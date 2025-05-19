import { Request } from "./Request.mts";
import { ReservationAttributes } from "../SharedTypes.mts";

export class GetReservationRequest extends Request {
    
    public static path = "getReservation"
    protected reservation: ReservationAttributes

    constructor(success: boolean, message: string, reservation: ReservationAttributes) {
        super(success, message);
        this.reservation = reservation
    }

    static getFromResponse(response: any): GetReservationRequest {
        let { success, message, reservation } = response.data
        return new GetReservationRequest(success, message, reservation);
    }

    getReservation(): ReservationAttributes {
        return this.reservation
    }

    toJson() {
        return {
            success: this.success,
            message: this.message,
            reservation: this.reservation
        }
    }

}