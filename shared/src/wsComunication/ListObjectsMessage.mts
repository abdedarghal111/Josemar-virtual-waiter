import { anyObject, UserAttributes, validObjectType } from "../SharedTypes.mts";
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

    constructor(success: boolean, type: validObjectType, objects: anyObject[]) {
        super(ListObjectsMessage.event, success)
        this.type = type
        this.objects = objects
    }

    static fromTable(table: listObjectsContents): ListObjectsMessage {
        return new ListObjectsMessage(table.success, table.type, table.objects)
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
}