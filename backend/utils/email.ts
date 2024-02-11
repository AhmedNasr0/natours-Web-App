
import nodemailer from 'nodemailer'





const sendEmail=async (options:any)=>{
    // 1) create transporter 
    const transporter:any = nodemailer.createTransport({
        port:(process.env.EMAIL_PORT as unknown as number) ,
        host:process.env.EMAIL_HOST,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
        //activate less sequre app

    });
    // 2) define email options
    const mailOptions={
        from:'',
        to: options.email ,
        subject:options.subject,
        text:options.message 
    }
    // 3) actully send the email
    await transporter.sendMail(mailOptions);
}
export default sendEmail