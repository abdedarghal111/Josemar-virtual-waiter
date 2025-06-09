<script lang='ts'>
    import { faCalendarDays, faBurger, faReceipt, faFolderOpen, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
    import ClientFooter from '../../partials/ClientFooter.svelte'
    import View from '../../components/View.svelte'
    import { setCurrentView } from '../../lib/viewsCollector';
    import { userdata } from '../../lib/userdata.svelte';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';

</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="home" currentPage="Panel de empleados" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col justify-center gap-10 items-center">

            <div class="flex flex-wrap justify-center items-center gap-3 p-3 shadow bg-surface-900 card max-w-80 mx-3">
                <div class="w-full">
                    <h2 class="h2">Panel de trabajo</h2>
                    <p>
                        Esta es una zona restringida para empleados, los clientes no pueden acceder.
                        Puedes crear, editar y eliminar todos los aspectos de la aplicación en la base de datos.
                    </p>
                </div>
                {#if $userdata.permissionLevel === 'admin'}
                    <IconButton icon={faFolderOpen} text="Base de datos" onclick={() => setCurrentView('admin.editDatabase')} />
                {/if}

                <IconButton icon={faCalendarDays} text="Aceptar reservas" onclick={() => setCurrentView('worker.acceptReserves')} />
                    <IconButton icon={faReceipt} text="Modo camarero" onclick={() => setCurrentView('worker.waiterMode')} />
                <IconButton icon={faBurger} text="Modo cocinero" onclick={() => setCurrentView('worker.cheffMode')} />
                <IconButton icon={faArrowLeft} text="Volver al inicio" onclick={() => setCurrentView('home')} />
            </div>
        </div>
    {/snippet}
</View>