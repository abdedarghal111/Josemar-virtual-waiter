import { Request } from "./Request.mts";

export class DeleteReservationRequest extends Request {
    
    public static path = "deleteReservation";

    static getFromResponse(response: any) {
        let { success, message } = response.data
        return new DeleteReservationRequest(success, message)
    }

    toJson() {
        return {
            success: this.success,
            message: this.message
        }
    }
}