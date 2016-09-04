var env = process.env
var twilio = require('twilio')
var client = new twilio.RestClient(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)

/**
 * Sends a text message to the specified number via the Twilio Client.
 *
 * @param  {String|Number} phoneNumber
 *         The phone number to send the message to
 * @param  {String} message
 *         The content of the message
 *
 * @return {promise} A promise that resovles on whether the sms sending was successful or not
 */
function sendSms(phoneNumber, message) {
  return client.sendMessage({
      to: phoneNumber,
      from: env.TWILIO_NUMBER,
      body: message
  })
}

/**
 * Validates whether the request was sent by the Twilio service or not
 *
 * @param  {Object} req
 *         An express request object
 *
 * @return {boolean} Returns whether it is a valid request or not from Twilio
 */
function validateRequest(req) {
  var options = { url: env.TWILIO_WEBHOOK }

  return twilio.validateExpressRequest(req, env.TWILIO_AUTH_TOKEN, options)
}

module.exports = {
  sendSms: sendSms,
  validateRequest: validateRequest
}
