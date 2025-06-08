<script lang='ts'>
    import { faCalendarDays, faAddressCard, faUserPlus, faBurger, faDoorOpen, faBriefcase } from '@fortawesome/free-solid-svg-icons'
    import ClientFooter from '../partials/ClientFooter.svelte'
    import { setCurrentView } from '../lib/viewsCollector'
    import View from '../components/View.svelte'
    import { logout, userdata } from '../lib/userdata.svelte';
    import toast from 'svelte-french-toast';
    import axios from 'axios';
    import { LogoutRequest } from '_shared/requests/LogoutRequest.mjs';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';
</script>

<View>

    {#snippet header()}
        <GenericHeader currentPage="Inicio" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center justify-around gap-y-5 py-5">

            <div class="border-s-2 border-surface-900 text-start mx-5 ps-3">
                <h3 class="h3 text-surface-950">Josemar Virtual Waiter</h3>
                <p class="text-justify text-surface-900"><b>JVW</b> es una aplicación desarrollada para el restaurante <b>Josemar</b>, donde puedes ver los productos disponibles y realizar reservas si estás registrado.</p>
            </div>

            <div class="flex flex-col items-center gap-y-3 p-3 shadow bg-surface-900 card">

                {#if !$userdata.id}
                    <IconButton icon={faUserPlus} text="Registrarse" onclick={() => setCurrentView('register')} />

                    <IconButton icon={faAddressCard} text="Iniciar sesión" onclick={() => setCurrentView('login')} />
                {/if}

                <IconButton icon={faBurger} text="Ver los productos" onclick={() => setCurrentView('user.products')} />

                {#if $userdata.id}
                    <IconButton icon={faCalendarDays} text="Realizar o ver reserva" onclick={() => setCurrentView('user.reserveMenu')} />

                    {#if $userdata.permissionLevel !== 'user'}
                        <IconButton icon={faBriefcase} text="Panel de empleados" onclick={() => setCurrentView('worker.pannel')} />
                    {/if}

                    <IconButton icon={faDoorOpen} text="Cerrar sesión" onclick={
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
                        }
                    />
                {/if}
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>