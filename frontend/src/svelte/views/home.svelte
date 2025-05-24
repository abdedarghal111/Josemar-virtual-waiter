<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faCalendarDays, faAddressCard, faUserPlus, faBurger, faDoorOpen, faBriefcase } from '@fortawesome/free-solid-svg-icons'
    import ClientFooter from '../partials/ClientFooter.svelte'
    // import { UserRoundPlus } from '@lucide/svelte'

    import { setCurrentView } from '../lib/viewsCollector'
    import View from '../components/View.svelte'
    import { logout, userdata } from '../lib/userdata.svelte';
    import TittleHeader from '../partials/TittleHeader.svelte';
    import toast from 'svelte-french-toast';
    import axios from 'axios';
    import { LogoutRequest } from '_shared/requests/LogoutRequest.mjs';
    import { initConnection, onSocketEvent } from '../lib/wsComunication';

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
    // dark:bg-surface-800 border-1 border-surface-800 dark:border-surface-50
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center gap-y-5 py-5"><!-- justify-between -->

            <div class="flex flex-col items-center mx-10">
                <h2 class={'h2 p-3 ' + pClass}>¡Bienvenido!</h2>
            </div>
            
            <p class={"text-center p-3 mx-5 " + pClass}>Bienvenido al portal web del restaurante Josemar.</p>
            <p class={"text-center p-3 mx-5 " + pClass}>En esta aplicación puedes ver el menú del día o realizar reservas y sobre todo ver los productos disponibles.</p>

            <div class={"flex flex-col items-center p-5 " + pClass}>
                {#if !$userdata.id}
                    <button class={"flex items-center gap-2 mb-5 " + bClass} onclick={() => setCurrentView('register')}>
                        <Fa icon={faUserPlus} size="lg" /> Registrarse
                    </button>

                    <button class={"flex items-center gap-2 mb-5 " + bClass} onclick={() => setCurrentView('login')}>
                        <Fa icon={faAddressCard} size="lg" /> Iniciar sesión
                    </button>
                {/if}

                <button class={"flex items-center gap-2 " + bClass} onclick={() => setCurrentView('user.products')}>
                    <Fa icon={faBurger} size="lg" /> Ver los productos
                </button>

                {#if $userdata.id}
                    <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('user.reserveMenu')}>
                        <Fa icon={faCalendarDays} size="lg" /> Realizar o ver reserva
                    </button>

                    {#if $userdata.permissionLevel !== 'user'}
                        <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('worker.pannel')}>
                            <Fa icon={faBriefcase} size="lg" /> Panel de empleados
                        </button>
                    {/if}

                    <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={
                    () => {
                        axios({
                            method: "post",
                            url: `${window.location.origin}/api/${LogoutRequest.path}`,
                            headers: {
                                "Content-Type": "application/json",
                            }
                        }).then(() => {
                            logout()
                            toast.success("Sesion cerrada")
                        }).catch(() => {
                            toast.error("Error en la red")
                        })}
                    }>
                        <Fa icon={faDoorOpen} size="lg" /> Cerrar sesión
                    </button>
                {/if}
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>