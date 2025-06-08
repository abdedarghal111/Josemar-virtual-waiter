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
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center"><!-- justify-between -->

           <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 '}>Reservas</h2>

                <div class="grid gap-4">
                    {#if reservations.length > 0 && requested}
                        {#each reservations as reservation ( reservation.id )}
                        <div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover block overflow-hidden mb-5">
                            <article class="p-2">
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
                        <p class="h3 text-center">Todas las reservas han sido revisadas ✅</p>
                    {:else}
                        <p class="placeholder animate-pulse h2">Cargando...</p>
                    {/if}
                </div>
            </div>

            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('worker.pannel')}>
                <Fa icon={faArrowLeft} size="lg" /> Volver
            </button>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>