export interface baseContents {
    event: string
    success: boolean
}

export class BaseMessage {
    public static event = 'baseMessage'
    protected contents: baseContents

    // parse contents
    constructor(baseContents: baseContents) {
        let { event, success } = baseContents
        this.contents = { event, success }
    }

    isOk(): boolean {
        return this.contents.success
    }

    toString(): string {
        return JSON.stringify(this.contents)
    }
}