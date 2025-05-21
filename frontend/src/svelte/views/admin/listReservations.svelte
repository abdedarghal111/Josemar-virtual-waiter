<script lang="ts">
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
    import { getCurrentView, setCurrentView } from "@src/lib/viewsCollector";
    import type { ReservationAttributes } from "_shared/SharedTypes.mjs";
    import { ListObjectsMessage } from "_shared/wsComunication/ListObjectsMessage.mjs";
    import { onSocketEvent, getWebSocket, waitEvent } from "@src/lib/wsComunication";

    let reservations = $state<ReservationAttributes[]>([])

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'admin.listReservations'){return}
        let info = ListObjectsMessage.fromTable(data)

        reservations = info.getReservations()
    })

    let waiting = 'placeholder animate-pulse';
    let reservationStatus = {
        requested: 'Pendiente',
        accepted: 'Aceptada',
        rejected: 'Rechazada'
    }

    ;(async () => {
        getWebSocket().then(ws => ws.send(new ListObjectsMessage('reservation', []).toString()))
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
                <h2 class={'h2 p-3 '}>Reservas</h2>
            </div>

            <div class="table-wrap flex-1 p-5">
                <table class="table caption-bottom">
                    <tbody class={"[&>tr]:hover:preset-tonal-primary min-h-full"}>
                        <tr>
                            <th>Id</th>
                            <th>Usuario</th>
                            <th>Fecha</th>
                            <th>Adultos</th>
                            <th>Niños</th>
                            <th>Estado</th>
                        </tr>
                    {#each reservations as reservation (reservation.id)}
                        <tr onclick={() => {
                            // setCurrentView('admin.reservation', { id: reservation.id })
                        }}>
                            <td>{reservation.id}</td>
                            <td>{reservation.requestedBy}</td>
                            <td>{(() => {
                                    let date = new Date(reservation.requestDate)
                                    return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`
                                })()}</td>
                            <td>{reservation.numAdults}</td>
                            <td>{reservation.numMinors}</td>
                            <td>{reservationStatus[reservation.status] ?? "Desconocido"}</td>
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

            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('admin.reservation')}>
                <Fa icon={faFileCirclePlus} size="lg" /> Crear nueva
            </button>
        </div>
    {/snippet}
</View>
