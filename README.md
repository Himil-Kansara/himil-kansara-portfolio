# Himil Kansara — Portfolio

A production-ready, accessible portfolio for Himil Kansara, Senior Full-Stack Developer. It combines a premium editorial interface with reusable, centrally configured content and a secure server contact form.

## Technology stack

- Next.js App Router, React, TypeScript (strict)
- Tailwind CSS and custom design tokens
- Framer Motion and Lucide icons
- React Hook Form with Zod validation
- Resend-compatible server-side contact endpoint
- ESLint and Prettier
- Vinext/Vite deployment output for OpenAI Sites and Cloudflare Workers

## Local setup

Use Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by the development server.

```bash
npm run lint
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
RESEND_API_KEY=re_replace_me
CONTACT_TO_EMAIL=himilkansara007@gmail.com
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>
```

The contact variables are server-only. Never add `NEXT_PUBLIC_` to secret values.

## Editing content

- `data/profile.ts`: identity, contact details, social links, résumé, availability, statistics
- `data/experience.ts`: work timeline
- `data/skills.ts`: grouped skills and proficiency labels
- `data/projects.ts`: project case studies
- `data/testimonials.ts`: verified recommendations
- `types/portfolio.ts`: reusable interfaces

Search for `[ADD`, `[REPLACE`, and `[SAMPLE]` to find every placeholder.

### Add experience

Add an object to `data/experience.ts`:

```ts
{ company: "", role: "", duration: "", location: "", summary: "", achievements: [], technologies: [] }
```

### Add projects

Add an object to `data/projects.ts` using the `Project` interface. Give it a unique `slug`, real links when available, and remove `placeholder: true` once verified.

### Replace images and résumé

Place optimized WebP, AVIF, or PNG files in `public/images/` and update the `image` value in the project data. The social preview is `public/og.png`. To serve a local résumé, place it at `public/resume/himil-kansara-resume.pdf` and change `resumeUrl` in `data/profile.ts`.

## Contact form

The form submits to `app/api/contact/route.ts`. Create a Resend API key, verify your sender, and configure the environment variables. It includes client validation, a honeypot, loading/success/error states, and direct-email fallback. Add edge rate limiting if automated traffic becomes significant.

## Deploy on Vercel

1. Push the project to a Git repository.
2. Import it into Vercel.
3. Add the environment variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
5. Deploy with the default Next.js settings.

## Troubleshooting

- Use Node.js 22.13+ for engine compatibility.
- If delivery fails, verify all contact variables and the Resend sender/domain.
- Update `NEXT_PUBLIC_SITE_URL` if canonical metadata is wrong.
- Update the GitHub profile URL in `data/profile.ts` if the account changes.
