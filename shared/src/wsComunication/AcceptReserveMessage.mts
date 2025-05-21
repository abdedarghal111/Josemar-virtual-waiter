import { BaseMessage, type baseContents } from "./BaseMessage.mts";

export interface acceptReserveContents extends baseContents {
    id: number,
    accept: boolean
}

export class AcceptReserveMessage extends BaseMessage {
    public static event = 'acceptReserve'
    public event = 'acceptReserve'
    
    protected id: number
    protected accept: boolean

    constructor(id: number, accept: boolean) {
        super(AcceptReserveMessage.event)
        this.id = id
        this.accept = accept
    }

    static fromTable(table: acceptReserveContents): AcceptReserveMessage {
        let mess = new AcceptReserveMessage(table.id, table.accept)
        if(!table.success){
            mess.setFailure(table.message)
        }else{
            mess.setSuccess(table.message)
        }
        return mess
    }

    getId(): number {
        return this.id
    }

    isAccepted(): boolean {
        return this.accept
    }

    toString(): string {
        return JSON.stringify({...super.toObject(), id: this.id, accept: this.accept})
    }
}