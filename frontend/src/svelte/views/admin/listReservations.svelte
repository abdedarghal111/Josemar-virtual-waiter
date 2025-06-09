<script lang="ts">
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
    import { getCurrentView, setCurrentView } from "@src/lib/viewsCollector";
    import type { ReservationAttributes } from "_shared/SharedTypes.mjs";
    import { ListObjectsMessage } from "_shared/wsComunication/ListObjectsMessage.mjs";
    import { onSocketEvent, getWebSocket, waitEvent } from "@src/lib/wsComunication";
    import IconButton from '@src/components/IconButton.svelte';
    import GenericHeader from '@src/partials/GenericHeader.svelte';

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
</script>

<View>
    {#snippet header()}
        <GenericHeader returnPage="admin.editDatabase" currentPage="Lista de reservas" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center py-5 pb-25">

           <div class="flex flex-col justify-center items-center gap-3 p-3 shadow bg-surface-900 card mx-3">
                <div class="w-full">
                    <h2 class="h2">Lista de reservas</h2>
                    <p>
                        Aquí se pueden ver todas las reservas confirmadas y solicitadas.
                    </p>
                </div>

                <div class="table-wrap flex-1 p-5 px-2">
                    <table class="table caption-bottom">
                        <tbody class="min-h-full rounded-md">
                            <tr class="bg-tertiary-100/80 text-surface-950">
                                <!-- <th  class="rounded-tl-md">Id</th> -->
                                <th class="rounded-tl-md">Usuario</th>
                                <th>Fecha</th>
                                <th>Adultos</th>
                                <th>Niños</th>
                                <th  class="rounded-tr-md">Estado</th>
                            </tr>
                        {#each reservations as reservation (reservation.id)}
                            <tr onclick={() => {
                                // setCurrentView('admin.reservation', { id: reservation.id })
                            }} class="
                            bg-surface-800/50 odd:bg-surface-800/30 hover:bg-surface-700
                            first:[&>td:first-child]:rounded-tl-md
                            last:[&>td:last-child]:rounded-br-md
                            ">
                                <!-- <td>{reservation.id}</td> -->
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
        </div>
    {/snippet}

    {#snippet upperFooter()}
        <div class="flex items-center justify-center gap-5 p-5 bg-surface-900/50">
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('admin.editDatabase')}/>
        </div>
    {/snippet}
</View>
