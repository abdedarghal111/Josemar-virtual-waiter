<script>
    let {
            header = null,
            main,
            footer = null,
            upperFooter = null
        } = $props()
</script>

<wrapper class="w-full h-full flex flex-col box-border bg-gradient-to-br from-surface-400 to-surface-600 relative">
    {#if header}
        <header class="max-w-full">
            {@render header()}
        </header>
    {/if}

    <main class="flex-1 overflow-x-scroll relative">
        {@render main()}
    </main>

    {#if upperFooter}
        <div class="w-full fixed bottom-0 left-0">
            <div class="bg-blur">
                {@render upperFooter()}
            </div>
        </div>
    {:else if footer}
        <footer class="max-w-full">
            {@render footer()}
        </footer>
    {/if}
</wrapper>
