<script lang="ts" module>
    import { SetObjectMessage, GetObjectMessage, DeleteObjectMessage } from "_shared/wsComunication/ObjectMessage.mjs";

    let user = $state({
        id: -1,
        name: '',
        surname: '',
        username: '',
        email: '',
        permissionLevel: '',
        password: ''
    })

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        
        let msg = new SetObjectMessage("user", user)
        await sendMessage(msg.toString())

        let resData = await waitEvent(SetObjectMessage.event)
        let response = SetObjectMessage.fromTable(resData)

        if(response.isOk()){
            toast.success(response.getMessage())
            let newUser = response.getUser()
            user.id = newUser.id
            user.name = newUser.name
            user.surname = newUser.surname
            user.username = newUser.username
            user.email = newUser.email
            user.permissionLevel = newUser.permissionLevel
            user.password = ''
        }else{
            toast.error(response.getMessage())
        }
    };


    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<script lang="ts">
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
    import { getParameters, setCurrentView } from "@src/lib/viewsCollector";
    import toast from "svelte-french-toast";
    import { sendMessage, waitEvent } from "@src/lib/wsComunication";


    
    let id = getParameters().id
    if(id){
        (async () => {
            sendMessage(new GetObjectMessage('user', {id: id}).toString())
            let result = await waitEvent(GetObjectMessage.event)

            let response = GetObjectMessage.fromTable(result)
            
            if(!response.isOk()){
                toast.error(response.getMessage())
                return
            }

            user = response.getUser()
        })()
    }
</script>

<View>
    {#snippet header()}
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center"><!-- justify-between -->

           <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 '}>Usuario</h2>
            </div>

            <div class="flex-1 p-5">
                <!-- formulario para crear un usuario -->
                
                <form onsubmit={handleSubmit}>

                    <label class="label">
                        <span class="label-text text-lg">Nombre:</span>
                        <input bind:value={user.name} id="user/name" autocomplete="off" type="text" class="input input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text text-lg">Apellido:</span>
                        <input bind:value={user.surname} id="user/surname" autocomplete="off" type="text" class="input input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text text-lg">Nombre de usuario:</span>
                        <input bind:value={user.username} id="user/username" autocomplete="off" type="text" class="input input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text text-lg">Email:</span>
                        <input bind:value={user.email} id="user/email" autocomplete="off" type="email" class="input input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label mt-2">
                        <span class="label-text text-lg">Nivel de permiso:</span>
                        <select id="user/permissionLevel" bind:value={user.permissionLevel} autocomplete="off" class="input input-bordered w-full" placeholder=" - ">
                            <option value="">Seleccione un nivel de permiso</option>
                            <option value="admin">Administrador</option>
                            <option value="worker">Moderador</option>
                            <option value="user">Usuario</option>
                        </select>
                    </label>

                    <label class="label mt-2">
                        <span class="label-text text-lg">Contraseña:</span>
                        <input bind:value={user.password} id="user/password" autocomplete="off" type="password" class="input input-bordered w-full" placeholder={user.id != -1 ? "( rellenar para cambiar )" : "Introduce tu contraseña"} />
                    </label>

                    <div class="flex items-center justify-center gap-5 mt-5">
                        <input id="user/submit" class={"w-fit " + bClass} type="submit" value="Guardar"/>
                        <button onclick={async (ev) => {
                            ev.preventDefault()

                            sendMessage(new DeleteObjectMessage('user', {id: user.id}).toString())
                            let result = await waitEvent(DeleteObjectMessage.event)

                            let response = DeleteObjectMessage.fromTable(result)
                            
                            if(!response.isOk()){
                                toast.error(response.getMessage())
                                return
                            }else{
                                toast.success(response.getMessage())
                            }

                            setCurrentView('admin.listUsers')
                        }} class={"w-fit " + bClass}>Borrar</button>
                    </div>
                </form>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <!-- flex centrado -->
        <div class="flex flex-col items-center p-5">
            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('admin.listUsers')}>
                <Fa icon={faArrowLeft} size="lg" /> Volver
            </button>
        </div>
    {/snippet}
</View>
