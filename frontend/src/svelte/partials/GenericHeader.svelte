<script>
    import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
    import avatarLogo from '/public/avatarLogo.svg'
    import { Avatar } from '@skeletonlabs/skeleton-svelte';
    import { userdata } from '@src/lib/userdata.svelte';
    import { setCurrentView } from '@src/lib/viewsCollector';
    import Fa from 'svelte-fa';

    let { currentPage = 'N/A',returnPage = null } = $props()
</script>

<div class="flex justify-center items-center p-3 bg-surface-950 text-surface-50">
    <div class="flex justify-center items-center">
        {#if returnPage}
            <button class="pe-2" onclick={() => setCurrentView(returnPage)}>
                <Fa icon={faArrowLeft} size="lg" />
            </button>
        {/if}
        <div class="flex-1 font-bold">{currentPage}</div>
    </div>
    <div class="flex-1"></div>
    <div class="flex justify-center items-center">
        <span class="text-sm font-bold mr-2">{$userdata.id ? $userdata.username : 'No registrado'}</span>
        <Avatar src={avatarLogo} name="avatar" classes="w-7.5 h-7.5" />
    </div>
</div>