$(function() {
  function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var secretParam = getParameterByName('secret');
  var toParam = getParameterByName('to');

  if (secretParam) {
    $('#secret').val(secretParam);
  }

  if (toParam) {
    $('#to').val('+' + toParam);
  }

  /**
  * Displays a Bootstrap Info Alert informing the user we are sending the message
  */
  function showInfoAlert() {
    $('.alert-success').toggleClass('hidden', true);
    $('.alert-danger').toggleClass('hidden', true);
    $('.alert-info').toggleClass('hidden', false);
  }

  /**
  * Displays a Bootstrap Error Alert informing the user the message failed to send
  */
  function showErrorAlert() {
    $('.alert-info').toggleClass('hidden', true);
    $('.alert-success').toggleClass('hidden', true);
    $('.alert-danger').toggleClass('hidden', false);
  }

  /**
  * Displays a Bootstrap Success Alert informing the user that message has been sent successfully
  */
  function showSuccessAlert() {
    $('.alert-info').toggleClass('hidden', true);
    $('.alert-danger').toggleClass('hidden', true);
    $('.alert-success').toggleClass('hidden', false);
  }

  $('#sms-form').submit(function(e) {
    var secretVal = $('#secret').val();
    var toVal = $('#to').val();
    var bodyVal = $('#body').val();

    e.preventDefault();

    showInfoAlert();

    // Validate all fields have values before sending message
    if (secretVal.length && toVal.length && bodyVal.length) {
      $.ajax({
        type: 'POST',
        url: '/api/send',
        data: { secret: secretVal, to: toVal, body: bodyVal },
        success: showSuccessAlert,
        error: showErrorAlert
      });
    } else {
      showErrorAlert();
    }
  });
});
