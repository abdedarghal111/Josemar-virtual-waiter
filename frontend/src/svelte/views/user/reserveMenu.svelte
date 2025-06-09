<script lang='ts'>
    import { faArrowLeft, faBurger, faList } from '@fortawesome/free-solid-svg-icons'
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import { returnToHomeIfNotLogged, setCurrentView } from '@src/lib/viewsCollector';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';

    returnToHomeIfNotLogged()
</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="home" currentPage="Reservas" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col justify-center items-center">


            <div class="flex flex-col items-center gap-10 p-3 shadow bg-surface-900 card max-w-70 m-3">
                <div class="w-full">
                    <h3 class='h3'>Panel de reservas</h3>
                    <p class="text-surface-50/85">Aquí puedes realizar y gestionar reservas. Una vez realizada, nuestro equipo la revisará en menos de 24 horas.</p>
                </div>

                <div class="flex flex-col gap-3 justify-center items-center">
                    <IconButton icon={faBurger} text="Realizar nueva reserva" onclick={() => setCurrentView('user.reserve')} />
                    <IconButton icon={faList} text="Ver mis reservas" onclick={() => setCurrentView('user.listReserves')} />
                    <IconButton icon={faArrowLeft} text="Ir atras"  onclick={() => setCurrentView('home')}/>
                </div>

            </div>
            
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>