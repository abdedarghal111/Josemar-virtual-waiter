import { BaseMessage, type baseContents } from "./baseMessage.mts";

export interface messageContents extends baseContents {
    message: string
}

export class HelloMessage extends BaseMessage {
    public static event = 'helloMessage'
    protected contents: messageContents

    constructor(messageContents: messageContents) {
        super(messageContents)
        let { event, success, message } = messageContents
        this.contents = { event, success, message }
    }

    getMessage(): string {
        return this.contents.message;
    }
}