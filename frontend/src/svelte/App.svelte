<script lang='ts'>
  import { changeTheme, changeThemeEffect } from './lib/darkmode.svelte';
  import { checkSesion, getUser } from './lib/userdata.svelte';
  import { views, currentView } from './lib/viewsCollector';
  import { Toaster } from 'svelte-french-toast';
  import { onMount } from 'svelte';
    import { get } from 'svelte/store';

  let loadingScreen = $state(true)

  $effect(changeThemeEffect)

  onMount(async () => {
    await checkSesion()
    console.log(getUser())
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