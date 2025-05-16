import { writable, get } from 'svelte/store';
import { storable } from './storable';

import Home from '../views/home.svelte'
import Pannel from '../views/workers/pannel.svelte'
import Menu from '../views/menu.svelte'
import Reserve from '../views/reserve.svelte'
import Register from '../views/register.svelte'
import Profile from '../views/profile.svelte'
import InfoScreen from '../views/infoScreen.svelte'
import Login from '../views/login.svelte'
import StartScreen from '../views/startScreen.svelte';

import WorkerPannel from '../views/workers/pannel.svelte';
import WorkerWaiterMode from '../views/workers/waiterMode.svelte';
import WorkerCheckReserves from '../views/workers/checkReserves.svelte';
import WorkerCheffMode from '../views/workers/cheffMode.svelte';

import AdminEditDatabase from '../views/admin/editDatabase.svelte';
import AdminListUsers from '../views/admin/listUsers.svelte';
import AdminUser from '../views/admin/user.svelte';

export let currentView = storable<string>('currentView', 'home')
export let parameters = storable<{ [key: string]: any }>('parameters', {})
let previusView = get(currentView)

export function setCurrentView(view: string, newParams: { [key: string]: any } = {}) {
    previusView = get(currentView)
    parameters.set(newParams)
    currentView.set(view)
}

export function getParameters() {
    return get(parameters)
}

export function getCurrentView() {
    return get(currentView)
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
    
    "worker.pannel": WorkerPannel,
    "worker.waiterMode": WorkerWaiterMode,
    "worker.checkReserves": WorkerCheckReserves,
    "worker.cheffMode": WorkerCheffMode,

    "admin.editDatabase": AdminEditDatabase,
    "admin.listUsers": AdminListUsers,
    "admin.user": AdminUser,
}