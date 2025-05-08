<script lang="ts">
  
  import ClientFooter from "../partials/ClientFooter.svelte";
  // import { UserRoundPlus } from '@lucide/svelte'

  import { setCurrentView, setPreviusView } from "../lib/viewsCollector";
  import View from "../components/View.svelte";
  import { isLogged } from "../lib/userdata.svelte";
  import TittleHeader from "../partials/TittleHeader.svelte";
    import { postWithToast } from "../lib/apiComunication";

  const pClass = "bg-surface-100 dark:bg-surface-800 rounded-md w-fit";
  const bClass = "bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500 p-3 rounded-md";
  // dark:bg-surface-800 border-1 border-surface-800 dark:border-surface-50

  async function onSubmit(this: HTMLButtonElement) {
    // isLogged.set(true);

    // this.disabled = true
    
    let response = await postWithToast(
      "WhoAmI", {
      username: (document.getElementById("login/username") as HTMLInputElement)?.value,
      password: (document.getElementById("login/password") as HTMLInputElement)?.value,
    },{
        loading: "Cargando...",
        success: "Éxito al iniciar sesión",
        error: "Error al iniciar sesión"
    }, (response) => {
      setPreviusView()
      return {
        status: true,
        msg: "Éxito al iniciar sesión",
      }
    })

    console.log(response)

    // setPreviusView()
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
            <span class="label-text text-lg">Usuario</span>
            <input id="login/username" type="user" class="input" placeholder="Introduce tu usuario" />
          </label>
          
          <label class="label">
            <span class="label-text text-lg">Contraseña</span>
            <input  id="login/password" type="password" class="input" placeholder="Introduce tu contraseña" />
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
