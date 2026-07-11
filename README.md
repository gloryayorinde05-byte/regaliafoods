# Regalia Foods — Online Store

A ready-to-deploy online store for Regalia Foods (FUTA Akure, Ondo State). Plain HTML/CSS/JS — **no build step**, so it deploys to Netlify as-is.

## Pages
- `index.html` — Home + Store (product grid, filters, basket)
- `about.html` — About Us
- `contact.html` — Contact form (Netlify Forms)
- `careers.html` — Job Offers + application form (Netlify Forms)
- `checkout.html` — Order review + Paystack payment
- `thankyou.html` — Order confirmation

## 1. Deploy to Netlify (fastest way)

**Option A — Drag & drop (no Git needed)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the whole `regalia-foods` folder onto the page
3. Your store is live in seconds, on a `*.netlify.app` URL

**Option B — Connect a Git repo (recommended for ongoing edits)**
1. Push this folder to a new GitHub repository
2. In Netlify: **Add new site → Import an existing project**
3. Pick the repo. Build settings can stay empty — `netlify.toml` already sets `publish = "."` and there is no build command needed
4. Deploy

Either way, once deployed you can add a custom domain (e.g. `regaliafoods.com`) under **Site settings → Domain management**.

## 2. Turn on Paystack payments (required before going live)

1. Create a free account at [paystack.com](https://paystack.com) and complete business verification (needed to receive real payouts)
2. In the Paystack dashboard, go to **Settings → API Keys & Webhooks**
3. Copy your **Public Key** (starts with `pk_test_...` for testing, `pk_live_...` for real payments)
4. Open `js/main.js` and find this line near the bottom of `handlePaystackCheckout`:
   ```js
   const PAYSTACK_PUBLIC_KEY = "pk_test_00000000000000000000000000000000";
   ```
5. Replace it with your real key, then redeploy (re-drag the folder, or just push to GitHub if using Git deploy)

**Test cards:** while using a `pk_test_...` key, use Paystack's [test card numbers](https://paystack.com/docs/payments/test-payments/) to try a full checkout without moving real money. Switch to your `pk_live_...` key only when you're ready to accept real payments.

> **Security note:** the public key is safe to expose in frontend code — that's what it's for. Never put your **secret key** in any file that gets deployed to the browser.
>
> This site charges the customer and gets a callback in the browser once payment succeeds. For extra protection against tampered requests, you can later add a Netlify Function that calls Paystack's `/transaction/verify` endpoint with your secret key (stored as an environment variable) to double-check each payment server-side. This isn't required to accept payments, but it's a good next step once you're processing real orders at volume.

## 3. Turn on the Contact & Careers forms

Both forms use **Netlify Forms**, which needs no database or backend:
- Once the site is deployed on Netlify (not just previewed locally), submissions from `contact.html` and `careers.html` will appear automatically under **Site settings → Forms** in your Netlify dashboard
- To get an email every time someone submits, go to **Forms → Form notifications → Add notification → Email notification**
- Nothing else to configure — it works out of the box after the first deploy

## 4. Edit your product catalog

Open `js/products.js`. Every product is one line in the `REGALIA_PRODUCTS` list:
```js
{ id: "beans-brown", name: "Brown Beans", category: "grains", unit: "per derica", price: 1500, desc: "..." },
```
Change `price`, `name`, `unit`, or `desc` freely, or copy a line to add a new product. `category` must be one of: `grains`, `produce`, `oils`, `spices`, `drinks` (edit `REGALIA_CATEGORIES` at the top of the same file to add a new category).

## 5. Update contact details

Search each HTML file for these placeholders and replace with your real details:
- `+2348000000000` (phone / WhatsApp link)
- `hello@regaliafoods.example` (email)
- `FUTA South Gate, Akure, Ondo State` (address, already correct — edit if your pickup point differs)

## 6. Local preview (optional)

You don't need a server for basic browsing, but the cart and Paystack popup work best served over HTTP. Any static server works, e.g.:
```bash
npx serve .
```
Then open the printed `localhost` address. Netlify Forms submissions only register once the site is actually deployed on Netlify — local testing won't create dashboard entries.

## What this store does — and doesn't — include

- ✅ Product catalog, category filters, basket (cart) with add/remove/quantity, persisted in the browser
- ✅ Checkout with pickup/delivery choice and Paystack payment
- ✅ Contact and job-application forms wired to Netlify Forms
- ❌ No customer accounts/login or admin dashboard — this is a storefront, not a full backend system. If you later want order history, staff logins, or inventory syncing, that needs a database (e.g. Supabase or Firebase) connected through Netlify Functions — a bigger project than this static site, and worth planning separately if you get there.
