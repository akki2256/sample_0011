# Organisation Static Website

A modern, responsive static website for your organisation featuring:

- **Home** – Mission, vision, and quick links
- **Events & Plans** – Upcoming events and long-term initiatives
- **Careers** – Job listings and benefits
- **Donate** – Razorpay-powered donation form
- **Contact** – Contact form for inquiries, partnerships, and applications

## Quick Start

1. Open `index.html` in a browser, or
2. Serve locally with a simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000`

## Project Structure

```
├── index.html          # Home page
├── events.html         # Events & Plans
├── careers.html        # Careers
├── donate.html         # Donation page
├── contact.html        # Contact form
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── main.js         # Navigation
│   ├── contact.js      # Contact form logic
│   └── donate.js       # Razorpay donation logic
└── README.md
```

## Contact Form Setup

The contact form is client-side only by default. To receive submissions:

### Option 1: Formspree (No backend)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a form and get your form ID
3. In `js/contact.js`, uncomment the Formspree fetch block and replace `YOUR_FORM_ID` with your ID

### Option 2: Backend API

Create an endpoint (e.g. `/api/contact`) that accepts POST with `name`, `email`, `phone`, `subject`, `message`. Update the fetch URL in `js/contact.js`.

### Option 3: Netlify Forms

If deploying to Netlify, add `netlify` attribute to the form and `name` attributes to inputs. Netlify will capture submissions automatically.

## Razorpay Donation Setup

Razorpay requires **server-side order creation** for security. You have two approaches:

### Option 1: Razorpay Payment Links (No backend)

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Payment Links** → Create new
3. Set amount, description, and redirect URLs
4. Replace the donate form with a button that links to your Payment Link URL

### Option 2: Backend + Checkout (Full integration)

1. Sign up at [razorpay.com](https://razorpay.com) and get **Key ID** and **Key Secret**
2. Create a backend endpoint that creates orders. Example (Node.js):

```javascript
// Example: Node.js + Express
const Razorpay = require('razorpay');
const razorpay = new Razorpay({ key_id: 'YOUR_KEY_ID', key_secret: 'YOUR_KEY_SECRET' });

app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body; // amount in paise
  const order = await razorpay.orders.create({
    amount: amount,
    currency: 'INR',
    receipt: 'donation_' + Date.now()
  });
  res.json({ orderId: order.id });
});
```

3. In `js/donate.js`:
   - Replace `RAZORPAY_KEY_ID` with your Key ID
   - Uncomment and configure the backend fetch to call your `/api/create-order` endpoint
   - Ensure your backend verifies the payment using `razorpay.payments.fetch(paymentId)` after success

### Test Mode

Use Razorpay **test keys** (start with `rzp_test_`) and test card: `4111 1111 1111 1111`

## Customisation

- **Branding**: Update the organisation name in all HTML files and in `js/donate.js` (Razorpay `name` option)
- **Contact details**: Edit email, phone, and address in the footer and contact page
- **Events/Jobs**: Edit content in `events.html` and `careers.html`
- **Colours**: Change CSS variables in `css/styles.css` (`:root`)

## ICICI Payment Gateway

If you prefer ICICI Payment Gateway instead of Razorpay:

- ICICI offers payment gateway solutions for businesses. You would need to:
  1. Register with ICICI Bank for their payment gateway
  2. Replace the Razorpay script and logic in `donate.html` and `js/donate.js` with ICICI’s integration
  3. Implement server-side order creation and verification as per ICICI’s documentation

Razorpay is commonly used for Indian donations and has simpler integration and documentation.

## Deployment

- **Netlify**: Drag and drop the folder or connect a Git repo
- **Vercel**: Import the project and deploy
- **GitHub Pages**: Push to a repo and enable Pages

For Razorpay or contact form backend, ensure your backend is deployed and CORS is configured if the frontend is on a different domain.

## License

Use freely for your organisation. Update branding and content as needed.
