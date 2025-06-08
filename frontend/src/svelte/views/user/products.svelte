<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import Axios from 'axios';
    import { GetProductsRequest } from '_shared/requests/GetProductsRequest.mjs';
    import toast from 'svelte-french-toast';
    import { type ProductAttributes } from '_shared/SharedTypes.mjs';
    import GenericHeader from '@src/partials/GenericHeader.svelte';
    import IconButton from '@src/components/IconButton.svelte';
    import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
    import { setCurrentView } from '@src/lib/viewsCollector';

    let products = $state<ProductAttributes[]>([])
    let requested = $state<boolean>(false)

    ;(async () => {
        try {
            let response = await Axios({
                method: "post",
                url: `${window.location.origin}/api/${GetProductsRequest.path}`,
                headers: {
                    "Content-Type": "application/json",
                }
            })

            let request = GetProductsRequest.getFromResponse(response)

            if(request.isOk()){
                products = request.getProducts()
            }else{
                toast.error(request.getMessage())
            }
        }catch (error) {
            toast.error('Error en la red, reintentar mas tarde')
        }finally{
            requested = true
        }
    })()
</script>

<View>

    {#snippet header()}
        <GenericHeader returnPage="home" currentPage="Lista de productos" />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center">

           <div class="flex flex-col items-center my-3 max-w-xl mx-3">
                <h2 class='h2 pb-3 text-surface-950'>Productos</h2>

                <div class="grid gap-3">
                    {#if products.length > 0 && requested}
                        {#each products as product}
                        <div class="card shadow bg-surface-900 border-[1px] border-surface-800 card-hover">
                            <article class="p-2">
                            <span class="flex justify-between items-center">
                                <h2 class="h6 font-bold">{product.name}</h2>
                                <span class="text-sm font-bold me-4">{product.price.toString().replace('.', ',')} €</span>
                            </span>
                                <p class="text-xs">{product.description}</p>
                            </article>
                        </div>
                        {/each}
                    {:else if requested && products.length === 0}
                        <p class="h3 text-center">Sin productos.</p>
                    {:else}
                        <p class="placeholder animate-pulse h2">Cargando...</p>
                    {/if}
                </div>
                
                <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('home')} extraClass="mt-5 mb-2 text-surface-50 bg-surface-900" />
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>