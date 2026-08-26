# ServiceFinder — Local Service Finder Web App

## Project Overview
A full-stack web application where service providers can register and list their services,
and customers can search, discover, and contact them through an interactive map interface.

The platform solves a real problem in Cambodia — finding reliable local service providers
(plumbers, AC technicians, cleaners, tutors, beauty specialists, etc.) is currently done
through WhatsApp or Facebook groups, which is slow and unorganized.

---

## Tech Stack
- **Frontend:** Vue.js, HTML, CSS, Leaflet.js
- **Backend:** Node.js + Express.js
- **Database:** Supabase (PostgreSQL + Storage + Realtime)
- **Version Control:** Git & GitHub

---

## User System — One Account Does Everything
There is NO role selection at signup. Everyone signs up the same way.
- By default everyone is a **customer**
- Any user can become a **provider** by going to Settings → Provider Account → Set up my listing
- Any user can be both a customer AND a provider at the same time
- Admin is just a regular user with `is_admin = true` set manually in Supabase

---

## Two Types of Providers
1. **Shop-based** — has a physical shop, shown as a mint pin on the map. Customers can visit, but provider may also travel to customers.
2. **Freelancer** — no fixed shop, sets a service area. Shown as a slate gray pin. Can negotiate to go further than their area.

---

## Features (13 total)
1. **User Authentication** — register and login with JWT, no role selection needed
2. **Provider Setup** — 3-step form in Settings to create a service listing
3. **Interactive Map** — all providers shown as Leaflet.js pins with clickable popups
4. **Nearby Me** — Geolocation API button to show providers close to the user
5. **Search & Filter** — filter by category, keyword, distance, Open Now
6. **Service Detail Page** — full info, contact options (Call / WhatsApp / Chat)
7. **Review & Rating System** — customers rate and review providers (1–5 stars)
8. **Smart Ranking** — search results sorted by: score = (rating × 0.6) + (1/distance × 0.4)
9. **Verified Badge** — provider submits document → admin approves → ✓ badge appears
10. **Service Request** — customers post a need, providers browse and respond
11. **Favorites / Bookmark** — save preferred providers to a personal list
12. **Working Hours & Open Now** — auto shows Open Now or Closed based on real time
13. **Real-time Chat** — inbox + messenger powered by Supabase Realtime
14. **Admin Panel** — approve listings, manage verifications, users, requests, reports
15. **Report System** — customers can report fake or inappropriate listings

---

## Pages (18 total)
### Customer / Provider Pages
1. Home — map + sidebar with categories and nearby services
2. Service detail page
3. Search results — split list + map
4. Login
5. Register
6. Become a Provider Step 1 — basic info
7. Become a Provider Step 2 — location & working hours
8. Become a Provider Step 3 — review & submit
9. Service Requests board
10. Chat / Inbox (Facebook Messenger style)
11. My Profile
12. My Favorites
13. Settings (includes Provider Account section)

### Admin Pages
14. Admin Dashboard
15. Manage Listings
16. Manage Verification Requests
17. Manage Service Requests
18. Manage Users

---

## Database (11 tables)
See DATABASE_SCHEMA.md for full details. SQL script: `supabase_schema_final.sql`

| Table | Purpose |
|---|---|
| `users` | Everyone — customers, providers, admins |
| `services` | Provider listings |
| `working_hours` | 7 rows per service (Mon–Sun) |
| `reviews` | Customer ratings and comments |
| `favorites` | Saved/bookmarked services |
| `service_requests` | Customer requests posted on the board |
| `request_responses` | Provider replies to requests |
| `conversations` | Chat threads between two users |
| `messages` | Individual chat messages (Realtime) |
| `verification_requests` | Provider documents for admin review |
| `reports` | Customer reports on bad listings |

### Key Rules
- `services.is_active` defaults to `false` — admin must approve before listing appears on map
- `service_requests` older than 7 days are auto-deleted every midnight (pg_cron)
- `messages` table has Realtime enabled for live chat
- Passwords are always hashed with bcrypt — never stored as plain text
- Admin is just a regular user with `is_admin = true` set manually in Supabase

---

## Supabase Storage Buckets
- `avatars` — user profile photos (Public)
- `service-photos` — service listing photos (Public)
- `documents` — verification documents (Private, admin only)

---

## Project Structure
```
/frontend              → Vue.js application
  /src
    /components        → Reusable UI components
    /views             → Page-level components
    /router            → Vue Router (page navigation)
    /store             → State management (user session, etc.)
    /assets            → Images, icons
/backend               → Node.js + Express.js API
  /routes              → API route definitions
  /controllers         → Business logic
  /middleware          → JWT auth middleware
/database              → SQL scripts and schema
README.md              → Project overview (this file)
PLAN.md                → Week by week development plan
PROGRESS.md            → Current progress tracker
DATABASE_SCHEMA.md     → Full database schema with all 11 tables
```

---

## Internship Info
- **Student:** Kuoch Chyhang
- **Student ID:** E20220574
- **Supervisor:** Dr. Kuy Movsun
- **Program:** Year 4 Internship Program — Internet Technology (IT)
- **Institution:** Institute of Technology of Cambodia (ITC)
- **Duration:** 8 Weeks (July 17 – September 10, 2026)

---

## ITC Internship Schedule
| Deadline | Milestone |
|---|---|
| Before Jul 17 | Submit project proposal ✅ |
| Before Jul 24 | 1st supervisor meeting — requirements & planning |
| Before Aug 14 | 2nd supervisor meeting — 30% progress |
| Before Aug 28 | 3rd supervisor meeting — 60% progress |
| Before Sep 11 | 4th supervisor meeting — 80% progress |
| Before Sep 30 | 5th supervisor meeting — 100% + slides draft |
| Oct 16 | Submit final thesis |
| Oct 26 | Submit final presentation slides |
| Before Nov 5 | Rehearsal |
| Nov 9 | Defense 🎓 |

---

## Design System

### Color Palette
| Role | Color | Where to use |
|---|---|---|
| **Primary Mint** | `#2EC4B6` | Navbar, primary buttons, shop pins, active states, prices |
| **Background** | `#F9FFFE` | Page background, input fields |
| **White** | `#FFFFFF` | Cards, secondary buttons, sidebar |
| **Red** | `#E74C3C` | Hearts, Closed badge, delete actions, reports |
| **Text Dark** | `#22223B` | Headings, card titles, body text |
| **Text Gray** | `#888888` | Subtitles, labels, metadata |
| **Border** | `#B2EDE8` | Card borders, input borders, dividers |
| **Open Badge** | `#D9F7F4` bg + `#1A8A83` text | "Open now" |
| **Closed Badge** | `#FFE8E8` bg + `#E74C3C` text | "Closed" |
| **Verified Badge** | `#EEF0FF` bg + `#4B55D1` text | "✓ Verified" |
| **Shop Pin** | `#2EC4B6` mint | Shop-based provider map pins |
| **Freelancer Pin** | `#78909C` slate gray | Freelancer map pins |
| **Star/Heart** | `#E74C3C` red | Review hearts and ratings |
| **Gold** | `#F39C12` | Star rating icons |

### Font Sizes
- **Body text / labels / metadata:** 20px
- **Section titles / subheadings:** 30px
- **Page headings / names:** 32px
- **Icons / cover images:** 40px

### Typography
- Font: **Arial** (system font, no import needed)
- Headings: bold, `#22223B`
- Body: regular, `#22223B`
- Subtext: regular, `#888888`

### Layout
- **Screen size:** 1728 × 1017px
- **Navbar:** mint background, 72px tall, white text, white dividers between links, hamburger icon for settings
- **Home page:** left sidebar (400px) + map fills the rest
- **Search results:** left list (420px) + map fills the rest
- **Detail page:** left panel (460px) + map fills the rest
- **Cards:** white background, mint border, 12px rounded corners
- **Inputs:** white background, mint border, pill shape (border-radius: 24px)

### Buttons
- **Primary** — mint bg (`#2EC4B6`), white text
- **Secondary** — white bg, mint text, mint border
- **Danger** — red bg (`#E74C3C`), white text

### Reference Design
Full 18-page HTML mockup: `servicefinder_full_design.html` — open in Chrome

---

## Important Notes for Claude Code
- Always read PROGRESS.md first to know what is done
- Always read PLAN.md to know what this week's tasks are
- Always read DATABASE_SCHEMA.md before touching any database work
- The student is learning while building — **explain concepts before writing code**
- Keep code **simple and well-commented** so the student understands it
- After finishing each task, **suggest what to do next**
- Never store plain text passwords — always use bcrypt
- Use Supabase Realtime on the `messages` table for live chat
- Admin routes must check `is_admin = true` before allowing access
- `services.is_active` defaults to false — admin must approve before it shows on map
