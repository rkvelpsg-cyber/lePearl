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

## UPHESC mock-only enrolment

The UPHESC page includes a separate **Mock - Only** payment card alongside the
unchanged full-course and instalment cards. This option enrols students in
`UPHESC-Mock Only`, a dedicated course/batch assigned to Dr Prem Shankar Pandey.
The configured one-time fee is **Rs. 1**, as requested; it is defined in
`src/lib/mockOnlyBatch.ts`. There are no instalments, discounts, or recorded-class/
study-material access add-ons for this purchase.

**Before enabling this option in production:**

1. Apply `supabase/migrations/20261003_add_uphesc_mock_only_batch.sql` after all
   earlier migrations. It requires exactly one active faculty profile for
   Dr Prem Shankar Pandey. It creates only the new course/batch and its access
   guards; it does not move students or alter existing batches.
2. Ensure Razorpay keys, automatic payment capture, and the existing registration
   email provider are configured. This option always uses Razorpay, even if
   other courses use the site's manual/UPI registration mode. Checkout is blocked
   until the new batch and active default faculty exist.
3. Validate a payment using Razorpay **test-mode** keys first. Successful
   registration reuses the existing student-account provisioning, admin/student
   credential emails, first-login password reset, and panel listings.

Students in this batch can use Dashboard, Mock Tests, and Fees & Payments only.
Other sidebar sections and their dashboard shortcuts are disabled/hidden.
Faculty can assign MCQ/descriptive mock tests and evaluate/report results through
the existing Mock Tests and Evaluations tools. When the mock-only course is
selected, non-test sections are disabled; when another course (or All Courses)
is selected, the existing teaching tools remain available for full-course batches.
Mock-only batches are excluded from class, lecture, material, task, and general
course-progress assignments, including database-level checks.

Run the focused regression suite with:

```bash
npm run test:mock-only
```

The suite uses mocked payment/email/Supabase services and an in-memory PostgreSQL
database (PGlite); it does not charge cards, send emails, or access production data.
The migration is transactional and repeatable. Roll back the application release
to hide new purchases if necessary; do not delete a batch that already has paid
enrollments, payments, or test submissions. For a future full rollback, review
those records before removing the migration's `uphesc_mock_only_*` policies,
helper functions, and scoped payment index.

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

## Faculty registration notification setup

The faculty registration flow is available at `/faculty-registration` and submits through `/api/faculty-registration`.

The admin notification recipient is `admin@lepearleducation.com`, but that is not the SMTP provider login. To actually send confirmations, configure one email provider and one WhatsApp provider in `.env.local`:

```bash
# Email provider options
GMAIL_USER=your-gmail-address
GMAIL_APP_PASSWORD=your-gmail-app-password
REGISTRATION_EMAIL_FROM=optional-from-address

# Or use a generic SMTP server
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
REGISTRATION_EMAIL_FROM=optional-from-address

# WhatsApp provider options
WHATSAPP_WEBHOOK_URL=your-whatsapp-webhook-url
# Or use Twilio WhatsApp
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Local webhook testing (optional)

For local end-to-end testing without an external provider, this project includes a test receiver at `/api/whatsapp-webhook`.

Set these in `.env.local`:

```bash
WHATSAPP_WEBHOOK_URL=http://localhost:3000/api/whatsapp-webhook
WHATSAPP_WEBHOOK_AUTH_TOKEN=your-local-webhook-token
```

Then restart the dev server and submit the faculty registration form. If successful, the server log prints a `[whatsapp-webhook] payload received` entry.

If these variables are not set, faculty registration will still save successfully, but email and WhatsApp confirmations will not be delivered.

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
