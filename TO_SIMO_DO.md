# Manual Actions Required

## 🛠 Supabase Setup
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (e.g., "Bathroom Booking").
3. Go to the **SQL Editor** (left sidebar).
4. Create a **New query**.
5. Copy the code from `supabase_schema.sql` (located in your project root) and paste it into the editor.
6. Click **Run**. This creates the `profiles` and `reservations` tables and sets up the security rules.

## 🔑 Environment Variables
1. In the Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy the **Project URL**.
3. Copy the **anon public** API key.
4. Open the `.env` file in your editor (the one you currently have active).
5. Paste them like this:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. **Restart your development server** (`npm run dev`) for the changes to take effect.

## 🚀 GitHub Pages Setup
1. **GitHub Repository**:
   - Go to your repository `luisfernarndo1/uk` on GitHub.
   - Go to **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.
2. **Push Changes**:
   - Commit and push the changes I just made (including the `.github` folder).
   - Go to the **Actions** tab in your repo to watch the deployment progress.
3. **PWA Note**: GitHub Pages serves over HTTPS, which is required for the PWA features to work correctly.
