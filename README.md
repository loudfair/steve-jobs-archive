# Steve Jobs Archive

A curated digital archive of Steve Jobs' interviews, speeches, product launches, and quotes. Built with an Apple-inspired dark theme.

## Live Production

| Resource                 | URL                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| **Live Site**            | https://www.myeye.cloud                                                                    |
| **Cloudflare Pages**     | https://steve-jobs-archive.pages.dev                                                       |
| **GitHub**               | https://github.com/loudfair/steve-jobs-archive                                             |
| **Cloudflare Dashboard** | https://dash.cloudflare.com/cd63df5d51174dd5a46564c13212c832/pages/view/steve-jobs-archive |

## Quick Reference for AI Agents

### Content Location

**ALL CONTENT IS IN ONE FILE:** `src/data/content_database.json`

- 77 quotes
- 43 videos (YouTube IDs)
- 12 timeline events
- 15 categories

### Deployment

**Auto-deploy enabled** - Push to `main` branch triggers Cloudflare Pages deployment.

```bash
git add -A && git commit -m "message" && git push
```

### Key Files

| File                             | Purpose                           |
| -------------------------------- | --------------------------------- |
| `src/data/content_database.json` | ALL quotes, videos, timeline data |
| `src/css/styles.css`             | Apple dark theme (~750 lines)     |
| `src/index.html`                 | Home page                         |
| `src/browse.html`                | Video archive browser             |
| `src/quotes.html`                | Quotes collection                 |
| `src/js/main.js`                 | Core JS, YouTube API              |
| `src/js/browse.js`               | Filter/sort logic                 |

---

## Project Overview

This static website features:

- **77 curated quotes** with sources and years
- **43 YouTube videos** (interviews, keynotes, product launches)
- **12 timeline events** (1955-2011)
- **15 content categories**

## Tech Stack

| Component | Technology                                         |
| --------- | -------------------------------------------------- |
| Frontend  | Vanilla HTML5, CSS3, ES6+ JavaScript               |
| Hosting   | Cloudflare Pages (auto-deploy from GitHub)         |
| DNS       | GoDaddy (www CNAME → steve-jobs-archive.pages.dev) |
| Domain    | myeye.cloud                                        |
| Theme     | Apple-inspired dark mode                           |

## Directory Structure

```
steve-jobs-archive/
├── src/                          # DEPLOYED DIRECTORY
│   ├── index.html                # Home (hero, timeline, featured)
│   ├── browse.html               # Video browser with filters
│   ├── quotes.html               # Quotes collection
│   ├── css/
│   │   └── styles.css            # Apple dark theme
│   ├── js/
│   │   ├── main.js               # Core + YouTube API
│   │   ├── browse.js             # Filter/sort/search
│   │   └── quotes.js             # Quotes page
│   └── data/
│       └── content_database.json # *** ALL CONTENT HERE ***
├── docs/
│   └── architecture/
│       └── ARCHITECTURE.md
├── _headers                      # Cloudflare security headers
├── _redirects                    # Cloudflare URL redirects
├── wrangler.toml                 # Cloudflare Pages config
└── README.md
```

## Content Database Schema

```json
{
  "videos": [
    {
      "id": "unique-slug",
      "title": "Video Title",
      "youtube_id": "YouTube11Char",
      "category": "Category Name",
      "description": "Description text",
      "year": 2007,
      "featured": true
    }
  ],
  "quotes": [
    {
      "id": "quote-id",
      "quote": "The quote text...",
      "source": "Source, Year",
      "year": 2005,
      "featured": true
    }
  ],
  "timeline": [
    {
      "year": 1976,
      "title": "Event Title",
      "description": "What happened"
    }
  ],
  "categories": ["Interviews", "Speeches", ...]
}
```

## Common Tasks

### Add a Video

Edit `src/data/content_database.json`:

```json
{
  "id": "new-video",
  "title": "Video Title",
  "youtube_id": "dQw4w9WgXcQ",
  "category": "Interviews",
  "description": "Description",
  "year": 2007
}
```

### Add a Quote

```json
{
  "id": "quote-78",
  "quote": "The quote text.",
  "source": "Stanford 2005",
  "year": 2005
}
```

### Modify Theme

Edit CSS custom properties in `src/css/styles.css`:

```css
:root {
  --color-bg: #000000;
  --color-text-primary: #f5f5f7;
  --color-accent: #2997ff;
}
```

## Infrastructure Details

### DNS (GoDaddy)

- Domain: `myeye.cloud`
- www CNAME: `steve-jobs-archive.pages.dev`

### Cloudflare

- Account ID: `cd63df5d51174dd5a46564c13212c832`
- Project: `steve-jobs-archive`
- Build output: `src`
- Build command: (none - static)

### GitHub

- Org: `loudfair`
- Repo: `steve-jobs-archive`
- Branch: `main`
- Auto-deploy: **ENABLED**

## Project History

- **Created:** January 2026
- **Merged from:** 4 source folders with Steve Jobs content
- **Original issues:** Corrupted JSON files in source folders
- **Quotes expanded:** 20 → 77 via web scraping
- **Videos:** 43 unique YouTube videos

## Security

- No secrets in repository
- No API keys required (static site)
- Credentials managed externally (GoDaddy, Cloudflare)
- Security headers in `_headers` file

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ index   │  │ browse  │  │ quotes  │                 │
│  │ .html   │  │ .html   │  │ .html   │                 │
│  └────┬────┘  └────┬────┘  └────┬────┘                 │
│       │            │            │                       │
│       └────────────┼────────────┘                       │
│                    ▼                                    │
│            ┌──────────────┐                             │
│            │ styles.css   │                             │
│            └──────────────┘                             │
│                    │                                    │
│       ┌────────────┼────────────┐                       │
│       ▼            ▼            ▼                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ main.js │  │browse.js│  │quotes.js│                 │
│  └────┬────┘  └────┬────┘  └────┬────┘                 │
│       │            │            │                       │
│       └────────────┼────────────┘                       │
│                    ▼                                    │
│         ┌───────────────────┐                           │
│         │content_database   │                           │
│         │     .json         │                           │
│         └─────────┬─────────┘                           │
└───────────────────┼─────────────────────────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │   YouTube API   │
          │  (thumbnails +  │
          │    playback)    │
          └─────────────────┘
```

## Data Flow

```
User visits page
       │
       ▼
DOMContentLoaded fires
       │
       ▼
Fetch content_database.json
       │
       ▼
Render cards/quotes/timeline
       │
       ▼
User clicks video play
       │
       ▼
YouTube IFrame API loads
       │
       ▼
Video streams from YouTube
```

---

_"The people who are crazy enough to think they can change the world are the ones who do."_

**Last Updated:** January 2026
