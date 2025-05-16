import { BaseMessage, type baseContents } from "./baseMessage.mts";

export interface messageContents extends baseContents {
    message: string
}

export class HelloMessage extends BaseMessage {
    public static event = 'hello'
    public event = 'hello'
    
    protected contents: messageContents = { event: '', success: false, message: '' }

    constructor(messageContents: messageContents) {
        super(messageContents)
        let { success, message } = messageContents
        this.contents = { event: this.event, success, message }
    }

    getMessage(): string {
        return this.contents.message;
    }
}