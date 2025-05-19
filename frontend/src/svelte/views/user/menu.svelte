<script lang='ts'>
    import ClientFooter from '@src/partials/ClientFooter.svelte'
    import View from '@src/components/View.svelte'
    import TittleHeader from '@src/partials/TittleHeader.svelte';
    import Axios from 'axios';
    import { GetProductsRequest } from '_shared/requests/GetProductsRequest.mjs';
    import toast from 'svelte-french-toast';
    import { ProductAttributes } from '_shared/SharedTypes.mjs';

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
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center"><!-- justify-between -->

           <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 '}>Productos</h2>

                <div class="grid gap-4">
                    {#if products.length > 0 && requested}
                        {#each products as product}
                        <div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover block overflow-hidden mb-5">
                            <article class="p-2">
                            <span class="flex justify-between items-center">
                                <h2 class="h6 font-bold">{product.name}</h2>
                                <span class="text-sm font-bold me-4">{product.price.toString().replace('.', ',')} €</span>
                            </span>
                                <p class="text-xs pe-15">{product.description}</p>
                            </article>
                            <footer class="flex justify-end">
                                <button class="btn btn-primary btn-xs">Ver +</button>
                            </footer>
                        </div>
                        {/each}
                    {:else if requested && products.length === 0}
                        <p class="h3 text-center">Sin productos.</p>
                    {:else}
                        <p class="placeholder animate-pulse h2">Cargando...</p>
                    {/if}
                </div>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <ClientFooter />
    {/snippet}
</View>