<script lang="ts">
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
    import { getCurrentView, setCurrentView } from "@src/lib/viewsCollector";
    import type { ProductAttributes } from "_shared/SharedTypes.mjs";
    import { ListObjectsMessage } from "_shared/wsComunication/ListObjectsMessage.mjs";
    import { onSocketEvent, getWebSocket, waitEvent } from "@src/lib/wsComunication";

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
        <div class="h-full flex flex-col items-center"><!-- justify-between -->

           <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 '}>Productos</h2>
            </div>

            <div class="table-wrap flex-1 p-5">
                <table class="table caption-bottom">
                    <tbody class={"[&>tr]:hover:preset-tonal-primary min-h-full"}>
                        <tr>
                            <th>Nombre</th>
                            <th>Stock</th>
                            <th>Precio</th>
                        </tr>
                    {#each products as product (product.id)}
                        <tr onclick={() => {
                            setCurrentView('admin.product', { id: product.id })
                        }}>
                            <td>{product.name}</td>
                            <td>{product.stock}</td>
                            <td>{product.price.toString().replace('.', ',')} €</td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <!-- flex centrado -->
        <div class="flex items-center justify-center gap-5 p-5">
            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('admin.editDatabase')}>
                <Fa icon={faArrowLeft} size="lg" /> Volver
            </button>

            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('admin.product')}>
                <Fa icon={faFileCirclePlus} size="lg" /> Crear nuevo
            </button>
        </div>
    {/snippet}
</View>
