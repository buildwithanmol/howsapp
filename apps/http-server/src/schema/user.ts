import mongoose, { Schema, model, models } from 'mongoose';


interface IUser {
    name: {
        first_name: string
        last_name: string
    }
    email: string
    password: string
    session: string
}

const UserSchema = new Schema({
    name: {
        first_name: String,
        last_name: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    session: {
        type: String,
        select: false
    }
});

export const User = models?.User as mongoose.Model<IUser> || model('User', UserSchema)