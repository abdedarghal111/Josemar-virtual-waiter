<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import { anyObject, type ProductAttributes } from '_shared/SharedTypes.mjs';
    import { getWebSocket, onSocketEvent, waitEvent } from '@src/lib/wsComunication';
    import { ListObjectsMessage } from '_shared/wsComunication/ListObjectsMessage.mjs';
    import { getCurrentView } from '@src/lib/viewsCollector';

    let requested = $state<boolean>(false)

    let notes = $state<anyObject[]>([])

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'worker.viewNotes'){return}
        let info = ListObjectsMessage.fromTable(data)

        notes = info.getObjects()
    })

    ;(async () => {
        getWebSocket().then(ws => ws.send(new ListObjectsMessage('product', notes).toString()))
        await waitEvent(ListObjectsMessage.event)
        requested = true
    })()
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center"><!-- justify-between -->

           <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 '}>Notas</h2>

                <div class="grid gap-4">
                    {#if notes.length > 0 && requested}
                        {#each notes as note}
                        <div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover block overflow-hidden mb-5">
                            <article class="p-2">
                            <span class="flex justify-between items-center">
                                <h2 class="h6 font-bold">{note.name}</h2>
                                <span class="text-sm font-bold me-4">{note.price.toString().replace('.', ',')} €</span>
                            </span>
                                <p class="text-xs pe-15">{note.description}</p>
                            </article>
                            <footer class="flex justify-end">
                                <button class="btn btn-primary btn-xs">Ver +</button>
                            </footer>
                        </div>
                        {/each}
                    {:else if requested && notes.length === 0}
                        <p class="h3 text-center">Sin notas.</p>
                    {:else}
                        <p class="placeholder animate-pulse h2">Cargando...</p>
                    {/if}
                </div>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>