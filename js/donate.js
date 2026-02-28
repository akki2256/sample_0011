/**
 * Donation Form with Razorpay Integration
 *
 * SETUP INSTRUCTIONS:
 * 1. Sign up at https://razorpay.com and get your API keys
 * 2. For production: Create a backend (Node/PHP/Python) to generate orders
 *    - Razorpay requires server-side order creation for security
 * 3. Replace RAZORPAY_KEY_ID below with your actual Key ID (starts with rzp_)
 * 4. For testing: Use Razorpay test keys and test card 4111 1111 1111 1111
 */

(function () {
  // ===== CONFIGURATION - Replace with your Razorpay Key ID =====
  const RAZORPAY_KEY_ID = 'rzp_test_xxxxxxxx'; // Replace with your Key ID

  const form = document.getElementById('donate-form');
  const amountInput = document.getElementById('custom-amount');
  const amountBtns = document.querySelectorAll('.amount-btn');
  const donateBtn = document.getElementById('donate-btn');
  const statusEl = document.getElementById('donate-status');

  if (!form) return;

  // Amount selection
  let selectedAmount = 0;

  function updateAmount(value) {
    selectedAmount = parseInt(value, 10) || 0;
    amountInput.value = selectedAmount > 0 ? selectedAmount : '';
    amountInput.required = selectedAmount === 0;
    amountBtns.forEach(function (btn) {
      btn.classList.toggle('active', parseInt(btn.dataset.amount, 10) === selectedAmount);
    });
    donateBtn.disabled = selectedAmount < 100;
  }

  amountBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      updateAmount(btn.dataset.amount);
    });
  });

  amountInput.addEventListener('input', function () {
    const val = parseInt(this.value, 10) || 0;
    if (val > 0) {
      selectedAmount = val;
      amountBtns.forEach(function (b) {
        b.classList.remove('active');
      });
    }
    donateBtn.disabled = val < 100;
  });

  amountInput.addEventListener('change', function () {
    const val = parseInt(this.value, 10) || 0;
    selectedAmount = val;
    donateBtn.disabled = val < 100;
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const amount = selectedAmount >= 100 ? selectedAmount : parseInt(amountInput.value, 10) || 0;
    if (amount < 100) {
      statusEl.textContent = 'Minimum donation amount is Rs. 100.';
      statusEl.className = 'form-status error';
      return;
    }

    const donorName = document.getElementById('donor-name').value.trim();
    const donorEmail = document.getElementById('donor-email').value.trim();

    donateBtn.disabled = true;
    donateBtn.textContent = 'Processing...';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      // Amount in paise (Razorpay uses smallest currency unit)
      const amountInPaise = amount * 100;

      // PRODUCTION: Replace this with a call to your backend that creates a Razorpay order
      // Example backend response: { orderId: "order_xxx", amount: 50000, currency: "INR" }
      let orderId;

      if (RAZORPAY_KEY_ID && RAZORPAY_KEY_ID !== 'rzp_test_xxxxxxxx') {
        // If you have a backend, call it here:
        // const res = await fetch('/api/create-order', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ amount: amountInPaise, currency: 'INR' })
        // });
        // const data = await res.json();
        // orderId = data.orderId;

        // For demo: Razorpay Checkout will open but will fail without a real order
        // You MUST implement a backend to create orders. See README for details.
        orderId = null;
      }

      if (!orderId) {
        // Demo mode: Show instructions for backend setup
        statusEl.innerHTML =
          'Payment integration requires a backend server. ' +
          'Please set up a Node/PHP/Python backend to create Razorpay orders, ' +
          'or use Razorpay Payment Links for a no-code solution. ' +
          'See README.md for setup instructions.';
        statusEl.className = 'form-status';
        donateBtn.disabled = false;
        donateBtn.textContent = 'Proceed to Pay';
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: 'INR',
        name: 'Our Organisation',
        description: 'Donation to Our Organisation',
        order_id: orderId,
        prefill: {
          name: donorName,
          email: donorEmail
        },
        theme: {
          color: '#3b82f6'
        },
        handler: function (response) {
          // PRODUCTION: Verify payment on your backend using response.razorpay_payment_id
          statusEl.textContent = 'Thank you for your donation! Payment successful.';
          statusEl.className = 'form-status success';
          form.reset();
          selectedAmount = 0;
          donateBtn.disabled = true;
          donateBtn.textContent = 'Proceed to Pay';
        }
      };

      const rzp = new Razorpay(options);

      rzp.on('payment.failed', function (response) {
        statusEl.textContent = 'Payment failed. Please try again. Error: ' + (response.error ? response.error.description : 'Unknown');
        statusEl.className = 'form-status error';
        donateBtn.disabled = false;
        donateBtn.textContent = 'Proceed to Pay';
      });

      rzp.open();
      donateBtn.disabled = false;
      donateBtn.textContent = 'Proceed to Pay';
    } catch (err) {
      statusEl.textContent = 'An error occurred. Please try again.';
      statusEl.className = 'form-status error';
      donateBtn.disabled = false;
      donateBtn.textContent = 'Proceed to Pay';
    }
  });
})();
