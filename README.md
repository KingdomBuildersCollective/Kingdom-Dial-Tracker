# 👑 Kingdom Dial Tracker

Gamified dial session tracker for life insurance agents. Built with React + Vite + Supabase.

## Features
- 🔐 Unique agent logins with persistent data
- 📞 Gamified dial sessions (Dials 300 / Contacts 100 / Appointments 20)
- 🗓️ Choose day of week & time block per session
- ⚡ XP system, levels, and achievement milestones
- ⏱️ Session timer with hourly block tracking
- 💼 Sales Board with client records
- 📋 Full client worksheet (name, DOB, carrier, APV, show status)
- 📊 Conversion rates & hustle score
- 🔥 Streak tracking

---

## 🚀 Deploy in 3 Steps

### Step 1: Set Up Supabase (free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a **New Project**
3. Go to **SQL Editor** and run the contents of `SUPABASE_SETUP.sql`
4. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
5. Go to **Authentication → Settings** and enable **Email confirmations** (or disable for easier testing)

### Step 2: Deploy to Netlify (free)

**Option A: Drag & Drop (fastest)**
1. Run `npm install && npm run build` locally
2. Drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Add environment variables in Netlify → Site Settings → Environment Variables

**Option B: GitHub + Netlify (recommended)**
1. Push this folder to a GitHub repo
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables (see below)

### Step 3: Add Environment Variables

In Netlify → **Site configuration → Environment variables**, add:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

Then **trigger a redeploy** and your app is live!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Supabase credentials

# Start dev server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── App.jsx              # Root app + auth gate
├── main.jsx             # React entry point
├── styles.css           # Global styles
├── supabase.js          # Supabase client
├── hooks/
│   └── useStore.js      # Central state + Supabase sync
├── components/
│   ├── Nav.jsx          # Navigation bar
│   └── Notifications.jsx # XP toast + achievement banner
└── pages/
    ├── AuthPage.jsx     # Login / Signup
    ├── Dashboard.jsx    # Command center
    ├── SessionPage.jsx  # Gamified dial session
    ├── SalesBoard.jsx   # Client records
    └── Worksheet.jsx    # Client intake form
```

---

## 🎮 Gamification System

| Action | XP Earned |
|--------|-----------|
| 1 Dial | +1 XP |
| 1 Contact | +5 XP |
| 1 Appointment | +15 XP |
| 1 Presentation | +10 XP |
| 1 Sale | +50 XP |
| 1 Recruiting | +8 XP |
| Client saved as Sale | +200 XP |
| Milestone hit | +50–500 XP bonus |
| Level Up | Every 1.4x XP threshold |

**Hustle Score** = Dials×1 + Contacts×3 + Appointments×10 + Presentations×5 + Sales×25

---

Built for Kingdom Business Services · For the Kingdom 🔨
