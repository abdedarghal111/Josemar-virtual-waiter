<script>
    let { header = null, main, footer = null } = $props()
</script>

<wrapper class="w-screen h-screen flex flex-col">
    {#if header}
        <header>
            {@render header()}
        </header>
    {/if}

    <main class="flex-1 bg-surface-50 dark:bg-surface-500">
        {@render main()}
    </main>

  {#if footer}
    <footer>
        {@render footer()}
    </footer>
  {/if}  
</wrapper>