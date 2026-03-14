/**
 * Global Search Logic
 * Handles indexing and real-time searching of 22 topic pages (0-21).
 */

// Initialize search when language data is ready
document.addEventListener('languageChanged', () => {
    initSearch();
});

function initSearch() {
    const searchInput = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchInput || !resultsContainer) return;

    // Index all pages (0-21)
    const topics = [];
    const content = window.LanguageManager ? window.LanguageManager.currentLangData : null;
    
    if (content && content.pages_content) {
        // Categories mapping for badges
        const categories = {
            'page0': 'Preparation',
            'page1': 'Spirit of Eid', 'page2': 'Spirit of Eid', 'page3': 'Spirit of Eid', 
            'page4': 'Spirit of Eid', 'page5': 'Spirit of Eid', 'page6': 'Spirit of Eid', 'page7': 'Spirit of Eid',
            'page8': 'Prayer Guide', 'page9': 'Prayer Guide', 'page10': 'Prayer Guide', 'page11': 'Prayer Guide',
            'page12': 'Sadaqah Guide', 'page13': 'Sadaqah Guide', 'page14': 'Sadaqah Guide', 
            'page15': 'Sadaqah Guide', 'page16': 'Sadaqah Guide', 'page17': 'Sadaqah Guide',
            'page18': 'Wisdom', 'page19': 'Wisdom', 'page20': 'Wisdom', 'page21': 'Summary'
        };

        for (let i = 0; i <= 21; i++) {
            const pageKey = `page${i}`;
            const page = content.pages_content[pageKey];
            if (page) {
                topics.push({
                    id: i,
                    url: `page-${i}.html`,
                    title: page.title || 'Untitled',
                    category: categories[pageKey] || 'General',
                    // Recursively collect all text strings for deep search
                    text: flattenText(page)
                });
            }
        }
    }

    // Helper: Flatten object values into a single string
    function flattenText(obj) {
        let text = "";
        for (const key in obj) {
            if (typeof obj[key] === "string") {
                text += obj[key] + " ";
            } else if (typeof obj[key] === "object") {
                text += flattenText(obj[key]) + " ";
            }
        }
        return text.trim();
    }

    // Search event
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (query.length < 2) return;

        const matches = topics.filter(topic => 
            topic.title.toLowerCase().includes(query) || 
            topic.text.toLowerCase().includes(query)
        );

        // Results Header
        if (matches.length > 0) {
            const header = document.createElement('div');
            header.className = 'px-3 py-2 mb-2 small text-muted text-uppercase fw-bold border-bottom d-flex justify-content-between';
            header.innerHTML = `<span>Results Found</span> <span class="badge bg-primary-theme">${matches.length}</span>`;
            resultsContainer.appendChild(header);

            matches.forEach(match => {
                const item = document.createElement('a');
                item.href = match.url;
                item.className = 'list-group-item list-group-item-action py-3 border-0 rounded-4 mb-3 shadow-sm result-item';
                
                // Highlight match in title
                const highlightedTitle = match.title.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
                
                // Generate Snippet
                let snippet = "";
                const textLower = match.text.toLowerCase();
                const index = textLower.indexOf(query);
                
                if (index !== -1) {
                    const start = Math.max(0, index - 40);
                    const end = Math.min(match.text.length, index + 60);
                    snippet = (start > 0 ? "..." : "") + 
                              match.text.substring(start, end).replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>') + 
                              (end < match.text.length ? "..." : "");
                }

                item.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <div class="pe-3">
                            <span class="badge bg-soft-primary text-primary-theme mb-2 small">${match.category}</span>
                            <h6 class="mb-1 fw-bold text-dark fs-5">${highlightedTitle}</h6>
                            <p class="text-muted small mb-0 snippet-text">${snippet}</p>
                        </div>
                        <i class="fa-solid fa-chevron-right text-accent opacity-50 mt-2"></i>
                    </div>
                `;
                resultsContainer.appendChild(item);
            });
        } else {
            const noResults = document.createElement('div');
            noResults.className = 'text-center py-5 text-muted';
            noResults.innerHTML = `
                <div class="mb-3 opacity-25"><i class="fa-solid fa-magnifying-glass fa-4x"></i></div>
                <h5 class="fw-bold mb-1" data-i18n="search.no_results">No results found</h5>
                <p class="small">Try searching for different keywords like "Prayer", "Dates", or "Urdu"</p>
            `;
            resultsContainer.appendChild(noResults);
        }
    });

    // Modal Events
    const searchModal = document.getElementById('searchModal');
    if (searchModal) {
        searchModal.addEventListener('shown.bs.modal', () => searchInput.focus());
        searchModal.addEventListener('hidden.bs.modal', () => {
            searchInput.value = '';
            resultsContainer.innerHTML = '';
        });
    }

    // Handle Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const firstResult = resultsContainer.querySelector('.result-item');
            if (firstResult) firstResult.click();
        }
    });
}

// Boot
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initSearch, 100));
} else {
    setTimeout(initSearch, 100);
}
