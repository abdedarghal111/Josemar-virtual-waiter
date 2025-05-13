import { Request } from "./Request.mts";
import { type PrivateUser } from "../SharedTypes.mts";

export class WhoAmIRequest extends Request {

    public static path = "whoAmI"
    protected user?: PrivateUser
    protected logged: boolean

    constructor(success: boolean, message: string, isLogged: boolean, user?: PrivateUser) {
        super(success, message);
        this.logged = isLogged;
        this.user = user;
    }

    isLogged(): boolean {
        return this.logged;
    }

    getUser(): PrivateUser {
        if(!this.user){ throw new Error("Usuario inexistente") }
        return this.user;
    }

    static getFromResponse(response: any): WhoAmIRequest {
        let { success, message, isLogged, user } = response.data
        return new WhoAmIRequest(success, message, isLogged, user);
    }

    toJson() {
        return {
            success: this.success,
            message: this.message,
            isLogged: this.logged,
            user: this.user
        }
    }
}