<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faCalendarDays, faAddressCard, faUserPlus, faBurger, faDoorOpen } from '@fortawesome/free-solid-svg-icons'
    import ClientFooter from '../../partials/ClientFooter.svelte'
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
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
                

                <button class={"flex items-center gap-2 " + bClass} onclick={() => setCurrentView('menu')}>
                    <Fa icon={faBurger} size="lg" /> Ver la carta
                </button>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>