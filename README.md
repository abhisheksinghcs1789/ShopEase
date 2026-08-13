# ShopEase

A full-stack e-commerce project — product catalog, cart, checkout with Razorpay,
order tracking, and an admin dashboard for inventory and order management.

**Stack:** MongoDB, Express, Angular, Node.js (MEAN)

## Folder structure

```
shopease/
  backend/     Express + MongoDB REST API
  frontend/    Angular app (customer storefront + admin dashboard)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — a free MongoDB Atlas connection string (mongodb.com/cloud/atlas)
- `JWT_SECRET` — any long random string
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — free test keys from dashboard.razorpay.com

Seed an admin account and a few sample products:

```bash
node seed.js
```
This creates `admin@shopease.com` / `admin123` — log in with it, then change the password.

Start the API:

```bash
npm run dev
```
Runs on `http://localhost:5000`. Health check: `GET /api/health`.

## 2. Frontend setup

```bash
cd frontend
npm install
npm start
```
Runs on `http://localhost:4200`.

The API base URL is set in `src/environments.ts` — update it if your backend
runs somewhere other than `localhost:5000`.

## Features

- JWT auth (register/login), customer vs admin roles
- Product catalog with search, category filter, pagination
- Cart stored per-user, syncs across sessions
- Checkout with Razorpay (test mode) or cash-on-delivery
- Order confirmation + order history with a visual tracking timeline
- Admin dashboard: revenue/order stats, inventory CRUD with quick stock edits,
  order status management

## Notes

- Stock is decremented on the server at checkout, after re-validating
  availability — not trusted from the client cart.
- Razorpay payments are verified server-side via HMAC signature before an
  order is marked paid.
- Product images currently take a plain image URL (no upload). Swapping in
  Cloudinary + Multer for real uploads is a natural next step if needed.
