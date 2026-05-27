# LePearl NET English Exam Preparation Website

This project is a modern CMS-based website for a NET English exam coaching centre, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Decap CMS (Git-based CMS admin)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## CMS editing

- CMS admin path: `/admin`
- CMS config: `public/admin/config.yml`
- Site content file: `content/site.json`

Update the homepage sections from the CMS UI or by editing `content/site.json` directly.

## Build checks

```bash
npm run lint
npm run build
```

## Student registration email setup

The student registration flow is available at `/student-registration` and submits through `/api/student-registration`.

Configure one of these email options in your environment before using the form:

```bash
GMAIL_USER=your-gmail-address
GMAIL_APP_PASSWORD=your-gmail-app-password
REGISTRATION_EMAIL_FROM=optional-from-address
```

Or use a generic SMTP server:

```bash
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
REGISTRATION_EMAIL_FROM=optional-from-address
```

Registration submissions are sent to `lepearledu@gmail.com`.

## Redesign flow updates (May 2026)

The following client-requested flow changes are now available:

- All courses hub: `/all-courses`
- Paid enrolment + free registration split: `/student-registration`
  - Free mode deep-link: `/student-registration?mode=free`
- Faculty registration form: `/faculty-registration`
- Faculty registration API: `/api/faculty-registration`

### Paid enrolment flow

- Includes username, case-sensitive password, auto-generated registration number.
- Enforces mandatory consent checkboxes for Terms, Privacy and Refund.
- Supports Pearlian eligibility flag and optional books add-on in payment summary.

### Free registration flow

- Lightweight 5-field form for PYQ/demo access.
- Existing PYQ registration gates now route to free mode.

### Course page UI changes

- Sticky left quick-link panel is available across course pages.
- Demo Class CTA routes to free registration mode.
- Enroll CTA on course pages keeps users on-page and scrolls to enrollment.

## Layout coverage

The homepage follows the provided sample layout order:

1. Header/menu
2. Course slider banners
3. PYQ blocks
4. Video testimonials
5. Mission + qualifications + photo
6. Faculty members
7. Why choose section
8. Team details
9. Books slider
10. Mock test slider
11. Footer with FAQs + calendar block
