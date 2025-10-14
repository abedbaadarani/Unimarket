# Multi-Step Registration with Email Verification

## Overview
The registration process has been updated to a 3-step flow with email verification:

### Step 1: Personal Information
- First Name
- Last Name
- Phone Number
- Date of Birth (with calendar picker)
- Address

### Step 2: Account Credentials
- Email Address
- Password
- Confirm Password

### Step 3: Email Verification
- User receives a 6-digit verification code via email
- User enters the code to verify their email
- Account is created after successful verification

## Features Implemented

### Frontend (React)
✅ Multi-step form with progress indicator
✅ Date picker for Date of Birth
✅ Form validation for each step
✅ Back button to navigate between steps
✅ Password visibility toggle
✅ Email verification code input
✅ Resend verification code option
✅ Loading states for all async operations
✅ Error and success message displays

### Backend (Node.js/Express)
✅ Email sending functionality using Nodemailer
✅ Verification code generation
✅ Beautiful HTML email template
✅ Updated User model with new fields (dateOfBirth, address)
✅ Updated registration endpoint to accept new fields

### Database (Prisma/PostgreSQL)
✅ Added `dateOfBirth` (DateTime?) field to User model
✅ Added `address` (String?) field to User model
✅ Database schema updated successfully

## Email Configuration

### Setting Up Email (Important!)

To enable email sending, you need to configure environment variables in `Unimarket/api/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### For Gmail:
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password
4. Use this app password in your `.env` file

### For Other Email Providers:
Update the transporter configuration in `Unimarket/api/routes/auth.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Testing Without Email

If you want to test the registration without setting up email, you can:

1. **Check the console**: The verification code is logged in the frontend console (for development)
2. **Modify the code**: In `Register.jsx`, the `sentCode` state contains the generated code

## API Endpoints

### Send Verification Email
```
POST /api/auth/send-verification
Body: {
  "email": "user@example.com",
  "code": "123456",
  "firstName": "John"
}
```

### Register User
```
POST /api/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St, City, Country"
}
```

## User Flow

1. **Step 1**: User fills in personal information → Clicks "Next"
2. **Step 2**: User enters email and password → Clicks "Next"
   - Backend sends verification email with 6-digit code
3. **Step 3**: User enters verification code → Clicks "Verify & Create Account"
   - If code matches, account is created and user is logged in
   - If code doesn't match, error is shown
   - User can click "Resend" to get a new code

## Files Modified

### Frontend
- `Unimarket/client/src/pages/Register.jsx` - Complete rewrite with multi-step form
- `Unimarket/client/src/context/AuthContext.jsx` - Updated register function to accept new parameters

### Backend
- `Unimarket/api/routes/auth.js` - Added email verification endpoint, updated register endpoint
- `Unimarket/api/prisma/schema.prisma` - Added dateOfBirth and address fields to User model
- `Unimarket/api/package.json` - Added nodemailer dependency

## Important Notes

1. **Email Provider**: Configure your email provider credentials in the `.env` file
2. **Date Format**: Date of Birth is stored as a DateTime in the database
3. **Optional Fields**: dateOfBirth and address are optional (can be null)
4. **Security**: Verification codes are generated client-side for simplicity. For production, generate and store codes server-side with expiration times.

## Future Enhancements

- [ ] Store verification codes in database with expiration
- [ ] Add rate limiting for verification email sending
- [ ] Add SMS verification as an alternative
- [ ] Add password strength indicator
- [ ] Add address autocomplete
- [ ] Implement resend cooldown timer

