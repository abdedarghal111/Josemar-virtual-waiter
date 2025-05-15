import type { UserAttributes } from "../SharedTypes.mjs";
import { BaseMessage, type baseContents } from "./BaseMessage.mts";

export interface listUsersContents extends baseContents {
    users: UserAttributes[]
}

export class ListUsersMessage extends BaseMessage {
    public static event = 'listUsers'
    public event = 'listUsers'
    
    protected contents: listUsersContents = { event: '', success: false, users: [] }

    constructor(messageContents: listUsersContents) {
        super(messageContents)
        let { event, success, users } = messageContents
        this.contents = { event, success, users }
    }

    getUsers(): UserAttributes[] {
        return this.contents.users
    }
}