import { writable, get } from 'svelte/store';
import { storable } from './storable';

import Home from '@src/views/home.svelte'
import Pannel from '@src/views/workers/pannel.svelte'
import Register from '@src/views/register.svelte'
import Profile from '@src/views/profile.svelte'
// import InfoScreen from '@src/views/infoScreen.svelte'
import Login from '@src/views/login.svelte'
import StartScreen from '@src/views/startScreen.svelte';

import UserProducts from '@src/views/user/products.svelte'
import UserReserveMenu from '@src/views/user/reserveMenu.svelte'
import UserListReserves from '@src/views/user/listReserves.svelte'
import UserReserve from '@src/views/user/reserve.svelte'

import WorkerPannel from '@src/views/workers/pannel.svelte';
import WorkerWaiterMode from '@src/views/workers/waiterMode.svelte';
import WorkerAcceptReserves from '@src/views/workers/acceptReserves.svelte';
import WorkerCheffMode from '@src/views/workers/cheffMode.svelte';
import WorkerViewNotes from '@src/views/workers/viewNotes.svelte';

import AdminEditDatabase from '@src/views/admin/editDatabase.svelte';
import AdminListUsers from '@src/views/admin/listUsers.svelte';
import AdminUser from '@src/views/admin/user.svelte';
import AdminListProducts from '@src/views/admin/listProducts.svelte';
import AdminProduct from '@src/views/admin/product.svelte';
import AdminListReservations from '@src/views/admin/listReservations.svelte';
// import AdminReservation from '@src/views/admin/reservation.svelte';

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
    "worker.acceptReserves": WorkerAcceptReserves,
    "worker.cheffMode": WorkerCheffMode,
    "worker.viewNotes": WorkerViewNotes,

    "admin.editDatabase": AdminEditDatabase,
    "admin.listUsers": AdminListUsers,
    "admin.user": AdminUser,
    "admin.listProducts": AdminListProducts,
    "admin.product": AdminProduct,
    "admin.listReservations": AdminListReservations,
    // "admin.reservation": AdminReservation
}