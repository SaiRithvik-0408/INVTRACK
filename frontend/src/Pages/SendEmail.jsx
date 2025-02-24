const nodemailer = require('nodemailer');

module.exports = async(email,subject,text)=>{
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            post: process.env.EMAIL-PORT,
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject,
            text:text
        })
    }catch(error){
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}