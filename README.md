# LORSWeb

Marketing landing site for **LORS Nexus** — [lorsnexus.com](https://lorsnexus.com).

**Tagline:** *Elevating Everyday Experiences*

Single-page vertical scroll site: utility-app positioning, IT solutions, ecosystem diagram, **CSS hologram** project cards, and featured highlights for **RouteMates** and **Family OS**.

## Page sections

| Section | Anchor | Content |
|---------|--------|---------|
| Hero | — | Brand, tagline, utility + IT positioning |
| Mission | `#mission` | Three pillars (everyday utility, real problems, scale) |
| IT Solutions | `#it` | Mobile, cloud, security, DevOps, consulting |
| Ecosystem | `#ecosystem` | Parent brand → products → future ventures |
| Featured products | `#products` | RouteMates & Family OS (flagship hologram cards) |
| Pipeline | `#pipeline` | TripKit, DocVault, TwinCam, Nexus Lab |
| Contact | `#contact` | Mailto CTA |

## Stack

- Vite + React + TypeScript
- Tailwind CSS

## Quick start

```bash
cp .env.example .env   # optional: set VITE_CONTACT_EMAIL
npm install
make dev             # or: npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Commands

| Command | Description |
|---------|-------------|
| `make install` | `npm ci` |
| `make dev` | Dev server |
| `make build` | Production build → `dist/` |
| `make preview` | Production build, then serve `dist/` at [localhost:4173](http://localhost:4173) |
| `make deploy` | Build + deploy to Firebase Hosting |
| `make lint` | Typecheck |

## Customize copy

Edit [`src/content.ts`](src/content.ts) for:

- `siteContent` — hero, mission, ecosystem intro
- `missionPillars`, `itCapabilities`
- `featuredProjects` — RouteMates, Family OS
- `upcomingProjects` — pipeline cards

Environment variables (see [`.env.example`](.env.example)):

```bash
VITE_CONTACT_EMAIL=lorsnexus@lorsnexus.com
# VITE_ROUTEMATES_URL=https://…   # optional link on RouteMates card
```

## Deploy (Firebase Hosting)

Google Workspace provides **email and DNS**, not static hosting. This site deploys to **Firebase Hosting**; connect **lorsnexus.com** later in the Firebase console.

### One-time setup

1. Install Node 20+ and the CLI (`brew install node@20`; `npm install -g firebase-tools`).
2. Log in with the **LORS Nexus Workspace account** (not a personal Gmail):

   ```bash
   export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
   firebase login:add                    # pick lorsnexus@lorsnexus.com in the browser
   firebase login:use lorsnexus@lorsnexus.com
   firebase login:list                   # confirm active account
   ```

3. Link your Firebase project:

   ```bash
   cp .firebaserc.example .firebaserc
   # edit .firebaserc → set default project ID from console.firebase.google.com
   # or: firebase use --add
   ```

4. Optional env for contact mailto:

   ```bash
   cp .env.example .env
   # VITE_CONTACT_EMAIL=lorsnexus@lorsnexus.com
   ```

### Publish

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
make deploy
# or: ./scripts/deploy-firebase.sh   # checks *@lorsnexus.com before deploy
```

First deploy serves at `https://YOUR_PROJECT_ID.web.app` (and `.firebaseapp.com`).

### Custom domain (later)

1. [Firebase console](https://console.firebase.google.com) → **Hosting** → **Add custom domain** → `lorsnexus.com` + `www.lorsnexus.com`
2. Add the DNS records Firebase shows in **Squarespace** ([account.squarespace.com/domains](https://account.squarespace.com/domains)) — do **not** remove MX records (Workspace email).
3. Wait for HTTPS, then set `www` ↔ apex redirect in Firebase.

### Verify

- `https://YOUR_PROJECT_ID.web.app` shows the landing page
- Contact CTA opens your Workspace inbox
- After DNS: `https://lorsnexus.com` with valid SSL

## Repository layout

This folder is a sibling of `RoutematesBE` and `RoutematesAndroid` in the RoutematesV2 workspace. You may initialize a separate Git repository here when ready.
