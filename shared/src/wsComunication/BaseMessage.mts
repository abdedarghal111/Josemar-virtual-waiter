export interface baseContents {
    event: string
    success: boolean
    message?: string
}

export class BaseMessage {
    public static event = 'base'

    public event: string
    protected success = true
    protected message = ''

    constructor(event: string) {
        this.event = event
        this.success = true
    }

    static fromTable(table: baseContents): BaseMessage {
        let mess = new BaseMessage(table.event)
        if(!table.success){
            mess.setFailure(table.message)
        }else{
            mess.setSuccess(table.message)
        }
        return mess
    }

    isOk(): boolean {
        return this.success
    }

    setEvent(event: string) {
        this.event = event
    }

    setSuccess(message?: string) {
        this.success = true
        this.message = message ?? ''
    }

    setFailure(message?: string) {
        this.success = false
        this.message = message ?? ''
    }

    getMessage(): string {
        return this.message
    }

    toObject() {
        return {event: this.event, success: this.success, message: this.message}
    }

    toString(): string {
        return JSON.stringify({event: this.event, success: this.success, message: this.message})
    }
}