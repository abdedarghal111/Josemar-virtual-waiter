import type { UserAttributes } from "../SharedTypes.mjs";
import { BaseMessage, type baseContents } from "./BaseMessage.mts";

type objectType = {[key: string]: any}
export interface listUsersContents extends baseContents {
    object: objectType
}

export class GetObjectMessage extends BaseMessage {
    public static event = 'getObject'
    public event = 'getObject'
    
    protected contents: listUsersContents = { event: '', success: false, object: {} }

    constructor(messageContents: listUsersContents) {
        super(messageContents)
        let { success, object } = messageContents
        this.contents = { event: this.event, success, object }
    }

    getObject(): objectType {
        return this.contents.object
    }
}