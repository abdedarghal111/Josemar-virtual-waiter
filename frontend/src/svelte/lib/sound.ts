import {Howl, Howler} from 'howler';
import dingSound from "/public/dingSound.mp3";
import dingSuccessSound from "/public/dingSuccessSound.mp3";
import notificationSound from "/public/notificationSound.mp3";
import bellSound from "/public/bellSound.mp3";

Howler.autoUnlock = true;

class HowlWrapper extends Howl {
    play(spriteOrId?: string | number) {
        
        if (!Howler.ctx || Howler.ctx.state !== 'running') {
            console.warn('AudioContext no está listo. No se reproduce el sonido.');
            return 0
        }

        console.warn("Todo ok")
        return super.play(spriteOrId)
    }
}


export const sounds: { [key: string]: HowlWrapper } = {
    ding: new HowlWrapper({src: [dingSound]}),
    dingSuccess: new HowlWrapper({src: [dingSuccessSound]}),
    notification: new HowlWrapper({src: [notificationSound]}),
    bell: new HowlWrapper({src: [bellSound]})
}