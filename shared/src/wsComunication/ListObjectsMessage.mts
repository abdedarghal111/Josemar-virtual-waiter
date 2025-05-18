import { anyObject, ProductAttributes, UserAttributes, validObjectType } from "../SharedTypes.mts";
import { BaseMessage, type baseContents } from "./BaseMessage.mts";

export interface listObjectsContents extends baseContents {
    type: validObjectType
    objects: anyObject[]
}

export class ListObjectsMessage extends BaseMessage {
    public static event = 'listObjects'
    public event = 'listObjects'
    
    protected type: validObjectType
    protected objects: anyObject[]

    constructor(type: validObjectType, objects: anyObject[]) {
        super(ListObjectsMessage.event)
        this.type = type
        this.objects = objects
    }

    static fromTable(table: listObjectsContents): ListObjectsMessage {
        let mess = new ListObjectsMessage(table.type, table.objects)
        if(!table.success){
            mess.setFailure(table.message)
        }else{
            mess.setSuccess(table.message)
        }
        return mess
    }

    toString(): string {
        return JSON.stringify({...super.toObject(), type: this.type, objects: this.objects})
    }

    getType(): validObjectType {
        return this.type
    }

    getObjects(): anyObject[] {
        return this.objects
    }

    getUsers(): UserAttributes[] {
        return this.objects as UserAttributes[]
    }

    getProducts(): ProductAttributes[] {
        return this.objects as ProductAttributes[]
    }
}