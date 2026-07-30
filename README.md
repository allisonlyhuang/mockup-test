# Design @ UCI: Mockup

A single-page website built with React and Vite.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Library | [React 19](https://react.dev/) |
| Build Tool | [Vite 8](https://vite.dev/) |
| Smooth Scroll | [Lenis 1](https://lenis.darkroom.engineering/) |
| Animation | [GSAP 3](https://gsap.com/) + [@gsap/react](https://gsap.com/react/) |
| Linting | [ESLint 10](https://eslint.org/) with `eslint-plugin-react-hooks` & `eslint-plugin-react-refresh` |
| Deployment | [Vercel](https://vercel.com/) |

## Project Structure

```
src/
├── assets/ 
├── components/
│   └── Sidebar.jsx 
├── pages/
│   ├── Hero.jsx
│   ├── AboutUs.jsx
│   ├── Projects.jsx
│   └── JoinUs.jsx
├── App.jsx
└── main.jsx
```

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
