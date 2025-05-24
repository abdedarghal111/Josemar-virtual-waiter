import { orderLineId, orderLineStatus } from "../SharedTypes.mts";
import { BaseMessage, type baseContents } from "./BaseMessage.mts";

export interface SetOrderLineStatusContents extends baseContents {
    orderLineId: orderLineId
    status: orderLineStatus
}

export class SetOrderLineStatusMessage extends BaseMessage {
    public static event = 'setOrderLineStatus'
    public event = 'setOrderLineStatus'
    
    protected orderLineId: orderLineId
    protected status: orderLineStatus

    constructor(orderLineId: orderLineId, status: orderLineStatus) {
        super(SetOrderLineStatusMessage.event)
        this.orderLineId = orderLineId
        this.status = status
    }

    static fromTable(table: SetOrderLineStatusContents): SetOrderLineStatusMessage {
        let mess = new SetOrderLineStatusMessage(table.orderLineId, table.status)
        if(!table.success){
            mess.setFailure(table.message)
        }else{
            mess.setSuccess(table.message)
        }
        return mess
    }

    toString(): string {
        return JSON.stringify({...super.toObject(), orderLineId: this.orderLineId, status: this.status})
    }

    getOrderLineId(): orderLineId {
        return this.orderLineId
    }
    
    getOrderLineStatus(): orderLineStatus {
        return this.status
    }
}