# Real Estate Tokenization Platform

The Real Estate Tokenization Platform is a full-stack application that enables investment and management of tokenized real estate properties. The backend is built with Express.js and PostgreSQL, utilizing Prisma ORM for database management. The frontend is created using React, TypeScript, and Tailwind CSS.

## Project Overview

This platform allows users to:
- Browse available real estate properties
- Invest in properties through tokenized shares
- Track investment performance and portfolio over time
- Access an admin dashboard for user and property management (admin only)

The system supports both user and admin roles with role-based access control.

---

## Features

### User Roles and Permissions
- **Admin**: Manages properties, users, and tracks investments.
- **User**: Views properties, makes investments, and monitors investment performance.

### Core Functionalities
1. **Authentication & Authorization**: Secure registration, login, and role-based access.
2. **Property Management**: Admin capabilities to create, update, delete, and manage property listings.
3. **Investment Management**: Users can manage investments and track performance over time.
4. **Transaction Management**: Maintains records of investments, deposits, and withdrawals.

> **Note:** Some features are still in development.

### Backend
- **Authentication & Authorization**: Secure login and role-based access control.
- **Investment Management**: CRUD functionality for user investments.
- **Property Management**: Admin-only functionality for property listings.
- **Transaction Tracking**: Records transactions for transparency.
- **Audit Logging**: Logs for property creation, investment, and deletion actions (for future updates).

### Frontend
- **Responsive UI**: Built with React and Tailwind CSS for an interactive experience.
- **Dashboards**: Separate views for users and admins.
- **User Profile**: Displays user information and investment history.
- **Property Details & ROI**: Shows potential ROI and past performance.

---

## Tech Stack

### Backend
- **Node.js** & **Express.js**: API development and routing.
- **PostgreSQL**: Relational database for user, property, and transaction data.
- **Prisma**: ORM for database operations.
- **JWT** & **bcrypt**: For authentication and password hashing.
- **cookie-parser**: For handling session cookies.

### Frontend
- **React** with **TypeScript**: Component-based architecture with type safety.
- **Tailwind CSS**: For responsive and modern UI styling.
- **shadcn/ui**

---

## API Endpoints

### Auth Routes
- `POST /api/v1/register`: Register a new user
- `POST /api/v1/login`: Log in a user and issue a JWT token

### Property Routes (Admin Only)
- `POST /api/v1/properties`: Create a new property
- `GET /api/v1/properties`: View all properties
- `PATCH /api/v1/properties/:id`: Update property details
- `DELETE /api/v1/properties/:id`: Delete a property

### Investment Routes
- `POST /api/v1/investments`: Create a new investment
- `GET /api/v1/investments/user`: View logged-in user's investments
- `GET /api/v1/investments`: Admin-only route to view all investments

---

## Getting Started

### Prerequisites
- **Node.js** (v14 or later)
- **PostgreSQL** (latest version recommended)
- **pnpm** for package management

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/LazarusJunior/real-estate-tokenization-platform.git
    cd real-estate-tokenization-platform
    ```

2. **Install dependencies**
    ```bash
    pnpm install
    ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory with the following (fill in your actual values):
      ```env
      DATABASE_URL=your_postgresql_db_url
      JWT_SECRET=your_jwt_secret
      ```

4. **Initialize Prisma**
    ```bash
    pnpm prisma migrate dev
    ```

5. **Run the server**
    ```bash
    pnpm start
    ```

---
