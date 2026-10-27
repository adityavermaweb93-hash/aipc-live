# All India Pastors’ Conference (AIPC) Web Portal

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fadityavermaweb93-hash%2Faipc-live)

An exact, high-fidelity visual reproduction and dynamic operations platform for the **All India Pastors’ Conference** (https://aipc.live/).

Powered by **React**, **Next.js**, **TypeScript**, and **Tailwind CSS**, featuring an edge-to-edge **WordPress-styled Admin Dashboard** (`/admin`) for annual edition transitions, attendee registrations, and visitor inquiry response workflows.

---

## Features

- **Pixel-Perfect Visual Clone**: Faithfully preserves all typography, fonts (`Playfair Display`, `Bebas Neue`, `DM Sans`), color palettes, photo sliders, and responsive breakpoints from `aipc.live`.
- **Dynamic Annual Variables**: Update year, dates, location/venue, theme, scripture expositions, schedule, and pricing without editing frontend code.
- **WordPress-Style Admin Dashboard (`/admin`)**:
  - Full-bleed edge-to-edge layout with top Admin Bar and flush-left sidebar.
  - **Attendee Registrations**: Real-time attendance and revenue metrics, live search & filtering, 1-click payment status toggles, detail notes, and CSV export.
  - **Visitor Queries & Replies**: Contact form submissions inbox, 1-click email and WhatsApp direct reply actions, and response note logging.
  - **One-Click Annual Switcher**: Instant transition to future editions (e.g. 2027, 2028).
  - **Media File Uploader**: Direct upload for hero banners, venue photos, and complimentary book covers.
- **Persistent Data Storage**: Zero-dependency atomic JSON persistence in `data/conference.json`, `data/registrations.json`, and `data/queries.json`.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site, or [http://localhost:3000/admin](http://localhost:3000/admin) to manage the conference.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## Deploying to Vercel

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com/), click **Add New Project** and import `aipc-live`.
3. Vercel automatically detects **Next.js**. Click **Deploy**.
4. Your site will be live instantly!

---

## License

MIT
