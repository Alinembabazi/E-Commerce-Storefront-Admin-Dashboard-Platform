# E-Commerce Storefront

A React-based e-commerce application with admin dashboard, built with React 19, TypeScript, and Vite.

## Features

- **User Authentication**: Login/Register with JWT token handling
- **Product Catalog**: Browse products with search and filtering
- **Shopping Cart**: Add/remove items with persistent state
- **Checkout Process**: Complete purchase flow
- **User Profile**: View and manage account
- **Admin Dashboard**: Manage products (CRUD operations)

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context (Auth, Cart)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: Axios + React Query
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api-url.com
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React Context (Auth, Cart)
├── hooks/         # Custom hooks
├── pages/         # Route pages
├── routes/        # Protected route components
├── services/      # API and utilities
├── App.tsx        # Main application
└── main.tsx      # Entry point
```

## API

The app connects to a backend API. Configure the base URL in `.env`. The API service includes automatic path fallbacks for different endpoint patterns.

## License

MIT
