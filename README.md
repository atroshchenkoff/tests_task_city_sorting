# City Sorting Application

This project is a full-stack application for managing and sorting city information. It consists of a React frontend and a Node.js backend.

## Project Structure

The project is divided into two main parts:
- [frontend/]: React application built with TypeScript and Vite
- [backend/]: Node.js server using Express and MongoDB

## Prerequisites

- Node.js 20.x
- MongoDB

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory and add your MongoDB connection string:

```bash
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

4. Build the backend:

```bash
npm run build
```

5. (optional) Seed the database with initial city data:

```bash
npm run seed-cities
```

6. Start the backend server:

```bash
npm start
```

For development with hot-reloading:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory and add your API URL string:

```bash
VITE_API_BASE_URL=https://some-api.com/api
```

4. Start the development server:

```bash
npm run dev
```

## Features

- Display and manage city information
- Editable city data
- Sorting functionality

## Technologies Used

- Frontend: React, TypeScript, Vite, Ant Design, Xstate
- Backend: Node.js, Express, MongoDB, Mongoose
- Development: ESLint, Nodemon

## Deployment

The backend is currently deployed using Render, a cloud application hosting service.
