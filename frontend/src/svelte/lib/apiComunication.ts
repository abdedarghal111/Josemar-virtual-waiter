import Axios, { type AxiosResponse } from "axios"
import toast, { type Renderable, type ValueOrFunction } from "svelte-french-toast"

type toastPromiseOptionsType = {
    loading: Renderable;
    success: ValueOrFunction<Renderable, void>;
    error: ValueOrFunction<Renderable, any>;
}
export async function postWithToast(
    address: string,
    data: {}, toastOptions:toastPromiseOptionsType,
    successCallback?: (response: AxiosResponse<any, any>) => {status: boolean, msg: string},
    errorCallback?: (error: any) => void
) {
    let successMsg: string = ''
    let errorMsg: string = ''
    let resolve: () => void
    let reject: () => void
    toast.promise(new Promise<void>((resolvable, rejectable) => {
        resolve = resolvable
        reject = rejectable
    }), {
        loading: toastOptions.loading,
        success: () => {return successMsg},
        error: () => {return errorMsg}
    }, {
        duration: 2500
    })

    return Axios({
        method: "post",
        url: `${window.location.origin}/api/${address}`,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    }).then((response) => {
        if(successCallback){
            let {status, msg} = successCallback(response)
            if(!status){
                if(msg === ''){
                    msg = toastOptions.error as string
                }
                errorMsg = msg
                reject()
            }else{
                if(msg === ''){
                    msg = toastOptions.success as string
                }
                successMsg = msg
                resolve()
            }
        }else{
            resolve()
        }
    }).catch((error) => {
        reject()
        console.error(error)
        errorCallback ? errorCallback(error) : null
    })
}