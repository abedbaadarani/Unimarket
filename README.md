# UniMarket

A full-stack marketplace application for university students to buy and sell items. Built with React, Node.js, Express, Prisma, and PostgreSQL.

## Project Structure

```
unimarket/
├── api/          # Backend - Node.js + Express + Prisma
└── client/       # Frontend - React + Vite + Tailwind
```

## Features

- **Authentication**: Register, login, JWT-based auth
- **Item Management**: Post, edit, delete items with photos
- **Categories**: Filter items by category
- **Search**: Search items by title/description
- **Favorites**: Favorite/unfavorite items
- **Photo Upload**: Upload images or add photo URLs
- **User Listings**: View your posted items
- **User Favorites**: View your favorited items

## Tech Stack

### Backend (API)
- Node.js & Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend (Client)
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API for state management

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Navigate to Project

```bash
cd unimarket
```

**Note:** Environment example files are named `env.example` (copy them to `.env` as shown below).

### 2. Setup Backend (API)

```bash
cd api

# Install dependencies
npm install

# Create .env file
cp env.example .env
```

Edit `api/.env` and configure your database:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/unimarket?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
```

**Important:** Replace `postgres:password` with your actual PostgreSQL username and password.

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start the API server
npm run dev
```

The API should now be running at `http://localhost:5000`

### 3. Setup Frontend (Client)

Open a new terminal window:

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp env.example .env
```

Edit `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
# Start the development server
npm run dev
```

The client should now be running at `http://localhost:3000`

## Usage

1. **Register** a new account at `http://localhost:3000/register`
2. **Login** with your credentials
3. **Browse items** on the home page
4. **Post an item** using the "Post Item" button
5. **Add photos** by uploading files or pasting URLs
6. **Search and filter** items by category
7. **Favorite items** by clicking the favorite button
8. **View your listings** in "My Listings"
9. **Edit or delete** your items
10. **View favorites** in "Favorites"

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### Items
- `GET /items` - Get all items (with optional filters: search, category, sellerId)
- `GET /items/:id` - Get single item
- `POST /items` - Create item (protected)
- `PUT /items/:id` - Update item (protected)
- `DELETE /items/:id` - Delete item (protected)
- `POST /items/:id/photos` - Add photo to item (protected)
- `POST /items/:id/favorite` - Favorite item (protected)
- `DELETE /items/:id/favorite` - Unfavorite item (protected)
- `GET /items/me/listings` - Get current user's listings (protected)
- `GET /items/me/favorites` - Get current user's favorites (protected)

### Upload
- `POST /upload` - Upload image file (protected)

## Database Schema

### User
- id, email (unique), password (hashed), name, createdAt, updatedAt

### Item
- id, title, description, price, category, sellerId, createdAt, updatedAt

### Photo
- id, url, itemId, createdAt

### Favorite
- userId, itemId (composite primary key), createdAt

## Development

### API Scripts
```bash
npm run dev          # Start with nodemon
npm start            # Start production
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
npm run prisma:reset      # Reset database
```

### Client Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Environment Variables

### API (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/unimarket
JWT_SECRET=your-secret-key
PORT=5000
```

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify credentials in `DATABASE_URL`
- Check if database `unimarket` exists (or let Prisma create it)

### Port Already in Use
- Change `PORT` in `api/.env`
- Change `server.port` in `client/vite.config.js`

### CORS Errors
- Ensure API is running on the correct port
- Check `VITE_API_BASE_URL` in client `.env`

## License

MIT

## Author

Built as a university marketplace platform.

