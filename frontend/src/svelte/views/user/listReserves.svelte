<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import Axios from 'axios';
    import { ListMyReservesRequest } from '_shared/requests/ListMyReservesRequest.mjs';
    import toast from 'svelte-french-toast';
    import { type ReservationAttributes } from '_shared/SharedTypes.mjs';
    import Fa from 'svelte-fa';
    import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
    import { setCurrentView } from '@src/lib/viewsCollector';

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
</script>

<View>

    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center"><!-- justify-between -->

           <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 '}>Reservas</h2>

                <div class="grid gap-4">
                    {#if reservations.length > 0 && requested}
                        {#each reservations as reservation}
                        <button class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover block overflow-hidden mb-5" onclick={() => setCurrentView('user.reserve', {id: reservation.id})}>
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

            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('user.reserveMenu')}>
                <Fa icon={faArrowLeft} size="lg" /> Volver
            </button>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>