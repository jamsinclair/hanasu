var expectedVars = [
  'APP_SECRET',
  'EMAIL_CONNECTION_STRING',
  'EMAIL_RECIPIENT',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_NUMBER',
  'TWILIO_WEBHOOK'
]
var errors = false
var isProductionEnv = process.env.NODE_ENV === 'production'

if (!isProductionEnv) {
  require('./env')
}

for (var i = 0; i < expectedVars.length; i++) {
  if (!process.env[expectedVars[i]]) {
    console.log(`The env var ${expectedVars[i]} has not been configured`)
    errors = true
  }
}

if (errors && isProductionEnv) {
  throw new Error('Please setup the above env vars before running the app')
}
