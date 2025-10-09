import nodemailer from 'nodemailer'
export async function sendVerificationEmail(email: string, token: string, subject: string) {
    const transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        secure: false,
        auth: {
            user: "user@example.com",
            pass: "password"
        }
    })
    const url = `http://localhost:3000/auth/verify?token=${token}`
    await transporter.sendMail({
        from: 'subhadeepthandaka@gmail.com',
        to: email,
        subject: subject,
        html: `<p>Click <a href="${url}">here</a> to verify your email</p>`
    })
}
