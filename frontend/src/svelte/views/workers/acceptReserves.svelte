<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import { type ReservationAttributes } from '_shared/SharedTypes.mjs';
    import Fa from 'svelte-fa';
    import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
    import { getCurrentView, setCurrentView } from '@src/lib/viewsCollector';
    import { getWebSocket, onSocketEvent, waitEvent } from '@src/lib/wsComunication';
    import { ListObjectsMessage } from '_shared/wsComunication/ListObjectsMessage.mjs';
    import { AcceptReserveMessage } from '_shared/wsComunication/AcceptReserveMessage.mjs';
    import toast from 'svelte-french-toast';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';

    let reservations = $state<ReservationAttributes[]>([])

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'worker.acceptReserves'){return}
        let info = ListObjectsMessage.fromTable(data)

        reservations = []
        for(let newReservation of info.getReservations()){
            if(newReservation.status === 'requested'){
                reservations.push(newReservation)
            }
        }
    })

    let acceptReserve = async (ev: Event, reservationId: number, accept: boolean) => {
        let button = ev.target as HTMLButtonElement
        button.disabled = true

        getWebSocket().then(ws => ws.send(new AcceptReserveMessage(reservationId, accept).toString()))
        let dataIn = await waitEvent(AcceptReserveMessage.event)
        let info = AcceptReserveMessage.fromTable(dataIn)

        if(info.isOk()){
            toast.success(info.getMessage())
        }else{
            toast.error(info.getMessage())
        }

        button.disabled = false
    }

    let requested = $state<boolean>(false)

    ;(async () => {
        getWebSocket().then(ws => ws.send(new ListObjectsMessage('reservation', []).toString()))
        await waitEvent(ListObjectsMessage.event)
        requested = true
    })()

    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="worker.pannel" currentPage="Aceptar reservas" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center">

           <div class="flex flex-col items-center mt-5 mb-25">
                <div class="border-s-2 border-surface-900 text-start mx-5 ps-3 mb-5">
                    <h3 class="h3 text-surface-950">Reservas pendientes</h3>
                    <p class="text-justify text-surface-900">
                        Aquí aparecerán las reservas pendientes de los clientes para que puedan ser aceptadas o rechazadas.
                    </p>
                </div>

                <div class="grid gap-3">
                    {#if reservations.length > 0 && requested}
                        {#each reservations as reservation ( reservation.id )}
                        <div class="card bg-surface-900 border-[1px] border-surface-200-800 mb-5 max-w-70">
                            <article class="p-3">
                                <h2 class="h6 font-bold">Reserva #{reservation.id}</h2>
                                <p class="text-sm">Sugerida por: {reservation.requestedBy ?? 'Desconocido'}</p>
                                <p class="text-sm">Fecha: {new Date(reservation.requestDate).toLocaleDateString()} {new Date(reservation.requestDate).toLocaleTimeString()}</p>
                                <p class="text-sm">Adultos: {reservation.numAdults}</p>
                                <p class="text-sm">Niños: {reservation.numMinors}</p>
                            </article>

                            <footer class="flex justify-end gap-5 p-5">
                                <button onclick={(ev) => acceptReserve(ev, reservation.id, true)} class="btn btn-primary btn-xs preset-filled-tertiary-500">Aceptar</button>
                                <button onclick={(ev) => acceptReserve(ev, reservation.id, false)} class="btn btn-primary btn-xs preset-filled-warning-500">Denegar</button>
                            </footer>
                        </div>
                        {/each}
                    {:else if requested}
                        
                        <div class="card bg-surface-900 border-[1px] border-surface-200-800 max-w-90 mt-20">
                            <p class="text-lg p-3 text-center font-bold">Todas las reservas han sido revisadas ✅</p>
                        </div>
                    {:else}
                        <p class="placeholder animate-pulse h2  mt-20">Cargando...</p>
                    {/if}
                </div>
            </div>
        </div>
    {/snippet}

    {#snippet upperFooter()}
        <div class="flex items-center justify-center gap-5 p-5 bg-surface-900/50">
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('worker.pannel')}/>
        </div>
    {/snippet}
</View>