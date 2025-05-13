export class Request {
    
    protected success: boolean;
    protected message: string;

    constructor(success: boolean, message: string) {
        this.success = success;
        this.message = message;
    }

    isOk(): boolean {
        return this.success;
    }

    getMessage(): string {
        return this.message;
    }
}