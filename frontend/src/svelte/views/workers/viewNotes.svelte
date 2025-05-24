<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import toast from 'svelte-french-toast';
    import { CompleteOrderType } from '_shared/SharedTypes.mjs';
    import { ListObjectsMessage } from '_shared/wsComunication/ListObjectsMessage.mjs';
    import { SetOrderLineStatusMessage } from '_shared/wsComunication/SetOrderLineStatusMessage.mjs';
    import { getWebSocket, onSocketEvent, waitEvent } from '@src/lib/wsComunication';
    import { getCurrentView, setCurrentView } from '@src/lib/viewsCollector';
    import Fa from 'svelte-fa';
    import { faArrowLeft, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

    let orders = $state<CompleteOrderType[]>([])
    let requested = $state<boolean>(false)

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'worker.viewNotes'){return}
        let info = ListObjectsMessage.fromTable(data)
        if(info.getType() !== 'completeOrder'){return}

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
            return 'bg-surface-200 dark:bg-surface-900'
        }else if(status === 'making'){
            return 'bg-yellow-200 dark:bg-yellow-900'
        }else if(status === 'ready'){
            return 'bg-blue-200 dark:bg-blue-900'
        }else if(status === 'delivered'){
            return 'bg-green-200 dark:bg-green-900'
        }else{
            return ''
        }
    }

    const isOrderDelivered = (order) => {
        return order.lines.length > 0 && order.lines.every(line => line.status === 'delivered')
    }

    const setBackgroundOrderStatus = (order) => {
        if(isOrderDelivered(order)){
            return 'bg-green-200 dark:bg-green-900'
        }
        return 'bg-surface-100 dark:bg-surface-900'
    }

    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Pedidos" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center my-5 space-y-5 px-5">

            <div class="flex flex-col gap-y-4 w-full max-w-[400px]">
                {#if orders.length > 0 && requested}
                    {#each orders as order (order.id)}
                    <div class={"space-y-2 div preset-filled-surface-100-900 border-[1px] border-surface-200-800 p-3 " + setBackgroundOrderStatus(order)}>
                        <h2 class="">{`Pedido #${order.id}`} <b>{order.name ? `(${order.name})` : ''}</b></h2>

                        <div class="hr border-surface-400"></div>

                        <ul class="list-disc ps-5">
                            {#each order.lines as line (line.productId)}
                            <li class={"p-2 rounded-md mb-1 " + setBackgroundLineStatus(line.status)}>
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
                            </li>
                            {/each}
                        </ul>

                        
                    </div>
                    {/each}
                {:else if requested && orders.length === 0}
                    <p class="h3 text-center">No se han realizado pedidos todavía.</p>
                {:else}
                    <p class="placeholder animate-pulse h2">Cargando...</p>
                {/if}
            </div>

            
            <button onclick={() => setCurrentView('worker.waiterMode')} class={"flex items-center gap-2 mx-auto " + bClass}>
                <Fa icon={faArrowLeft} size="lg"/> Volver
            </button>
                
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>