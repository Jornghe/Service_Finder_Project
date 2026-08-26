# Development Plan — ServiceFinder

## Week 1 — Research & Planning
**Goal:** Understand the project fully and set everything up before writing any code

Completed ✅:
- Supabase project created
- All 11 tables created and verified
- Storage buckets set up (avatars, service-photos, documents)
- Realtime enabled on messages table

Remaining:
- Study similar platforms (Google Maps, Taskrabbit, Facebook Marketplace)
- Set up GitHub repository (name: servicefinder, set to Private)
- Install VS Code, Node.js, Git on your computer
- Initialize Vue.js frontend (npm create vue@latest)
- Initialize Node.js + Express.js backend (npm init)
- Connect backend to Supabase using environment variables
- Create `.env` file with Supabase URL, anon key, service role key, JWT secret
- Drop all project files into the folder (README, PLAN, PROGRESS, DATABASE_SCHEMA, SQL file, HTML design)

---

## Week 2 — Authentication
**Goal:** Users can register and log in — one account, no role selection

Tasks:
- Build Register page (name, email, phone, password)
- Build Login page (email, password)
- Hash passwords with bcrypt before saving to Supabase
- Generate JWT token on successful login
- Store JWT in localStorage on the frontend
- Build auth middleware on backend — verify JWT on protected routes
- Build Vue Router navigation guards — redirect to login if not authenticated
- Test: can a user register, log in, and access protected pages?

---

## Week 3 — Provider Setup & Working Hours
**Goal:** Users can become a provider through Settings → Provider Account

Tasks:
- Build Settings page with Provider Account section
- Build 3-step provider setup form:
  - Step 1: service name, category, description, price range, contact, photo upload, provider type
  - Step 2: location pin on map (shop-based) or service areas (freelancer), working hours per day
  - Step 3: review and submit
- Upload service photo to Supabase Storage → save URL in services.photo_url
- Save working hours as 7 rows in working_hours table
- Auto-calculate Open Now / Closed based on current time vs working_hours
- Admin must approve listing before it appears on map (is_active = false by default)
- Test: can a user set up a provider listing and see it in their profile?

---

## Week 4 — Map Page & Smart Ranking
**Goal:** The main map page works with all approved providers visible

Tasks:
- Build the main map page using Leaflet.js
- Fetch all active (is_active = true, is_paused = false) providers from Supabase
- Display providers as map pins — mint color for shop, slate gray for freelancer
- Clickable pin → popup with name, category, rating, Open Now badge, photo
- Popup has "View details" button linking to service detail page
- Implement Nearby Me button using browser Geolocation API
- Implement Smart Ranking formula: score = (rating × 0.6) + (1/distance × 0.4)
- Apply smart ranking to the sidebar list on the home page
- Test: do all approved providers appear on the map? Does Nearby Me work?

---

## Week 5 — Search, Filter, Favorites & Service Requests
**Goal:** Customers can search, save providers, and post service requests

Tasks:
- Build search bar — filter providers by keyword (name, category, description)
- Build filter chips — by category, by distance, by Open Now, by provider type
- Results shown in list alongside map, sorted by smart ranking
- Favorites / Bookmark:
  - Heart icon on each listing card (red when saved)
  - Toggle save/unsave — saves to favorites table in Supabase
  - My Favorites page in profile sidebar
- Service Request:
  - Post a Request form (title, category, description, location)
  - Requests board page showing all open requests
  - Providers can respond to requests — saves to request_responses table
- Test: search, filter, bookmark, and post request all work?

---

## Week 6 — Service Detail Page, Reviews & Verified Badge
**Goal:** Full provider detail page with trust features

Tasks:
- Build service detail page:
  - Provider photo, name, category, description
  - Open Now / Closed based on working hours
  - Price range, service mode, location on mini map
  - Verified badge if is_verified = true
  - Action buttons: Call, WhatsApp, Chat, Save
  - Average rating + total reviews
  - All customer reviews with stars and comments
- Review system:
  - Only logged-in users who haven't reviewed yet can leave a review
  - Star rating (1–5) + written comment
  - After review saved, recalculate avg_rating and review_count on services table
- Verified Badge:
  - Provider uploads document in Settings → Provider Account
  - Saves to verification_requests table (status = "pending")
  - Admin approves → services.is_verified = true → ✓ badge shown
- Test: detail page loads? Reviews save? Badge shows after verification?

---

## Week 7 — Real-time Chat & Admin Panel
**Goal:** Chat works in real time, admin can manage everything

Tasks:
- Real-time Chat:
  - Build chat page — inbox list on left, message window on right
  - Create or find existing conversation between two users
  - Send and receive messages using Supabase Realtime on messages table
  - Show unread message count in navbar
- Admin Panel (separate route, protected by is_admin check):
  - Dashboard — stats: total listings, users, pending verifications, open requests
  - Manage Listings — approve, suspend, remove listings
  - Manage Verifications — review document, approve or reject
  - Manage Service Requests — monitor and remove inappropriate requests
  - Manage Users — suspend or restore accounts
  - Manage Reports — review and dismiss reported listings
- Test: messages appear in real time? Admin can approve listings?

---

## Week 8 — Bug Fixing, Testing & Final Polish
**Goal:** Everything works cleanly — ready for supervisor review on Sep 11

Tasks:
- Full end-to-end testing of all features:
  - Register → set up provider → listing appears on map after admin approval
  - Customer searches, filters, finds provider, books via chat
  - Reviews saved and avg_rating updates correctly
  - Smart ranking sorts correctly
  - Verified badge shows after admin approves
  - Open Now / Closed accurate based on real time
  - Chat messages appear in real time
  - Admin panel — all management features work
  - Reports can be submitted and reviewed
- Fix all bugs found during testing
- Polish UI — consistent spacing, fonts, colors across all 18 pages
- Prepare to demo for 4th supervisor meeting (Sep 11 — 80% progress)

---

## After Week 8 — ITC Schedule
- **Sep 30** — 100% complete + draft presentation slides
- **Oct 16** — Submit final thesis to department
- **Oct 26** — Submit final presentation slides
- **Before Nov 5** — Rehearsal
- **Nov 9** — Defense 🎓
