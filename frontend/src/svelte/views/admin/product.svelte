<script lang="ts" module>
    import { SetObjectMessage, GetObjectMessage, DeleteObjectMessage } from "_shared/wsComunication/ObjectMessage.mjs";

    let product = $state({
        id: -1,
        name: '',
        description: '',
        stock: 0,
        price: 0
    })

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        
        let msg = new SetObjectMessage("product", product)
        await sendMessage(msg.toString())

        let resData = await waitEvent(SetObjectMessage.event)
        let response = SetObjectMessage.fromTable(resData)

        if(response.isOk()){
            toast.success(response.getMessage())
            let newProduct = response.getProduct()
            product.id = newProduct.id
            product.name = newProduct.name
            product.description = newProduct.description
            product.stock = newProduct.stock
            product.price = newProduct.price
        }else{
            toast.error(response.getMessage())
        }
    };
</script>

<script lang="ts">
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
    import { getParameters, setCurrentView } from "@src/lib/viewsCollector";
    import toast from "svelte-french-toast";
    import { sendMessage, waitEvent } from "@src/lib/wsComunication";
    import IconButton from "@src/components/IconButton.svelte";
    import GenericHeader from "@src/partials/GenericHeader.svelte";


    
    let id = getParameters().id
    if(id){
        (async () => {
            sendMessage(new GetObjectMessage('product', {id: id}).toString())
            let result = await waitEvent(GetObjectMessage.event)

            let response = GetObjectMessage.fromTable(result)
            
            if(!response.isOk()){
                toast.error(response.getMessage())
                return
            }

            product = response.getProduct()
        })()
    }
</script>

<View>
    {#snippet header()}
        <GenericHeader returnPage="admin.listProducts" currentPage={product.id ? "Editar producto" : "Nuevo producto"} />
    {/snippet}

    {#snippet main()}
        <div class="min-h-full flex flex-col items-center pb-20">

           <div class="card bg-surface-900 border-[1px] border-surface-800 max-w-70 p-3 mt-3">
                <div class="w-full">
                    <h3 class="h3 font-bold">{id ? "Editar" : "Nuevo"} producto</h3>
                    <p class="text-sm opacity-70">Puedes modificar todos estos campos.</p>
                </div>

                <form onsubmit={handleSubmit}>

                    <label class="label">
                        <span class="label-text">Nombre:</span>
                        <input bind:value={product.name} id="product/name" autocomplete="off" type="text" class="input text-sm input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text">Precio:</span>
                        <input bind:value={product.price} id="product/price" autocomplete="off" type="number" step="0.01" class="input text-sm input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text">Stock:</span>
                        <input bind:value={product.stock} id="product/stock" autocomplete="off" type="number" class="input text-sm input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text">Descripción:</span>
                        <textarea bind:value={product.description} id="product/description" autocomplete="off" rows="8" class="resize-y input text-sm input-bordered w-full" placeholder=" - "></textarea>
                    </label>

                    <div class="flex items-center justify-center gap-5 mt-5">
                        <input id="user/submit" class="w-fit btn preset-filled-primary-500 p-2 card text-sm" type="submit" value="Guardar"/>
                        <button onclick={async (ev) => {
                            ev.preventDefault()

                            sendMessage(new DeleteObjectMessage('product', {id: product.id}).toString())
                            let result = await waitEvent(DeleteObjectMessage.event)

                            let response = DeleteObjectMessage.fromTable(result)
                            
                            if(!response.isOk()){
                                toast.error(response.getMessage())
                                return
                            }else{
                                toast.success(response.getMessage())
                            }

                            setCurrentView('admin.listProducts')
                        }} class="w-fit btn preset-filled-warning-500 p-2 card text-sm">Borrar</button>
                    </div>
                </form>
            </div>
        </div>
    {/snippet}

    {#snippet upperFooter()}
        <div class="flex flex-col items-center p-5 bg-surface-900/50">
            <IconButton icon={faArrowLeft} text="Volver" onclick={() => setCurrentView('admin.listProducts')}/>
        </div>
    {/snippet}
</View>
