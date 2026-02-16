# Manual Actions Required
- **PWA Logo Update**: If you have already installed the PWA on your phone or desktop, you may need to uninstall and reinstall it, or clear the browser cache to see the new "full screen" logo.

## GitHub Pages Deployment (Critical)
1. Go to your GitHub repository settings: [GitHub Pages Settings](https://github.com/luisfernarndo1/uk/settings/pages)
2. Under **Build and deployment** > **Source**, change "Deploy from a branch" to **"GitHub Actions"**.
3. This is necessary because the current site is serving the source code instead of the built version.

## Supabase Credentials
Ensure you have added the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
