# ⭐ Store Rating Platform

A full-stack production-level web application where users can rate stores from 1–5 stars, with role-based access for Admins, Users, and Store Owners.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon/Supabase) |
| ORM | Prisma |
| Auth | JWT (Access + Refresh tokens) |
| Validation | Zod (frontend & backend) |
| Forms | React Hook Form |
| Charts | Recharts |
| Icons | Lucide React |

---

## Project Structure

```
store-rating-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # DB schema
│   │   └── seed.js             # Sample data
│   └── src/
│       ├── config/             # DB client
│       ├── controllers/        # Route handlers
│       ├── middleware/         # Auth, RBAC, validation, errors
│       ├── routes/             # Express routers
│       ├── services/           # Business logic
│       ├── utils/              # JWT, response helpers
│       ├── validators/         # Zod schemas
│       ├── app.js              # Express app
│       └── server.js           # Entry point
└── frontend/
    └── src/
        ├── api/                # Axios instance + service calls
        ├── app/                # Redux store
        ├── components/
        │   ├── common/         # Input, Button, Modal, StarRating, etc.
        │   └── layout/         # Navbar, Sidebar, DashboardLayout
        ├── features/auth/      # Auth Redux slice
        ├── hooks/              # useDebounce, usePagination, useSort
        ├── pages/
        │   ├── admin/          # AdminDashboard, AdminUsers, AdminStores
        │   ├── user/           # UserDashboard, Profile
        │   └── owner/          # OwnerDashboard
        ├── routes/             # ProtectedRoute, RoleRoute, GuestRoute
        └── utils/              # Zod validation schemas
```

---

## Database Schema

### Users
- `id`, `name` (20–60 chars), `email` (unique), `password` (bcrypt), `address`, `role` (ADMIN/USER/STORE_OWNER)

### Stores
- `id`, `name` (20–60 chars), `email` (unique), `address`, `ownerId` (FK → users, unique)

### Ratings
- `id`, `value` (1–5), `userId` (FK → users), `storeId` (FK → stores)
- Unique constraint: `(userId, storeId)` — one rating per user per store

### RefreshTokens
- `id`, `token`, `userId` (FK → users), `expiresAt`

---

## User Roles & Permissions

| Feature | Admin | User | Store Owner |
|---------|-------|------|-------------|
| View all stores | ✅ | ✅ | ❌ |
| Rate stores | ❌ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Manage stores | ✅ | ❌ | ❌ |
| View own store dashboard | ❌ | ❌ | ✅ |
| Update password | ✅ | ✅ | ✅ |

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# backend/.env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/store_rating_db"
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173

# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

App runs at: http://localhost:5173

---

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@storerating.com | Admin@1234 |
| User | john.doe@example.com | User@1234 |
| Store Owner | owner.coffee@example.com | Owner@1234 |

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public |
| POST | `/api/auth/refresh` | Public |
| GET | `/api/auth/me` | Authenticated |
| PUT | `/api/auth/password` | Authenticated |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (search, filter, sort, paginate) |
| GET | `/api/users/stats` | Dashboard stats |
| GET | `/api/users/:id` | User detail |
| POST | `/api/users` | Create user |

### Stores
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/stores` | Authenticated |
| GET | `/api/stores/:id` | Authenticated |
| GET | `/api/stores/owner/dashboard` | Store Owner |
| POST | `/api/stores` | Admin |
| PUT | `/api/stores/:id` | Admin |
| DELETE | `/api/stores/:id` | Admin |

### Ratings (User only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings` | Submit/update rating |
| GET | `/api/ratings/my` | Get my ratings |

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel or connect GitHub repo
```

### Backend → Render/Railway
1. Set environment variables in dashboard
2. Set build command: `npm install && npx prisma generate`
3. Set start command: `npm start`

### Database → Neon (Recommended)
1. Create project at https://neon.tech
2. Copy connection string to `DATABASE_URL`
3. Run `npx prisma migrate deploy`

---

## Security Features
- Passwords hashed with bcrypt (10 rounds)
- JWT access tokens (15min) + refresh tokens (7 days, stored in httpOnly cookies)
- Helmet.js for HTTP security headers
- CORS restricted to frontend origin
- Rate limiting (100 req/15min)
- Zod validation on all inputs (frontend + backend)
- SQL injection protection via Prisma ORM
- Role-based route protection

---

## Form Validation Rules
- **Name**: 20–60 characters
- **Address**: max 400 characters
- **Password**: 8–16 chars, 1 uppercase, 1 special character
- **Email**: standard email format
- **Rating**: integer 1–5
