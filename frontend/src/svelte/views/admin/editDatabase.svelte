<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faCalendarDays, faAddressCard, faUserPlus, faBurger, faDoorOpen, faKitchenSet, faReceipt, faFolderOpen, faUsers, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
    import ClientFooter from '../../partials/ClientFooter.svelte'
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import { currentView, setCurrentView } from '../../lib/viewsCollector';
    import { userdata } from '../../lib/userdata.svelte';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="worker.pannel" currentPage="Base de datos" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col justify-center gap-10 items-center">

            <div class="flex flex-col justify-center items-center gap-3 p-3 shadow bg-surface-900 card max-w-80 mx-3">
                <div class="w-full">
                    <h2 class="h2">Base de datos</h2>
                    <p>
                        Elige una de las opciones para editar o ver los registros disponibles.
                    </p>
                </div>
                
                {#if $userdata.permissionLevel === 'admin'}
                    <IconButton icon={faUsers} text="Usuarios" onclick={() => setCurrentView('admin.listUsers')} />
                {/if}

                <IconButton icon={faBurger} text="Productos" onclick={() => setCurrentView('admin.listProducts')} />
                <IconButton icon={faCalendarDays} text="Reservas" onclick={() => setCurrentView('admin.listReservations')} />
                <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('worker.pannel')} />

            </div>
        </div>
    {/snippet}
</View>