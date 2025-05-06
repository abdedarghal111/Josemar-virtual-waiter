import { writable } from 'svelte/store';

import Home from '../views/home.svelte'
import Pannel from '../views/pannel.svelte'


export let currentView = writable('home')

export function setCurrentView(view: string) {
    currentView.set(view)
}

export const views = {
    home: Home,
    pannel: Pannel
}