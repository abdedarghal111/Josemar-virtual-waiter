<script lang="ts">
  
  import ClientFooter from "../partials/ClientFooter.svelte";
  // import { UserRoundPlus } from '@lucide/svelte'

  import { setCurrentView, setPreviusView } from "../lib/viewsCollector";
  import View from "../components/View.svelte";
  import { checkSesion, isLogged, setUser } from "../lib/userdata.svelte";
  import TittleHeader from "../partials/TittleHeader.svelte";
    import toast from "svelte-french-toast";
    import Axios from "axios";

  const pClass = "bg-surface-100 dark:bg-surface-800 rounded-md w-fit";
  const bClass = "bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500 p-3 rounded-md";
  // dark:bg-surface-800 border-1 border-surface-800 dark:border-surface-50

  if(isLogged()){
    setPreviusView()
  }

  async function onSubmit(this: HTMLButtonElement) {
    this.disabled = true

    let sendData = {
      name: (document.getElementById("register/name") as HTMLInputElement)?.value,
      surname: (document.getElementById("register/surname") as HTMLInputElement)?.value,
      username: (document.getElementById("register/username") as HTMLInputElement)?.value,
      email: (document.getElementById("register/email") as HTMLInputElement)?.value,
      password: (document.getElementById("register/password") as HTMLInputElement)?.value,
      password2: (document.getElementById("register/password2") as HTMLInputElement)?.value
    }

    let err = "Error en la red"
    toast.promise(
        Axios({
        method: "post",
        url: `${window.location.origin}/api/register`,
        headers: {
            "Content-Type": "application/json",
        },
        data: sendData,
    }),{
        loading: "Cargando...",
        success: (response) => {
            let received = response.data
            if(received.status){
                setUser(received.user)
                setPreviusView()
                return received.message
            }else{
                err = received.message
                throw new Error(received.msg)
            }
        },
        error: () => err
    }).finally(() => {
        this.disabled = false
    })
  }
</script>

<View>
  {#snippet header()}
    <TittleHeader tittle="Josemar virtual waiter" />
  {/snippet}

  {#snippet main()}
    <div class="h-full flex flex-col items-center justify-center">
    <div class={"flex flex-col items-center p-5 " + pClass}>
      <div class="h-full flex flex-col items-center gap-5">

        <form class="w-[70vw] sm:w-md space-y-4">
            <label class="label">
                <span class="label-text text-lg">Nombre</span>
                <input id="register/name" type="text" class="input input-bordered w-full" placeholder="Introduce tu nombre" />
            </label>

            <label class="label">
                <span class="label-text text-lg">Apellidos</span>
                <input id="register/surname" type="text" class="input input-bordered w-full" placeholder="Introduce tus apellidos" />
            </label>

            <label class="label">
                <span class="label-text text-lg">Nombre de usuario</span>
                <input id="register/username" type="text" class="input input-bordered w-full" placeholder="Introduce tu nombre de usuario" />
            </label>

            <label class="label">
                <span class="label-text text-lg">Email</span>
                <input id="register/email" type="email" class="input input-bordered w-full" placeholder="Introduce tu email" />
            </label>

            <label class="label">
                <span class="label-text text-lg">Contraseña</span>
                <input id="register/password" type="password" class="input input-bordered w-full" placeholder="Introduce tu contraseña" />
            </label>

            <label class="label">
                <span class="label-text text-lg">Repetir Contraseña</span>
                <input id="register/password2" type="password" class="input input-bordered w-full" placeholder="Repite tu contraseña" />
            </label>
        </form>

        <button class={bClass} onclick={onSubmit}>Enviar</button>
      </div>
    </div>
  </div>
  {/snippet}

  {#snippet footer()}
    <ClientFooter />
  {/snippet}
</View>
