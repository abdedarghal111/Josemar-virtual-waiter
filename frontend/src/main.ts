import { mount } from 'svelte'
import './css/source.css'
import App from './svelte/App.svelte'

const app = mount(App, {
  target: document.body!,
})

export default app
