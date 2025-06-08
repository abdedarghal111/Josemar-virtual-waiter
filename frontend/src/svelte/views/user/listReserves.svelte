<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import Axios from 'axios';
    import { ListMyReservesRequest } from '_shared/requests/ListMyReservesRequest.mjs';
    import toast from 'svelte-french-toast';
    import { type ReservationAttributes } from '_shared/SharedTypes.mjs';
    import IconButton from '@src/components/IconButton.svelte';
    import Fa from 'svelte-fa';
    import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
    import { returnToHomeIfNotLogged, setCurrentView } from '@src/lib/viewsCollector';
    import GenericHeader from '@src/partials/GenericHeader.svelte';

    returnToHomeIfNotLogged()

    let reservations = $state<ReservationAttributes[]>([])
    let requested = $state<boolean>(false)

    let reservationStatus = {
        requested: 'Pendiente de revisión',
        accepted: 'Reserva aceptada',
        rejected: 'Reserva rechazada'
    }

    ;(async () => {
        try {
            let response = await Axios({
                method: "post",
                url: `${window.location.origin}/api/${ListMyReservesRequest.path}`,
                headers: {
                    "Content-Type": "application/json",
                }
            })

            let request = ListMyReservesRequest.getFromResponse(response)

            if(request.isOk()){
                reservations = request.getReservations()
            }else{
                toast.error(request.getMessage())
            }
        }catch (error) {
            toast.error('Error en la red, reintentar mas tarde')
        }finally{
            requested = true
        }
    })()

    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'

    const setBackgroudReservationStatus = (status: string) => {
        if(status === 'requested'){
            return 'bg-tertiary-400 border-tertiary-700 text-tertiary-950'
        }else if(status === 'accepted'){
            return 'bg-success-400 border-success-700 text-success-950'
        }else{
            return 'bg-error-400 border-error-700 text-error-950'
        }
    }
</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="user.reserveMenu" currentPage="Mis reservas" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center">

           <div class="flex flex-col items-center my-3 max-w-xl mx-3">
                <h2 class='h2 pb-3 text-surface-950'>Reservas</h2>

                <div class="grid gap-3">
                    {#if reservations.length > 0 && requested}
                        {#each reservations as reservation}
                        <button class={setBackgroudReservationStatus(reservation.status) + ` card preset-filled-surface900 border-[1px] card-hover block`} onclick={() => setCurrentView('user.reserve', {id: reservation.id})}>
                            <article class="p-2">
                                <h2 class="h6 font-bold">Reserva #{reservation.id}</h2>
                                <p class="text-sm">Fecha: {new Date(reservation.requestDate).toLocaleDateString()} {new Date(reservation.requestDate).toLocaleTimeString()}</p>
                                <p class="text-sm">Adultos: {reservation.numAdults}</p>
                                <p class="text-sm">Niños: {reservation.numMinors}</p>
                                <p class="text-sm font-bold mt-2">Estado: {reservationStatus[reservation.status]}</p>
                            </article>
                            {#if reservation.status === 'requested'}
                                <footer class="flex justify-end">
                                    <div class="btn btn-primary btn-xs">Modificar</div>
                                </footer>
                            {/if}
                        </button>
                        {/each}
                    {:else if requested && reservations.length === 0}
                        <p class="h3 text-center">No se ha realizado ninguna reserva.</p>
                    {:else}
                        <p class="placeholder animate-pulse h2">Cargando...</p>
                    {/if}
                </div>
            </div>

            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('user.reserveMenu')} extraClass="mt-5 mb-2 text-surface-50 bg-surface-900" />

        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>