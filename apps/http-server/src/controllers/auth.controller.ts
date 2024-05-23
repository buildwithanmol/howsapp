import { Request, Response } from "express"
import { signInValidation, signUpValidation, verifyValidation } from "../utils/validations";
import { User } from "../schema/user";
import { compare, hash } from 'bcrypt';
import { TokenExpiredError, sign, verify } from 'jsonwebtoken';

export const signup_controller = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!signUpValidation.safeParse(body).success) {
            res.status(400).json({ message: 'Validation Error', success: false })
        };

        const hashed = await hash(body.password, 10);

        const user = await User.create({
            name: {
                first_name: body.first_name,
                last_name: body.last_name
            },
            email: body.email,
            password: hashed
        });

        res.status(200).json({ success: true, message: 'User created successfully', data: user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error', success: false })
    }
}
export const signin_controller = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!signInValidation.safeParse(body).success) {
            res.status(400).json({ message: 'Validation Error', success: false });
        };

        const email_check = await User.findOne({ email: body.email }).select('+password');

        console.log(email_check)

        if (!email_check) {
            res.status(400).json({ message: 'Invalid credentials', success: false })
        };

        const check_password = email_check && await compare(body.password, email_check.password);

        if (!check_password) {
            res.status(400).json({ message: 'Invalid credentials', success: false })
        };

        const session = sign({
            user_id: email_check?._id,
            email: email_check?.email,
        }, process.env.SECRET as string, {
            expiresIn: '2h'
        });


        res.cookie('session', session, {
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: true,
        });

        await User.updateOne({ email: body.email }, {
            $set: {
                session: session
            }
        })

        res.status(200).json({ success: true, message: 'User logged in successfully', session: session });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error', success: false })
    }
}
export const verify_controller = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!verifyValidation.safeParse(body).success) {
            res.status(400).json({ message: 'Validation Error', success: false });
        };

        const user = await User.findOne({ _id: body.user_id });

        if (!user) {
            res.status(400).json({ message: 'User does not exists', success: false })
        }

        const check = verify(body.session, process.env.SECRET as string)

        if (!check) {
            res.status(400).json({ message: 'Session expired', success: false })
        };

        res.status(200).json({ success: true, message: 'User verified successfully' })

    } catch (error) {

        if (error instanceof TokenExpiredError) {
            res.status(400).json({ message: 'Session expired', success: false })
        } else {
            res.status(500).json({ message: 'Server Error', success: false })
        }
    }
}