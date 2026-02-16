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
## [2026-02-16 23:06]: Professional Branding
- *Details*: Replaced default Vite README with a professional, humorous, and optimized project description. Added a MIT License.
- *Files*: `README.md`, `LICENSE` created/updated.


## [2026-02-16 23:05]: PWA Logo Enhancement
- *Details*: Redesigned and updated PWA icons to fill the entire square frame, removing unused margins and improving aesthetic appeal.
- *Tech Notes*:
  - **Icons**: Generated high-resolution 512x512, 192x192, and 180x180 icons.
  - **Favicon**: Added `favicon.png` and updated `index.html` to use it instead of the default Vite logo.
  - **Glassmorphism**: Maintained the premium glassmorphic style for the central icon elements.

## [2026-02-16 23:10]: Deployment Fixed: Asset Path Resolution
- *Details*: Fixed 404 errors on the deployed site caused by absolute path resolution and incorrect deployment source.
- *Tech Notes*:
  - **Index.html**: Changed `/favicon.png` and `/src/main.jsx` to `./favicon.png` and `./src/main.jsx` to support subdirectory hosting more robustly.
  - **Diagnosis**: Identified that the source `index.html` was being served instead of the `dist/` build. Instructed the user to switch GitHub Pages source to "GitHub Actions".
6. [2026-02-16 23:25]: Mobile UI Responsiveness & PWA Optimization
- *Details*: Fixed the "Now" button positioning and responsiveness in the Booking Modal. Improved PWA safe-area support.
- *Tech Notes*:
  - **Flexbox**: Optimized `.time-input-wrapper` with `align-items: stretch` and `flex-shrink: 0` for the "Now" button to prevent layout breakage on small screens.
  - **Safe Areas**: Added `env(safe-area-inset-bottom)` support to modal overlays for better compatibility with mobile home indicators.
  - **Interaction**: Added active states and transitions to the "Now" button for better tactile feedback.
  - **Files**: `src/components/Dashboard.jsx` updated.
