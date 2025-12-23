# To-Do Assignment - Frontend Application

A modern, responsive To-Do Management Application built with Next.js, React 19, and Tailwind CSS. This frontend provides an intuitive interface for managing your daily tasks with features like real-time search, filtering, and pagination.

## Project Overview

This is the frontend component of a To-Do Management Application that demonstrates modern React development practices. The application provides a clean, user-friendly interface with:

- **Complete Todo Management**: Create, view, update, and delete todos
- **Smart Filtering**: Filter todos by status (all, active, completed)
- **Real-time Search**: Search todos by title or description
- **Pagination**: Efficiently handle large todo lists
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: User authentication via Clerk
- **Modern UI**: Beautiful animations and transitions

### Key Features

✅ Create new todos with title and description  
✅ Mark todos as completed or pending  
✅ Edit existing todos  
✅ Delete todos with confirmation  
✅ Filter by status (all, active, completed)  
✅ Search functionality across title and description  
✅ Pagination for better performance  
✅ User authentication and registration  
✅ Loading animations for better UX  
✅ Fully responsive design  

## Technologies Used

### Core Stack
- **[Next.js 16](https://nextjs.org/)** - React framework for production
- **[React 19](https://react.dev/)** - Modern React with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### Authentication
- **[@clerk/nextjs](https://clerk.com/docs/quickstarts/nextjs)** - Complete user authentication and management

### UI Components & Icons
- **[React Icons](https://react-icons.github.io/react-icons/)** - Popular icon library
- **clsx** & **tailwind-merge** - Conditional CSS class management

### Additional Libraries
- **jspdf** & **html2canvas** - PDF generation (for future features)
- **cloudinary** - Image management (for future features)
- **@google/genai** - AI integration (for future features)

### Development Tools
- **[@biomejs/biome](https://biomejs.dev/)** - Fast code formatter and linter
- **TypeScript** - Type checking
- **PostCSS** - CSS processing

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v22 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Backend API Running** - The server must be running on `http://localhost:3001`
- **Clerk Account** - [Sign up for free](https://clerk.com/)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd to-do-assignment-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Node
NODE_ENV=development

# Next
NEXT_PUBLIC_API_URL=http://localhost:3000

# Clerk
# DEV - KEYS
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aW50ZW5zZS1haXJlZGFsZS05MC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_Y0Huv8Moki9cbAiuTxQVqZAPvVyv0qEO9uNt6DS4hp

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/

```

**Important**: Make sure to use the **same Clerk application** for both frontend and backend!

### 4. Ensure Backend is Running

Before starting the frontend, make sure the backend API is running:

```bash
cd ../to-do-assignment-server
npm run dev
```

The backend should be running on `http://localhost:3001`

## How to Run the Frontend

### Development Mode

Run the application in development mode with hot-reloading:

```bash
npm run dev
```

The application will start on `http://localhost:3000`

Open your browser and navigate to:
- **Main App**: http://localhost:3000
- **Sign In**: http://localhost:3000/sign-in
- **Todos Page**: http://localhost:3000/todos (requires authentication)

### Production Mode

Build and run in production:

```bash
# Build the optimized production bundle
npm run build

# Start the production server
npm start
```

Or use the combined command:

```bash
npm run bns
```

## Features Guide

### Authentication Flow

1. Users must sign in or create an account via Clerk
2. After authentication, users are automatically registered in the backend
3. Authenticated users are redirected to the Home page

### API URL Configuration

If your backend runs on a different port or domain, update the `.env` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:YOUR_PORT
```

Or for production:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Troubleshooting

### Backend Connection Issues

If you see "Failed to fetch todos" errors:

1. Ensure the backend is running on `http://localhost:3001`
2. Check that `NEXT_PUBLIC_API_URL` in `.env` is correct
3. Verify CORS is enabled in the backend

### Clerk Authentication Errors

If authentication doesn't work:

1. Verify your Clerk keys are correct in `.env`
2. Ensure you're using the **same Clerk application** in both frontend and backend
3. Check that Clerk URLs in `.env` are correct
4. Clear browser cache and cookies

## Browser Support

This application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

---

**Note**: This is a demonstration project for the To-Do Assignment. Make sure the backend API is running before starting the frontend application.

## Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your Clerk keys and API URL
cp .env.example .env  # Then edit with your values

# 3. Start the development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

Remember: The backend must be running on `http://localhost:3001` for the application to work!
