# Quick Setup Guide for UniMarket

Follow these steps to get UniMarket up and running:

## Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

## Step-by-Step Setup

### 1. Database Setup
Make sure PostgreSQL is installed and running. Create a database (or let Prisma create it):

```sql
CREATE DATABASE unimarket;
```

### 2. API Setup (Backend)

```bash
# Navigate to API directory
cd api

# Install dependencies
npm install

# Copy environment file and configure
cp env.example .env
# Edit .env with your PostgreSQL credentials

# Generate Prisma client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev --name init

# Start API server (runs on port 5000)
npm run dev
```

**Keep this terminal running!**

### 3. Client Setup (Frontend)

Open a **new terminal** window:

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Copy environment file
cp env.example .env
# Default settings should work if API is on localhost:5000

# Start development server (runs on port 3000)
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000

## Quick Test Flow

1. **Register** a new account
2. **Login** with your credentials
3. **Post an Item** with photos
4. **Browse** items on the home page
5. **Favorite** an item
6. **View** your listings and favorites

## Common Issues

### Database Connection Error
- Check PostgreSQL is running: `pg_isready` (if installed) or check services
- Verify DATABASE_URL in `api/.env` has correct credentials
- Ensure database exists

### Port Already in Use
- **API (5000):** Change PORT in `api/.env`
- **Client (3000):** Change port in `client/vite.config.js`

### Module Not Found
- Make sure you ran `npm install` in both `api/` and `client/` directories

### Prisma Errors
- Run `npx prisma generate` in the `api/` directory
- Run `npx prisma migrate dev` if schema changed

## Default Configuration

### API (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/unimarket?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
```

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Next Steps

Once everything is running:
- Register your first account
- Post some test items
- Try searching and filtering
- Test the favorite functionality
- Upload some images

Enjoy using UniMarket! 🎓🛒

