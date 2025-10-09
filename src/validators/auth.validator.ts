import { z } from 'zod';
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
export type loginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8)
})
export type registerInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email()
})
export type forgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(8)
})
export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;