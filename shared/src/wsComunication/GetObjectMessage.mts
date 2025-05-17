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

    constructor(success: boolean, type: validObjectType, object: objectType) {
        super(GetObjectMessage.event, success)
        this.type = type
        this.object = object
    }

    static fromTable(table: listObjectContents): GetObjectMessage {
        return new GetObjectMessage(table.success, table.type, table.object)
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