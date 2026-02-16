# Manual Actions Required

## 🛠 Supabase Setup
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project.
3. Once the project is ready, go to the **SQL Editor**.
4. Copy the contents of `supabase_schema.sql` and run it.
5. Go to **Project Settings** -> **API**.
6. Copy the **Project URL** and **anon public** key.

## 🔑 Environment Variables
1. Create a `.env` file in `/Users/simo/Downloads/DEV/HOME STAY/`.
2. Add the following lines:
   ```env
   VITE_SUPABASE_URL=PASTE_YOUR_URL_HERE
   VITE_SUPABASE_ANON_KEY=PASTE_YOUR_ANON_KEY_HERE
   ```

## 🚀 Deployment
1. If you want to host on GitHub Pages:
   - Ensure the `base` in `vite.config.js` matches your repo name if not using a custom domain.
   - Run `npm run build` and push the `dist` folder or use a GitHub Action to deploy.
