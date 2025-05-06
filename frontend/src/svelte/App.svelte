<script lang='ts'>
  import { changeTheme, changeThemeEffect } from './lib/darkmode.svelte';
  import { userdata } from './lib/userdata.svelte';
  import { views, currentView } from './lib/viewsCollector';

  $effect(changeThemeEffect)
</script>

<svelte:component this={views[$currentView]}/>

<svelte:body on:keypress={
    (e) => {
      if(e.key == 'e'){
        changeTheme()
      }
    }
}></svelte:body>