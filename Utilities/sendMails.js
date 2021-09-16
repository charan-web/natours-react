
const nodemailer = require('nodemailer')
console.log(process.env.GMAIL)

module.exports = class Email {
    constructor(user,url){
        this.to = user.email,
        this.from = "Charan <hello@gmail.com>",
        this.firstName = user.name.split(' ')[0],
        this.url = url

    }   
    async send(template,subject){
        //* 2.Create a transporter
        const transport = nodemailer.createTransport({
            service:'gmail',
            // host:process.env.GMAIL_HOST,
            // port:process.env.GMAOL_PORT,
            auth:{
                user:"cc710788@gmail.com",
                pass:"Charan143@"
            }
        })



        //* options and send email
        const mailOptions = {
            from:this.from,
            to:this.to,
            subject,
            text:`${this.url}`
        }
        await transport.sendMail(mailOptions)
    

    }

    async sendWelcome(){
       await this.send("Welcome","Welcome to the Natours Family")
    }
    async sendPassword(){
        await this.send("Password","Reset Password")
    }
}



// const sendMails = async (options) =>{
    // const transport = nodemailer.createTransport({
    //     host:process.env.GMAIL_HOST,
    //     port:process.env.GMAOL_PORT,
    //     auth:{
    //         user:process.env.GMAIL,
    //         pass:process.env.PASSWORD_GMAIL
    //     }
    // })

    // const mailOptions = {
    //     from:"Charan <hello@gmail.com",
    //     to:options.email,
    //     subject:options.subject,
    //     text:options.message
    // }
    // await transport.sendMail(mailOptions)

// }

// module.exports = sendMails