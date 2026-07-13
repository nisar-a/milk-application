# Smart Dairy Milk Management System

A production-ready MERN stack application for managing dairy milk operations with role-based access for admin and customer users.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Recharts
- Backend: Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, Morgan, Express Validator
- Database: MongoDB + Mongoose
- Exports: PDFKit (PDF), ExcelJS (Excel)

## Core Features

- Secure JWT authentication and protected routes
- Admin dashboard analytics with charts
- Customer management (add, edit, delete, search, filter, pagination)
- Daily milk entries (morning/evening) with automatic amount calculations
- Price history with future-effective pricing
- Monthly billing with paid/pending/partial statuses
- Payment recording and history
- Daily, weekly, monthly, yearly reports
- Customer invoice export to PDF and Excel
- Dark/light mode and responsive interface

## Project Structure

- server: Express API with MVC architecture
- client: React frontend with route-based modules

## Setup Instructions

1. Install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

2. Configure environment files:

- Copy server/.env.example to server/.env and update values.
- Copy client/.env.example to client/.env if needed.

3. Bootstrap admin account once:

- Start server and call POST /api/auth/bootstrap-admin
- Defaults come from server .env values

4. Run in development:

```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Default API Modules

- /api/auth
- /api/customers
- /api/milk
- /api/prices
- /api/payments
- /api/reports
- /api/dashboard
- /api/billing

## Notes

- Milk rate is captured per entry to preserve historical pricing.
- New price updates only affect future entries.
- Customer users can only view their own records, bills, and payments.

## Deployment (Render)

This repo includes [render.yaml](render.yaml) to deploy backend and frontend together.

1. Push code to GitHub.
2. In Render, create a new Blueprint and select your repository.
3. Render will detect [render.yaml](render.yaml) and create:
	- `smart-dairy-api` (Node web service)
	- `smart-dairy-web` (static frontend)
4. Configure backend environment values in Render:
	- `MONGO_URI` (use MongoDB Atlas connection string)
	- `JWT_SECRET`
	- `ADMIN_PHONE`
	- `ADMIN_PASSWORD`
5. After backend deploys, set:
	- backend `CORS_ORIGIN` = your frontend URL (for example `https://smart-dairy-web.onrender.com`)
	- frontend `VITE_API_URL` = your backend API URL (for example `https://smart-dairy-api.onrender.com/api`)
6. Redeploy both services.

### Production Environment Checklist

- Backend (`server`):
  - `NODE_ENV=production`
  - `MONGO_URI=<atlas-uri>`
  - `MONGO_DB_NAME=smart_dairy`
  - `JWT_SECRET=<strong-random-secret>`
  - `JWT_EXPIRES_IN=7d`
  - `CORS_ORIGIN=<frontend-url>`
  - `DEFAULT_MILK_PRICE=40`

- Frontend (`client`):
  - `VITE_API_URL=<backend-url>/api`
