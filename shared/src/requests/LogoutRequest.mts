import { Request } from "./Request.mts";

export class LogoutRequest extends Request {

    public static path = "logout"

    constructor(success: boolean, message: string) {
        super(success, message);
    }

    toJson() {
        return {
            success: this.success,
            message: this.message
        }
    }
}