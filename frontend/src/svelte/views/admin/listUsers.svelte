<script lang="ts" module>
    import type { UserAttributes } from "_shared/SharedTypes.mjs";
    import { ListUsersMessage } from "_shared/wsComunication/ListUsersMessage.mjs";
    import { getSocket, onSocketEvent, socket } from "@src/lib/wsComunication";

    let users = $state<UserAttributes[]>([])

    onSocketEvent(ListUsersMessage.event, (data, socket) => {
        console.log("mensaje recibido")
        let info = new ListUsersMessage(data)

        users = info.getUsers()
    })
    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<script lang="ts">
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
    import { setCurrentView } from "@src/lib/viewsCollector";

    users = []

    let waiting = 'placeholder animate-pulse';

    (async () => {
        (await getSocket()).send(new ListUsersMessage({ event: ListUsersMessage.event, success: true, users }).toString())
        console.log('enviado')
    })()

    $effect(() => {
        console.log(users)
    })

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

            <div class="table-wrap flex-1">
                <table class="table caption-bottom">
                    <tbody class={"[&>tr]:hover:preset-tonal-primary min-h-full "}>
                    {#each users as user}
                        <tr>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.permissionLevel}</td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <!-- flex centrado -->
        <div class="flex flex-col items-center p-5">
            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('admin.editDatabase')}>
                <Fa icon={faArrowLeft} size="lg" /> Vovler
            </button>
        </div>
    {/snippet}
</View>
