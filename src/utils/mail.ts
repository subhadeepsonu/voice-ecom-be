import nodemailer from 'nodemailer'
export async function sendVerificationEmail(email: string, token: string, subject: string, type: "verification" | "reset") {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: 'subhadeepthandaka@gmail.com',
                pass: "enxx zwgm wdgd svgd"
            }
        })
        const url = `http://localhost:5173/verify?token=${token}`
        const urlReset = `http://localhost:5173/reset-password?token=${token}`

        await transporter.sendMail({
            from: 'subhadeepthandaka@gmail.com',
            to: email,
            subject: subject,
            html: type === "verification" ? `<p>Please click the link below to verify your email:</p><a href="${url}">${url}</a>` : `<p>Please click the link below to reset your password. This link is valid for 1 hour:</p><a href="${urlReset}">${urlReset}</a>`
        })
    } catch (error) {
        console.error("Error sending verification email:", error)
    }

}
