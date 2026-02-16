# Documentation

## [2026-02-16 22:15]: Bathroom Booking PWA Initialization
- *Details*: Created a mobile-optimized PWA for shared bathroom scheduling.
- *Tech Notes*:
  - **Framework**: Vite + React
  - **Styling**: Vanilla CSS with CSS Variables and Glassmorphism.
  - **Database**: Supabase (PostgreSQL + Real-time).
  - **PWA**: `vite-plugin-pwa` for offline and standalone support.
  - **Features**: Auth (Login/Signup), Today/Tomorrow tabs, Duration-based booking, Conflict detection.
  - **Files**:
    - `App.jsx`: Main routing and auth state.
    - `Auth.jsx`: Login/Signup UI.
    - `Dashboard.jsx`: Main scheduler UI with real-time updates.
    - `supabase_schema.sql`: Database tables and RLS policies.

## [2026-02-16 22:48]: GitHub Pages Deployment Configuration
- *Details*: Configured the project for hosting on GitHub Pages under the repository name `uk`.
- *Tech Notes*:
  - **Vite Config**: Set `base` to `/uk/` to support subdirectory hosting.
  - **CI/CD**: Added `.github/workflows/deploy.yml` for automated builds and deployments via GitHub Actions.
## [2026-02-16 23:00]: Simplified Auth Flow
- *Details*: Removed the Sign Up option to restrict access to existing users only.
- *Files*: `src/components/Auth.jsx` modified.
## [2026-02-16 23:04]: Removed Mock Mode
- *Details*: Completely removed the Mock Supabase fallback. The app now requires real Supabase credentials to run.
- *Files*: `src/lib/supabase.js` simplified.


## [2026-02-16 23:05]: PWA Logo Enhancement
- *Details*: Redesigned and updated PWA icons to fill the entire square frame, removing unused margins and improving aesthetic appeal.
- *Tech Notes*:
  - **Icons**: Generated high-resolution 512x512, 192x192, and 180x180 icons.
  - **Favicon**: Added `favicon.png` and updated `index.html` to use it instead of the default Vite logo.
  - **Glassmorphism**: Maintained the premium glassmorphic style for the central icon elements.
