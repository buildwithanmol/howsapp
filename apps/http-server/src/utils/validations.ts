import z from 'zod';

export const signUpValidation = z.object({
    email: z.string().email().max(500),
    password: z.string().min(6).max(100),
    first_name: z.string().max(500),
    last_name: z.string().max(500)
})

export const signInValidation = z.object({
    email: z.string().email().max(500),
    password: z.string().min(6).max(100)
})

export const verifyValidation = z.object({
    user_id: z.string().max(500),
    session: z.string(),
})