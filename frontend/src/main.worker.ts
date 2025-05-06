import { mount } from 'svelte'
import './css/source.css'
import WorkerApp from './svelte/WorkerApp.svelte'

const app = mount(WorkerApp, {
  target: document.body!,
})

export default app
