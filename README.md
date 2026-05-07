# Advance School Management App

Advance School Management App is a Next.js 16 application for managing school workflows with role-aware access, Supabase authentication, and separate student and teacher experiences.

## What It Does

- Handles sign in and sign up with Supabase.
- Redirects authenticated users to a role-based dashboard.
- Supports profile setup for new users.
- Provides grade and weekly schedule pages for both students and teachers.
- Uses shared UI components for navigation, headers, tables, and sign out flows.

## Core Routes

- `/` landing page with login prompt and authenticated redirect.
- `/login` sign in and sign up form.
- `/profile-setup` profile completion flow.
- `/dashboard` role-based dashboard entry point.
- `/grades` grade management area.
- `/weekly-schedule` schedule overview.
- `/auth/callback` Supabase auth callback handler.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Supabase auth and data access
- Tailwind CSS 4
- Lucide React icons
- React Hot Toast

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create a `.env.local` file with your Supabase credentials.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server.

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run start` runs the production server.
- `npm run lint` runs ESLint.

## Project Structure

- `app/` application routes, pages, and server actions.
- `components/` shared layout, navigation, and table components.
- `lib/` schedule and table configuration helpers.
- `supabase/` browser and server client setup.
- `types/` generated database types.
- `public/` static assets.

## Supabase Notes

The app expects Supabase-backed authentication and profile data. The current code references tables such as `users`, `roles`, `schools`, and `academic_years`.

## Workflow

- New users sign in or sign up on the login page.
- Authenticated users are routed to the dashboard.
- Users without a completed profile are sent to profile setup.
- Dashboard content changes based on the stored role.

## Deployment

This project can be deployed like any standard Next.js application. Make sure the production environment includes the Supabase environment variables above.
