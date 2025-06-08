<script lang="ts">
  
  import ClientFooter from "../partials/ClientFooter.svelte";
  import { returnToHomeIfLogged, setCurrentView, setPreviusView } from "../lib/viewsCollector";
  import View from "../components/View.svelte";
  import { userdata } from "../lib/userdata.svelte";
  import toast from "svelte-french-toast";
  import Axios from "axios";
  import { RegisterRequest } from "_shared/requests/RegisterRequest.mjs";
  import GenericHeader from "@src/partials/GenericHeader.svelte";

  returnToHomeIfLogged()

  async function onSubmit(ev: Event) {

    ev.preventDefault()

    let submit = document.getElementById("register/submit") as HTMLInputElement
    submit.disabled = true

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
        url: `${window.location.origin}/api/${RegisterRequest.path}`,
        headers: {
            "Content-Type": "application/json",
        },
        data: sendData,
    }),{
        loading: "Cargando...",
        success: (response) => {
          let request = RegisterRequest.getFromResponse(response)
          if(request.isOk()){
            userdata.set(request.getUser())
            setPreviusView()
            return request.getMessage()
          }else{
              err = `${request.getBadField()}: ${request.getMessage()}`
              throw new Error(err)
          }
        },
        error: () => err
    }).finally(() => {
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
    <div class="my-3 flex flex-col items-center p-3 shadow bg-surface-900 card">
      <div class="h-full flex flex-col items-center gap-5">

        <div class="w-full">
          <h2 class="h2">Registrarse</h2>
          <p>¿Tienes una cuenta? <button onclick={() => setCurrentView('login')} class="underline text-tertiary-300 bg-transparent border-none cursor-pointer">Iniciar sesión</button></p>
        </div>

        <form onsubmit={onSubmit} class="w-[70vw] sm:w-md space-y-3">
            <label class="label">
                <span class="label-text">Nombre</span>
                <input id="register/name" autocomplete="name" type="text" class="input text-sm input-bordered w-full" placeholder="Introduce tu nombre" />
            </label>

            <label class="label">
                <span class="label-text">Apellidos</span>
                <input id="register/surname" autocomplete="family-name" type="text" class="input text-sm input-bordered w-full" placeholder="Introduce tus apellidos" />
            </label>

            <label class="label">
                <span class="label-text">Nombre de usuario</span>
                <input id="register/username" autocomplete="username" type="text" class="input text-sm input-bordered w-full" placeholder="Introduce tu nombre de usuario" />
            </label>

            <label class="label">
                <span class="label-text">Email</span>
                <input id="register/email" autocomplete="email" type="email" class="input text-sm input-bordered w-full" placeholder="Introduce tu email" />
            </label>

            <label class="label">
                <span class="label-text">Contraseña</span>
                <input id="register/password" autocomplete="current-password" type="password" class="input text-sm input-bordered w-full" placeholder="Introduce tu contraseña" />
            </label>

            <label class="label">
                <span class="label-text">Repetir Contraseña</span>
                <input id="register/password2" autocomplete="current-password" type="password" class="input text-sm input-bordered w-full" placeholder="Repite tu contraseña" />
            </label>

            <div class="flex flex-col items-center">
              <input id="register/submit" class="w-fit btn preset-filled-primary-500 p-2 card text-sm" type="submit" value="Registrarse"/>
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
