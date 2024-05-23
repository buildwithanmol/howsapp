export enum EventType {VERIFY = "verify", MESSAGE = "message"}
export type EventTypes = {
    type: EventType.VERIFY, 
    data: {
        user_id: string, 
        session: string
    }
} | {
    type: EventType.MESSAGE, 
    data: {
        user_id: string,
        reciever: string, 
        message: string
    }
}