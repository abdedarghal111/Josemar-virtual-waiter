<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faBurger } from '@fortawesome/free-solid-svg-icons'
    import { faCalendarDays, faAddressCard, faUserPlus } from '@fortawesome/free-solid-svg-icons'
    // import { UserRoundPlus } from '@lucide/svelte'

    import { setCurrentView } from '../lib/viewsCollector'
    import View from '../components/View.svelte'
    import { isLogged } from '../lib/userdata.svelte';

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
    // dark:bg-surface-800 border-1 border-surface-800 dark:border-surface-50
</script>

<View>

    {#snippet main()}
        <div class="h-full flex flex-col items-center"><!-- justify-between -->
            <div class="w-full text-center bg-surface-500 dark:bg-surface-900 border-b-3 border-surface-800 dark:border-surface-50">
                <h1 class="h1 p-5">Josemar virtual waiter</h1>
            </div>
            <!-- <button class="p-4 bg-surface-200" onclick={() => setCurrentView('pannel')}>jose . 2</button> -->
            <div class="flex flex-col items-center gap-8 mt-15 mx-10">
                <p class={"text-center p-3 " + pClass}>Bienvenido al portal web del restaurante Josemar.</p>
                <p class={"text-center p-3 mt-5 " + pClass}>En esta aplicación puedes ver el menú del día o realizar reservas y sobre todo ver los productos disponibles.</p>
            </div>

            <div class={"flex flex-col items-center mt-15 p-5 " + pClass}>
                {#if !isLogged()}
                    <button class={"flex items-center gap-2 mb-5 " + bClass}>
                        <Fa icon={faUserPlus} size="lg" /> Registrarse
                    </button>

                    <button class={"flex items-center gap-2 mb-5 " + bClass}>
                        <Fa icon={faAddressCard} size="lg" /> Iniciar sesión
                    </button>
                {/if}

                <button class={"flex items-center gap-2 " + bClass}>
                    <Fa icon={faBurger} size="lg" /> Ver la carta
                </button>

                <button class={"flex items-center gap-2 mt-5 " + bClass}>
                    <Fa icon={faCalendarDays} size="lg" /> Realizar o ver reserva
                </button>
            </div>
        </div>
    {/snippet}
    {#snippet footer()}
        <div class="w-full text-center bg-surface-500 dark:bg-surface-900 border-t-3 border-surface-800 dark:border-surface-50">
            <p class="p-5">
                <button class="underline text-tertiary-700 dark:text-tertiary-300">
                    Aviso legal
                </button>
                 | 
                <button class="underline text-tertiary-700 dark:text-tertiary-300">
                    Política de privacidad
                </button>
                 | 
                <button class="underline text-tertiary-700 dark:text-tertiary-300">
                    Política de cookies
                </button>
            </p>
        </div>
    {/snippet}
</View>