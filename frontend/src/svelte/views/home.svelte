<script lang="ts" module>
    let message = $state('')

    onSocketEvent(HelloMessage.event, (data, socket) => {
        let info = new HelloMessage(data)

        message = info.getMessage()

        info = new HelloMessage({ event: HelloMessage.event, success: true, message: "Hola mundo desde un websocket en el cliente" })
        socket.send(info.toString())
    })
</script>

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
    import { HelloMessage } from '_shared/wsComunication/HelloMessage.mjs';

    $effect(() => {
        console.log(message)
    })

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
    // dark:bg-surface-800 border-1 border-surface-800 dark:border-surface-50
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col justify-around items-center"><!-- justify-between -->

            <!-- <button class="p-4 bg-surface-200" onclick={() => setCurrentView('pannel')}>jose . 2</button> -->

            <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 ' + pClass}>¡Bienvenido!</h2>
            </div>
            
            <div class="flex flex-col items-center gap-8 mx-10">
                <p class={"text-center p-3 " + pClass}>Bienvenido al portal web del restaurante Josemar.</p>
                <p class={"text-center p-3 mt-5 " + pClass}>En esta aplicación puedes ver el menú del día o realizar reservas y sobre todo ver los productos disponibles.</p>
            </div>

            <div class={"flex flex-col items-center p-5 mb-10 " + pClass}>
                {#if !$userdata.id}
                    <button class={"flex items-center gap-2 mb-5 " + bClass} onclick={() => setCurrentView('register')}>
                        <Fa icon={faUserPlus} size="lg" /> Registrarse
                    </button>

                    <button class={"flex items-center gap-2 mb-5 " + bClass} onclick={() => setCurrentView('login')}>
                        <Fa icon={faAddressCard} size="lg" /> Iniciar sesión
                    </button>
                {/if}

                <button class={"flex items-center gap-2 " + bClass} onclick={() => setCurrentView('menu')}>
                    <Fa icon={faBurger} size="lg" /> Ver la carta
                </button>

                {#if $userdata.id}
                    <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => initConnection()}><!-- setCurrentView('reserve')}> -->
                        <Fa icon={faCalendarDays} size="lg" /> Realizar o ver reserva
                    </button>

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

                    {#if $userdata.permissionLevel !== 'user'}
                        <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('worker.pannel')}>
                            <Fa icon={faBriefcase} size="lg" /> Panel de empleados
                        </button>
                    {/if}
                {/if}
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>