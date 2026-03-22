# Typing Speedtest

A minimalist typing speed test inspired by [Monkeytype](https://monkeytype.com), built as a single-page application.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-12-FF0055?logo=framer&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Nginx-2496ED?logo=docker&logoColor=white)

## Features

- **Real-time typing test** with character-by-character feedback and animated cursor
- **WPM & accuracy tracking** — errors are counted even if corrected
- **WPM history chart** with smooth curve, highest/lowest annotations
- **English & French quotes** sourced from Monkeytype's open dataset
- **Dark / Light theme** toggle with localStorage persistence
- **Auto-scroll** for long texts (7+ lines)
- **Best score** saved locally and displayed in the footer
- **Blur reveal animations** powered by Motion

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Deployment

The project includes a Docker + Nginx setup with a GitHub Actions CI/CD pipeline that builds and deploys to a VPS via Traefik.

```bash
# Build Docker image locally
docker build -t typing-speedtest .

# Run locally
docker run -p 3000:80 typing-speedtest
```

### GitHub Actions Secrets

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | SSH private key |
| `GHCR_PAT` | GitHub PAT with `read:packages` scope |
| `VPS_DEPLOY_PATH` | Path to docker-compose.yml on VPS |

## Controls

| Key | Action |
|-----|--------|
| `Esc` | Reset with a new quote |
| Any character | Type the displayed text |
| `Backspace` | Delete last character |

## Tech Stack

- **React 19** — UI framework
- **TypeScript 5.9** — Type safety
- **Vite 7** — Build tool with HMR
- **Tailwind CSS 4** — Utility-first styling with custom theme tokens
- **Motion** — Blur reveal and slide animations
- **Nginx** — Production static file serving
- **GitHub Actions** — CI/CD pipeline to GHCR + VPS

## Fonts

- **Manrope** (variable) — Headers and UI labels
- **IBM Plex Mono** — Typing area, stats, and monospace elements

## License

MIT
