const elasticemail = require('elasticemail')
require('dotenv').config()


const client = elasticemail.createClient({
    username: 'chatwitval10@gmail.com',
    apiKey: process.env.ELASTIC_EMAIL_API_KEY
})


const sendWelcomeMail = (email, name) => {
    try {
        client.mailer.send({
            from: 'chatwitval10@gmail.com',
            to: email,
            subject: 'Welcome!',
            body_text: `Hello ${name}, Welcome to my application and email service`
        }, (err, result) => {
            if (err) {
              throw 'Something went wrong, unable to send email';
            }
          });
    } catch (error) {
        return error
    }
}

const sendCancellationMail = async (email, name) => {
    try {
        client.mailer.send({
            from: 'chatwitval10@gmail.com',
            to: email,
            subject: 'Goodbye!',
            body_text: `Bye ${name}, I hope to see you again.`
        }, (err, result) => {
            if (err) {
              throw 'Something went wrong, unable to send email';
            }
          });
    } catch (error) {
        return error
    }
}

module.exports = {sendWelcomeMail, sendCancellationMail};

