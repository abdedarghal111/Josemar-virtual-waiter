<script>
    let { header = null, main, footer = null } = $props()
</script>

<wrapper class="w-full h-full flex flex-col box-border bg-gradient-to-br from-surface-400 to-surface-600">
    {#if header}
        <header class="max-w-full">
            {@render header()}
        </header>
    {/if}

    <main class="flex-1 overflow-x-scroll">
        {@render main()}
    </main>

  {#if footer}
    <footer class="max-w-full">
        {@render footer()}
    </footer>
  {/if}
</wrapper>