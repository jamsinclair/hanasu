var nodemailer = require('nodemailer')
var env = process.env

var transporter = nodemailer.createTransport(env.EMAIL_CONNECTION_STRING)

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
function forwardSms (phoneNumber, message, recipient) {
  recipient = recipient || env.EMAIL_RECIPIENT

  var mailOptions = {
    from: `"Hanasu App" <${recipient}>`,
    to: recipient,
    subject: `Message from: ${phoneNumber}`,
    html: `<b>Message:</b> <br> <p>${message}</p>`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.error(error)
    }

    console.log('Message sent: ' + info.response)
  })
}

module.exports = {
  forwardSms: forwardSms
}
