<script lang='ts'>
    import { modals } from 'svelte-modals';
    import CustomModal from '@src/partials/CustomModal.svelte';
    import ClientFooter from '@src/partials/ClientFooter.svelte';
    import View from '@src/components/View.svelte';
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import { anyObject, ProductAttributes } from '_shared/SharedTypes.mjs';
    import Fa from 'svelte-fa';
    import { faArrowLeft, faBroom, faCartPlus, faListUl, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
    import { getWebSocket, onSocketEvent, waitEvent } from '@src/lib/wsComunication';
    import { ListObjectsMessage } from '_shared/wsComunication/ListObjectsMessage.mjs';
    import { getCurrentView } from '@src/lib/viewsCollector';
    import Product from '../admin/product.svelte';
    import { storable } from '@src/lib/storable';
    import { get } from 'svelte/store';


    interface lineType {
        quantity: number,
        productId: number,
        name: string,
        price: number,
        extraInfo: string
    }

    let memoProducts = storable<lineType[]>('waiterModeProducts', [])

    $effect(() => {
        memoProducts.set(lines)
    })

    let products = $state<ProductAttributes[]>([])
    let productInputSearch = $state<string>('')
    let lines = $state<lineType[]>(get(memoProducts))
    let placeHolderName = $state<string>('#nota 123')
    let receiptName = $state<string>('');

    const cleanDraft = () => {
        lines = []
        receiptName = ''
    }

    let displayProducts = $derived(products.filter(product => product.name.toLowerCase().includes(productInputSearch.toLowerCase())))


    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'worker.waiterMode'){return}
        let info = ListObjectsMessage.fromTable(data)

        products = info.getProducts()
    })

    ;(async () => {
        getWebSocket().then(ws => ws.send(new ListObjectsMessage('product', products).toString()))
        await waitEvent(ListObjectsMessage.event)
    })()

    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>
    {#snippet header()}
        <TittleHeader tittle="Modo camarero" />
    {/snippet}

    {#snippet main()}
        <div class="flex flex-col min-h-full min-w-full p-2">
             <div class="flex-1 preset-filled-surface-100-900 border-[1px] border-surface-200-800 flex flex-col justify-between p-3">

                <div class="space-y-4">
                    <input type="text" placeholder={placeHolderName} bind:value={receiptName} class="input input-bordered w-full rounded-token-base bg-surface-50" />

                    

                    <table class="border-collapse border rounded-token-base border-surface-950 w-full text-center">
                        <thead>
                            <tr>
                                <th class="border border-surface-950 p-[0.1px] w-min">Cant.</th>
                                <th class="border border-surface-950 p-[0.1px] w-max">Producto</th>
                                <th class="border border-surface-950 p-[0.1px] w-min">Precio</th>
                                <th class="border border-surface-950 p-[0.1px] w-min">Info.</th>
                            </tr>
                        </thead>
                        <tbody class="overflow-x-hidden">
                            {#each lines as line (line)}
                                <tr>
                                    <td class="bg-surface-50 border border-surface-950 p-[0.1px]">
                                        <div class="flex items-center justify-center">
                                            <button onclick={() => line.quantity++}>➕</button>
                                            <input type="text" bind:value={line.quantity} readonly class="input text-center input-bordered w-[40px] rounded-token-base">
                                            <button onclick={() => {
                                                line.quantity--
                                                if(line.quantity === 0){
                                                    lines = lines.filter(item => item !== line)
                                                }
                                            }}>➖</button>
                                        </div>
                                    </td>
                                    <td class="border bg-surface-50 p-[0.1px]">
                                        <button>Nombre producto</button>
                                    </td>
                                    <td class="border bg-surface-50 p-[0.1px]">
                                        {(line.price * line.quantity).toFixed(2)}
                                    </td>
                                    <td class="border bg-surface-50 p-[0.1px]">
                                        <button 
                                        onclick={() => modals.open(CustomModal as any, { customModal: addDescriptionModal })}>
                                        {line.extraInfo ? '✅' : 'ℹ️'}</button>
                                        {#snippet addDescriptionModal(close)}
                                            <div class="modal-box p-6 preset-filled-surface-100-900 rounded-lg shadow-xl max-w-md mx-auto my-auto">
                                                <h3 class="font-bold text-lg mb-4">Nota extra para {line.name}</h3>

                                                <div class="mb-4">
                                                    <textarea
                                                        placeholder="Añade notas o detalles aquí..."
                                                        bind:value={line.extraInfo}
                                                        class="textarea textarea-bordered w-full h-32 rounded-lg bg-gray-50 resize-y"
                                                    ></textarea>
                                                </div>

                                                <div class="flex justify-end">
                                                    <button
                                                        onclick={close}
                                                        class={"flex items-center gap-2 m-2 mx-auto " + bClass}
                                                    >
                                                        Aceptar
                                                    </button>
                                                </div>
                                            </div>
                                        {/snippet}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <div class="flex justify-around pt-4 flex-wrap">
                    <button onclick={() => modals.open(CustomModal as any, { customModal: addProductModal })} class={"flex items-center gap-2 m-2 mx-auto " + bClass}>
                        <Fa icon={faCartPlus} size="lg"/> Añadir Producto
                    </button>
                    {#snippet addProductModal(close)}
                        <div class="flex-1 flex flex-col max-h-[100vh] min-w-full gap-5">
                            <div class="p-5">
                                <input type="text" placeholder="Busca por nombre" bind:value={productInputSearch} class="min-w-full input input-bordered w-full rounded-token-base bg-surface-50" />
                            </div>
                            <div class="flex-1 overflow-y-scroll no-scrollbar p-3">
                                {#each displayProducts as product}
                                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                                <div onclick={() => {
                                    let line = lines.find(line => line.name === product.name)
                                    if(!line){
                                        line = {
                                            quantity: 1,
                                            productId: product.id,
                                            name: product.name,
                                            price: product.price,
                                            extraInfo: ''
                                        }
                                        lines.push(line)
                                    }else{
                                        line.quantity += 1
                                    }

                                    close()
                                }} class="card preset-filled-surface-100-900 border-[1px] border-surface-<200-800 card-hover block overflow-hidden mb-3">
                                    <article class="p-2">
                                    <span class="flex justify-between items-center">
                                        <h2 class="h6 font-bold">{product.name}</h2>
                                        <span class="text-sm font-bold me-4">{product.price.toString().replace('.', ',')} €</span>
                                    </span>
                                        <p class="text-xs pe-15">{product.description}</p>
                                    </article>
                                </div>
                                {/each}
                            </div>
                            <button class={"flex items-center gap-2 m-2 mx-auto " + bClass} onclick={close}>close</button>
                        </div>
                    {/snippet}
                    <button onclick={cleanDraft} class={"flex items-center gap-2 m-2 mx-auto " + bClass}>
                        <Fa icon={faBroom} size="lg"/> Limpiar
                    </button>
                    <button class={"flex items-center gap-2 m-2 mx-auto " + bClass}>
                        <Fa icon={faPaperPlane} size="lg"/> Enviar a Cocina
                    </button>
                    <button class={"flex items-center gap-2 m-2 mx-auto " + bClass}>
                        <Fa icon={faListUl} size="lg"/> Ver pedidos
                    </button>
                </div>
            </div>
        </div>
       
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>

<style>
    .h-full {
        height: calc(100vh - var(--header-height, 0px) - var(--footer-height, 0px));
    }
</style>