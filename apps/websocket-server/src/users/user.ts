import { WebSocket } from "ws"

export type UserType = {
    ws: WebSocket,
    is_verified: boolean 
}
export class User {
    private user: Map<string, UserType>;

    constructor() {
        this.user = new Map<string, UserType>();
    };

    add_user(user_id: string, ws: WebSocket, is_verified: boolean) {
        if(this.user.has(user_id)) {
            return {message: 'User already exists', success: false};
        };
        this.user.set(user_id, {
            ws, 
            is_verified
        });
    }

    valid_user(user_id: string) {
        const current_user = this.user.get(user_id);

        if(!current_user) {
            return {success: false, message: 'No user with this Id exists in this session'}
        };
        
        const check = current_user.is_verified;

        if (!check) {
            return {message: 'Unauthorized', success: false};
        };

        return {message: 'Authorized', success: true};
    }
}