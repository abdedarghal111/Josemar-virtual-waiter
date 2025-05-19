<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import { faArrowLeft, faCalendarCheck, faCalendarDays, faList } from '@fortawesome/free-solid-svg-icons';
    import { getParameters, setCurrentView } from '@src/lib/viewsCollector';
    import Fa from 'svelte-fa';
    import { type ReservationAttributes } from '_shared/SharedTypes.mjs';
    import toast from 'svelte-french-toast';
    import { GetReservationRequest } from '_shared/requests/GetReservationRequest.mts';
    import { SetReservationRequest } from '_shared/requests/SetReservationRequest.mts';
    import axios from 'axios';

    let reservation = $state<ReservationAttributes>({
        id: -1,
        requestDate: new Date(),
        numAdults: 0,
        numMinors: 0,
        requestedBy: -1,
        status: 'requested',
        orderId: -1
    })

    let readonly = $state<boolean>(false)
    let disabled = $derived(readonly)

    let id = getParameters().id
    if(id){
        readonly = true
        ;(document.getElementById('clientReservation/submit') as HTMLButtonElement).disabled = true
        ;(async () => {
            try {
                let response = await axios({
                    method: "post",
                    url: `${window.location.origin}/api/${GetReservationRequest.path}`,
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                let request = GetReservationRequest.getFromResponse(response)

                if(request.isOk()){
                    reservation = request.getReservation()
                    if(reservation.status !== 'requested'){
                        readonly = true
                        ;(document.getElementById('clientReservation/submit') as HTMLButtonElement).disabled = true
                    }
                }else{
                    toast.error(request.getMessage())
                }
            }catch (error) {
                toast.error('Error en la red, reintentar mas tarde')
            }
        })()
    }

    async function onSubmit() {
        let submitButton = document.getElementById('clientReservation/submit') as HTMLButtonElement

        submitButton.disabled = true

        try {
            let response = await axios({
                method: "post",
                url: `${window.location.origin}/api/${SetReservationRequest.path}`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: reservation
            })

            let request = SetReservationRequest.getFromResponse(response)

            if(request.isOk()){
                reservation = request.getReservation()
                setCurrentView('user.listReserves')
            }else{
                toast.error(request.getMessage())
            }
        }catch (error) {
            toast.error('Error en la red, reintentar mas tarde')
        }

        submitButton.disabled = false
    }

    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center gap-6 p-6">
            <div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800">
                <div class="p-4">
                    {#if reservation.status === 'requested'}
                        {#if id}
                            <h3 class="h5 font-bold mb-2">Editar Reserva</h3>
                            <p class="text-sm opacity-70">La reserva no ha sido revisada aún, puedes editarla o eliminarla.</p>
                        {:else}
                            <h3 class="h5 font-bold mb-2">Nueva Reserva</h3>
                            <p class="text-sm opacity-70">Crea una nueva reserva para disfrutar de nuestro restaurante.</p>
                        {/if}
                    {:else if reservation.status === 'accepted'}
                        <h3 class="h5 font-bold mb-2">"Reserva aceptada"</h3>
                        <p class="text-sm opacity-70">Las reservas aceptadas no se pueden editar, solo visualizar.</p>
                    {:else}
                        <h3 class="h5 font-bold mb-2">"Reserva rechazada"</h3>
                        <p class="text-sm opacity-70">Las reservas rechazadas no se pueden editar, solo visualizar.</p>
                    {/if}
                </div>
            </div>
            <form onsubmit={onSubmit} class="space-y-4">
                <div class="space-y-2">
                    <label for="requestDate" class="label">
                    <span class="label-text text-lg">Fecha y hora:</span>
                    </label>
                    <input {readonly} {disabled} type="datetime-local" id="requestDate" class="input input-bordered w-full" bind:value={reservation.requestDate} />
                </div>

                <div class="space-y-2">
                    <label for="numAdults" class="label">
                    <span class="label-text text-lg">Adultos:</span>
                    </label>
                    <input {readonly} {disabled} type="number" id="numAdults" class="input input-bordered w-full" bind:value={reservation.numAdults} min="1" />
                </div>

                <div class="space-y-2">
                    <label for="numMinors" class="label">
                    <span class="label-text text-lg">Niños:</span>
                    </label>
                    <input {readonly} {disabled} type="number" id="numMinors" class="input input-bordered w-full" bind:value={reservation.numMinors} min="0" />
                </div>

                <div class="flex flex-col items-center">
                    <button id="clientReservation/submit" class={"gap-2 mt-5 " + bClass}  type="submit" onclick={() => setCurrentView('user.reserveMenu')}>
                        <Fa icon={faCalendarCheck} size="lg" /> Realizar Reserva
                    </button>
                </div>
            </form>
            <button class={"gap-2 mt-5 " + bClass} onclick={() => setCurrentView('user.reserveMenu')}>
                <Fa icon={faArrowLeft} size="lg" /> ir atras
            </button>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>