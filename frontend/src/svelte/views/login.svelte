<script lang="ts">
  
  import ClientFooter from "../partials/ClientFooter.svelte";
  // import { UserRoundPlus } from '@lucide/svelte'

  import { setCurrentView, setPreviusView } from "../lib/viewsCollector";
  import View from "../components/View.svelte";
  import { checkSesion, userdata } from "../lib/userdata.svelte";
  import TittleHeader from "../partials/TittleHeader.svelte";
    import toast from "svelte-french-toast";
    import Axios from "axios";
    import { LoginRequest } from "_shared/requests/LoginRequest.mjs";

  const pClass = "bg-surface-100 dark:bg-surface-800 rounded-md w-fit";
  const bClass = "bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500 p-3 rounded-md";
  // dark:bg-surface-800 border-1 border-surface-800 dark:border-surface-50

  if($userdata.id){
    setPreviusView()
  }

  async function onSubmit(ev: Event) {

    ev.preventDefault()
    let submit = document.getElementById("login/submit") as HTMLInputElement
    submit.disabled = true

    let sendData = {
      userOrEmail: (document.getElementById("login/userOrEmail") as HTMLInputElement)?.value,
      password: (document.getElementById("login/password") as HTMLInputElement)?.value
    }

    let err = "Error en la red"
    toast.promise(
        Axios({
        method: "post",
        url: `${window.location.origin}/api/${LoginRequest.path}`,
        headers: {
            "Content-Type": "application/json",
        },
        data: sendData,
    }),{
        loading: "Cargando...",
        success: (response) => {
          let request = LoginRequest.getFromResponse(response)
          if(request.isOk()){
            userdata.set(request.getUser())
            setPreviusView()
            return request.getMessage()
          }else{
              err = `${request.getBadField()}: ${request.getMessage()}`
              throw new Error()
          }
        },
        error: () => err
    }).finally(async () => {
        submit.disabled = false
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

        <form onsubmit={onSubmit} class="w-[70vw] sm:w-md space-y-4">
            <label class="label">
                <span class="label-text text-lg">Nombre de usuario o email</span>
                <input id="login/userOrEmail" autocomplete="username" type="text" class="input input-bordered w-full" placeholder="Introduce tu usuario o email" />
            </label>


            <label class="label">
                <span class="label-text text-lg">Contraseña</span>
                <input id="login/password" autocomplete="current-password" type="password" class="input input-bordered w-full" placeholder="Introduce tu contraseña" />
            </label>

            <div class="flex flex-col items-center">
              <input id="login/submit" class={"w-fit " + bClass} type="submit" value="Entrar"/>
            </div>
        </form>
      </div>
    </div>
  </div>
  {/snippet}

  {#snippet footer()}
    <ClientFooter />
  {/snippet}
</View>
