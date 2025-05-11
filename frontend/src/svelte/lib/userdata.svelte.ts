import Axios from "axios"
import toast from "svelte-french-toast"
import { storable } from "./storable"
import { get } from "svelte/store"

export let userdata = storable('userdata', {
    id: 0,
    name: '',
    surname: '',
    username: '',
    email: '',
    logged: false,
    permissionLevel: 'user'
})

export function isLogged() {
    return get(userdata).logged
}

// export function getUser() {
//     return userdata
// }

export function setUser(user: any, logged: boolean = true) {
    let emptyUser: any = {
        id: 0,
        name: '',
        surname: '',
        username: '',
        email: '',
        logged: logged,
        permissionLevel: 'user'
    }

    for(let key in user){
        emptyUser[key] = user[key]
    }

    userdata.set(emptyUser)
}

export async function checkSesion() {
    Axios({
            method: "post",
            url: `${window.location.origin}/api/whoAmI`,
            headers: {
                "Content-Type": "application/json",
            }
    }).then((response) => {
        let data = response.data
        if(data.user){
            setUser(data.user)
        }else{
            setUser({}, false)
        }
    }).catch((error) => {
        toast.error("Error en la red, reintentar mas tarde")
        console.error(error)
    })
}