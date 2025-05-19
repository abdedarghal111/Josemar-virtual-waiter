import { writable, get } from 'svelte/store';
import { storable } from './storable';

import Home from '../views/home.svelte'
import Pannel from '../views/workers/pannel.svelte'
import Register from '../views/register.svelte'
import Profile from '../views/profile.svelte'
// import InfoScreen from '../views/infoScreen.svelte'
import Login from '../views/login.svelte'
import StartScreen from '../views/startScreen.svelte';

import UserProducts from '../views/user/products.svelte'
import UserReserveMenu from '../views/user/reserveMenu.svelte'
import UserListReserves from '../views/user/listReserves.svelte'
import UserReserve from '../views/user/reserve.svelte'

import WorkerPannel from '../views/workers/pannel.svelte';
import WorkerWaiterMode from '../views/workers/waiterMode.svelte';
import WorkerCheckReserves from '../views/workers/checkReserves.svelte';
import WorkerCheffMode from '../views/workers/cheffMode.svelte';

import AdminEditDatabase from '../views/admin/editDatabase.svelte';
import AdminListUsers from '../views/admin/listUsers.svelte';
import AdminUser from '../views/admin/user.svelte';
import AdminListProducts from '../views/admin/listProducts.svelte';
import AdminProduct from '../views/admin/product.svelte';

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
    register: Register,
    profile: Profile,
    // infoScreen: InfoScreen,
    login: Login,
    startScreen: StartScreen,

    "user.products": UserProducts,
    "user.reserveMenu": UserReserveMenu,
    "user.reserve": UserReserve,
    "user.listReserves": UserListReserves,
    
    "worker.pannel": WorkerPannel,
    "worker.waiterMode": WorkerWaiterMode,
    "worker.checkReserves": WorkerCheckReserves,
    "worker.cheffMode": WorkerCheffMode,

    "admin.editDatabase": AdminEditDatabase,
    "admin.listUsers": AdminListUsers,
    "admin.user": AdminUser,
    "admin.listProducts": AdminListProducts,
    "admin.product": AdminProduct
}