<script>
  const {
    // provided by <Modals />
    isOpen,
    close,

    customModal
  } = $props()
</script>

{#if isOpen}
    <!-- salir ==> onclick={() => close()} onclick={(ev) => ev.stopPropagation()}  -->
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
  <div role="dialog" class="fixed top-0 bottom-0 right-0 left-0 min-h-full min-w-full max-h-full">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="min-h-full max-h-full min-w-full flex flex-col justify-center items-center">
        {@render customModal(close)}
    </div>
  </div>
{/if}