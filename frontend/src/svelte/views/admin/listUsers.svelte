<script lang="ts">
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
    import { getCurrentView, setCurrentView } from "@src/lib/viewsCollector";
    
    import type { UserAttributes } from "_shared/SharedTypes.mjs";
    import { ListObjectsMessage } from "_shared/wsComunication/ListObjectsMessage.mjs";
    import { onSocketEvent, sendMessage } from "@src/lib/wsComunication";
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';

    let users = $state<UserAttributes[]>([])

    onSocketEvent(ListObjectsMessage.event, (data) => {
        if(getCurrentView() !== 'admin.listUsers'){return}
        let info = ListObjectsMessage.fromTable(data)

        users = info.getUsers()
    })
    
    ;(async () => {
        sendMessage(new ListObjectsMessage('user', users).toString())
        // getWebSocket().then(ws => ws.send(new ListObjectsMessage('user', users).toString()))
        // await waitEvent(ListObjectsMessage.event)
    })()
    
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<View>
    {#snippet header()}
        <GenericHeader returnPage="admin.listUsers" currentPage="Usuarios" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center py-5">

            <div class="flex flex-col justify-center items-center gap-3 p-3 shadow bg-surface-900 card mx-3">
                <div class="w-full">
                    <h2 class="h2">Lista de usuarios</h2>
                    <p>
                        Aquí se pueden ver todos los usuarios que existen en el sistema, puedes modificar sus datos o sus contraseñas a gusto.
                        También puedes crear usuarios nuevos y elegir que permisos tienen.
                    </p>
                </div>

                <table class="table caption-bottom rounded-md">
                    <tbody class="min-h-full rounded-md">
                        <tr class="bg-tertiary-100/80 text-surface-950">
                            <!-- <th>id</th> -->
                            <th class="rounded-tl-md"><b>Nombre de usuario</b></th>
                            <th><b>Nombre real</b></th>
                            <th class="rounded-tr-md"><b>Apellidos</b></th>
                            <!-- <th>email</th> -->
                            <!-- <th>permissionLevel</th> -->
                            <!-- <th>Created at</th>
                            <th>Updated at</th> -->
                        </tr>
                    {#each users as user}
                        <tr class="
                        bg-surface-800/50 odd:bg-surface-800/30 hover:bg-surface-700
                        first:[&>td:first-child]:rounded-tl-md
                        last:[&>td:last-child]:rounded-br-md
                        " onclick={() => {
                            setCurrentView('admin.user', { id: user.id })
                        }}>
                            <!-- <td>{user.id}</td> -->
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.username}</td>
                            <!-- <td>{user.email ?? '-'}</td> -->
                            <!-- <td>{user.permissionLevel}</td> -->
                            <!-- <td>{user.createdAt}</td>
                            <td>{user.updatedAt}</td> -->
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
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('admin.editDatabase')}  extraClass="mb-2 text-surface-50 bg-surface-900"/>
            <IconButton icon={faFileCirclePlus} text="Crear nuevo" onclick={() => setCurrentView('admin.user')}  extraClass="mb-2 text-surface-50 bg-surface-900"/>
        </div>
    {/snippet}
</View>
