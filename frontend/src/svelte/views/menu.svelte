<script lang='ts'>
    import ClientFooter from '../partials/ClientFooter.svelte'
    import View from '../components/View.svelte'
    import TittleHeader from '../partials/TittleHeader.svelte';
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center"><!-- justify-between -->

           
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>