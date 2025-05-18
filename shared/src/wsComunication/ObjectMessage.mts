import type { UserAttributes, validObjectType } from "../SharedTypes.mjs";
import { BaseMessage, type baseContents } from "./BaseMessage.mts";

type objectType = {[key: string]: any}
export interface listObjectContents extends baseContents {
    type: validObjectType
    object: objectType
}

export class GetObjectMessage extends BaseMessage {
    public static event = 'getObject'
    public event = 'getObject'
    
    protected type: validObjectType
    protected object: objectType

    constructor(type: validObjectType, object: objectType) {
        super(GetObjectMessage.event)
        this.type = type
        this.object = object
    }

    static fromTable(table: listObjectContents): GetObjectMessage {
        let mess = new GetObjectMessage(table.type, table.object)
        if(!table.success){
            mess.setFailure(table.message)
        }else{
            mess.setSuccess(table.message)
        }
        return mess
    }

    getType(): validObjectType {
        return this.type
    }

    getObject(): objectType {
        return this.object
    }

    getUser(): UserAttributes {
        return this.object as UserAttributes
    }

    toString(): string {
        return JSON.stringify({...super.toObject(), type: this.type, object: this.object})
    }
}

export class SetObjectMessage extends GetObjectMessage {
    public static event = 'setObject'
    public event = 'setObject'
    
    constructor(type: validObjectType, object: objectType) {
        super(type, object)
        this.setEvent(SetObjectMessage.event)
    }
}

export class DeleteObjectMessage extends GetObjectMessage {
    public static event = 'deleteObject'
    public event = 'deleteObject'
    
    constructor(type: validObjectType, object: objectType) {
        super(type, object)
        this.setEvent(DeleteObjectMessage.event)
    }
}