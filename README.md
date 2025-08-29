# Final Project – Music Events (Backend)

## 1) Project Description
A simple events platform backend that exposes public endpoints to browse events and categories, and protected admin endpoints to manage them. It follows a conventional NestJS architecture with DTO validation, role-based access control, and Prisma as the data layer.

---

## 2) List of Features
- Public endpoints to list and view **Events** and **Categories**
- Admin-only CRUD for **Events** and **Categories**
- (Optional) Ticket booking flow (create/cancel) with stock checks
- Input validation and structured error handling
- OpenAPI/Swagger API documentation

---

## 3) Tech Stack Used
- **Runtime/Framework**: Node.js, **NestJS**
- **ORM**: **Prisma** (PostgreSQL)
- **Auth**: Passport JWT (role-based guards)
- **Validation**: `class-validator`, `class-transformer`
- **Docs**: Swagger (OpenAPI)
- **Tooling**: TypeScript, ESLint/Prettier (optional)

---

## 4) Installation & Usage Instructions

### Prerequisites
- Node.js 18+ (or LTS)
- PostgreSQL 14+ (local or cloud)
- npm / pnpm / yarn

### Environment
Create a `.env` file based on your needs:

## Database
DATABASE_URL="postgresql://postgres:zUhNJpCjHNulcLBVNyAfjEGrkfRITBxF@maglev.proxy.rlwy.net:27830/railway"

## JWT & Cookies
JWT_ACCESS_SECRET="replace_me"
JWT_REFRESH_SECRET="replace_me"
AUTH_COOKIE_DOMAIN="" # e.g. .yourdomain.com or leave empty for localhost
AUTH_SAME_SITE="lax" # lax | none | strict
AUTH_COOKIE_SECURE="false" # true in production over HTTPS

## App
NODE_ENV="development"
PORT="3000"

### Setup
```bash```
# install deps
npm install

# generate Prisma client
npx prisma generate

# run migrations (dev)
npx prisma migrate dev

# (optional) seed data
# npx ts-node prisma/seed.ts  # or npm run seed if provided

### Run
# development
npm run start:dev

# production
npm run build
npm run start:prod

### API Docs
Swagger UI usually available at: http://localhost:3000/docs (or your configured path)

## 5) Deployment Links
Backend: (https://final-project-be-fikrifirdauscn-production.up.railway.app/)

## 6) Screenshots of Apps

## 7) ERD on Documentation


### Mermaid 
erDiagram
  USER ||--o{ BOOKING : "places"
  CATEGORY ||--o{ EVENT : "has many"
  EVENT ||--o{ BOOKING : "has many"

  USER {
    string id PK
    string name
    string username
    string email
    string role          // e.g., ADMIN, USER
    string status        // e.g., active/suspended
    datetime createdAt
    datetime updatedAt
  }

  CATEGORY {
    string id PK
    string name
    datetime createdAt
    datetime updatedAt
  }

  EVENT {
    string id PK
    string name
    string description
    datetime date
    string location
    string artist
    decimal price
    int totalTickets
    int availableTickets
    string imageUrl
    string categoryId FK
    datetime createdAt
    datetime updatedAt
  }

  BOOKING {
    string id PK
    string eventId FK
    string userId FK
    int quantity
    decimal unitPrice
    decimal totalPrice
    string status        // e.g., pending, confirmed, cancelled
    datetime createdAt
    datetime updatedAt
  }

### DBML
Table users {
  id          varchar [pk]
  name        varchar
  username    varchar [unique]
  email       varchar [unique]
  role        varchar
  status      varchar
  created_at  timestamp
  updated_at  timestamp
}

Table categories {
  id          varchar [pk]
  name        varchar [unique]
  created_at  timestamp
  updated_at  timestamp
}

Table events {
  id                 varchar [pk]
  name               varchar
  description        text
  date               timestamp
  location           varchar
  artist             varchar
  price              decimal(12,2)
  total_tickets      int
  available_tickets  int
  image_url          varchar
  category_id        varchar [ref: > categories.id]
  created_at         timestamp
  updated_at         timestamp
}

Table bookings {
  id          varchar [pk]
  event_id    varchar [ref: > events.id]
  user_id     varchar [ref: > users.id]
  quantity    int
  unit_price  decimal(12,2)
  total_price decimal(12,2)
  status      varchar
  created_at  timestamp
  updated_at  timestamp
}

Ref: categories.id < events.category_id
Ref: events.id < bookings.event_id
Ref: users.id < bookings.user_id


