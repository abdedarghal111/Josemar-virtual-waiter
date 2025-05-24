import {Howl, Howler} from 'howler';
import dingSound from "@src/../assets/dingSound.mp3";
import dingSuccessSound from "@src/../assets/dingSuccessSound.mp3";
import notificationSound from "@src/../assets/notificationSound.mp3";
import bellSound from "@src/../assets/bellSound.mp3";

// Howler.autoUnlock = true;

export const sounds: { [key: string]: Howl } = {
    ding: new Howl({src: [dingSound]}),
    dingSuccess: new Howl({src: [dingSuccessSound]}),
    notification: new Howl({src: [notificationSound]}),
    bell: new Howl({src: [bellSound]})
}