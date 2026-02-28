/**
 * Contact Form Handler
 * For production: connect to a backend API or form service (Formspree, Netlify Forms, etc.)
 */

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

    try {
      // Option 1: Use Formspree (free tier) - replace YOUR_FORM_ID with your Formspree form ID
      // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      //   headers: { 'Content-Type': 'application/json' }
      // });

      // Option 2: Use your own backend API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      //   headers: { 'Content-Type': 'application/json' }
      // });

      // For static demo: simulate success (replace with actual API call above)
      await new Promise(function (resolve) {
        setTimeout(resolve, 800);
      });

      statusEl.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
      statusEl.className = 'form-status success';
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Something went wrong. Please try again or email us directly at contact@ourorganisation.org';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
