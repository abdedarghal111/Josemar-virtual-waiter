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


    const pClass = 'bg-surface-100 dark:bg-surface-800 rounded-md w-fit'
    const bClass = 'bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500e p-3 rounded-md'
</script>

<script lang="ts">
    import View from '../../components/View.svelte'
    import TittleHeader from '../../partials/TittleHeader.svelte';
    import Fa from "svelte-fa";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
    import { getParameters, setCurrentView } from "@src/lib/viewsCollector";
    import toast from "svelte-french-toast";
    import { sendMessage, waitEvent } from "@src/lib/wsComunication";


    
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
        <TittleHeader tittle="Josemar virtual waiter" />
    {/snippet}

    {#snippet main()}
        <div class="h-full flex flex-col items-center"><!-- justify-between -->

           <div class="flex flex-col items-center mt-10 mx-10">
                <h2 class={'h2 p-3 '}>Producto</h2>
            </div>

            <div class="flex-1 p-5">
                <!-- formulario para crear un usuario -->
                
                <form onsubmit={handleSubmit}>

                    <label class="label">
                        <span class="label-text text-lg">Nombre:</span>
                        <input bind:value={product.name} id="product/name" autocomplete="off" type="text" class="input input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text text-lg">Precio:</span>
                        <input bind:value={product.price} id="product/price" autocomplete="off" type="number" step="0.01" class="input input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text text-lg">Stock:</span>
                        <input bind:value={product.stock} id="product/stock" autocomplete="off" type="number" class="input input-bordered w-full" placeholder=" - " />
                    </label>

                    <label class="label">
                        <span class="label-text text-lg">Descripción:</span>
                        <textarea bind:value={product.description} id="product/description" autocomplete="off" class="input input-bordered w-full" placeholder=" - "></textarea>
                    </label>

                    <div class="flex items-center justify-center gap-5 mt-5">
                        <input id="user/submit" class={"w-fit " + bClass} type="submit" value="Guardar"/>
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
                        }} class={"w-fit " + bClass}>Borrar</button>
                    </div>
                </form>
            </div>
        </div>
    {/snippet}

    {#snippet footer()}
        <!-- flex centrado -->
        <div class="flex flex-col items-center p-5">
            <button class={"flex items-center gap-2 mt-5 " + bClass} onclick={() => setCurrentView('admin.listProducts')}>
                <Fa icon={faArrowLeft} size="lg" /> Volver
            </button>
        </div>
    {/snippet}
</View>
