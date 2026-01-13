# System Architecture

## Overview

The Steve Jobs Archive is a static website built with HTML, CSS, and JavaScript. It requires no backend server and can be deployed to any static hosting service.

## Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
    end

    subgraph Application["Application Layer"]
        subgraph Pages["HTML Pages"]
            Index[index.html]
            Browse[browse.html]
            Quotes[quotes.html]
        end

        subgraph Styles["Styling"]
            CSS[styles.css]
        end

        subgraph Scripts["JavaScript"]
            Main[main.js]
            BrowseJS[browse.js]
            QuotesJS[quotes.js]
        end
    end

    subgraph Data["Data Layer"]
        JSON[(content_database.json)]
    end

    subgraph External["External Services"]
        YouTube[YouTube IFrame API]
        Thumbnails[YouTube Thumbnails CDN]
    end

    Browser --> Pages
    Pages --> CSS
    Pages --> Scripts
    Scripts --> JSON
    Scripts --> YouTube
    Scripts --> Thumbnails
```

## Component Structure

```mermaid
graph TD
    subgraph "HTML Structure"
        Header[Header/Navigation]
        Hero[Hero Section]
        Timeline[Timeline Section]
        Featured[Featured Videos]
        QuotesSection[Quotes Section]
        BrowseCTA[Browse CTA]
        Footer[Footer]
    end

    subgraph "JavaScript Modules"
        MainJS[main.js]
        BrowseJS[browse.js]
        QuotesJS[quotes.js]
    end

    MainJS --> Header
    MainJS --> Hero
    MainJS --> Timeline
    MainJS --> Featured
    MainJS --> QuotesSection

    BrowseJS --> |Filter/Sort| VideoGrid[Video Grid]
    QuotesJS --> |Render| QuotesList[Quotes List]
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant MainJS as main.js
    participant BrowseJS as browse.js
    participant JSON as content_database.json
    participant YouTube

    User->>Browser: Navigate to site
    Browser->>MainJS: Load script
    MainJS->>JSON: Fetch content
    JSON-->>MainJS: Return data

    alt Home Page
        MainJS->>Browser: Render timeline
        MainJS->>Browser: Render featured videos
        MainJS->>Browser: Render quotes
    end

    alt Browse Page
        MainJS->>BrowseJS: Data available
        BrowseJS->>Browser: Render video grid
        User->>Browser: Click filter
        BrowseJS->>Browser: Re-render filtered
    end

    User->>Browser: Click play button
    MainJS->>YouTube: Create player
    YouTube-->>Browser: Stream video
```

## File Structure

```
src/
├── index.html          # Home page
├── browse.html         # Browse archive page
├── quotes.html         # Quotes collection
├── css/
│   └── styles.css      # All styling (750+ lines)
├── js/
│   ├── main.js         # Core functionality (200+ lines)
│   ├── browse.js       # Browse page logic (100+ lines)
│   └── quotes.js       # Quotes page logic (80+ lines)
├── data/
│   └── content_database.json  # All content (40+ videos, 20+ quotes)
└── assets/
    └── images/         # Optional local images
```

## Key Features

### 1. Content Database

Single JSON file containing:

- 40+ video entries with YouTube IDs
- 20+ curated quotes with sources
- 12 timeline events
- Category definitions

### 2. Filter System

- Category-based filtering (Interviews, Speeches, etc.)
- Sort options (date, title)
- Real-time count updates

### 3. YouTube Integration

- YouTube IFrame API for embedded playback
- Fallback to direct iframe if API fails
- Lazy loading of thumbnails

### 4. Responsive Design

- Mobile-first approach
- CSS Grid and Flexbox layouts
- Breakpoints: 480px, 768px, 1024px

### 5. Animations

- Intersection Observer for scroll animations
- Staggered card animations
- Smooth transitions

## Performance Considerations

| Aspect    | Implementation                              |
| --------- | ------------------------------------------- |
| Loading   | Lazy load images, defer non-critical JS     |
| Rendering | CSS transitions, GPU-accelerated animations |
| Data      | Single JSON fetch, cached in memory         |
| Images    | YouTube CDN thumbnails, SVG fallbacks       |
| Fonts     | System font stack (no external fonts)       |

## Security

- No user input processing
- No authentication required
- No sensitive data storage
- Content from public sources only
- YouTube embed API (sandboxed iframes)
