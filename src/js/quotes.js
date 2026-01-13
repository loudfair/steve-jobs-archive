/**
 * Steve Jobs Archive - Quotes Page JavaScript
 * Handles loading and display of quotes collection
 */

// ============================================
// DOM Elements
// ============================================
const quotesGrid = document.getElementById("quotes-grid");

// ============================================
// Quote Rendering
// ============================================
function renderQuotes(quotes) {
  if (!quotesGrid || !quotes) return;

  quotesGrid.innerHTML = quotes
    .map(
      (quote) => `
        <article class="quote-item">
            <blockquote>${quote.quote}</blockquote>
            <div class="quote-source">
                ${quote.source || "Steve Jobs"}
                ${quote.year ? `<span class="quote-year">${quote.year}</span>` : ""}
            </div>
        </article>
    `,
    )
    .join("");

  // Animate quotes on scroll
  observeQuotes();
}

function observeQuotes() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px",
    },
  );

  quotesGrid.querySelectorAll(".quote-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// ============================================
// Data Loading
// ============================================
async function loadQuotes() {
  try {
    const response = await fetch("data/content_database.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();

    if (data.quotes && data.quotes.length > 0) {
      renderQuotes(data.quotes);
    } else {
      quotesGrid.innerHTML = '<div class="empty-state">No quotes found.</div>';
    }
  } catch (error) {
    console.error("Error loading quotes:", error);
    quotesGrid.innerHTML =
      '<div class="empty-state">Error loading quotes. Please refresh the page.</div>';
  }
}

// ============================================
// Initialisation
// ============================================
document.addEventListener("DOMContentLoaded", loadQuotes);
