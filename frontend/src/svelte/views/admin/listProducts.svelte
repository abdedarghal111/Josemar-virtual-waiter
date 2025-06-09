<script lang="ts">
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
    import { getCurrentView, setCurrentView } from "@src/lib/viewsCollector";
    import type { ProductAttributes } from "_shared/SharedTypes.mjs";
    import { ListObjectsMessage } from "_shared/wsComunication/ListObjectsMessage.mjs";
    import { onSocketEvent, getWebSocket, waitEvent } from "@src/lib/wsComunication";
    import IconButton from '@src/components/IconButton.svelte';

    let products = $state<ProductAttributes[]>([])

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'admin.listProducts'){return}
        let info = ListObjectsMessage.fromTable(data)

        products = info.getProducts()
    })

    let waiting = 'placeholder animate-pulse';

    (async () => {
        getWebSocket().then(ws => ws.send(new ListObjectsMessage('product', products).toString()))
        await waitEvent(ListObjectsMessage.event)
        waiting = ''
    })()

    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>
    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center py-5">

           <div class="flex flex-col justify-center items-center gap-3 p-3 shadow bg-surface-900 card mx-3">
                <div class="w-full">
                    <h2 class="h2">Lista de productos</h2>
                    <p>
                        Aquí se pueden ver todos los productos que existen en el sistema, puedes modificarlos a gusto.
                        También puedes crear productos nuevos y elegir que permisos tienen.
                    </p>
                </div>

                <div class="table-wrap flex-1 p-5">
                    <table class="table caption-bottom">
                        <tbody class="min-h-full rounded-md">
                            <tr class="bg-tertiary-100/80 text-surface-950">
                                <th class="rounded-tl-md"><b>Nombre</b></th>
                                <th><b>Stock</b></th>
                                <th class="rounded-tr-md"><b>Precio</b></th>
                            </tr>
                        {#each products as product (product.id)}
                            <tr onclick={() => {
                                setCurrentView('admin.product', { id: product.id })
                            }} class="
                            bg-surface-800/50 odd:bg-surface-800/30 hover:bg-surface-700
                            first:[&>td:first-child]:rounded-tl-md
                            last:[&>td:last-child]:rounded-br-md
                            ">
                                <td>{product.name}</td>
                                <td>{product.stock}</td>
                                <td>{product.price.toString().replace('.', ',')} €</td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>
           </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <div class="flex items-center justify-center gap-5 p-5">
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('admin.editDatabase')}  extraClass="mb-2 text-surface-50 bg-surface-900"/>
            <IconButton icon={faFileCirclePlus} text="Crear nuevo" onclick={() => setCurrentView('admin.product')}  extraClass="mb-2 text-surface-50 bg-surface-900"/>
        </div>
    {/snippet}
</View>
