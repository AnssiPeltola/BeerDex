# 🍺 BeerDex

BeerDex is a full-stack beer catalog and collection web application built as a portfolio project. Users can browse beers, maintain their personal beer collection, and contribute new beers, breweries, and beer styles through a moderation workflow.

The project is built with modern web technologies including Next.js App Router, React, TypeScript, PostgreSQL, and Drizzle ORM.

---

## Highlights

- Full-stack Next.js App Router application
- Server Components and Server Actions
- Repository pattern architecture
- Type-safe database access with Drizzle ORM
- Image processing with Sharp and Cloudinary
- JWT authentication with role-based authorization
- Moderated user-generated content workflow

---

## Features

### Authentication

- User registration
- Secure login with NextAuth
- JWT-based authentication (HttpOnly cookie)
- Secure password hashing (argon2)
- Protected routes
- Role-based authorization (User / Admin)

### Beer Database

- Browse approved beers
- View detailed beer information
- Search beers
- View average community ratings
- See how many users have collected each beer
- Beer images hosted on Cloudinary

### Personal Collection

- Add beers to your personal collection
- View your collected beers
- Collection preview on profile page
- Rate beers in your collection
- Paginated collection view
- Collection statistics (unique breweries, countries, styles, ABV insights)

### Beer Submission

Users can submit:

- New beers
- New breweries
- New beer styles
- Beer images
- Uploaded images are validated for file type and size, then converted and stored as WebP (Sharp library) on Cloudinary.

Submissions require administrator approval before becoming publicly visible.

### Admin Moderation

Administrators can:

- Approve or reject beers
- Approve or reject breweries
- Approve or reject beer styles
- Approve or reject beer images

### User Profile

- View account information
- Collection progress
- Collection statistics
- Latest collected beers
- Quick access to full collection

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js Route Handlers
- Server Actions
- NextAuth
- Drizzle ORM

## Database

- PostgreSQL (Neon)

## Image Storage

- Cloudinary

## Validation

- Zod

---

# Getting Started

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/BeerDex.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DATABASE_URL=""
AUTH_SECRET=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

Run database migrations

```bash
npm run db:migrate
```

Start the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# License

This project is developed for learning and portfolio purposes.
