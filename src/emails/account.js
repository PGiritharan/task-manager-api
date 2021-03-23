const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_SENDER_ADDRESS,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }).then(() => {
        
    }).catch((error) => {
        console.log('error', error);
    });;
};

const sendUnsubscribeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_SENDER_ADDRESS,
        subject: 'Have a great journy ahead!',
        text: `Goodbye!, ${name}. is that anything we could have done to keep you onboard.`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendUnsubscribeEmail
}
