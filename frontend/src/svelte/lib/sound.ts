import {Howl, Howler} from 'howler';
import dingSound from "@src/../assets/dingSound.mp3";

// Howler.autoUnlock = true;

export const sounds: { [key: string]: Howl } = {
    ding: new Howl({src: [dingSound]})
}