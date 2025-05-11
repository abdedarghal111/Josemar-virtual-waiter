<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faCalendarDays, faAddressCard, faUserPlus, faBurger, faDoorOpen, faKitchenSet, faReceipt, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
    import ClientFooter from '../../partials/ClientFooter.svelte'
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import { setCurrentView } from '../../lib/viewsCollector';
    import { userdata } from '../../lib/userdata.svelte';

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col justify-center gap-10 items-center"><!-- justify-between -->

            <!-- <button class="p-4 bg-surface-200" onclick={() => setCurrentView('pannel')}>jose . 2</button> -->

            <div class={"flex flex-col items-center mt-10 mx-10 " + pClass}>
                <h2 class={'h2 p-3 ' + pClass}>Panel de trabajo</h2>
                <p class={"text-center p-3 " + pClass}>Aquí no pueden acceder los clientes</p>
            </div>
            

            <div class={"flex flex-col items-center p-5 " + pClass}>
                
                {#if $userdata.permissionLevel === 'admin'}
                    <button class={"flex items-center gap-2 " + bClass} onclick={() => setCurrentView('admin.editDatabase')}>
                        <Fa icon={faFolderOpen} size="lg" /> Base de datos
                    </button>
                {/if}

                <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('worker.cheffMode')}>
                    <Fa icon={faBurger} size="lg" /> Modo cocinero
                </button>

                <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('worker.waiterMode')}>
                    <Fa icon={faReceipt} size="lg" /> Modo camarero
                </button>

                <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('worker.checkReserves')}>
                    <Fa icon={faCalendarDays} size="lg" /> Aceptar reservas
                </button>

            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>