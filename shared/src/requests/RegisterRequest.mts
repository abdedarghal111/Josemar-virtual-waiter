import { Request } from "./Request.mts";
import { PrivateUser } from "../SharedTypes.mts";

export type ValidFields = "name"|"surname"|"username"|"email"|"password"|"password2"

export class RegisterRequest extends Request {
    
    public static path = "register"
    protected user?: PrivateUser
    protected badField?: ValidFields

    constructor(success: boolean, message: string, badField?: ValidFields, user?: PrivateUser) {
        super(success, message);
        if(user){ this.user = user }
        if(badField){ this.badField = badField }
    }

    getUser(): PrivateUser {
        if(!this.user){ throw new Error("Usuario inexistente") }
        return this.user;
    }

    getBadField(): ValidFields {
        if(!this.badField){ throw new Error("Campo inexistente") }
        return this.badField;
    }

    static getFromResponse(response: any): RegisterRequest {
        let { success, message, badField, user } = response.data
        return new RegisterRequest(success, message, badField, user);
    }

    toJson() {
        return {
            success: this.success,
            message: this.message,
            user: this.user,
            badField: this.badField
        }
    }

}