/**
 * Share Cards Engine
 * Handles rendering and downloading of shareable Eid status cards.
 */

document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('share-cards-container');
    if (!cardsContainer) return;

    const cardsData = [
        {
            id: 'eid-greeting',
            titleKey: 'share_cards.greeting_title',
            contentKey: 'share_cards.greeting_content',
            bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            icon: 'fa-moon',
            accent: '#F59E0B'
        },
        {
            id: 'sunnah-list',
            titleKey: 'share_cards.sunnah_title',
            contentKey: 'share_cards.sunnah_content',
            bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            icon: 'fa-star',
            accent: '#ffffff'
        },
        {
            id: 'takbeerat',
            titleKey: 'share_cards.takbeer_title',
            contentKey: 'share_cards.takbeer_content',
            bg: '#FFFFFF',
            icon: 'fa-mosque',
            accent: '#10B981',
            isLight: true
        },
        {
            id: 'charity-remind',
            titleKey: 'share_cards.charity_title',
            contentKey: 'share_cards.charity_content',
            bg: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
            icon: 'fa-hand-holding-heart',
            accent: '#ffffff'
        }
    ];

    function renderCards() {
        cardsContainer.innerHTML = '';
        cardsData.forEach((card, index) => {
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-6';
            col.setAttribute('data-aos', 'zoom-in');
            col.setAttribute('data-aos-delay', (index + 1) * 100);

            col.innerHTML = `
                <div class="share-card-wrapper">
                    <div id="card-${card.id}" class="share-card-canvas" style="background: ${card.bg}; color: ${card.isLight ? '#0D4D3D' : '#ffffff'};">
                        <div class="card-pattern"></div>
                         <div class="card-content-inner text-center">
                            <i class="fa-solid ${card.icon} mb-3" style="font-size: 2.5rem; color: ${card.accent};"></i>
                            <h3 class="card-main-title mb-2" data-i18n="${card.titleKey}">Card Title</h3>
                            <p class="card-main-text mb-0" data-i18n="${card.contentKey}">Card message goes here...</p>
                            <div class="card-footer-branding mt-4 pt-3 border-top" style="border-color: rgba(255,255,255,0.1) !important;">
                                <small>www.eidguide.com</small>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-premium btn-primary-premium btn-sm w-100" onclick="downloadCard('${card.id}')">
                            <i class="fa-solid fa-download me-2"></i> Download for Status
                        </button>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(col);
        });

        // Trigger translation update for the newly added cards
        if (window.LanguageManager) {
            window.LanguageManager.updatePageContent();
        }
    }

    window.downloadCard = function(cardId) {
        const element = document.getElementById(`card-${cardId}`);
        const btn = event.currentTarget;
        const originalHtml = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Saving...';
        btn.disabled = true;

        html2canvas(element, {
            scale: 2, // Higher resolution
            useCORS: true,
            backgroundColor: null
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `EidGuide-${cardId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            btn.innerHTML = '<i class="fa-solid fa-check me-2"></i> Saved!';
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }, 2000);
        });
    };

    try {
        renderCards();
    } catch (err) {
        console.warn('renderCards failed, continuing with custom creator setup:', err);
    }

    // --- Custom Creator Logic ---
    const customTitleInput = document.getElementById('custom-title');
    const customMessageInput = document.getElementById('custom-message');
    const customIconSelect = document.getElementById('custom-icon');
    const customColor1 = document.getElementById('custom-color-1');
    const customColor2 = document.getElementById('custom-color-2');
    const bgSolidRadio = document.getElementById('bg-solid');
    const bgGradientRadio = document.getElementById('bg-gradient');
    const color2Container = document.getElementById('color-2-container');
    const textLightBtn = document.getElementById('text-light-toggle');
    const textDarkBtn = document.getElementById('text-dark-toggle');

    const previewCard = document.getElementById('custom-card-preview');
    const previewTitle = document.getElementById('preview-title');
    const previewMessage = document.getElementById('preview-message');
    const previewIcon = document.getElementById('preview-icon');

    // Safety check: if core elements are missing, don't crash the whole script
    if (!customTitleInput || !previewCard) return;

    let currentConfig = {
        title: 'Eid Mubarak!',
        message: 'May this Eid bring joy and prosperity to you.',
        icon: 'fa-moon',
        color1: '#10B981',
        color2: '#064E3B',
        bgType: 'solid',
        isLightText: true
    };

    function updatePreview() {
        // Update Content
        previewTitle.textContent = customTitleInput.value || 'Eid Mubarak!';
        previewMessage.textContent = customMessageInput.value || 'May this Eid bring joy and prosperity to you.';
        
        // Update Icon
        previewIcon.className = `fa-solid ${customIconSelect.value} mb-3`;
        
        // Update Background
        if (bgGradientRadio.checked) {
            previewCard.style.background = `linear-gradient(135deg, ${customColor1.value} 0%, ${customColor2.value} 100%)`;
            color2Container.classList.remove('d-none');
        } else {
            previewCard.style.background = customColor1.value;
            color2Container.classList.add('d-none');
        }

        // Update Text Color
        const footer = previewCard.querySelector('.card-footer-branding');
        if (currentConfig.isLightText) {
            previewCard.style.color = '#ffffff';
            if (footer) footer.style.borderColor = 'rgba(255,255,255,0.2)';
            previewIcon.style.color = '#F59E0B'; // Gold accent for dark bg
        } else {
            previewCard.style.color = '#111827';
            if (footer) footer.style.borderColor = 'rgba(0,0,0,0.1)';
            previewIcon.style.color = '#10B981'; // Green accent for light bg
        }
    }

    // Initialize Preview
    updatePreview();

    // Event Listeners
    [customTitleInput, customMessageInput, customIconSelect, customColor1, customColor2, bgSolidRadio, bgGradientRadio].forEach(el => {
        el.addEventListener('input', updatePreview);
    });

    textLightBtn.addEventListener('click', () => {
        currentConfig.isLightText = true;
        textLightBtn.classList.add('active');
        textDarkBtn.classList.remove('active');
        updatePreview();
    });

    textDarkBtn.addEventListener('click', () => {
        currentConfig.isLightText = false;
        textDarkBtn.classList.add('active');
        textLightBtn.classList.remove('active');
        updatePreview();
    });

    window.generateCustomCard = function() {
        const btn = event.currentTarget;
        const originalHtml = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-magic fa-spin me-2"></i> Creating...';
        btn.disabled = true;

        html2canvas(previewCard, {
            scale: 2,
            useCORS: true,
            backgroundColor: null
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `My-Eid-Card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            btn.innerHTML = '<i class="fa-solid fa-check me-2"></i> Downloaded!';
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }, 2000);
        });
    };
});
