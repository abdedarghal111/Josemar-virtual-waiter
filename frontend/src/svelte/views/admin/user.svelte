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
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
    import { getParameters, setCurrentView } from "@src/lib/viewsCollector";
    import toast from "svelte-french-toast";
    import { sendMessage, waitEvent } from "@src/lib/wsComunication";
    import IconButton from '@src/components/IconButton.svelte';
    import GenericHeader from "@src/partials/GenericHeader.svelte";


    
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
        <GenericHeader returnPage="admin.listUsers" currentPage={id ? "Editar usuario" : "Nuevo usuario"} />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center">
            <div class="card bg-surface-900 border-[1px] border-surface-800 max-w-70 p-3 mt-5">
                <div class="w-full">
                    <h3 class="h3 font-bold">Editar Reserva</h3>
                    <p class="text-sm opacity-70">La reserva no ha sido revisada aún, puedes editarla o eliminarla.</p>
                </div>
                <form onsubmit={handleSubmit}>

                    <label class="label">
                        <span class="label-text">Nombre:</span>
                        <input bind:value={user.name} id="user/name" autocomplete="off" type="text" class="input text-sm input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text">Apellido:</span>
                        <input bind:value={user.surname} id="user/surname" autocomplete="off" type="text" class="input text-sm input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text">Nombre de usuario:</span>
                        <input bind:value={user.username} id="user/username" autocomplete="off" type="text" class="input text-sm input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text">Email:</span>
                        <input bind:value={user.email} id="user/email" autocomplete="off" type="email" class="input text-sm input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label mt-2">
                        <span class="label-text">Nivel de permiso:</span>
                        <select id="user/permissionLevel" bind:value={user.permissionLevel} autocomplete="off" class="input text-sm input-bordered w-full" placeholder=" - ">
                            <option value="">Seleccione un nivel de permiso</option>
                            <option value="admin">Administrador</option>
                            <option value="worker">Moderador</option>
                            <option value="user">Usuario</option>
                        </select>
                    </label>

                    <label class="label mt-2">
                        <span class="label-text">Contraseña:</span>
                        <input bind:value={user.password} id="user/password" autocomplete="off" type="password" class="input text-sm input-bordered w-full" placeholder={user.id != -1 ? "( rellenar para cambiar )" : "Introduce tu contraseña"} />
                    </label>

                    <div class="flex items-center justify-center gap-5 mt-5">
                        <input id="user/submit" class="w-fit btn preset-filled-primary-500 p-2 card text-sm" type="submit" value="Guardar"/>
                        
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
                        }} class="w-fit btn preset-filled-warning-500 p-2 card text-sm">Borrar</button>
                    </div>
                </form>
            </div>

            
        </div>
    {/snippet}

    {#snippet footer()}
        <div class="flex flex-col items-center p-5">
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('admin.listUsers')}  extraClass="mb-2 text-surface-50 bg-surface-900"/>
        </div>
    {/snippet}
</View>
