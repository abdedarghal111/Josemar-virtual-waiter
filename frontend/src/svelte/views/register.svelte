<script lang='ts'>
    import ClientFooter from '../partials/ClientFooter.svelte'
    import TittleHeader from '../partials/TittleHeader.svelte';

    import View from '../components/View.svelte'

</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="pannel" />
    {/snippet}

    {#snippet main()}    
    <div/>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>