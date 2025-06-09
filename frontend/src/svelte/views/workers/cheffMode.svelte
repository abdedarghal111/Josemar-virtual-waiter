<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import toast from 'svelte-french-toast';
    import { type CompleteOrderType } from '_shared/SharedTypes.mjs';
    import { ListObjectsMessage } from '_shared/wsComunication/ListObjectsMessage.mjs';
    import { SetOrderLineStatusMessage } from '_shared/wsComunication/SetOrderLineStatusMessage.mjs';
    import { getWebSocket, onSocketEvent, waitEvent } from '@src/lib/wsComunication';
    import { getCurrentView, setCurrentView } from '@src/lib/viewsCollector';
    import Fa from 'svelte-fa';
    import { faArrowLeft, faClock, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
    import { sounds } from '@src/lib/sound';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';

    let orders = $state<CompleteOrderType[]>([])
    let requested = $state<boolean>(false)

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'worker.cheffMode'){return}
        let info = ListObjectsMessage.fromTable(data)
        if(info.getType() !== 'completeOrder'){return}

        let oneDayOrders = info.getCompleteOrders()
            .filter(order => {
                const now = Date.now()
                const orderDate = new Date(order.orderDate).getTime()
                return (now - orderDate) < 24 * 60 * 60 * 1000
            })
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

        

        let sortedOrders = oneDayOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

        orders = sortedOrders
        

        if(info.getMessage() === 'NEW_ORDER'){
            sounds.bellSound.play()
        }
    })

    ;(async () => {
        getWebSocket().then(ws => ws.send(new ListObjectsMessage('completeOrder', orders).toString()))
        await waitEvent(ListObjectsMessage.event)
        requested = true
    })()

    const setBackgroundLineStatus = (status: string) => {
        if(status === 'notPrepared'){
            return 'bg-surface-50 text-surface-950'
        }else if(status === 'making'){
            return 'bg-warning-200 text-black/70'
        }else if(status === 'ready'){
            return 'bg-tertiary-400 text-black/70'
        }else if(status === 'delivered'){
            return 'bg-success-400 text-black/70'
        }else{
            return ''
        }
    }

    const isOrderDelivered = (order) => {
        return order.lines.length > 0 && order.lines.every(line => line.status === 'delivered')
    }

    const setBackgroundOrderStatus = (order) => {
        if(isOrderDelivered(order)){
            return 'bg-success-400 text-success-950'
        }
        return 'bg-surface-950 text-surface-50'
    }

    const bClass = 'bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="worker.pannel" currentPage="Modo cocinero" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center my-5 space-y-5 px-5 pb-20">

            <div class="flex flex-col gap-y-4 w-full max-w-[400px]">
                {#if orders.length > 0 && requested}
                    {#each orders as order (order.id)}
                    <div class={"card space-y-2 div preset-filled-surface-100-900 border-[1px] border-surface-200-800 p-3 " + setBackgroundOrderStatus(order)}>
                        <h2 class="">{`Pedido #${order.id}`} <b>{order.name ? `(${order.name})` : ''}</b></h2>

                        <div class="hr border-surface-400"></div>

                        <table class="border-collapse border rounded-token-base border-surface-950 w-full text-center">
                            <tbody class="overflow-x-hidden">
                                {#each order.lines as line (line.productId)}
                                    <tr>
                                        <td class={"border border-surface-950 p-[0.1px] " + setBackgroundLineStatus(line.status)}>
                                            <div class="flex items-center justify-center px-1">
                                                {line.quantity}
                                            </div>
                                        </td>
                                        <td class={"border border-surface-950 " + setBackgroundLineStatus(line.status)}>
                                            <div class="flex flex-col justify-center">
                                                <span class="p-[0.1px] px-2 text-start">{line.name}</span>
                                                {#if line.annotation && line.annotation !== ''}
                                                    <span class="p-[0.1px] px-2 text-start border-t border-surface-950 text-xs">({line.annotation})</span>
                                                {/if}
                                            </div>
                                        </td>
                                        <td class={"border border-surface-950 p-[0.1px] " + setBackgroundLineStatus(line.status)}>
                                            <button onclick={async () => {
                                            getWebSocket().then(ws => ws.send(new SetOrderLineStatusMessage({orderId: order.id, productId: line.productId}, 'making').toString()))
                                                let dataIn = await waitEvent(SetOrderLineStatusMessage.event)
                                                let info = SetOrderLineStatusMessage.fromTable(dataIn)

                                                if(info.isOk()){
                                                    toast.success(info.getMessage())
                                                }else{
                                                    toast.error(info.getMessage())
                                                }
                                            }} class="mx-auto flex align-center items-center p-1 rounded-md">
                                                <Fa icon={faClock}/>
                                            </button>
                                        </td>
                                        <td class={"border border-surface-950 p-[0.1px] " + setBackgroundLineStatus(line.status)}>
                                            <button onclick={async () => {
                                            getWebSocket().then(ws => ws.send(new SetOrderLineStatusMessage({orderId: order.id, productId: line.productId}, 'ready').toString()))
                                                let dataIn = await waitEvent(SetOrderLineStatusMessage.event)
                                                let info = SetOrderLineStatusMessage.fromTable(dataIn)

                                                if(info.isOk()){
                                                    toast.success(info.getMessage())
                                                }else{
                                                    toast.error(info.getMessage())
                                                }
                                            }} class="mx-auto flex align-center items-center p-1 rounded-md">
                                                <Fa icon={faSquareCheck}/>
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                        
                    </div>
                    {/each}
                {:else if requested && orders.length === 0}
                    <p class="h3 text-center">No se han realizado pedidos todavía.</p>
                {:else}
                    <p class="placeholder animate-pulse h2">Cargando...</p>
                {/if}
            </div>
                
        </div>
    {/snippet}

    {#snippet upperFooter()}
        <div class="flex items-center justify-center gap-5 p-5 bg-surface-900/50">
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('worker.pannel')}/>
        </div>
    {/snippet}
</View>