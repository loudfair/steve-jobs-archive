/**
 * Steve Jobs Archive - Browse Page JavaScript
 * Handles filtering, sorting, and display of video archive
 */

// ============================================
// DOM Elements
// ============================================
const videoGrid = document.getElementById('video-grid');
const filterBar = document.getElementById('filter-bar');
const sortSelect = document.getElementById('sort-select');
const resultsCount = document.getElementById('results-count');

// ============================================
// State
// ============================================
let allVideos = [];
let currentFilter = 'all';
let currentSort = 'date-desc';

// ============================================
// Display Functions
// ============================================
function displayVideos(videos) {
    if (!videoGrid) return;

    videoGrid.innerHTML = '';

    if (videos.length === 0) {
        videoGrid.innerHTML = '<div class="empty-state">No videos found matching your criteria.</div>';
        updateResultsCount(0);
        return;
    }

    videos.forEach(video => {
        const card = window.createVideoCard(video);
        videoGrid.appendChild(card);
    });

    updateResultsCount(videos.length);
    window.observeAnimations(videoGrid);
}

function updateResultsCount(count) {
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} ${count === 1 ? 'item' : 'items'}`;
    }
}

// ============================================
// Filter & Sort
// ============================================
function filterAndSortVideos() {
    let filteredVideos = [...allVideos];

    // Apply filter
    if (currentFilter !== 'all') {
        filteredVideos = filteredVideos.filter(video =>
            (video.category || '').toLowerCase() === currentFilter.toLowerCase()
        );
    }

    // Apply sort
    switch (currentSort) {
        case 'date-desc':
            filteredVideos.sort((a, b) => (b.year || 0) - (a.year || 0));
            break;
        case 'date-asc':
            filteredVideos.sort((a, b) => (a.year || 0) - (b.year || 0));
            break;
        case 'title-asc':
            filteredVideos.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            break;
    }

    displayVideos(filteredVideos);
}

// ============================================
// Event Handlers
// ============================================
function handleFilterClick(event) {
    const button = event.target.closest('.filter-btn');
    if (!button) return;

    // Update active state
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');

    // Update filter and re-render
    currentFilter = button.dataset.filter;
    filterAndSortVideos();
}

function handleSortChange(event) {
    currentSort = event.target.value;
    filterAndSortVideos();
}

// ============================================
// Initialisation
// ============================================
async function initBrowsePage() {
    console.log('Browse.js: Initialising browse page');

    // Load content
    const data = await window.loadContentDatabase();

    if (!data || !data.videos) {
        videoGrid.innerHTML = '<div class="empty-state">Error loading content. Please refresh the page.</div>';
        return;
    }

    allVideos = data.videos;
    console.log(`Loaded ${allVideos.length} videos`);

    // Initial render
    filterAndSortVideos();

    // Attach event listeners
    if (filterBar) {
        filterBar.addEventListener('click', handleFilterClick);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
}

// Wait for main.js to load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure main.js functions are available
    setTimeout(initBrowsePage, 100);
});
