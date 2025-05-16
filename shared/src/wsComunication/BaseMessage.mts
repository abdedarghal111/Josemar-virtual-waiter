export interface baseContents {
    event: string
    success: boolean
}

export class BaseMessage {
    public static event = 'base'
    public event = 'base'
    
    protected contents: baseContents = { event: '', success: false }

    // parse contents
    constructor(baseContents: baseContents) {
        let { success } = baseContents
        this.contents = { event: this.event, success }
    }

    isOk(): boolean {
        return this.contents.success
    }

    toString(): string {
        return JSON.stringify(this.contents)
    }
}