const sgMail = require('@sendgrid/mail');

const sendGridApiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridApiKey)

const sendWelcomeEmailAfterSignUp = async (senderEmail, senderUsername) => {
    try {
        senderUsername = senderUsername.toUpperCase();
        await sgMail.send({
          to: senderEmail,
          from: "ianmurithi92@gmail.com",
          subject: `Welcome, thank you for signing up ${senderUsername}!`,
          text: `Hello ${senderUsername}, thank you once again for the nod by signing up for this application. Hope you find it helpful. Please send an email to this account for any enquiries.`,
        });
    } catch (e) {
        console.log('ERROR: ', e)
        
        if (e.response) {
            console.log('ERROR RESPONSE: ', e.response.body)
        }
    }
}

module.exports = {
    'signUpEmail': sendWelcomeEmailAfterSignUp
}