<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faArrowLeft, faBurger, faList } from '@fortawesome/free-solid-svg-icons'
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import { setCurrentView } from '@src/lib/viewsCollector';

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col justify-center gap-10 items-center">


            <div class={"flex flex-col items-center mt-10 mx-10 " + pClass}>
                <h2 class={'h2 p-3 ' + pClass}>Panel de reservas</h2>
                <p class={"text-center p-3 " + pClass}>Aquí puedes realizar y gestionar nuevas reservas</p>
            </div>
            

            <div class={"flex flex-col items-center p-5 " + pClass}>

                <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('user.reserve')}>
                    <Fa icon={faBurger} size="lg" /> Realizar nueva reserva
                </button>

                <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('user.listReserves')}>
                    <Fa icon={faList} size="lg" /> Ver mis reservas
                </button>

            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>