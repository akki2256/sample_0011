/**
 * Contact Form Handler
 * Submits to FormSubmit.co (free, unlimited submissions) → emails to airteldth1702@gmail.com
 * First time: FormSubmit sends a confirmation email to that address; click the link once to activate.
 */

var CONTACT_EMAIL = 'airteldth1702@gmail.com';
var FORMSUBMIT_AJAX_URL = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  // Pre-fill subject from URL params (for event registration, career applications)
  const params = new URLSearchParams(window.location.search);
  const eventParam = params.get('event');
  const positionParam = params.get('position');
  const subjectParam = params.get('subject');

  if (eventParam) {
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
      subjectSelect.value = 'event';
      const messageField = document.getElementById('message');
      if (messageField) {
        messageField.placeholder = 'I am interested in: ' + eventParam.replace(/-/g, ' ') + '...';
      }
    }
  }

  if (positionParam) {
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
      subjectSelect.value = 'career';
      const messageField = document.getElementById('message');
      if (messageField) {
        messageField.placeholder = 'I am applying for: ' + positionParam.replace(/-/g, ' ') + '. Please find my details below...';
      }
    }
  }

  if (subjectParam) {
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
      subjectSelect.value = subjectParam;
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // FormSubmit special fields: email subject line, Reply-To, and table template
    var subjectLabel = form.querySelector('#subject option:checked') ? form.querySelector('#subject option:checked').textContent : data.subject || 'Contact';
    var payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject,
      message: data.message,
      _subject: 'Utsaah Foundation – ' + subjectLabel,
      _replyto: data.email || '',
      _template: 'table'
    };

    try {
      const response = await fetch(FORMSUBMIT_AJAX_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = response.ok ? await response.json().catch(function () { return {}; }) : null;

      if (response.ok && (result.success !== false)) {
        statusEl.textContent = result.message + 'Thank you! Your message has been sent. We will get back to you soon.';
        statusEl.className = 'form-status success';
        form.reset();
      } else {
        statusEl.textContent = 'Something went wrong. Please try again or email us directly at ' + CONTACT_EMAIL + '.';
        statusEl.className = 'form-status error';
      }
    } catch (err) {
      statusEl.textContent = 'Something went wrong. Please try again or email us directly at ' + CONTACT_EMAIL + '.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
