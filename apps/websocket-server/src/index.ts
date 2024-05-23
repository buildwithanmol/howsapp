import http from 'http';
import { WebSocketServer } from 'ws';
import { config } from 'dotenv';
import { EventType, EventTypes } from './utils/types';
import { User } from './users/user';
import { verify } from './utils/auth';

config();

const server = http.createServer((req, res) => {
    console.log((new Date()) + ' requested url ' + req.url);
});

server.listen(process.env.PORT, () => {
    console.log((new Date()) + ' Server is listening on port ' + process.env.PORT)
});

const user = new User();

const wss = new WebSocketServer({ server });

wss.on('connection', async (ws) => {
    ws.on('message', async (data) => {
        let event: EventTypes = JSON.parse(data.toLocaleString());

        if (event.type === EventType.VERIFY) {
            const { user_id } = event.data;
            const authorized = await verify(user_id);

            if (!authorized) {
                ws.send(JSON.stringify({
                    message: 'Unauthorized',
                    success: false
                }))
            };

            user.add_user(user_id, ws, authorized);
            ws.send(JSON.stringify({ message: 'Authorized', success: true }));
        };

        if (event.type === EventType.MESSAGE) {
            const { message, reciever, user_id } = event.data;
            const check = user.valid_user(user_id);

            if (!check.success) {
                ws.send(JSON.stringify({ message: check.message, success: false }));
            }

        }
    });
})