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
7. [2026-02-16 23:28]: Automatic Refresh & Feedback Fix
- *Details*: Resolved a bug where the application would crash after a successful booking and fail to update the list.
- *Tech Notes*:
  - **State Management**: Fixed a scoping issue by passing `setDialog` into `BookingModal`.
  - **Immediate Feedback**: Added an `onSuccess` callback to `BookingModal` that triggers an immediate `fetchReservations()` call in the parent component.
  - **UX**: Ensured the success dialog appears and the booking list is updated synchronously after insertion.
8. [2026-02-16 23:28]: Booking Validation - No Past Bookings
- *Details*: Added a strict validation rule to prevent users from creating reservations for times that have already passed.
- *Tech Notes*:
  - **Logic**: Implemented a timestamp comparison in `BookingModal.handleSubmit` that checks the selected `start_time` against the current system time.
  - **UI**: Added a descriptive error message "You cannot book a slot in the past" in the modal's error container.
9. [2026-02-16 23:30]: Visual Alignment Fix - Now Button Height
- *Details*: Synchronized the height of the "Now" button with the time selector input field for perfect horizontal alignment.
- *Tech Notes*:
  - **Flexbox**: Applied `display: flex` to the input wrapper and set the input field to `height: 100%`.
  - **Layout**: Removed explicit `height: auto` from `.now-btn` to allow it to naturally stretch and match the sibling container's height within the flex wrapper.

## [2026-02-17 08:58]: FAB Fixed Position & UI Polish
- *Details*: Fixed the position of the "+" booking button to be truly fixed in the lower right part of the screen.
- *Tech Notes*:
  - **Positioning**: Changed `.fab` from `absolute` to `fixed` to decouple it from the scrolling dashboard container.
  - **Responsiveness**: Added `env(safe-area-inset-bottom)` to ensure the button is navigable on modern mobile devices.
  - **Aesthetics**: Increased `z-index` to 90 and added a spring-like micro-animation (`cubic-bezier`) for hover and active states to improve the premium feel.
  - **Files**: `src/components/Dashboard.jsx` updated.

## [2026-03-15 11:43]: Comprehensive Mobile PWA UI Redesign
- *Details*: Full visual and structural overhaul for consistent, professional look across all screen sizes and on PWA standalone mode.
- *Tech Notes*:
  - **`index.css`**: Replaced with a complete design system — Inter Google Font, full CSS token set (colors, spacing, radius, shadows, transitions), 44px minimum touch targets, `font-size: 16px` on all inputs to prevent iOS zoom, `.loading-screen`/`.spinner` styles added (previously missing), and `.glass-card-hi` variant for modals.
  - **`App.css`**: Removed all Vite boilerplate (`#root { max-width: 1280px }`) that was interfering with the layout.
  - **`Auth.jsx`**: Added ambient radial glow blobs, icon-ring brand mark with Bath icon, proper `safe-area-inset` top/bottom padding, inline spinner replacing `Loader2`, and `id`/`htmlFor` on inputs for accessibility.
  - **`Dashboard.jsx`**: Initials avatar in header; reservation cards show start→bar→end time; FAB uses `max(28px, env(safe-area-inset-bottom) + 20px)` for all phones; BookingModal is a bottom-sheet on mobile and centered card on desktop with swipe handle; duration chips use gradient active state; all error messages include an icon; CustomDialog always centered.

## [2026-03-15 17:25]: Sign Up UI Added alongside Login
- *Details*: Re-enabled the Sign Up flow by adding a sign-in / sign-up toggle to `Auth.jsx`. Users can now create new accounts directly in the app without needing admin intervention.
- *Tech Notes*:
  - **`Auth.jsx`**: Added `mode` state (`'signin'` | `'signup'`). Sign-up calls `supabase.auth.signUp()` passing `display_name` and auto-derived `username` in `options.data`. On success a green confirmation banner is shown and view resets to sign-in. Animated tab bar switches between modes. Extra "Your name" field (with slide-in animation) appears only in sign-up mode. Password hint shown for new accounts. Footer switch link also provided.
  - **Schema**: No SQL changes required — the existing `handle_new_user` trigger already auto-creates a `profiles` row on new auth user creation.
  - **No breaking changes** to the existing sign-in flow.

## [2026-03-15 12:49]: Supabase Booking Cleanup Job
- *Details*: Created a scheduled database job to automatically delete reservations that took place more than 3 days ago, to keep the database clear.
- *Tech Notes*:
  - **Database**: Supabase (PostgreSQL).
  - **Extension**: `pg_cron` enabled.
  - **Job**: `cleanup_old_reservations` scheduled to run daily at midnight (`0 0 * * *`).
  - **Query**: `delete from public.reservations where start_time < (now() - interval '3 days')`.
  - **Files**: `supabase_cleanup_cron.sql` created for manual replication in the SQL editor.
