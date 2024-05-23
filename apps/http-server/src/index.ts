import express from 'express';
import { config } from 'dotenv';
import AuthRouter from './routers/auth.route';
import { connectDB } from './utils/database';
import cookie_parser from 'cookie-parser';

config();
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/auth', AuthRouter)
app.use(cookie_parser())

app.get('/', (req, res) => {
    res.send('Welcome to HowsApp\'s HTTP server!')
})

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log((new Date()) + ' server is listening @port ' + process.env.PORT)
    });
}).catch((error) => {
    console.log('Server cannot be served. Error: ' + error)
})  