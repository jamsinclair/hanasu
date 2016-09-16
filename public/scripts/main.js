$(function () {
  function getParameterByName (name, url) {
    if (!url) {
      url = window.location.href
    }

    name = name.replace(/[\[\]]/g, '\\$&')

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    var results = regex.exec(url)

    if (!results) return null
    if (!results[2]) return ''

    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  function hasLocalStorageSupport () {
    var mod = 'supportsLocalStorage'
    var localStorage = window.localStorage

    try {
      localStorage.setItem(mod, mod)
      localStorage.removeItem(mod)
      return true
    } catch (e) {
      return false
    }
  }

  // Retrieve a default 'send to' phone number from url
  // e.g. hanasu.app.com/?to=64123456789
  var toParam = getParameterByName('to')

  if (toParam) {
    // Use the url value for the send to input, prefix with international phone number '+'
    $('#to').val('+' + toParam)
  }

  // Saves the app's secret to localStorage
  // Will default to using that value for the 'secret' input field.
  // On blur of the secret input field, updates the secret value in localStorage
  if (hasLocalStorageSupport()) {
    var secretKey = 'HANASU_SECRET'
    var existingSecret = window.localStorage.getItem(secretKey)

    if (existingSecret) {
      $('#secret').val(existingSecret)
    }

    $('#secret').on('blur', function () {
      window.localStorage.setItem(secretKey, $(this).val())
    })
  }

  /**
  * Displays a Bootstrap Info Alert informing the user we are sending the message
  */
  function showInfoAlert () {
    $('.alert-success').toggleClass('hidden', true)
    $('.alert-danger').toggleClass('hidden', true)
    $('.alert-info').toggleClass('hidden', false)
  }

  /**
  * Displays a Bootstrap Error Alert informing the user the message failed to send
  */
  function showErrorAlert () {
    $('.alert-info').toggleClass('hidden', true)
    $('.alert-success').toggleClass('hidden', true)
    $('.alert-danger').toggleClass('hidden', false)
  }

  /**
  * Displays a Bootstrap Success Alert informing the user that message has been sent successfully
  */
  function showSuccessAlert () {
    $('.alert-info').toggleClass('hidden', true)
    $('.alert-danger').toggleClass('hidden', true)
    $('.alert-success').toggleClass('hidden', false)
  }

  /**
   * Form Handler, if all input and csrf fields have values it will send request
   */
  $('#sms-form').submit(function (e) {
    var secretVal = $('#secret').val()
    var toVal = $('#to').val()
    var bodyVal = $('#body').val()
    var csrfToken = $('#csrf_token').val()

    e.preventDefault()

    showInfoAlert()

    // Validate all fields have values before sending message
    if (secretVal.length && toVal.length && bodyVal.length && csrfToken.length) {
      $.ajax({
        type: 'POST',
        url: '/api/send',
        data: { secret: secretVal, to: toVal, body: bodyVal, _csrf: csrfToken },
        success: showSuccessAlert,
        error: showErrorAlert
      })
    } else {
      showErrorAlert()
    }
  })
})
