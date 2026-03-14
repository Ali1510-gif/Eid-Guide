/**
 * Shawwal 6-Day Fasting Tracker
 * Handles persistent storage and dynamic UI for tracking post-Eid fasts.
 */

class ShawwalTracker {
    constructor() {
        this.storageKey = 'shawwalTrackerStatus';
        this.totalDays = 6;
        this.containerId = 'shawwal-tracker-container';
        this.state = this.loadState();
        
        this.init();
    }

    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading ShawwalTracker state:', e);
        }
        return new Array(this.totalDays).fill(false);
    }

    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) {
            console.error('Error saving ShawwalTracker state:', e);
        }
        this.updateProgressUI();
    }

    init() {
        console.log('ShawwalTracker initializing...');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        console.log('ShawwalTracker ready.');
        
        // Ensure we at least show a loading state if data is pending
        this.renderLoading();

        // Listen for language changes (including the initial one)
        document.addEventListener('languageChanged', (e) => {
            console.log('Language changed event received:', e.detail?.lang);
            this.render();
        });

        // If language data is ALREADY loaded, render now
        if (window.LanguageManager && window.LanguageManager.currentLangData) {
            this.render();
        }
    }

    renderLoading() {
        const container = document.getElementById(this.containerId);
        if (container && !container.innerHTML.trim()) {
            container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div></div>';
        }
    }

    getTranslation(path, fallback) {
        if (window.LanguageManager && window.LanguageManager.currentLangData) {
            const translation = window.LanguageManager.getValueFromPath(window.LanguageManager.currentLangData, path);
            if (translation) return translation;
        }
        return fallback;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Shawwal Tracker container not found!');
            return;
        }

        const title = this.getTranslation('shawwal_tracker.title', '6 Days of Shawwal');
        const desc = this.getTranslation('shawwal_tracker.desc', 'Track your recommended Shawwal fasts.');
        const dayLabel = this.getTranslation('shawwal_tracker.day_label', 'Day');

        container.innerHTML = `
            <div class="content-card shawwal-tracker-card p-4 p-md-5">
                <div class="row align-items-center">
                    <div class="col-lg-8">
                        <h2 class="fw-bold mb-3">
                            <i class="fa-solid fa-moon text-accent me-2"></i> ${title}
                        </h2>
                        <p class="text-muted mb-4">${desc}</p>
                    </div>
                    <div class="col-lg-4 text-center text-lg-end mb-4 mb-lg-0">
                        <div class="shawwal-progress-circle">
                            <span id="shawwal-progress-text">0/6</span>
                        </div>
                    </div>
                </div>

                <div class="shawwal-days-grid d-flex flex-wrap justify-content-center gap-3 mb-4">
                    ${this.state.map((isDone, idx) => `
                        <div class="shawwal-day-box ${isDone ? 'completed' : ''}" 
                             data-day="${idx}" 
                             onclick="window.shawwalTracker.toggleDay(${idx})">
                            <span class="day-num">${dayLabel} ${idx + 1}</span>
                            <div class="status-icon">
                                <i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-circle'}"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div id="shawwal-completion-msg" class="alert bg-soft-primary text-center d-none animate__animated animate__fadeIn">
                    <i class="fa-solid fa-star text-warning me-2"></i>
                    ${this.getTranslation('shawwal_tracker.completed_msg', "Mubarak! You've completed your fasts.")}
                </div>
            </div>
        `;

        this.updateProgressUI();
        
        // Re-trigger translation for any missed data-i18n
        if (window.LanguageManager) window.LanguageManager.applyTranslations();
    }

    toggleDay(index) {
        this.state[index] = !this.state[index];
        this.saveState();
        this.render(); // Re-render for UI updates
        
        // Fire confetti if newly completed
        if (this.state.every(day => day)) {
            if (typeof AchievementSystem !== 'undefined') {
                AchievementSystem.fireConfetti();
            }
        }
    }

    updateProgressUI() {
        const completed = this.state.filter(day => day).length;
        const textElement = document.getElementById('shawwal-progress-text');
        const completionMsg = document.getElementById('shawwal-completion-msg');

        if (textElement) {
            textElement.textContent = `${completed}/6`;
        }

        if (completionMsg) {
            if (completed === 6) {
                completionMsg.classList.remove('d-none');
            } else {
                completionMsg.classList.add('d-none');
            }
        }
    }
}

// Global instance for easy access in spans/onclicks
window.shawwalTracker = new ShawwalTracker();
