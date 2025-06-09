<script lang='ts'>
    import { modals } from 'svelte-modals';
    import CustomModal from '@src/partials/CustomModal.svelte';
    import View from '@src/components/View.svelte';
    import { type lineType, type ProductAttributes } from '_shared/SharedTypes.mjs';
    import { faArrowLeft, faBroom, faCartPlus, faListUl, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
    import { getWebSocket, onSocketEvent, waitEvent } from '@src/lib/wsComunication';
    import { ListObjectsMessage } from '_shared/wsComunication/ListObjectsMessage.mjs';
    import { getCurrentView, setCurrentView } from '@src/lib/viewsCollector';
    import { storable } from '@src/lib/storable';
    import { get } from 'svelte/store';
    import { SetObjectMessage } from '_shared/wsComunication/ObjectMessage.mjs';
    import toast from 'svelte-french-toast';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';


    let memoProducts = storable<lineType[]>('waiterModeProducts', [])

    $effect(() => {
        memoProducts.set(lines)
    })

    let receiptId = $state<number>(-1)
    let products = $state<ProductAttributes[]>([])
    let productInputSearch = $state<string>('')
    let lines = $state<lineType[]>(get(memoProducts))
    let placeHolderName = $state<string>('#nota 123')
    let receiptName = $state<string>('');

    const cleanDraft = () => {
        lines = []
        receiptName = ''
        receiptId = -1
        memoProducts.set(lines)
    }

    let displayProducts = $derived(products.filter(product => product.name.toLowerCase().includes(productInputSearch.toLowerCase())))

    let sendToKitchen = async () => {
        getWebSocket().then(ws => ws.send(new SetObjectMessage('order', {
            id: receiptId,
            name: receiptName,
            lines: lines
        }).toString()))
        let response = SetObjectMessage.fromTable(await waitEvent(SetObjectMessage.event))
        if(response.isOk()){
            toast.success(response.getMessage())
            cleanDraft()
            setCurrentView('worker.viewNotes')
        }else{
            toast.error(response.getMessage())
        }
    }

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'worker.waiterMode'){return}
        let info = ListObjectsMessage.fromTable(data)

        products = info.getProducts()
    })

    ;(async () => {
        getWebSocket().then(ws => ws.send(new ListObjectsMessage('product', products).toString()))
        await waitEvent(ListObjectsMessage.event)
    })()
</script>

<View>
    {#snippet header()}
        <GenericHeader returnPage="worker.pannel" currentPage="Modo camarero" />
    {/snippet}

    {#snippet main()}
        <div class="flex flex-col min-h-full min-w-full p-2 pb-50">
             <div class="card bg-surface-900 border-[1px] border-surface-800 flex flex-col justify-between p-3">

                <div class="space-y-4">
                    <label class="label">
                        <span class="label-text">Nombre del pedido:</span>
                        <input type="text" placeholder={placeHolderName} bind:value={receiptName} class="input input-bordered w-full rounded-token-base text-surface-950 placeholder:text-surface-950 bg-surface-50" />
                    </label>

                    

                    <table class="border-collapse border rounded-token-base border-surface-950 w-full text-center">
                        <thead>
                            <tr>
                                <th class="border border-surface-950 p-[0.1px] bg-surface-50 text-surface-950 w-min">Cant.</th>
                                <th class="border border-surface-950 p-[0.1px] bg-surface-50 text-surface-950 w-max">Producto</th>
                                <th class="border border-surface-950 p-[0.1px] bg-surface-50 text-surface-950 w-min">Precio</th>
                                <th class="border border-surface-950 p-[0.1px] bg-surface-50 text-surface-950 w-min">Info.</th>
                            </tr>
                        </thead>
                        <tbody class="overflow-x-hidden">
                            {#if lines.length === 0}
                                <tr>
                                    <td class="border border-surface-950 p-[0.1px] bg-surface-50 text-surface-950" colspan="4">
                                        <p class="text-sm text-center">Añade productos desde el botón "Añadir Producto"</p>
                                    </td>
                                </tr>
                            {/if}
                            {#each lines as line (line)}
                                <tr>
                                    <td class="bg-surface-50 text-surface-950 border border-surface-950 p-[0.1px]">
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
                                    <td class="border bg-surface-50 text-surface-950 p-[0.1px]">
                                        {line.name}
                                    </td>
                                    <td class="border bg-surface-50 text-surface-950 p-[0.1px]">
                                        {(products.find(product => product.name === line.name)?.price * line.quantity).toFixed(2).toString().replace('.', ',')} €
                                    </td>
                                    <td class="border bg-surface-50 text-surface-950 p-[0.1px]">
                                        <button 
                                        onclick={() => modals.open(CustomModal as any, { customModal: addDescriptionModal })}>
                                        {line.annotation ? '✅' : 'ℹ️'}</button>
                                        {#snippet addDescriptionModal(close)}
                                            <div class="modal-box p-6 preset-filled-surface-100-900 rounded-lg shadow-xl max-w-md mx-auto my-auto">
                                                <h3 class="font-bold text-lg mb-4">Nota extra para {line.name}</h3>

                                                <div class="mb-4">
                                                    <textarea
                                                        placeholder="Añade notas o detalles aquí..."
                                                        bind:value={line.annotation}
                                                        class="textarea text-surface-950 placeholder:text-surface-950 bg-surface-50 textarea-bordered w-full h-32 rounded-lg resize-y"
                                                    ></textarea>
                                                </div>

                                                <div class="flex justify-end">
                                                    <IconButton text="Aceptar" onclick={close} extraClass="mx-auto"/>
                                                </div>
                                            </div>
                                        {/snippet}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
       
    {/snippet}

    {#snippet upperFooter()}
        <div class="flex flex-wrap items-center justify-center gap-5 p-5 bg-surface-900/50">
            <IconButton icon={faCartPlus} text="Añadir Producto" onclick={() => modals.open(CustomModal as any, { customModal: addProductModal })}/>
            <IconButton icon={faBroom} text="Limpiar" onclick={cleanDraft}/>
            <IconButton icon={faPaperPlane} text="Enviar a Cocina" onclick={sendToKitchen}/>
            <IconButton icon={faListUl} text="Ver pedidos" onclick={() => setCurrentView('worker.viewNotes')}/>
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('worker.pannel')}/>
            {#snippet addProductModal(close)}
                <div class="flex-1 flex flex-col items-center max-h-screen min-w-full gap-3 bg-blur">
                    <div class="w-full fixed top-0 left-0 p-5 bg-blur bg-surface-900/80">
                        <h4 class="h4">Filtrar por nombre:</h4>
                        <input type="text" placeholder="Busca por nombre" bind:value={productInputSearch} class="min-w-full input input-bordered w-full max-w-70 rounded-token-base text-surface-950 placeholder:text-surface-950 bg-surface-50" />
                    </div>
                    <div class="flex flex-col flex-1 overflow-y-scroll no-scrollbar gap-3 p-3 max-w-70 py-30">
                        {#each displayProducts as product}
                            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                            <div onclick={() => {
                                let line = lines.find(line => line.name === product.name)
                                if(!line){
                                    line = {
                                        quantity: 1,
                                        productId: product.id,
                                        name: product.name,
                                        annotation: ''
                                    }
                                    lines.push(line)
                                }else{
                                    line.quantity += 1
                                }

                                close()
                            }} class="card shadow bg-surface-900 border-[1px] border-surface-800 card-hover">
                                <article class="p-2">
                                <span class="flex justify-between items-center">
                                    <h2 class="h6 font-bold">{product.name}</h2>
                                    <span class="text-sm font-bold me-4">{product.price.toString().replace('.', ',')} €</span>
                                </span>
                                    <p class="text-xs">{product.description}</p>
                                </article>
                            </div>
                        {/each}
                    </div>

                    <div class="w-full fixed bottom-0 left-0 p-5 bg-blur">
                        <IconButton icon={faArrowLeft} text="Volver" onclick={close} extraClass="mx-auto"/>
                    </div>
                </div>
            {/snippet}
        </div>
    {/snippet}
</View>