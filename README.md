# 🚽 FlushFlow (or just 'The Throne Room')
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

> **Because the best relationships are built on shared understanding, not shared bathroom schedules.**

[**🚀 Live Demo**](https://luisfernarndo1.github.io/uk/)

---

## 😫 The Problem
You're in a shared house. It's 7:55 AM. You have a meeting at 8:00 AM. You run to the bathroom only to hear the dreaded sound of a shower turning on. You yell. They yell back. The neighbor's dog starts barking. **Chaos ensues.**

## ✨ The Solution
**FlushFlow** is a premium, real-time shared bathroom booking platform designed to end housemate wars before they start. Built with a sleek glassmorphic design that looks better than your actual bathroom, it turns scheduling into a high-end experience.

## 🔥 Key Features
- **🕒 Real-time Conflict Detection**: Try to book a slot that overlaps? Not on our watch.
- **📱 PWA Ready**: Install it on your Home Screen. Book your "important business" while you're still in bed.
- **✨ Glassmorphic UI**: Transparent cards, vibrant gradients, and smooth animations. It's so pretty you'll want to stay on the login screen (but don't, people are waiting).
- **⚡️ Supabase Powered**: Real-time updates. When someone finishes early, you'll know.
- **🔒 Secure Login**: Only housemates with the keys (and the link) get in.

## 🛠 Tech Stack
- **Frontend**: React 19 + Vite (for that lightning-fast HMR)
- **Styling**: Vanilla CSS (Custom properties, Glassmorphism, Responsive Design)
- **Backend & Auth**: Supabase (PostgreSQL + Realtime)
- **Icons**: Lucide React
- **PWA**: `vite-plugin-pwa`

## 🚀 Getting Started
### 1. Requirements
- A Supabase account
- A shared bathroom (mandatory)
- Temperamental housemates (optional, but encouraged for testing)

### 2. Setup
1. Clone this repo:
   ```bash
   git clone https://github.com/simo-hue/uk-home-stay-bathroom-booking.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Run it:
   ```bash
   npm run dev
   ```

## 📜 Database Schema
The database requires two main tables: `profiles` and `reservations`. You can find the full SQL setup in `supabase_schema.sql`.

---

## 🤝 Contributing
Found a bug? Or maybe you want to add a feature like "Emergency Flush Request"? Open a PR!

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Made with ❤️ and a lot of patience by [simo-hue](https://github.com/simo-hue)**
