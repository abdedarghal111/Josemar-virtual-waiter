import {Howl, Howler} from 'howler';
import dingSound from "/public/dingSound.mp3";
import dingSuccessSound from "/public/dingSuccessSound.mp3";
import notificationSound from "/public/notificationSound.mp3";
import bellSound from "/public/bellSound.mp3";

Howler.autoUnlock = true;

export const sounds: { [key: string]: Howl } = {
    ding: new Howl({src: [dingSound]}),
    dingSuccess: new Howl({src: [dingSuccessSound]}),
    notification: new Howl({src: [notificationSound]}),
    bell: new Howl({src: [bellSound]})
}