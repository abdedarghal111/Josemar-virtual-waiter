<script lang='ts'>
  import '@src/lib/sound'
  import { Modals } from 'svelte-modals'
  import { changeTheme, changeThemeEffect } from './lib/darkmode.svelte';
  import { checkSesion, userdata } from './lib/userdata.svelte';
  import { views, currentView } from './lib/viewsCollector';
  import toast, { Toaster } from 'svelte-french-toast';
  import { onMount } from 'svelte';
  import { onSocketEvent } from './lib/wsComunication';
  import { PushNotificationMessage } from '_shared/wsComunication/PushNotificationMessage.mts';

  let loadingScreen = $state(true)

  $effect(changeThemeEffect)

  onMount(async () => {
    await checkSesion()
    onSocketEvent(PushNotificationMessage.event, (data) => {
      let notification = PushNotificationMessage.fromTable(data)
      let icons = {
        'success': '✅',
        'info': 'ℹ️',
        'edited': '✏️',
        'warning': '⚠️',
        'error': '❌'
      }
      if(notification.isOk()){
        toast(notification.getMessage(), {
          icon: icons[notification.getType()],
        })
      }
    })
    loadingScreen = false
  })

  document.body.style.height = `${window.innerHeight}px`
</script>


{#if loadingScreen}
  <!-- svelte-ignore svelte_component_deprecated -->
  <svelte:component this={views['startScreen']}/>
{:else}
  {#key $currentView}
    <!-- svelte-ignore svelte_component_deprecated -->
    <svelte:component this={views[$currentView]}/>
  {/key}
{/if}
<Toaster/>

<svelte:body on:keypress={
    (e) => {
      if(e.key == 'e'){
        changeTheme()
      }
    }
}></svelte:body>

<svelte:window on:resize={(e) => {
  document.body.style.height = `${window.innerHeight}px`
}}></svelte:window>

<Modals>
  <!-- shown when any modal is opened -->
  {#snippet backdrop({ close })}
    <!-- svelte-ignore element_invalid_self_closing_tag, a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
    <div
      class="fixed top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,0.20)]"
      onclick={() => close()}
    />
  {/snippet}
</Modals>