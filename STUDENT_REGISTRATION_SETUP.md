# Student Registration Setup Guide

## Overview
The student registration form (`/student-registration`) now stores submissions to Supabase as the **primary method**, with optional email notifications as a secondary feature.

## Key Features
- ✅ **Supabase storage** — All registrations are persisted automatically
- ✅ **Email notifications** (optional) — If configured, admissions team gets notified  
- ✅ **Graceful degradation** — Registration succeeds even if email fails or is unconfigured
- ✅ **Course selection** — 13 courses available (NET, MPPSC, UPHESC, interviews, etc.)
- ✅ **Form validation** — Name, qualification, course, phone, email

## Required Setup

### 1. Run the Database Migration

Once you have Supabase credentials configured, run the migration:

```bash
# Using Supabase CLI (if installed)
supabase db push

# Or manually: Copy the SQL from supabase/migrations/20260426_create_student_registrations.sql
# and run it in the Supabase SQL Editor
```

This creates the `student_registrations` table with:
- `id` (UUID, primary key)
- `full_name` (text)
- `qualification` (text)
- `course` (text)
- `phone` (text)
- `email` (text)
- `created_at` (timestamp)
- `status` (defaults to 'pending')

### 2. (Optional) Configure Email Notifications

To receive email notifications when students register, add one of these to your `.env.local`:

**Option A: Gmail (Recommended)**
```bash
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
REGISTRATION_EMAIL_FROM=your-email@lepearl.com
```

Get your Gmail app password:
1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password

**Option B: Generic SMTP**
```bash
SMTP_HOST=mail.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
REGISTRATION_EMAIL_FROM=noreply@lepearl.com
```

## How It Works

1. Student fills form at `/student-registration`
2. Form validates all fields (name, qualification, course, phone, email)
3. **PRIMARY**: Data is stored in Supabase `student_registrations` table
   - If this fails → error displayed to user
   - If this succeeds → registration is complete
4. **SECONDARY**: Email is sent to `lepearledu@gmail.com` (if configured)
   - If email fails → logged as warning, but user still sees success
   - If email succeeds → admissions team notified

## Accessing Registrations

### In Supabase Dashboard
1. Go to https://supabase.com → your project
2. Tables → `student_registrations`
3. View, filter, and export all submissions

### Viewing Emails
When email is configured, each submission triggers an email to `lepearledu@gmail.com` with:
- Student name, qualification, selected course
- Contact number and email
- Submission timestamp
- Reply-to set to student's email for easy follow-up

## Troubleshooting

**Issue**: "Registration could not be stored. Please try again."
- Check: Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Check: Migration has been run (`student_registrations` table exists)
- Check: RLS policies allow public insert

**Issue**: Form submits but student doesn't see success
- Check browser console for fetch errors
- Check server logs for exceptions

**Issue**: Email not received
- Email is optional — registration still succeeds
- If desired, configure GMAIL_USER and GMAIL_APP_PASSWORD
- Check server logs for email send errors (they're logged as warnings)

## Form Link

Add this link to your login portal or anywhere you want to drive registrations:

```
https://your-domain.com/student-registration
```

Current link on login-portal: "New student? ... register here"
