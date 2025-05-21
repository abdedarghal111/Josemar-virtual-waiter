import { BaseMessage, type baseContents } from "./BaseMessage.mts";

export type pushNotificationType = 'success' | 'warning' | 'error' | 'info' | 'edited'
export interface pushNotificationContents extends baseContents {
    type: pushNotificationType
}

export class PushNotificationMessage extends BaseMessage {
    public static event = 'PushNotification'
    public event = 'PushNotification'

    protected type: pushNotificationType = 'success'

    constructor(type: pushNotificationType) {
        super(PushNotificationMessage.event)
        this.type = type
    }

    static fromTable(table: pushNotificationContents): PushNotificationMessage {
        let mess = new PushNotificationMessage(table.type)
        if(!table.success){
            mess.setFailure(table.message)
        }else{
            mess.setSuccess(table.message)
        }
        return mess
    }

    getType(): pushNotificationType {
        return this.type
    }

    toString(): string {
        return JSON.stringify({...super.toObject(), type: this.type})
    }
}