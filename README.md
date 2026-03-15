# 🚿 Bathroom Booking

[![Live App](https://img.shields.io/badge/🌐_Live_App-Visit-38bdf8?style=for-the-badge)](https://luisfernarndo1.github.io/uk/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Built with Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

> **A real-time shared bathroom scheduler for housemates — no more clash at 7:55 AM.**

---

## 🔗 Quick Links

| | |
|---|---|
| 🌐 **Live App** | [luisfernarndo1.github.io/uk](https://luisfernarndo1.github.io/uk/) |
| 📱 **How to install on iPhone** | [Watch on YouTube ↗](https://youtube.com/shorts/_DLrFlrzuFc) |

---

## 😫 The Problem

You're in a shared house. It's 7:55 AM. You have a meeting at 8:00 AM.
You sprint to the bathroom — only to hear the shower turn on.

Someone is already in there. You knock. They yell. You yell back.
The neighbour's dog starts barking. **Chaos ensues.**

## ✅ The Solution

**Bathroom Booking** is a lightweight, real-time PWA that lets every housemate see and book bathroom slots — from their phone, before they even get out of bed.

- 📅 Pick your time slot for today or tomorrow
- ⏱ Choose a duration (5 / 10 / 15 / 20 min)
- 🔴 Instant conflict detection — no double bookings, ever
- ✅ Confirm with one tap

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔑 **Account system** | Sign up with email, confirm via link, log in securely |
| 🕒 **Real-time updates** | Bookings appear instantly for all housemates |
| ⚡ **Conflict detection** | Overlapping slots are blocked automatically |
| 📱 **Installable PWA** | Works like a native app on iPhone and Android |
| 🎨 **Premium UI** | Glassmorphic design with dark mode and smooth animations |
| 🗑 **Auto-cleanup** | Old reservations are deleted daily by a scheduled DB job |

---

## 📱 How to Install on Your Phone (PWA)

The app works as a **Progressive Web App** — no App Store needed.

### iPhone / iPad
1. Open [https://luisfernarndo1.github.io/uk/](https://luisfernarndo1.github.io/uk/) in **Safari**
2. Tap the **Share** button (the box with an arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add** — done!

### Android
1. Open the link in **Chrome**
2. Tap the **three-dot menu** (top right)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **Add**

📹 **Watch the full walkthrough on iPhone**: [YouTube Short ↗](https://youtube.com/shorts/_DLrFlrzuFc)

---

## 👤 How to Create an Account

1. Open the app and tap **✨ Sign Up**
2. Enter your name, email, and a password (min 6 characters)
3. Tap **Create Account**
4. Check your inbox and click the **confirmation link**
5. Come back to the app, tap **🔑 Log In**, and you're in

> **Note**: you need to confirm your email before you can log in for the first time.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Vanilla CSS (CSS Variables, Glassmorphism) |
| Backend & Auth | Supabase (PostgreSQL + Realtime) |
| Icons | Lucide React |
| PWA | `vite-plugin-pwa` |
| Hosting | GitHub Pages (CI/CD via GitHub Actions) |

---

## 🗄 Database Schema

Two main tables power the app:

- **`profiles`** — linked to Supabase Auth, stores display name and username
- **`reservations`** — stores booking start time, duration, and owner

Full SQL (tables, RLS policies, and trigger) is in [`supabase_schema.sql`](./supabase_schema.sql).
Daily cleanup job is in [`supabase_cleanup_cron.sql`](./supabase_cleanup_cron.sql).

---

## 🚀 Run Locally (for developers)

```bash
# 1. Clone the repo
git clone https://github.com/simo-hue/uk-home-stay-bathroom-booking.git
cd uk-home-stay-bathroom-booking

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# → Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Start the dev server
npm run dev
```

---

## ⚖️ License

MIT © [simo-hue](https://github.com/simo-hue) — use it, fork it, improve it.

---

**Made with ❤️ and too many morning bathroom arguments by [simo-hue](https://github.com/simo-hue)**
