import { Request } from "./Request.mts";
import { ReservationAttributes } from "../SharedTypes.mts";

export class ListMyReservesRequest extends Request {
    
    public static path = "listMyReserves"
    protected reservations: ReservationAttributes[]

    constructor(success: boolean, message: string, reservations: ReservationAttributes[]) {
        super(success, message);
        this.reservations = reservations
    }

    static getFromResponse(response: any): ListMyReservesRequest {
        let { success, message, reservations } = response.data
        return new ListMyReservesRequest(success, message, reservations);
    }

    getReservations(): ReservationAttributes[] {
        return this.reservations
    }

    toJson() {
        return {
            success: this.success,
            message: this.message,
            reservations: this.reservations
        }
    }

}