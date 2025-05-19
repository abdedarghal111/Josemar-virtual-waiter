import { Request } from "./Request.mts";
import { ProductAttributes } from "../SharedTypes.mts";

export class GetProductsRequest extends Request {
    
    public static path = "getProducts"
    protected products: ProductAttributes[]

    constructor(success: boolean, message: string, products: ProductAttributes[]) {
        super(success, message);
        this.products = products
    }

    static getFromResponse(response: any): GetProductsRequest {
        let { success, message, products } = response.data
        return new GetProductsRequest(success, message, products);
    }

    getProducts(): ProductAttributes[] {
        return this.products
    }

    toJson() {
        return {
            success: this.success,
            message: this.message,
            products: this.products
        }
    }

}