<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import { faArrowLeft, faCalendarCheck, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
    import { getParameters, returnToHomeIfNotLogged, setCurrentView } from '@src/lib/viewsCollector';
    import Fa from 'svelte-fa';
    import { type ReservationAttributes } from '_shared/SharedTypes.mjs';
    import toast from 'svelte-french-toast';
    import { GetReservationRequest } from '_shared/requests/GetReservationRequest.mts';
    import { SetReservationRequest } from '_shared/requests/SetReservationRequest.mts';
    import { DeleteReservationRequest } from '_shared/requests/DeleteReservationRequest.mts';
    import { convertToDateTimeLocalString } from '_shared/helpers.mjs'
    import axios from 'axios';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';

    returnToHomeIfNotLogged()
    

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
        ;(async () => {
            try {
                let response = await axios({
                    method: "post",
                    url: `${window.location.origin}/api/${GetReservationRequest.path}`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: {
                        id: id
                    }
                })

                let request = GetReservationRequest.getFromResponse(response)

                if(request.isOk()){
                    let newReservation = request.getReservation()
                    reservation.id = newReservation.id
                    reservation.status = newReservation.status
                    reservation.requestDate = new Date(newReservation.requestDate)
                    reservation.numAdults = newReservation.numAdults
                    reservation.numMinors = newReservation.numMinors
                    ;(document.getElementById('clientReservation/requestDate') as HTMLInputElement).value = convertToDateTimeLocalString(reservation.requestDate)
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

    async function onSubmit(event: Event) {
        event.preventDefault()
        let submitButton = document.getElementById('clientReservation/submit') as HTMLButtonElement

        submitButton.disabled = true

        reservation.requestDate = new Date((document.getElementById('clientReservation/requestDate') as HTMLInputElement).value)

        try {
            let response = await axios({
                method: "post",
                url: `${window.location.origin}/api/${SetReservationRequest.path}`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    id: reservation.id,
                    requestDate: reservation.requestDate,
                    numAdults: reservation.numAdults ?? 0,
                    numMinors: reservation.numMinors ?? 0
                }
            })

            let request = SetReservationRequest.getFromResponse(response)

            if(request.isOk()){
                reservation = request.getReservation()
                reservation.requestDate = new Date(reservation.requestDate)
                ;(document.getElementById('clientReservation/requestDate') as HTMLInputElement).value = convertToDateTimeLocalString(reservation.requestDate)
                setCurrentView('user.listReserves')
            }else{
                toast.error(request.getMessage())
            }
        }catch (error) {
            toast.error('Error en la red, reintentar mas tarde')
        }

        submitButton.disabled = false
    }

    async function submitDelete(event: Event) {
        event.preventDefault()
        let submitButton = document.getElementById('clientReservation/delete') as HTMLButtonElement

        submitButton.disabled = true

        try {
            let response = await axios({
                method: "post",
                url: `${window.location.origin}/api/${DeleteReservationRequest.path}`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    id: reservation.id
                }
            })

            let request = DeleteReservationRequest.getFromResponse(response)

            if(request.isOk()){
                toast.success(request.getMessage())
                setCurrentView('user.listReserves')
            }else{
                toast.error(request.getMessage())
            }
        }catch (error) {
            toast.error('Error en la red, reintentar mas tarde')
        }

        submitButton.disabled = false
    }
</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="user.reserveMenu" currentPage="Solicitar reserva" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center gap-7 m-5">
            <div class="card bg-surface-900 border-[1px] border-surface-800 max-w-70 p-3">
                <div class="w-full">
                    {#if reservation.status === 'requested'}
                        {#if id}
                            <h3 class="h3 font-bold">Editar Reserva</h3>
                            <p class="text-sm opacity-70">La reserva no ha sido revisada aún, puedes editarla o eliminarla.</p>
                        {:else}
                            <h3 class="h3 font-bold">Nueva Reserva</h3>
                            <p class="text-sm opacity-70">Crea una nueva reserva para disfrutar de nuestro restaurante.</p>
                        {/if}
                    {:else if reservation.status === 'accepted'}
                        <h3 class="h3 font-bold">Reserva aceptada</h3>
                        <p class="text-sm opacity-70">Las reservas aceptadas no se pueden editar, solo visualizar.</p>
                    {:else}
                        <h3 class="h3 font-bold">Reserva rechazada</h3>
                        <p class="text-sm opacity-70">Las reservas rechazadas no se pueden editar, solo visualizar.</p>
                    {/if}
                </div>

                <form onsubmit={onSubmit} class="space-y-3 mt-7">
                    <div class="space-y-2">
                        <label for="requestDate" class="label">
                        <span class="label-text">Fecha y hora:</span>
                        </label>
                        <input {readonly} {disabled} type="datetime-local" id="clientReservation/requestDate" class="input text-sm input-bordered w-full" value={convertToDateTimeLocalString(new Date())} />
                    </div>

                    <div class="space-y-2">
                        <label for="numAdults" class="label">
                        <span class="label-text">Adultos:</span>
                        </label>
                        <input {readonly} {disabled} type="number" id="clientReservation/numAdults" class="input text-sm input-bordered w-full" bind:value={reservation.numAdults} min="0" />
                    </div>

                    <div class="space-y-2">
                        <label for="numMinors" class="label">
                        <span class="label-text">Niños:</span>
                        </label>
                        <input {readonly} {disabled} type="number" id="clientReservation/numMinors" class="input text-sm input-bordered w-full" bind:value={reservation.numMinors} min="0" />
                    </div>

                    <div class="flex flex-col gap-5 items-center justify-center mt-7">
                        <button id="clientReservation/submit" class="w-fit btn preset-filled-success-500 bg-success-300 p-2 card text-sm"  type="submit">
                            <Fa icon={faCalendarCheck} size="lg" /> 
                            {#if id}
                                Confirmar modificación
                            {:else}
                                Solicitar reserva
                            {/if}
                        </button>
                        {#if id && reservation.status === 'requested'}
                            <IconButton icon={faRectangleXmark} text="Cancelar solicitud" onclick={submitDelete} extraClass="preset-filled-warning-500"/>
                        {/if}
                    </div>
                </form>
            </div>

            <IconButton icon={faArrowLeft} text="Ir atras"  onclick={() => setCurrentView('user.reserveMenu')} extraClass="mb-2 text-surface-50 bg-surface-900"/>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>