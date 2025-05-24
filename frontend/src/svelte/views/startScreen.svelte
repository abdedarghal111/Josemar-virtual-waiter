<script lang='ts'>
    import ClientFooter from '../partials/ClientFooter.svelte'
    import View from '../components/View.svelte'
    import TittleHeader from '../partials/TittleHeader.svelte';

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col justify-around items-center"><!-- justify-between -->

            <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 ' + pClass}>¡Bienvenido a JVW!, si ves esta pantalla es porque la aplicación está cargando.</h2>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>