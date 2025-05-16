<script lang="ts" module>
    import type { UserAttributes } from "_shared/SharedTypes.mjs";
    import { GetObjectMessage } from "_shared/wsComunication/GetObjectMessage.mjs";
    import { onSocketEvent, getWebSocket, waitEvent } from "@src/lib/wsComunication";

    let user = $state({
        name: '',
        surname: '',
        username: '',
        email: '',
        permissionLevel: '',
        password: ''
    })

    onSocketEvent(GetObjectMessage.event, (data, socket) => {
        if(getCurrentView() !== 'admin.user'){return}
        let info = new GetObjectMessage(data)

        user = {
            name: info.getObject().name,
            surname: info.getObject().surname,
            username: info.getObject().username,
            email: info.getObject().email,
            permissionLevel: info.getObject().permissionLevel,
            password: info.getObject().password
        }
    })
    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<script lang="ts">
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
    import { getCurrentView, getParameters, setCurrentView } from "@src/lib/viewsCollector";

    let id = getParameters().id
    if(id){

    }

    

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        console.log(user);
        
        getWebSocket().then(ws => ws.send(new GetObjectMessage({ success: true, object: user }).toString()))
    };

</script>

<View>
    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center"><!-- justify-between -->

           <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 '}>Usuarios</h2>
            </div>

            <div class="flex-1 p-5">
                <!-- formulario para crear un usuario -->
                
                

                <form onsubmit={handleSubmit}>
                    <label for="name">Nombre:</label>
                    <input type="text" id="name" bind:value={user.name} />

                    <label for="surname">Apellido:</label>
                    <input type="text" id="surname" bind:value={user.surname} />

                    <label for="username">Nombre de usuario:</label>
                    <input type="text" id="username" bind:value={user.username} />

                    <label for="email">Email:</label>
                    <input type="email" id="email" bind:value={user.email} placeholder="Opcional" />

                    <label for="permissionLevel">Nivel de permiso:</label>
                    <select id="permissionLevel" bind:value={user.permissionLevel}>
                        <option value="">Seleccione un nivel de permiso</option>
                        <option value="admin">Administrador</option>
                        <option value="moderator">Moderador</option>
                        <option value="user">Usuario</option>
                    </select>

                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <!-- flex centrado -->
        <div class="flex flex-col items-center p-5">
            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('admin.editDatabase')}>
                <Fa icon={faArrowLeft} size="lg" /> Volver
            </button>
        </div>
    {/snippet}
</View>
