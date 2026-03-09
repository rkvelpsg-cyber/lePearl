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
