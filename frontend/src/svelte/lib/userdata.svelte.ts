import Axios from "axios"
import toast from "svelte-french-toast"
import { storable } from "./storable"
import { get } from "svelte/store"
import { type PrivateUser } from "_shared/SharedTypes.mjs"
import { WhoAmIRequest } from "_shared/requests/WhoAmIRequest.mts"

export let userdata = storable<PrivateUser>('userdata', {
    id: undefined,
    name: '',
    surname: '',
    username: '',
    email: '',
    permissionLevel: 'user'
})

export function isLogged() {
    return get(userdata).id !== undefined
}

export function logout() {
    userdata.set({
    id: undefined,
    name: '',
    surname: '',
    username: '',
    email: '',
    permissionLevel: 'user'
})
}

export async function checkSesion() {
    Axios({
            method: "post",
            url: `${window.location.origin}/api/${WhoAmIRequest.path}`,
            headers: {
                "Content-Type": "application/json",
            }
    }).then((response) => {
        let request = WhoAmIRequest.getFromResponse(response)

        console.log(request)
        if(request.isLogged()){
            userdata.set(request.getUser())
        }else{
            logout()
        }
    }).catch((error) => {
        toast.error("Error en la red, reintentar mas tarde")
        console.error(error)
    })
}