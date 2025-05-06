import path from 'path';
import { compile } from 'svelte/compiler';
import { fileURLToPath } from 'url';
import tailwind from '@tailwindcss/postcss';
import postcss from 'postcss';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __dist = path.join(__dirname, '..', 'dist')
const __outFront = path.join(__dist, 'public')
// const __outBack = path.join(__dist, 'backend')
const __sourceFront = path.join(__dirname, 'src')
// const __sourceBack = path.join(__dirname, 'src', 'backend')

// const result = compile(__frontend, {
// 	name: 'frontendApp',
// 	css: 'injected',
// 	preserveComments: false,
// 	preserveWhitespace: false,
// 	discloseVersion: false,
// 	hmr: false,
// });

// console.log(result)
import * as esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { copyFileSync } from 'fs';

let checkParam = par => process.argv.find(val => val === par)

if(checkParam('--frontend') && checkParam('--dev')){

	// copiar los html
	mkdirSync(__outFront, { recursive: true })
	copyFileSync(`${__sourceFront}/worker.html`, `${__outFront}/worker.html`);
	copyFileSync(`${__sourceFront}/index.html`, `${__outFront}/index.html`);

	// compilar el css
	const cssSource = `${__sourceFront}/css/source.css`
	const outCss = `${__outFront}/index.css`
	postcss([tailwind({})])
		.process(readFileSync(cssSource), { from: cssSource, to: outCss })
		.then(({ css }) => {
			writeFileSync(outCss, css)
		})
		.catch((error) => {
			console.error(error)
			process.exit(1)
		})

	// compilar el svelte
	const appSvelte = `${__sourceFront}/svelte/app.svelte`
	const appWorkerSvelte = `${__sourceFront}/svelte/app.worker.svelte`
	let ctx = await esbuild.context({
		entryPoints: [appSvelte, appWorkerSvelte],
		sourceRoot: __sourceFront,
		bundle: true,
		format: 'esm',
		outdir: __outFront,
		external: ['@zag-js/svelte'],
		plugins: [sveltePlugin()
			// sveltePlugin({
			// 	compilerOptions: { customElement: true }
			// })
		],
		banner: {
			js: "new EventSource('http://127.0.0.1:8888/esbuild').addEventListener('change', () => location.reload())"
		},
		logLevel: 'info'
	});
	

	await ctx.watch();
	await ctx.serve({
		servedir: './../dist/public',
		port: 8888,
		host: '127.0.0.1'
	});
}