# FITD — Backend

The FITD backend is a REST API built with Node.js, Express, TypeScript, and MongoDB. It provides authentication, product management, category management, orders, user management, password recovery, and dashboard functionality for the FITD e-commerce platform.

## Features

### Authentication

* User registration
* User login
* JWT authentication
* Password hashing
* Change password
* Forgot password
* Password reset through email
* Account activation/deactivation
* Role-based authorization

### User Management

* User profiles
* Username management
* Email management
* Phone number management
* Profile picture support
* User biography
* Wishlist management
* User roles

Supported roles:

```text
user
admin
owner
```

### Product Management

* Create products
* Update products
* Delete products
* Retrieve products
* Product filtering
* Product searching
* Product categories
* Product variants
* Stock management
* SKU support

Supported departments include:

```text
Clothing
Makeup
Skincare
Accessories
Perfume
```

### Category Management

* Create categories
* Update categories
* Delete categories
* Retrieve categories
* Category validation

### Orders

* Create orders
* Retrieve customer orders
* Retrieve all orders for administrators
* Retrieve individual orders
* Update order status
* Order pagination
* Order searching
* Product information in orders
* Customer information in orders

Supported order statuses:

```text
pending
shipped
delivered
cancelled
```

### Dashboard

The backend provides dashboard statistics including:

* Total products
* Total revenue
* Orders this week
* Pending orders
* Shipped orders
* Delivered orders
* Cancelled orders

Revenue information is restricted to the owner.

### Contact System

The backend supports customer contact messages and communication between customers and administrators.

## Technology Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* Zod
* Axios-compatible REST API
* Resend
* Multer
* Helmet
* Morgan

## Project Structure

```text
fited-backend/
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   ├── order.controller.ts
│   │   ├── user.controller.ts
│   │   ├── dashboard.controller.ts
│   │   └── contact.controller.ts
│   │
│   ├── models/
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── order.ts
│   │   └── contact.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── order.routes.ts
│   │   ├── user.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── contact.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── ...
│   │
│   ├── schemas/
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── order.ts
│   │   └── user.ts
│   │
│   ├── types/
│   │   └── models/
│   │
│   ├── utils/
│   │   ├── email.ts
│   │   ├── logger.ts
│   │   └── responseFormatter.ts
│   │
│   └── index.ts
│
├── scripts/
│   └── seed-owner.ts
│
├── dist/
│   └── ...
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=your_database_name

AUTH_SECRET=your_jwt_secret
TOKEN_EXPIRY=7d

FRONTEND_URL=http://localhost:3000

RESEND_API_KEY=your_resend_api_key
```

For production, `FRONTEND_URL` should point to the deployed frontend.

Example:

```env
FRONTEND_URL=https://your-frontend.vercel.app
```

Environment variables must never be committed to GitHub.

## Installation

Install dependencies:

```bash
npm install
```

## Development

Run the backend in development mode:

```bash
npm run dev
```

The API will normally run on:

```text
http://localhost:5000
```

## Build

Compile the TypeScript source files:

```bash
npm run build
```

The compiled JavaScript files are generated inside the `dist` directory.

## Production

Start the compiled application:

```bash
npm start
```

The production start command runs:

```text
node dist/src/index.js
```

## Database

FITD uses MongoDB as its database and MongoDB Atlas for cloud database hosting.

Mongoose is used to:

* Define schemas
* Validate data
* Create models
* Query MongoDB
* Manage relationships between documents

Main collections include:

```text
Users
Products
Categories
Orders
ContactMessages
```

## Authentication

Authentication uses JSON Web Tokens.

After successful login or registration, the server generates a JWT containing information such as:

```text
user ID
user role
```

Protected routes use authentication middleware to verify the token.

## Password Security

Passwords are hashed using bcryptjs before being stored in MongoDB.

The backend never stores plain-text passwords.

Password recovery uses:

1. A randomly generated reset token.
2. A SHA-256 hash of the token stored in the database.
3. An expiration time.
4. An email containing the reset link.
5. Token invalidation after a successful password reset.

## Validation

Zod is used to validate incoming requests.

Validation middleware is applied to:

* Request bodies
* URL parameters
* Query parameters

Invalid requests return an appropriate HTTP error response instead of being processed by the controller.

## Authorization

The backend uses role-based access control.

### User

Can:

* Manage their account
* Browse products
* Manage their cart
* Manage their wishlist
* Create orders
* View their orders
* Contact the store

### Admin

Can additionally:

* Manage products
* Manage categories
* Manage inventory
* Manage orders
* View customer information

### Owner

Has the highest level of access and can additionally:

* Manage users
* Access revenue statistics
* Manage administrative functionality

## API Structure

The API is organized into resource-based routes.

Example:

```text
/api/auth
/api/products
/api/categories
/api/orders
/api/users
/api/dashboard
/api/contact
```

Examples of authentication endpoints:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

Examples of order endpoints:

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/all
GET  /api/orders/:id
PUT  /api/orders/:id
```

## Error Handling

Controllers use centralized response formatting and Express error handling middleware.

Responses follow a consistent structure containing information such as:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Validation and server errors return appropriate HTTP status codes.

## Email

Resend is used for transactional emails.

The password recovery system sends users a password reset email containing a secure, temporary reset link.

## Security

The backend uses several security measures:

* Password hashing with bcryptjs
* JWT authentication
* Role-based authorization
* Zod input validation
* Helmet security headers
* Environment variables for secrets
* Password reset token hashing
* Password reset token expiration
* Consistent authentication checks

## Deployment

The backend can be deployed as a Node.js service.

The production build process is:

```bash
npm install --include=dev
npm run build
```

The production start command is:

```bash
npm start
```

The backend requires the production environment variables to be configured in the hosting platform.

The frontend URL must also be configured so password-reset links point to the deployed frontend.

## Deployment Architecture

```text
                ┌─────────────────────┐
                │      Customer       │
                │      Browser        │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   FITD Frontend     │
                │      Next.js        │
                │      Vercel         │
                └──────────┬──────────┘
                           │
                         HTTPS
                           │
                           ▼
                ┌─────────────────────┐
                │    FITD Backend     │
                │ Node.js + Express   │
                │      Render         │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   MongoDB Atlas     │
                │      Database       │
                └─────────────────────┘
```

## Project Goal

The backend provides the API and business logic required to operate FITD as a complete e-commerce platform.

It separates the frontend presentation layer from authentication, database operations, business logic, validation, and administrative functionality.
