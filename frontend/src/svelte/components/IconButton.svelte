<script>
    import Fa from "svelte-fa";

    let { icon = null, text, onclick, extraClass = '' } = $props()

</script>
<button class={"flex items-center gap-1 btn preset-filled-primary-500 p-2 card text-sm " + extraClass} onclick={onclick}>
    {#if icon}
        <Fa icon={icon} /> {text}
    {:else}
        {text}
    {/if}
</button>