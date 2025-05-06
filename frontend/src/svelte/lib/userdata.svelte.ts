export let userdata = $state({
    name: '',
    email: '',
    logged: false
})

export function isLogged() {
    return userdata.logged
}