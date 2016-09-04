var nodemailer = require('nodemailer')
var env = process.env

// @TODO make protocol configurabel aswell? *shrug*
var connectionString = `smtps://${env.EMAIL_USER}:${env.EMAIL_PASSWORD}@${env.EMAIL_HOSTNAME}`
var transporter =  nodemailer.createTransport(connectionString)

/**
 * Forwards the SMS sender's phone number and message to the email recipient
 *
 * @param  {String|Number} phoneNumber
 *         The SMS sender's phone number
 *
 * @param  {String} message
 *         The SMS message
 *
 * @param  {String} [recipient = process.env.EMAIL_RECIPIENT]
 *         The email to send the SMS message data to
 */
function forwardSms(phoneNumber, message, recipient) {
  var mailOptions = {
    from: `"Hanasu App" <${recipient}>`,
    to: recipient,
    subject: `Message from: ${number}`,
    html: `<b>Message:</b> <br> <p>${message}</p>`
  }

  recipient = recipient || env.EMAIL_RECIPIENT

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return console.error(error)
    }

    console.log('Message sent: ' + info.response)
  });
}

module.exports = forwardSms
