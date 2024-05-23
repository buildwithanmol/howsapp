import { Router } from "express";
import { signin_controller, signup_controller, verify_controller } from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.post('/signup', signup_controller);
AuthRouter.post('/signin', signin_controller);
AuthRouter.post('/verify', verify_controller);

export default AuthRouter as Router;