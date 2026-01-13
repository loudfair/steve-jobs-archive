/**
 * Steve Jobs Archive - Main JavaScript
 * Handles core functionality, YouTube player, and home page features
 */

// ============================================
// Global State
// ============================================
let contentDatabase = null;
let ytPlayerReady = false;
const players = {};

// ============================================
// YouTube Player API
// ============================================
function onYouTubeIframeAPIReady() {
  ytPlayerReady = true;
  console.log("YouTube IFrame API ready");
}

/**
 * Create a YouTube player in the specified container
 * @param {string} videoId - YouTube video ID
 * @param {HTMLElement} container - Container element for the player
 */
window.createPlayer = function (videoId, container) {
  if (!videoId || !container) {
    console.error("createPlayer: Missing videoId or container");
    return;
  }

  // Clear the container and create player wrapper
  container.innerHTML = "";
  const playerDiv = document.createElement("div");
  playerDiv.id = `player-${videoId}-${Date.now()}`;
  container.appendChild(playerDiv);

  if (ytPlayerReady && typeof YT !== "undefined" && YT.Player) {
    try {
      players[videoId] = new YT.Player(playerDiv.id, {
        videoId: videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onError: function (event) {
            console.error("YouTube player error:", event.data);
            showPlayerFallback(container, videoId);
          },
        },
      });
    } catch (error) {
      console.error("Error creating YouTube player:", error);
      showPlayerFallback(container, videoId);
    }
  } else {
    // Fallback to iframe if API not ready
    showPlayerFallback(container, videoId);
  }
};

/**
 * Show fallback player (direct iframe)
 */
function showPlayerFallback(container, videoId) {
  container.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        </iframe>
    `;
}

// ============================================
// Data Loading
// ============================================
async function loadContentDatabase() {
  if (contentDatabase) return contentDatabase;

  try {
    const response = await fetch("data/content_database.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    contentDatabase = await response.json();
    console.log("Content database loaded:", contentDatabase);
    return contentDatabase;
  } catch (error) {
    console.error("Error loading content database:", error);
    return null;
  }
}

// ============================================
// Card Creation
// ============================================
function createVideoCard(video) {
  const card = document.createElement("article");
  card.className = "card animate-on-scroll";
  card.dataset.category = video.category || "Unknown";

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;

  card.innerHTML = `
        <div class="card-media video-player" data-video-id="${video.youtube_id}">
            <img src="${thumbnailUrl}" alt="${video.title}" loading="lazy"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 320 180%27%3E%3Crect fill=%27%231d1d1f%27 width=%27320%27 height=%27180%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%23666%27 font-family=%27system-ui%27%3ENo Thumbnail%3C/text%3E%3C/svg%3E'">
            <button class="play-button" aria-label="Play video" data-video-id="${video.youtube_id}"></button>
        </div>
        <div class="card-content">
            <h3>${video.title}</h3>
            <p>${video.description || ""}</p>
            <span class="card-meta">${video.year || ""} &bull; ${video.category || ""}</span>
        </div>
    `;

  // Add click handler for play button
  const playButton = card.querySelector(".play-button");
  const mediaContainer = card.querySelector(".card-media");

  playButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.createPlayer(video.youtube_id, mediaContainer);
  });

  return card;
}

// ============================================
// Home Page Functions
// ============================================
function renderTimeline(timeline) {
  const container = document.getElementById("timeline-container");
  if (!container || !timeline) return;

  container.innerHTML = timeline
    .map(
      (item) => `
        <div class="timeline-item animate-on-scroll">
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </div>
    `,
    )
    .join("");

  observeAnimations(container);
}

function renderFeaturedVideos(videos) {
  const container = document.getElementById("featured-grid");
  if (!container || !videos) return;

  const featured = videos.filter((v) => v.featured).slice(0, 3);
  container.innerHTML = "";

  featured.forEach((video) => {
    container.appendChild(createVideoCard(video));
  });

  observeAnimations(container);
}

function renderFeaturedQuotes(quotes) {
  const container = document.getElementById("quotes-container");
  if (!container || !quotes) return;

  const featured = quotes.filter((q) => q.featured).slice(0, 3);

  container.innerHTML = featured
    .map(
      (quote) => `
        <div class="quote-card animate-on-scroll">
            <p class="quote-text">"${quote.quote}"</p>
            <span class="quote-attribution">${quote.source || ""}</span>
        </div>
    `,
    )
    .join("");

  observeAnimations(container);
}

// ============================================
// Animation Observer
// ============================================
function observeAnimations(container) {
  if (!container) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  container.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

// ============================================
// Initialisation
// ============================================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Main.js: DOMContentLoaded");

  // Check if we're on the home page
  const isHomePage = document.getElementById("timeline-container") !== null;

  if (isHomePage) {
    const data = await loadContentDatabase();

    if (data) {
      renderTimeline(data.timeline);
      renderFeaturedVideos(data.videos);
      renderFeaturedQuotes(data.quotes);
    }
  }

  // Observe any existing animated elements
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
  });
});

// Export for use in other scripts
window.loadContentDatabase = loadContentDatabase;
window.createVideoCard = createVideoCard;
window.observeAnimations = observeAnimations;
