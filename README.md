# Design @ UCI: Mockup

A single-page website built with React and Vite.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Library | [React 19](https://react.dev/) |
| Routing | [React Router 7](https://reactrouter.com/) |
| Build Tool | [Vite 8](https://vite.dev/) |
| Smooth Scroll | [Lenis 1](https://lenis.darkroom.engineering/) |
| Animation | [GSAP 3](https://gsap.com/) + [@gsap/react](https://gsap.com/react/) |
| Icons | [@radix-ui/react-icons](https://www.radix-ui.com/icons) + [lucide-react](https://lucide.dev/) |
| Analytics | [@vercel/analytics](https://vercel.com/docs/analytics) |
| Serverless API | Vercel Functions + [Nodemailer](https://nodemailer.com/) |
| Linting | [ESLint 10](https://eslint.org/) with `eslint-plugin-react-hooks` & `eslint-plugin-react-refresh` |
| Deployment | [Vercel](https://vercel.com/) |

## Project Structure

```
api/
├── submit.js          # Serverless endpoint for inquiry/application form submissions
└── emailTemplate.js   # HTML template for application confirmation emails
src/
├── assets/
├── components/        # Shared UI: Sidebar, Footer, Notification, InquiryForm, PhaseSlider, ...
├── pages/
│   ├── Hero.jsx
│   ├── AboutUs.jsx
│   ├── Mission.jsx
│   ├── Values.jsx
│   ├── Projects.jsx
│   ├── BuildWithUs.jsx
│   └── Apply.jsx
├── App.jsx
└── main.jsx
```

`App.jsx` renders the sections (`Hero`, `AboutUs`, `Mission`, `Values`, `Projects`, `BuildWithUs`) as a single scrolling page at `/`, with `/apply` as a separate routed page.

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Form submissions (`api/submit.js`) require these to be set (e.g. in `.env` locally, or in Vercel project settings):

| Variable | Description |
|----------|-------------|
| `SHEET_ENDPOINT` | Google Sheet (Apps Script) endpoint that submissions are forwarded to |
| `GMAIL_USER` | Gmail address used to send confirmation/notification emails |
| `GMAIL_APP_PASS` | Gmail app password for `GMAIL_USER` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
