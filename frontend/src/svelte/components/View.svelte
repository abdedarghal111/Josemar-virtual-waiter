<script>
    let { header = null, main, footer = null } = $props()
</script>

<wrapper class="w-full h-screen flex flex-col box-border">
    {#if header}
        <header class="max-w-full">
            {@render header()}
        </header>
    {/if}

    <main class="flex-1 bg-surface-50 dark:bg-surface-500 max-w-full">
        {@render main()}
    </main>

  {#if footer}
    <footer>
        {@render footer()}
    </footer>
  {/if}
</wrapper>