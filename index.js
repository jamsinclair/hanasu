require('./env-check')

var express = require('express')
var morgan = require('morgan')
var csrf = require('csurf')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var email = require('./email')
var twilio = require('./twilio-api')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
  extended: true
}))

// Setup Request Logging
app.use(morgan('combined'))

// Mount Webhook router before CSRF is added
app.use('/webhook', createWebhookRouter())

// Mount the CSRF middlewares
app.use(cookieParser())
app.use(csrf({ cookie: true }))

// Set Security HTTP Headers
app.use(function (req, res, next) {
  res.set({
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'self' *.googleapis.com maxcdn.bootstrapcdn.com"
  })

  next()
})

// Set the template directory and the templating engine used
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', function (request, response) {
  // Pass the csrfToken to the form view
  response.render('pages/index', { csrfToken: request.csrfToken() })
})

app.post('/api/send', function (request, response) {
  var data = request.body

  if (!data.to || !data.secret || !data.body) {
    console.log('Invalid api data received')
    response.sendStatus(400)
    return
  }

  if (data.secret !== process.env.APP_SECRET) {
    console.log('Invalid secret')
    response.sendStatus(403)
    return
  }

  twilio.sendSms(data.to, data.body)
    .then(function (responseData) {
      if (responseData.error_code) {
        console.log(err)
        response.sendStatus(400)
        return
      }

      console.log(`Text message sent successfully to ${data.to}`)
      response.json({status: 'ok'})
    })
    .catch(function (err) {
      console.log(err)
      response.sendStatus(400)
    })
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})

function createWebhookRouter () {
  var router = new express.Router()

  router.post('/receive', function (request, response) {
    var data = request.body

    if (twilio.validateRequest(request)) {
      // We are certain the request has come from twilio, forward the sms to the configured email
      response.json({ status: 'ok' })
      email.forwardSms(data.From, data.Body)
    } else {
      console.log('Invalid twilio webhook received')
      response.sendStatus(403)
    }
  })

  return router
}
