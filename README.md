# Ifeanyi Nnamani (Smork) — Portfolio & Content Management System

A hand-crafted, editorial personal developer portfolio and case-study CMS built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Zod**. Engineered with a decoupled repository architecture that seamlessly operates with live **Firebase (Firestore, Authentication, Storage)** when provisioned, and falls back gracefully to a resilient **Local Repository & Cache** when offline or in standalone preview.

---

## 1. Architecture Overview

The system strictly adheres to clean separation of concerns:

```
src/
├── components/          # Shared, domain-agnostic UI (Header, Footer, Lightbox, ToastContainer, ErrorBoundary)
├── features/
│   ├── projects/        # Project display components (ProjectRow, ProjectFilter, CaseStudyView)
│   └── admin/           # CMS components (AdminDashboard, ProjectEditor, SettingsEditor, AdminLogin)
├── hooks/               # Custom React hooks (useProjects, useProject, useSettings, useAuth, useTheme, useToast)
├── lib/
│   ├── repository/      # Repository pattern abstraction layer
│   │   ├── types.ts     # IProjectRepository, ISettingsRepository, IAuthRepository
│   │   ├── LocalRepository.ts    # Browser storage engine with auto-slug & collision handling
│   │   ├── FirebaseRepository.ts # Live Firestore, Firebase Auth, and Storage adapter
│   │   └── index.ts     # Environment-aware repository factory
│   ├── firebase.ts      # Firebase SDK client initialization and config detection
│   ├── initialData.ts   # Canonical initial seed data preserving verified facts
│   ├── utils.ts         # Pure utilities (slug generation, client-side WebP image compression)
│   └── validation.ts    # Zod schemas for all models and forms
├── routes/              # Page routes (HomeRoute, WorkRoute, CaseStudyRoute, ResumeRoute, AdminRoute, NotFoundRoute)
├── types/               # Domain interfaces (Project, SiteSettings, AdminUser, ToastMessage)
└── __tests__/           # Vitest unit test suite (slugs, Zod validation, repository operations)
```

### Decoupled Repository Pattern
UI components never call `localStorage` or Firebase directly. All persistence is delegated through the `IProjectRepository`, `ISettingsRepository`, and `IAuthRepository` contracts.
- **Production Mode**: When `VITE_FIREBASE_*` environment variables are populated, operations route to Cloud Firestore and Firebase Auth with server-enforced rules.
- **Local Fallback Mode**: When running without Firebase credentials, data persists in `localStorage` with full CRUD, auto-slug generation, slug collision resolution, and JSON backup export/import capabilities.

---

## 2. Design System & Aesthetics

- **Editorial Philosophy**: Organic, typographic, human-made aesthetic inspired by independent design studios. No glassmorphism, no blur overlays, no gradient orbs, and no generic cards.
- **Palette**:
  - **Paper** (`#F4F1EA` light / `#0F1115` dark): warm, tactile canvas with a subtle inline SVG noise texture under 3% opacity.
  - **Ink** (`#16181D` light / `#ECE8DF` dark): high-contrast text meeting WCAG AAA standard (>14:1 contrast ratio).
  - **Graphite** (`#2C3038` light / `#E2DDD3` dark) & **Stone** (`#D9D4C7` light / `#22262F` dark): structural hairlines and borders.
  - **Ember** (`#D9532B`): single high-intent accent reserved strictly for active states, links, focus rings, and small editorial tags.
- **Typography**:
  - **Display / Headings**: `Fraunces` (variable optical-size serif, tight tracking).
  - **Body Text**: `Inter` (16–17px, balanced line-height).
  - **Technical Meta & Tags**: `JetBrains Mono` (tabular figures, dates, tech stacks).
- **Spatial Geometry**: 12-column grid, small corner radii (2–4px), 1px rules instead of drop-shadows.

---

## 3. Data Models (Zod Validated)

### Project Model
- `id` (string, required): unique identifier.
- `title` (string, 2–120 chars): project title.
- `slug` (string, lowercase alphanumeric hyphenated): unique URL slug.
- `summary` (string, 5–280 chars): concise, one-line summary.
- `year` (string, 4-digit): completion year.
- `role` (string, 2–80 chars): engineering role / discipline.
- `tech` (string[], min 1 item): technology stack tags.
- `image` (string): cover image URL or WebP data URL.
- `liveUrl` (string, optional URL): live demonstration link.
- `githubUrl` (string, optional URL): source code repository.
- `status` (`'published' | 'draft'`): visibility control.
- `featured` (boolean): featured on homepage index.
- `order` (number): ordering priority.
- `sections` (optional):
  - `problem` (string): problem and context (hidden if empty).
  - `approach` (string): technical strategy and execution (hidden if empty).
  - `result` (string): measurable outcome and delivery (hidden if empty).
- `seoTitle` / `seoDescription` (string, optional): per-project meta tags.

### Site Settings Model
- `name` (`Ifeanyi Nnamani`)
- `handle` (`Smork`)
- `roleLine` (`Software Engineer & Frontend Developer`)
- `statement`: hero copy.
- `statusLineText` & `statusLineEnabled`: toggleable availability banner.
- `aboutText`: biographical prose.
- `skills`: grouped lists for Frontend, Backend, Tools (no percentage bars).
- `profilePhoto`: avatar path/URL.
- `resumeUrl`: PDF URL or external drive link (hidden if blank).
- `socials`: verified URLs for GitHub, LinkedIn, Email, WhatsApp, Instagram, Facebook.

---

## 4. Security & Access Control

### Firestore Security Rules (`firestore.rules`)
```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.email in ['ifeanyinuels42@gmail.com', 'ifeanyinuels32@gmail.com'] ||
        request.auth.token.admin == true
      );
    }
    match /projects/{projectId} {
      allow read: if isAdmin() || (resource.data.status == 'published');
      allow write: if isAdmin();
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### Storage Security Rules (`storage.rules`)
- Read access: public for all published assets.
- Write access: allowlisted admins only.
- Strict size caps: 5MB for project media, 10MB for documents.
- MIME type restriction: `image/*` and `application/pdf`.

---

## 5. Setup & Development

### Installation & Scripts
```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run full TypeScript type-checking and lint
npm run lint

# Run Vitest unit tests
npm run test

# Build production bundle
npm run build
```

### Connecting Firebase (Optional)
Copy `.env.example` to `.env` and configure:
```ini
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAILS=ifeanyinuels42@gmail.com,ifeanyinuels32@gmail.com
```

### Admin Authentication
- Navigate to `/admin` or click **Admin** in the header.
- In **Live Mode**: Sign in with an allowlisted Google account or Email/Password registered in Firebase Auth.
- In **Local Fallback Mode**: Sign in with `ifeanyinuels42@gmail.com` (use the one-click **Auto-fill** button on the login screen for testing).

---

## 6. Deployment (Vercel & SPA Rewrites)

The applet is fully configured for zero-config deployment on Vercel or any modern static hosting provider:
- `vercel.json` contains the mandatory rewrite rule mapping `/(.*)` to `/index.html` to support deep linking on `/work/:slug` and `/admin`.
- `public/robots.txt` and `public/sitemap.xml` are deployed at the root for search engine indexing.
- Continuous Integration workflow is configured in `.github/workflows/ci.yml` running linting, tests, and compilation on push.

---

## 7. Decisions and Trade-Offs

1. **Client-side Image Optimization**: Used an HTML5 Canvas pipeline in `processAndCompressImage` to convert uploaded imagery to `.webp` before storage. This avoids dependency on heavy Node native sharp binaries in serverless builds while dramatically reducing payload sizes on mobile devices.
2. **Graceful Fallback over Failure**: Instead of crashing or rendering empty blank screens when Firebase credentials are omitted, the application uses an active Repository Factory that seamlessly falls back to a feature-complete local repository with JSON export/import and soft-delete undo toasts.
3. **Typography-First Layout**: Replaced uniform rounded card grids with an editorial indexed table (`01`, `02`...) featuring desktop hover preview cards and responsive mobile inline rows.
