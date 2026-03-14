/**
 * Language Switcher for Eid Guide
 * Fetches JSON files and updates DOM elements with data-i18n attributes
 */

const LanguageManager = {
  currentLang: localStorage.getItem('eidGuideLang') || 'english',
  currentLangData: null,

  init() {
    this.loadLanguage(this.currentLang);
    this.bindEvents();
  },

  async loadLanguage(lang) {
    try {
      console.log(`LanguageManager: Loading ${lang}...`);
      const response = await fetch(`data/${lang}.json`);
      if (!response.ok) throw new Error(`Translation file for ${lang} not found`);
      
      const data = await response.json();
      this.currentLangData = data;
      this.currentLang = lang;
      
      localStorage.setItem('eidGuideLang', lang);
      
      this.updatePageContent();
      
      // Notify other components
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
      
      // Add RTL support for Urdu
      if (lang === 'urdu') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('lang-urdu');
      } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('lang-urdu');
      }
    } catch (error) {
      console.error('LanguageManager: Error loading language:', error);
      // Fallback or early exit to prevent app hang
      document.dispatchEvent(new CustomEvent('languageLoadError', { detail: { error } }));
    }
  },

  updatePageContent() {
    this.applyTranslations();
    this.updateUI();
  },


  applyTranslations() {
    if (!this.currentLangData) return;
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const path = el.getAttribute('data-i18n');
      const translation = this.getValueFromPath(this.currentLangData, path);
      
      if (translation) {
        if (el.tagName === 'INPUT' && el.type === 'placeholder') {
          el.placeholder = translation;
        } else {
          el.innerHTML = translation;
        }
      }
    });
  },

  getValueFromPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  },

  bindEvents() {
    // We bind using event delegation since the navbar might be loaded dynamically
    document.addEventListener('click', (e) => {
      const langBtn = e.target.closest('.language-select');
      if (langBtn) {
        e.preventDefault();
        const lang = langBtn.getAttribute('data-lang');
        this.loadLanguage(lang);
      }
    });
  },

  updateUI() {
    // Update the dropdown display
    const currentDisplay = document.getElementById('currentLangDisplay');
    if (currentDisplay) {
      const activeItem = document.querySelector(`.language-select[data-lang="${this.currentLang}"]`);
      if (activeItem) {
        currentDisplay.textContent = activeItem.getAttribute('data-display');
        
        // Update active class
        document.querySelectorAll('.language-select').forEach(el => el.classList.remove('active'));
        activeItem.classList.add('active');
      }
    }
  }
};

window.LanguageManager = LanguageManager;
