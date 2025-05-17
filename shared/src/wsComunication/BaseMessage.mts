export interface baseContents {
    event: string
    success: boolean
}

export class BaseMessage {
    public static event = 'base'

    public event: string
    protected success: boolean

    constructor(event: string, success: boolean) {
        this.event = event
        this.success = success
    }

    static fromTable(table: baseContents): BaseMessage {
        return new BaseMessage(table.event, table.success)
    }

    isOk(): boolean {
        return this.success
    }

    toObject() {
        return {event: this.event, success: this.success}
    }

    toString(): string {
        return JSON.stringify({event: this.event, success: this.success})
    }
}