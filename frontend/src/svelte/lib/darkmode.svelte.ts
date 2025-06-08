document.documentElement.dataset.theme = 'jvwTheme'

let darkTheme = $state(true)

export function changeThemeEffect(){
    if(darkTheme){
        document.documentElement.dataset.mode = 'dark'
    }else{
        document.documentElement.dataset.mode = 'light'
    }
}

export function changeTheme(){
    darkTheme = !darkTheme
}