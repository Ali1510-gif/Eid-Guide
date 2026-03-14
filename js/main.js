/**
 * Main JavaScript for Eid Guide
 * Handles initialization, component injection, and external libraries
 */

class ThemeSwitcher {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        document.addEventListener('DOMContentLoaded', () => {
            this.updateToggleButton();
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    this.theme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                    this.updateToggleButton();
                }
            });
        });
        document.addEventListener('componentsLoaded', () => this.updateToggleButton());
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        this.updateToggleButton();
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: this.theme } }));
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.body.setAttribute('data-theme', this.theme);
    }

    updateToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (!toggleBtn) return;
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            if (this.theme === 'dark') {
                icon.className = 'fa-solid fa-sun';
                toggleBtn.classList.add('btn-warning');
                toggleBtn.classList.remove('btn-outline-theme');
            } else {
                icon.className = 'fa-solid fa-moon';
                toggleBtn.classList.remove('btn-warning');
                toggleBtn.classList.add('btn-outline-theme');
            }
        }
    }
}
window.ThemeSwitcher = new ThemeSwitcher();

document.addEventListener('DOMContentLoaded', async () => {

  // Load UI Components
  await loadComponents();
  
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });
  }

  // Initialize Language Manager
  if (typeof LanguageManager !== 'undefined') {
    LanguageManager.init();
  }

  // Initialize Achievement System
  if (typeof AchievementSystem !== 'undefined') {
    AchievementSystem.init();
  }

  // Initialize AI Sunnah Assistant
  if (typeof AISunnahAssistant !== 'undefined') {
    AISunnahAssistant.init();
  }

  // Set active nav link based on current page
  setActiveNavLink();

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => {
          console.log('Service Worker registered:', reg);
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
               if (newWorker.state === 'activated') {
                 // The new SW is ready, but we use controllerchange for the reload
               }
            });
          });
        })
        .catch(err => console.log('Service Worker registration failed:', err));
    });

    // Reload the page when the new Service Worker takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
       if (!refreshing) {
         window.location.reload();
         refreshing = true;
       }
    });
  }
});

async function loadComponents() {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  try {
    if (navbarPlaceholder) {
      const navRes = await fetch('components/navbar.html');
      navbarPlaceholder.innerHTML = await navRes.text();
    }
    
    if (footerPlaceholder) {
      const footerRes = await fetch('components/footer.html');
      footerPlaceholder.innerHTML = await footerRes.text();
    }

    injectSearchModal();
    injectTOC();
    
    // Notify that components are ready
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  } catch (error) {
    console.error('Error loading components:', error);
  }

}

function injectTOC() {
  if (document.getElementById('tocOffcanvas')) return;

  const tocHtml = `
    <div class="offcanvas offcanvas-start" tabindex="-1" id="tocOffcanvas" aria-labelledby="tocOffcanvasLabel">
      <div class="offcanvas-header bg-primary-theme text-white">
        <h5 class="offcanvas-title" id="tocOffcanvasLabel" data-i18n="toc.title">Eid Guide Index</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-0">
        <div class="list-group list-group-flush">
          <a href="index.html" class="list-group-item list-group-item-action py-3 fw-bold bg-light">
             <i class="fa-solid fa-house me-2"></i> <span data-i18n="nav.home">Home</span>
          </a>
          
          <div class="p-3 bg-light border-bottom">
             <small class="text-uppercase fw-bold text-muted" data-i18n="toc.ch1">Spirit of Eid</small>
          </div>
          <a href="page-0.html" class="list-group-item list-group-item-action ps-4 py-2 border-0 fw-bold text-accent-premium" data-i18n="pages_content.page0.title">Chand Raat Plan</a>
          <a href="page-1.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page1.title">What is Eid-ul-Fitr?</a>
          <a href="page-2.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page2.title">Meaning of Eid</a>
          <a href="page-3.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page3.title">Special Acts</a>
          <a href="page-4.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page4.title">Sunnah of Morning</a>
          <a href="page-5.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page5.title">Fasting on Eid</a>
          <a href="page-6.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page6.title">Etiquettes</a>
          <a href="page-7.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page7.title">Greetings</a>
          
          <div class="p-3 bg-light border-bottom">
             <small class="text-uppercase fw-bold text-muted" data-i18n="toc.ch2">Prayer Guide</small>
          </div>
          <a href="page-8.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page8.title">Ruling & Time</a>
          <a href="page-9.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page9.title">Rak'ahs & Takbeers</a>
          <a href="page-10.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page10.title">How to Pray</a>
          <a href="page-11.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page11.title">Khutbah</a>
          
          <div class="p-3 bg-light border-bottom">
             <small class="text-uppercase fw-bold text-muted" data-i18n="toc.ch3">Sadaqah Guide</small>
          </div>
          <a href="page-12.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page12.title">Sadaqat-ul-Fitr</a>
          <a href="page-13.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page13.title">Obligation</a>
          <a href="page-14.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page14.title">Amount</a>
          <a href="page-15.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page15.title">Recipients</a>
          <a href="page-16.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page16.title">When to Give</a>
          <a href="page-17.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page17.title">Benefits</a>
          
          <div class="p-3 bg-light border-bottom">
             <small class="text-uppercase fw-bold text-muted" data-i18n="toc.ch4">Wisdom & Traditions</small>
          </div>
          <a href="page-18.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page18.title">Recommended Acts</a>
          <a href="page-19.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page19.title">Things to Avoid</a>
          <a href="page-20.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page20.title">Wisdom</a>
          <a href="page-21.html" class="list-group-item list-group-item-action ps-4 py-2 border-0" data-i18n="pages_content.page21.title">Summary</a>
        </div>
      </div>
    </div>
  `;

  const tocContainer = document.createElement('div');
  tocContainer.innerHTML = tocHtml;
  document.body.appendChild(tocContainer.firstElementChild);
  
  // Re-apply translations for the newly injected TOC
  if (window.LanguageManager) {
    window.LanguageManager.applyTranslations();
  }
}

function setActiveNavLink() {
  // Wait a small bit to ensure navbar is loaded
  setTimeout(() => {
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, 100);
}

function injectSearchModal() {
  if (document.getElementById('searchModal')) return;

  const searchHtml = `
    <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" id="searchModalLabel" data-i18n="search.title">Search Guide</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4 pt-2">
            <div class="input-group input-group-lg mb-3">
              <span class="input-group-text bg-white border-2 border-end-0" style="border-color: #e5e7eb;">
                <i class="fa-solid fa-magnifying-glass text-muted"></i>
              </span>
              <input type="text" id="global-search-input" class="form-control border-2 border-start-0" 
                data-i18n-placeholder="search.placeholder" placeholder="Type keywords..." style="border-color: #e5e7eb;">
            </div>
            <div id="search-results" class="list-group list-group-flush" style="max-height: 400px; overflow-y: auto;">
              <!-- Results will appear here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const searchContainer = document.createElement('div');
  searchContainer.innerHTML = searchHtml;
  document.body.appendChild(searchContainer.firstElementChild);

  // Load search logic script
  const script = document.createElement('script');
  script.src = 'js/search.js';
  document.body.appendChild(script);
}
