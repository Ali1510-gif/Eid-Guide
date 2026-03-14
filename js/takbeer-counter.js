/**
 * Interactive Takbeer Counter
 * A digital 'Tasbeeh' for reciting the Eid Takbeerat.
 */

class TakbeerCounter {
    constructor() {
        this.containerId = 'takbeer-counter-container';
        this.storageKey = 'takbeerCount';
        this.count = this.loadCount();
        this.init();
    }

    loadCount() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? parseInt(saved) : 0;
    }

    saveCount() {
        localStorage.setItem(this.storageKey, this.count);
        this.updateUI();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        console.log('TakbeerCounter: onReady called');
        
        // Initial render attempts
        this.render();

        // Listen for language changes (including the initial one)
        document.addEventListener('languageChanged', (e) => {
            console.log('TakbeerCounter: Language change detected', e.detail?.lang);
            this.render();
        });

        // Forced render if language data is already present
        if (window.LanguageManager && window.LanguageManager.currentLangData) {
            console.log('TakbeerCounter: Language data already present, rendering...');
            this.render();
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
        console.log('TakbeerCounter: rendering to container', this.containerId);
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('TakbeerCounter: Container NOT FOUND');
            return;
        }

        const title = this.getTranslation('takbeer_counter.title', 'Takbeer Counter');
        const desc = this.getTranslation('takbeer_counter.desc', 'Recite the Eid Takbeerat.');
        const takbeerText = this.getTranslation('takbeer_counter.takbeer_text', 'Allahu Akbar, Allahu Akbar, La ilaha illallah, Wallahu Akbar, Allahu Akbar, wa lillahil hamd');
        const countLabel = this.getTranslation('takbeer_counter.count_label', 'Recitations');
        const resetBtn = this.getTranslation('takbeer_counter.reset_btn', 'Reset');

        container.innerHTML = `
            <div class="takbeer-premium-card glass-card p-4 p-md-5 mt-4 text-center">
                <div class="card-glow"></div>
                
                <div class="mb-4">
                    <span class="badge bg-soft-primary px-3 py-2 rounded-pill mb-3">Spiritual Engagement</span>
                    <h2 class="fw-bold text-dark">
                        <i class="fa-solid fa-microphone-lines text-accent me-2"></i> ${title}
                    </h2>
                    <p class="text-muted">${desc}</p>
                </div>
                
                <div class="takbeer-display-modern p-4 mb-5">
                    <div class="takbeer-glass-box p-4 animate__animated animate__fadeIn">
                        <p id="takbeer-arabic" class="arabic-text-main">
                            ${takbeerText}
                        </p>
                    </div>
                </div>

                <div class="counter-display-area mb-5">
                    <div class="modern-counter-ring" onclick="window.takbeerCounter.increment()">
                        <div class="ring-status-glow"></div>
                        <div class="counter-inner-content">
                            <h2 id="takbeer-count-display" class="display-2 fw-bold mb-0">${this.count}</h2>
                            <span class="text-uppercase tracking-widest small fw-bold text-muted">${countLabel}</span>
                        </div>
                        <div class="tap-hint">Tap to Count</div>
                    </div>
                </div>

                <div class="takbeer-buttons-container d-flex flex-column flex-sm-row justify-content-center gap-3 pb-4">
                    <button class="btn btn-premium btn-accent-premium px-4 py-3 rounded-pill w-100" onclick="window.takbeerCounter.shareMilestone()">
                        <i class="fa-solid fa-share-nodes me-2"></i> ${this.getTranslation('takbeer_counter.share_btn', 'Share Milestone')}
                    </button>
                    <button class="btn btn-premium btn-outline-danger px-4 py-3 rounded-pill w-100" onclick="window.takbeerCounter.reset()">
                        <i class="fa-solid fa-rotate-left me-2"></i> ${resetBtn}
                    </button>
                </div>
            </div> <!-- Added missing closing div for takbeer-premium-card -->

            <!-- Hidden Share Card Template for Takbeer -->
            <div id="takbeer-share-template" style="position: fixed; left: -9999px; top: 0;">
                <div id="takbeer-share-card" class="share-card-canvas" style="background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%); width: 400px; padding: 50px; text-align: center; color: white;">
                    <div class="card-pattern"></div>
                    <div class="card-content-inner">
                        <div class="mb-4">
                            <i class="fa-solid fa-kaaba" style="font-size: 4rem; color: #F59E0B;"></i>
                        </div>
                        <h2 class="fw-bold mb-4" style="font-size: 2.2rem; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 15px;">Eid Takbeerat</h2>
                        
                        <div class="mb-5 bg-white bg-opacity-10 rounded-4 p-4">
                            <p class="mb-1 opacity-75 small text-uppercase tracking-widest">Digital Tasbeeh</p>
                            <h3 style="font-size: 3.5rem; color: #10B981; font-weight: 800; margin: 0;">
                                <span id="share-takbeer-count">0</span>
                            </h3>
                            <p class="mb-0 opacity-75">Recitations Completed</p>
                        </div>

                        <div class="takbeer-arabic-mini mb-4 opacity-90" style="font-family: 'Noto Nastaliq Urdu', serif; font-size: 1.1rem; line-height: 2;">
                            ${takbeerText}
                        </div>

                        <div class="mt-5 pt-4 border-top border-white border-opacity-20">
                            <p class="small opacity-75 mb-0">www.eidguide.com</p>
                            <p class="small fw-bold opacity-100" style="color: #F59E0B;">Sunnah-Aligned Celebration</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

    }

    increment() {
        this.count++;
        this.saveCount();
        
        // Haptic feedback
        if ('vibrate' in navigator) navigator.vibrate(50);

        const ring = document.querySelector('.modern-counter-ring');
        if (ring) {
            ring.classList.add('tap-pulse');
            setTimeout(() => ring.classList.remove('tap-pulse'), 200);
        }

        const display = document.getElementById('takbeer-count-display');
        if (display) {
            display.textContent = this.count;
            display.classList.add('animate__animated', 'animate__bounceIn');
            setTimeout(() => display.classList.remove('animate__animated', 'animate__bounceIn'), 500);
        }
    }

    reset() {
        if (confirm('Reset Takbeer count?')) {
            this.count = 0;
            this.saveCount();
            this.render();
        }
    }

    updateUI() {
        const display = document.getElementById('takbeer-count-display');
        if (display) display.textContent = this.count;
    }

    shareMilestone() {
        const shareCard = document.getElementById('takbeer-share-card');
        if (!shareCard || typeof html2canvas === 'undefined') {
            alert('Sharing module is loading, please try again.');
            return;
        }

        // Update Share Card Content
        document.getElementById('share-takbeer-count').textContent = this.count;

        const btn = event.currentTarget;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Generating...';
        btn.disabled = true;

        html2canvas(shareCard, {
            scale: 2,
            useCORS: true,
            backgroundColor: null
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Takbeer-Milestone-${this.count}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            btn.innerHTML = '<i class="fa-solid fa-check me-2"></i> Downloaded!';
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }, 2000);
        });
    }
}

// Global instance
window.takbeerCounter = new TakbeerCounter();

