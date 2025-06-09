<script lang='ts'>
    import View from '@src/components/View.svelte'
    import toast from 'svelte-french-toast';
    import { type CompleteOrderType } from '_shared/SharedTypes.mjs';
    import { ListObjectsMessage } from '_shared/wsComunication/ListObjectsMessage.mjs';
    import { SetOrderLineStatusMessage } from '_shared/wsComunication/SetOrderLineStatusMessage.mjs';
    import { getWebSocket, onSocketEvent, waitEvent } from '@src/lib/wsComunication';
    import { getCurrentView, setCurrentView } from '@src/lib/viewsCollector';
    import Fa from 'svelte-fa';
    import { faArrowLeft, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';
    import { sounds } from '@src/lib/sound';

    let orders = $state<CompleteOrderType[]>([])
    let requested = $state<boolean>(false)

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'worker.viewNotes'){return}
        let info = ListObjectsMessage.fromTable(data)
        if(info.getType() !== 'completeOrder'){return}

        let message = info.getMessage()
        if(message && message !== ''){
            let parts = message.split(':separator:')
            if(parts.length === 4 && parts[0] === 'NEW_ORDER_LINE_STATUS' && parts[3] == 'ready'){
                toast(`Pedido #${parts[1]} - ${parts[2]} preparado`, {
                    icon: 'ℹ️',
                })
                sounds.bell.play()
            }
        }

        let sortedOrders = info.getCompleteOrders().sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

        orders = sortedOrders
    })

    let statuses = {
        'notPrepared': 'Por preparar',
        'making': 'Preparándose',
        'ready': 'Listo',
        'delivered': 'Servido',
    }

    ;(async () => {
        getWebSocket().then(ws => ws.send(new ListObjectsMessage('completeOrder', orders).toString()))
        await waitEvent(ListObjectsMessage.event)
        requested = true
    })()

    const setBackgroundLineStatus = (status: string) => {
        if(status === 'notPrepared'){
            return 'bg-surface-400 text-surface-950 border-surface-700'
        }else if(status === 'making'){
            return 'bg-warning-400 text-warning-950 border-warning-700'
        }else if(status === 'ready'){
            return 'bg-tertiary-400 text-tertiary-950 border-tertiary-700'
        }else if(status === 'delivered'){
            return 'bg-success-400 text-success-950 border-success-700'
        }else{
            return ''
        }
    }

    const isOrderDelivered = (order) => {
        return order.lines.length > 0 && order.lines.every(line => line.status === 'delivered')
    }

    const setBackgroundOrderStatus = (order) => {
        if(isOrderDelivered(order)){
            return 'bg-success-400 text-success-950 border-success-700'
        }
        return 'bg-surface-900 text-surface-50 border-surface-700'
    }
</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="worker.waiterMode" currentPage="Pedidos" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center my-5 space-y-5 px-5 pb-25">

            <div class="flex flex-col gap-y-4 w-full max-w-100">
                {#if orders.length > 0 && requested}
                    {#each orders as order (order.id)}
                    <div class={"card space-y-2 div border-[1px] border-surface-800 p-3 " + setBackgroundOrderStatus(order)}>
                        <h2 class="">{`Pedido #${order.id}`} <b>{order.name ? `(${order.name})` : ''}</b></h2>

                        <div class="hr border-surface-400"></div>

                        {#each order.lines as line (line.productId)}
                            <div class={"p-2 rounded-md mb-1 " + setBackgroundLineStatus(line.status)}>
                                <div class="flex justify-between items-center ">
                                    <span class="h6 mb-0 pb-0">{line.quantity} x {line.name}</span>
                                    <span>{statuses[line.status]}</span>
                                    {#if line.status !== 'delivered'}
                                        <button onclick={async () => {
                                            getWebSocket().then(ws => ws.send(new SetOrderLineStatusMessage({orderId: order.id, productId: line.productId}, 'delivered').toString()))
                                            let dataIn = await waitEvent(SetOrderLineStatusMessage.event)
                                            let info = SetOrderLineStatusMessage.fromTable(dataIn)

                                            if(info.isOk()){
                                                toast.success(info.getMessage())
                                            }else{
                                                toast.error(info.getMessage())
                                            }

                                        }} class="bg-surface-50 p-1 rounded-md"><Fa icon={faSquareCheck}/></button>
                                    {/if}
                                </div>
                                {#if line.annotation && line.annotation !== ''}
                                    <span class="text-xs">{line.annotation}</span>
                                {/if}
                            </div>
                            {/each}

                        
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
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('worker.waiterMode')}/>
        </div>
    {/snippet}
</View>