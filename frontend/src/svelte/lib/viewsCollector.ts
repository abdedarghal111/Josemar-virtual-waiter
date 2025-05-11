import { writable, get } from 'svelte/store';

import Home from '../views/home.svelte'
import Pannel from '../views/workers/pannel.svelte'
import Menu from '../views/menu.svelte'
import Reserve from '../views/reserve.svelte'
import Register from '../views/register.svelte'
import Profile from '../views/profile.svelte'
import InfoScreen from '../views/infoScreen.svelte'
import Login from '../views/login.svelte'
import { storable } from './storable';
import StartScreen from '../views/startScreen.svelte';
import WorkerPannel from '../views/workers/pannel.svelte';


export let currentView = storable('currentView', 'home')
let previusView = get(currentView)

export function setCurrentView(view: string) {
    previusView = get(currentView)
    currentView.set(view)
}

export function setPreviusView(){
    if(get(currentView) === previusView && previusView !== 'login' && previusView !== 'register'){
        setCurrentView(previusView)
    }else{
        setCurrentView('home')
    }
}

export const views = {
    home: Home,
    pannel: Pannel,
    menu: Menu,
    reserve: Reserve,
    register: Register,
    profile: Profile,
    infoScreen: InfoScreen,
    login: Login,
    startScreen: StartScreen,
    "workers.pannel": WorkerPannel
}