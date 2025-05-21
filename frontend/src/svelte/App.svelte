<script lang='ts'>
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
</script>


{#if loadingScreen}
  <svelte:component this={views['startScreen']}/>
{:else}
  {#key $currentView}
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