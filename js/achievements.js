/**
 * Achievement & Progress System
 * Tracks visited pages and awards the "Sunnah Companion" badge/certificate.
 */

const AchievementSystem = {
    totalPages: 22,
    progressKey: 'eidGuideProgress',
    checklistKey: 'eidGuideChecklist',
    quizPassedKey: 'eidGuideQuizPassed',
    quizModalId: 'sunnahQuizModal',

    init() {
        this.trackProgress();
        this.checkStatus();
        this.injectQuizModal();
    },

    trackProgress() {
        const currentPath = window.location.pathname.split('/').pop();
        const match = currentPath.match(/page-(\d+)\.html/);
        
        if (match) {
            const pageNum = parseInt(match[1]);
            let progress = JSON.parse(localStorage.getItem(this.progressKey)) || [];
            
            if (!progress.includes(pageNum)) {
                progress.push(pageNum);
                localStorage.setItem(this.progressKey, JSON.stringify(progress));
                console.log(`Progress Tracked: Page ${pageNum}`);
            }
        }
    },

    getProgress() {
        const progress = JSON.parse(localStorage.getItem(this.progressKey)) || [];
        return progress.length;
    },

    isChecklistComplete() {
        const saved = localStorage.getItem(this.checklistKey);
        if (!saved) return false;
        const state = JSON.parse(saved);
        return Object.values(state).every(v => v === true);
    },

    isQuizPassed() {
        return localStorage.getItem(this.quizPassedKey) === 'true';
    },

    checkStatus() {
        const count = this.getProgress();
        
        // Award badge on Page 21 if all pages visited
        if (count >= this.totalPages && window.location.pathname.includes('page-21.html')) {
            this.showAward();
        }
    },

    showAward() {
        const container = document.querySelector('.content-card');
        if (!container || document.getElementById('achievement-badge')) return;

        const isFullyComplete = this.isChecklistComplete();
        const isQuizPassed = this.isQuizPassed();

        const badgeHtml = `
            <div id="achievement-badge" class="text-center p-5 mt-5 rounded-5 border-0 shadow-lg text-white" 
                 style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); position: relative; overflow: hidden;"
                 data-aos="zoom-in">
                
                <div class="position-absolute top-0 start-0 w-100 h-100" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 30c0-8.284-6.716-15-15-15S0 21.716 0 30s6.716 15 15 15 15-6.716 15-15zm0 0c0 8.284 6.716 15 15 15s15-6.716 15-15-6.716-15-15-15-15 6.716-15 15z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E'); opacity: 0.3;"></div>
                
                <div class="position-relative z-1">
                    <div class="mb-3">
                        <i class="fa-solid fa-certificate text-warning" style="font-size: 5rem; filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.5));"></i>
                    </div>
                    <h2 class="fw-bold mb-2" data-i18n="achievements.congrats">Congratulations!</h2>
                    <h4 class="mb-4 text-white-50" data-i18n="achievements.reached_end">You've reached the end of the guide.</h4>
                    <div class="bg-white text-primary-dark d-inline-block px-4 py-2 rounded-5 fw-bold mb-3">
                        <span data-i18n="achievements.sunnah_companion">SUNNAH COMPANION</span>
                    </div>
                    <p class="mb-4 opacity-75 small" data-i18n="achievements.completed_chapters">You have successfully completed all 22 chapters of the Eid Guide.</p>
                    
                    <div id="achievement-actions">
                        ${!isFullyComplete ? `
                            <div class="alert bg-white bg-opacity-10 border-0 text-white py-3 px-4 rounded-4 small">
                                <i class="fa-solid fa-lock me-2"></i> <span data-i18n="achievements.unlock_cert_note">Complete the Eid Checklist to unlock your Official Certification!</span>
                            </div>
                        ` : !isQuizPassed ? `
                            <button class="btn btn-premium btn-accent-premium px-5 py-3 rounded-5 shadow" data-bs-toggle="modal" data-bs-target="#${this.quizModalId}">
                                <i class="fa-solid fa-graduation-cap me-2"></i> <span data-i18n="quiz.btn_start">Take Sunnah Quiz</span>
                            </button>
                        ` : `
                            <button class="btn btn-premium btn-accent-premium px-5 py-3 rounded-5 shadow pulse-animation" onclick="AchievementSystem.generateCertificate(this)">
                                <i class="fa-solid fa-download me-2"></i> <span data-i18n="achievements.claim_cert">Claim Your Official Certificate</span>
                            </button>
                        `}
                    </div>
                </div>
            </div>

            <!-- Hidden Certificate Template -->
            <div id="cert-render-container" style="position: fixed; left: -9999px; top: 0;">
                <div id="cert-wrapper" style="width: 1000px; padding: 60px; background: white; border: 20px solid var(--primary-color); position: relative; overflow: hidden; box-sizing: border-box;">
                    <!-- Border decorations -->
                    <div style="position: absolute; top: 0; left: 0; width: 100px; height: 100px; border-top: 15px solid var(--accent-color); border-left: 15px solid var(--accent-color);"></div>
                    <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; border-top: 15px solid var(--accent-color); border-right: 15px solid var(--accent-color);"></div>
                    <div style="position: absolute; bottom: 0; left: 0; width: 100px; height: 100px; border-bottom: 15px solid var(--accent-color); border-left: 15px solid var(--accent-color);"></div>
                    <div style="position: absolute; bottom: 0; right: 0; width: 100px; height: 100px; border-bottom: 15px solid var(--accent-color); border-right: 15px solid var(--accent-color);"></div>
                    
                    <div id="cert-content-wrapper" translate="no" style="position: relative; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <i class="fa-solid fa-mosque mb-4" style="font-size: 3.5rem; color: var(--primary-color);"></i>
                        
                        <h1 id="cert-title" translate="no" style="font-size: 3.5rem; margin-bottom: 15px; color: var(--primary-color); font-weight: 800; line-height: 1.2;" data-i18n="achievements.cert_content.title">Certificate of Completion</h1>
                        <p id="cert-subtitle" translate="no" style="font-size: 1.3rem; margin-bottom: 35px; color: var(--accent-color); font-weight: 700; text-transform: uppercase;" data-i18n="achievements.cert_content.subtitle">OFFICIAL SUNNAH COMPANION</p>
                        
                        <div style="width: 150px; height: 3px; background: var(--accent-color); margin-bottom: 40px; opacity: 0.6;"></div>
                        
                        <p style="font-size: 1.5rem; color: #444; max-width: 80%; margin-bottom: 50px; line-height: 1.6;" data-i18n="achievements.cert_content.body">This is to certify that you have successfully completed the 22-Step Ultimate Eid Guide and followed the Sunnah Eid Preparation Checklist.</p>

                        <div style="margin-top: 50px; display: flex; justify-content: space-between; width: 80%;">
                            <div style="text-align: center; border-top: 1px solid #ccc; padding-top: 10px; width: 200px;">
                                <small style="display: block; opacity: 0.6;" data-i18n="achievements.cert_content.date_label">DATE</small>
                                <span id="cert-date" style="font-weight: bold;">${new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div>
                                <i class="fa-solid fa-certificate" style="font-size: 4rem; color: var(--accent-color);"></i>
                            </div>
                            <div style="text-align: center; border-top: 1px solid #ccc; padding-top: 10px; width: 200px;">
                                <small style="display: block; opacity: 0.6;" data-i18n="achievements.cert_content.verify_label">VERIFIED BY</small>
                                <span id="cert-verify-name" style="font-weight: bold;" data-i18n="achievements.cert_content.verify_name">Eid Guide Online</span>
                            </div>
                        </div>

                        <div style="position: absolute; bottom: 0; font-size: 0.8rem; opacity: 0.5;" data-i18n="achievements.cert_content.footer">
                            www.eid-guide.com | Empowering the Ummah with Knowledge
                        </div>
                    </div>
                </div>
            </div>
        `;

        const divider = document.createElement('hr');
        divider.className = 'my-5 opacity-0';
        container.appendChild(divider);
        
        const badgeDiv = document.createElement('div');
        badgeDiv.innerHTML = badgeHtml;
        container.appendChild(badgeDiv);

        // Set RTL for Urdu certificate
        if (currentLang === 'urdu') {
            const certWrapper = document.getElementById('cert-wrapper');
            const certElement = document.getElementById('cert-content-wrapper');
            if (certWrapper) {
                certWrapper.style.direction = 'rtl';
                certWrapper.style.lineHeight = '2.4';
                certWrapper.style.letterSpacing = 'normal';
            }
            if (certElement) {
                certElement.style.fontFamily = "'Noto Nastaliq Urdu', serif";
            }
            // Title Adjustment for Urdu
            const certTitle = document.getElementById('cert-title');
            if (certTitle) {
                certTitle.style.fontFamily = "'Noto Nastaliq Urdu', serif";
                certTitle.style.fontSize = '3.2rem';
                certTitle.style.fontWeight = '700';
                certTitle.style.marginBottom = '20px';
                certTitle.style.letterSpacing = 'normal';
                certTitle.style.textShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }
            // Subtitle Adjustment
            const certSubtitle = document.getElementById('cert-subtitle');
            if (certSubtitle) {
                certSubtitle.style.letterSpacing = 'normal';
                certSubtitle.style.fontSize = '1.4rem';
                certSubtitle.style.marginBottom = '40px';
                certSubtitle.style.fontFamily = "'Noto Nastaliq Urdu', serif";
            }
            // Date and Name Adjustment
            const certDate = document.getElementById('cert-date');
            const certVerify = document.getElementById('cert-verify-name');
            if (certDate) {
                certDate.style.letterSpacing = 'normal';
            }
            if (certVerify) {
                certVerify.style.letterSpacing = 'normal';
                certVerify.style.fontFamily = "'Noto Nastaliq Urdu', serif";
                certVerify.style.fontSize = '1.25rem';
            }
        } else {
            // Apply English fonts
            const certTitle = document.getElementById('cert-title');
            const certVerify = document.getElementById('cert-verify-name');
            if (certTitle) certTitle.style.fontFamily = "'Playfair Display', serif";
            if (certVerify) certVerify.style.fontFamily = "'Playfair Display', serif";
        }

        // Set Localized Date
        const dateElement = document.getElementById('cert-date');
        if (dateElement) {
            const now = new Date();
            if (currentLang === 'urdu') {
                // Manual format for Urdu to ensure "Day Month Year" order
                const months = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];
                const urduDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
                dateElement.textContent = urduDate;
            } else {
                const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
                const locale = currentLang === 'hinglish' ? 'hi-IN' : 'en-IN';
                dateElement.textContent = now.toLocaleDateString(locale, dateOptions);
            }
        }

        // Apply translations to the newly injected elements
        if (window.LanguageManager && typeof window.LanguageManager.applyTranslations === 'function') {
            window.LanguageManager.applyTranslations();
        }

        // Confetti effect if just unlocked
        if (isQuizPassed) {
             this.fireConfetti();
        }
    },

    injectQuizModal() {
        if (document.getElementById(this.quizModalId)) return;

        const modalHtml = `
            <div class="modal fade" id="${this.quizModalId}" tabindex="-1" aria-labelledby="quizModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg" style="border-radius: 20px; overflow: hidden;">
                        <div class="modal-header border-0 bg-primary-theme text-white p-4">
                            <h5 class="modal-title fw-bold" id="quizModalLabel">
                                <i class="fa-solid fa-graduation-cap me-2"></i> <span data-i18n="quiz.title">Sunnah Knowledge Quiz</span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-4 p-md-5">
                            <div id="quiz-intro">
                                <p class="lead mb-4" data-i18n="quiz.subtitle">Test your knowledge to unlock your certificate</p>
                                <button class="btn btn-primary-premium w-100 py-3 rounded-4 fw-bold" onclick="AchievementSystem.startQuiz()">
                                    <span data-i18n="quiz.btn_start">Start Quiz</span>
                                </button>
                            </div>
                            <div id="quiz-content" class="d-none">
                                <div id="quiz-questions-container"></div>
                                <div id="quiz-status" class="mt-4 p-3 rounded-4 d-none"></div>
                                <button id="quiz-submit-btn" class="btn btn-primary-premium w-100 py-3 rounded-4 fw-bold mt-4" onclick="AchievementSystem.submitQuiz()">
                                    <span data-i18n="quiz.btn_submit">Submit Answers</span>
                                </button>
                                <button id="quiz-retry-btn" class="btn btn-outline-theme w-100 py-3 rounded-4 fw-bold mt-4 d-none" onclick="AchievementSystem.startQuiz()">
                                    <span data-i18n="quiz.btn_retry">Try Again</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstElementChild);
    },

    startQuiz() {
        const intro = document.getElementById('quiz-intro');
        const content = document.getElementById('quiz-content');
        const container = document.getElementById('quiz-questions-container');
        const status = document.getElementById('quiz-status');
        const submitBtn = document.getElementById('quiz-submit-btn');
        const retryBtn = document.getElementById('quiz-retry-btn');

        if (!intro || !content || !container) return;

        intro.classList.add('d-none');
        content.classList.remove('d-none');
        status.classList.add('d-none');
        retryBtn.classList.add('d-none');
        submitBtn.classList.remove('d-none');

        // Fetch questions from current language dictionary
        const quizData = (window.LanguageManager && window.LanguageManager.currentLangData) ? window.LanguageManager.currentLangData.quiz : null;
        if (!quizData) return;

        // Clone and Shuffle questions
        let pool = [...quizData.questions];
        this.shuffleArray(pool);
        
        // Pick 5 random questions
        this.currentQuestions = pool.slice(0, 5).map(q => {
            // Shuffle options for each question
            let optionsPool = q.options.map((text, idx) => ({ text, originalIdx: idx }));
            this.shuffleArray(optionsPool);
            
            return {
                q: q.q,
                options: optionsPool.map(o => o.text),
                correct: optionsPool.findIndex(o => o.originalIdx === q.correct)
            };
        });

        container.innerHTML = this.currentQuestions.map((q, idx) => `
            <div class="quiz-question-item mb-4 p-4 rounded-4 bg-light border-start border-4 border-primary">
                <h6 class="fw-bold mb-3">${idx + 1}. ${q.q}</h6>
                <div class="quiz-options">
                    ${q.options.map((opt, optIdx) => `
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="q${idx}" id="q${idx}o${optIdx}" value="${optIdx}">
                            <label class="form-check-label w-100 p-2 rounded-3 hover-bg-light" for="q${idx}o${optIdx}">
                                ${opt}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    submitQuiz() {
        const quizData = (window.LanguageManager && window.LanguageManager.currentLangData) ? window.LanguageManager.currentLangData.quiz : null;
        if (!quizData || !this.currentQuestions) return;
        
        const container = document.getElementById('quiz-questions-container');
        const status = document.getElementById('quiz-status');
        const submitBtn = document.getElementById('quiz-submit-btn');
        const retryBtn = document.getElementById('quiz-retry-btn');

        let correctCount = 0;
        const total = this.currentQuestions.length;

        this.currentQuestions.forEach((q, idx) => {
            const selected = document.querySelector(`input[name="q${idx}"]:checked`);
            const selectedVal = selected ? parseInt(selected.value) : -1;
            
            const questionDiv = container.children[idx];
            if (selectedVal === q.correct) {
                correctCount++;
                questionDiv.classList.add('border-success');
                questionDiv.classList.remove('border-primary');
            } else {
                questionDiv.classList.add('border-danger');
                questionDiv.classList.remove('border-primary');
            }
        });

        const passed = correctCount === total;
        status.classList.remove('d-none');
        status.className = `mt-4 p-3 rounded-4 ${passed ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'}`;
        
        status.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fa-solid ${passed ? 'fa-circle-check' : 'fa-circle-xmark'} fs-3 me-3"></i>
                <div>
                   <div class="fw-bold">${correctCount} / ${total} Correct</div>
                   <div class="small">${passed ? quizData.status_pass : quizData.status_fail}</div>
                </div>
            </div>
        `;

        if (passed) {
            submitBtn.classList.add('d-none');
            localStorage.setItem(this.quizPassedKey, 'true');
            this.fireConfetti();
            
            // Update the main page UI
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById(this.quizModalId));
                modal.hide();
                // Refresh the award actions
                this.updateAwardActions();
            }, 2000);
        } else {
            submitBtn.classList.add('d-none');
            retryBtn.classList.remove('d-none');
        }
    },

    updateAwardActions() {
        const actionContainer = document.getElementById('achievement-actions');
        if (!actionContainer) return;

        const isFullyComplete = this.isChecklistComplete();
        const isQuizPassed = this.isQuizPassed();

        actionContainer.innerHTML = `
            ${!isFullyComplete ? `
                <div class="alert bg-white bg-opacity-10 border-0 text-white py-3 px-4 rounded-4 small">
                    <i class="fa-solid fa-lock me-2"></i> <span data-i18n="achievements.unlock_cert_note">Complete the Eid Checklist to unlock your Official Certification!</span>
                </div>
            ` : !isQuizPassed ? `
                <button class="btn btn-premium btn-accent-premium px-5 py-3 rounded-5 shadow" data-bs-toggle="modal" data-bs-target="#${this.quizModalId}">
                    <i class="fa-solid fa-graduation-cap me-2"></i> <span data-i18n="quiz.btn_start">Take Sunnah Quiz</span>
                </button>
            ` : `
                <button class="btn btn-premium btn-accent-premium px-5 py-3 rounded-5 shadow pulse-animation" onclick="AchievementSystem.generateCertificate(this)">
                    <i class="fa-solid fa-download me-2"></i> <span data-i18n="achievements.claim_cert">Claim Your Official Certificate</span>
                </button>
            `}
        `;
        
        if (window.LanguageManager) window.LanguageManager.applyTranslations();
    },

    generateCertificate(btn) {
        const element = document.getElementById('cert-wrapper');
        const originalHtml = btn.innerHTML;
        
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Generating...`;
        btn.disabled = true;

        if (typeof html2canvas === 'undefined') {
            alert('PDF/Image generator is still loading. Please try again in a moment.');
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            return;
        }

        html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Sunnah-Companion-Certificate.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            btn.innerHTML = `<i class="fa-solid fa-check me-2"></i> Downloaded!`;
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }, 3000);
        });
    },

    fireConfetti() {
        const count = 150;
        function fire(particleRatio, opts) {
            const container = document.body;
            for (let i = 0; i < count * particleRatio; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.zIndex = '9999';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = ['#10B981', '#F59E0B', '#FDFDFD', '#D97706'][Math.floor(Math.random() * 4)];
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.borderRadius = '2px';
                confetti.style.pointerEvents = 'none';
                container.appendChild(confetti);

                const animation = confetti.animate([
                    { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
                    { transform: `translate3d(${(Math.random() - 0.5) * 500}px, 100vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
                ], {
                    duration: 2000 + Math.random() * 3000,
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                });

                animation.onfinish = () => confetti.remove();
            }
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }
};


// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    AchievementSystem.init();
});
