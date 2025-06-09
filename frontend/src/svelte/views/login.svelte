<script lang="ts">
  
  import ClientFooter from "../partials/ClientFooter.svelte";
  // import { UserRoundPlus } from '@lucide/svelte'

  import { returnToHomeIfLogged, setCurrentView, setPreviusView } from "../lib/viewsCollector";
  import View from "../components/View.svelte";
  import { userdata } from "../lib/userdata.svelte";
  import toast from "svelte-french-toast";
  import Axios from "axios";
  import { LoginRequest } from "_shared/requests/LoginRequest.mjs";
  import GenericHeader from "@src/partials/GenericHeader.svelte";

  returnToHomeIfLogged()

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
    <GenericHeader returnPage="home" currentPage="" />
  {/snippet}

  {#snippet main()}
  <div class="min-h-full flex flex-col items-center justify-center">
    <div class="flex flex-col items-center my-3 p-3 shadow bg-surface-900 card">
      <div class="h-full flex flex-col items-center gap-5">

        <div class="w-full">
          <h2 class="h2">Iniciar sesión</h2>
          <p>¿No tienes una cuenta? <button onclick={() => setCurrentView('register')} class="underline text-tertiary-300 bg-transparent border-none cursor-pointer">Registrate</button></p>
        </div>

        <form onsubmit={onSubmit} class="w-[70vw] sm:w-md space-y-3">
            <label class="label">
                <span class="label-text">Nombre de usuario o email</span>
                <input id="login/userOrEmail" autocomplete="username" type="text" class="input text-sm input-bordered w-full" placeholder="Introduce tu usuario o email" />
            </label>


            <label class="label">
                <span class="label-text">Contraseña</span>
                <input id="login/password" autocomplete="current-password" type="password" class="input text-sm input-bordered w-full" placeholder="Introduce tu contraseña" />
            </label>

            <div class="flex flex-col items-center">
              <input id="login/submit" class="w-fit btn preset-filled-primary-500 p-2 card text-sm" type="submit" value="Entrar"/>
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
