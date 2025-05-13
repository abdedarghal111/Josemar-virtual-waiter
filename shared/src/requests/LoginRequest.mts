import { Request } from "./Request.mts";
import { PrivateUser } from "../SharedTypes.mts";

export type ValidFields = "userOrEmail"|"password"

export class LoginRequest extends Request {
    
    public static path = "login"
    protected user?: PrivateUser
    protected badField?: ValidFields

    constructor(success: boolean, message: string, badField?: ValidFields, user?: PrivateUser) {
        super(success, message);
        this.user = user;
        this.badField = badField;
    }

    getUser(): PrivateUser {
        if(!this.user){ throw new Error("Usuario inexistente") }
        return this.user;
    }

    getBadField(): ValidFields {
        return this.badField;
    }

    static getFromResponse(response: any): LoginRequest {
        let { success, message, user } = response.data
        return new LoginRequest(success, message, user);
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