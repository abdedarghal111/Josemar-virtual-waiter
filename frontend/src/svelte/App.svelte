<script lang='ts'>
  import { changeTheme, changeThemeEffect } from './lib/darkmode.svelte';
  import { userdata } from './lib/userdata.svelte';
  import { views, currentView } from './lib/viewsCollector';
  import { Toaster } from 'svelte-french-toast';

  $effect(changeThemeEffect)
</script>


<svelte:component this={views[$currentView]}/>
<Toaster/>

<svelte:body on:keypress={
    (e) => {
      if(e.key == 'e'){
        changeTheme()
      }
    }
}></svelte:body>