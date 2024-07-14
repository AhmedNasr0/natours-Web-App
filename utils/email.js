

const nodemailer=require('nodemailer')

const  sendEmail=async(options)=>{
    //// create transport
    const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: Number(process.env.EMAIL_PORT) || 0,
        service:process.env.EMAIL_SERVICE,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        },
    })
    const mailOptions = {
        from: 'Ahmed nasr ',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    
      // 3) Actually send the email
    await transporter.sendMail(mailOptions);
}
module.exports=sendEmail

