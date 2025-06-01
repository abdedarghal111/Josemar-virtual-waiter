import { copyFileSync, existsSync, readdir, readdirSync, rmSync } from 'fs'
import esbuild from 'esbuild'
import { replace } from 'esbuild-plugin-replace'
import { copy } from 'esbuild-plugin-copy'
import path from 'path'
import { fileURLToPath } from 'url'
import c from 'colors'

/*
Parámetros disponibles:
--dev  => compilar para desarrollo
--no-clean    => no realiza la limpieza
--clean       => realiza limpieza de directorios (por defecto)
*/

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __dist = path.join(__dirname, '..', 'dist')
const __src = path.join(__dirname, 'src')
const __shared = path.join(__dirname, '..', 'shared')

let checkParam = par => process.argv.find(val => val === par)

// limpieza
if (existsSync(__dist) && !checkParam('--no-clean')) {
  let files = readdirSync(__dist)
  let emptyDist = files.length === 0 || (files.length === 1 && files[0] === 'data')
  if(!emptyDist){console.log('\n==> Limpiando carpeta de compilación...'.yellow)}
  for (const file of files) {
    if (file !== 'static' && file !== 'node_modules' && file !== 'package.json') {
      const filePath = path.join(__dist, file)
      rmSync(filePath, { recursive: true, force: true })
      console.log(`  -> ${file} borrado`.cyan)
    }
  }
  console.log('\n==> Carpeta de compilación limpia'.green)
}


if (checkParam('--dev')) {
  // configuración para produccion
  let ctx = await esbuild.context({
    logLevel: 'info',
    entryPoints: [`${__src}/**/*.mts`],
    sourceRoot: __src,
    outdir: __dist,
    bundle: false,
    sourcemap: false,
    target: 'es2022',
    platform: 'node',
    format: 'esm',
    outExtension: {
      '.js': '.mjs'
    },
    resolveExtensions: ['.mts'],
    //external: ['discord.js', 'dotenv', '@google'],
    tsconfig: './tsconfig.json',
    plugins: [
      replace({
        '.mts': '.mjs',
        "_shared/": (...args) => {
          const filePath = args[0];
          const __filename = fileURLToPath("file://" + filePath);
          const __dirname = path.dirname(__filename);
          const relativePath = path.relative(__dirname, __src+'/shared');
          return relativePath.replace('\\', '/') + "/"
        }
      }),
      copy({
        assets: [
          {
            from: [`${__src}/**/{*.txt,*.img}`],
            to: [__dist],
          },
        ],
      })
    ]
  })

  let ctxShared = await esbuild.context({
    logLevel: 'info',
    entryPoints: [`${__shared}/**/*.mts`],
    sourceRoot: __shared,
    outdir: `${__dist}/shared`,
    bundle: false,
    sourcemap: false,
    target: 'es2022',
    platform: 'node',
    format: 'esm',
    outExtension: {
      '.js': '.mjs'
    },
    resolveExtensions: ['.mts'],
    tsconfig: './tsconfig.json',
    plugins: [
      replace({
        '.mts': '.mjs',
      }),
    ]
  })

  if(!checkParam('--watch')){
    await ctxShared.rebuild()
    await ctx.rebuild()

    ctx.dispose()
    ctxShared.dispose()
  }else{
    await (async () => {
      ctx.watch()
      ctxShared.watch()
    })()
  }

  // copyFileSync(`${__src}/../node_modules`, `${__dist}/node_modules`)
}else{
  if(!checkParam('--clean')){
    console.log(c.yellow('\n==> Aviso: No se ha especificado ')+c.red('--production')+c.yellow(' o ')+c.red('--dev')+c.yellow(' como parámetro'))
    console.log('==> Cancelando...'.yellow)
  }
}

console.log('\n==> Cadena de compilación finalizada\n'.green)