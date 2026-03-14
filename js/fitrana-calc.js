/**
 * Global Fitrana (Sadaqat-ul-Fitr) Calculator
 * Handles regional currency, monetary value estimation, and weight calculation.
 */

class FitranaCalculator {
    constructor() {
        this.containerId = 'fitrana-calc-container';
        this.initialized = false;
        this.data = {
            members: 1,
            region: 'india',
            weightRate: 2.5,
            rates: {
                india: { currency: 'INR', pricePerKg: 35, symbol: '₹' },
                pakistan: { currency: 'PKR', pricePerKg: 150, symbol: 'Rs' },
                bangladesh: { currency: 'BDT', pricePerKg: 80, symbol: '৳' },
                middle_east: { currency: 'AED/SAR', pricePerKg: 5, symbol: 'د.إ' },
                europe: { currency: 'EUR', pricePerKg: 1.5, symbol: '€' },
                uk: { currency: 'GBP', pricePerKg: 2.5, symbol: '£' },
                usa: { currency: 'USD', pricePerKg: 3.5, symbol: '$' },
                canada: { currency: 'CAD', pricePerKg: 2.0, symbol: '$' },
                others: { currency: '', pricePerKg: 0, symbol: '' }
            }
        };
        this.init();
    }

    init() {
        if (this.initialized) return;
        
        const tryInit = () => {
            if (document.getElementById(this.containerId)) {
                this.onReady();
                this.initialized = true;
                return true;
            }
            return false;
        };

        if (!tryInit()) {
            // Check on DOMContentLoaded
            document.addEventListener('DOMContentLoaded', () => tryInit());
            
            // Also check periodically in case it's injected late
            const interval = setInterval(() => {
                if (tryInit()) clearInterval(interval);
            }, 500);
            
            // Stop checking after 5 seconds
            setTimeout(() => clearInterval(interval), 5000);
        }

        document.addEventListener('languageChanged', () => {
            if (this.initialized) this.render();
        });
    }

    onReady() {
        this.render();
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
        if (!container) return;

        const t = (key, fallback) => this.getTranslation(`fitrana_calc.${key}`, fallback);

        container.innerHTML = `
            <div class="fitrana-premium-card glass-card p-4 p-md-5 mt-5 border-0 shadow-lg" data-target="global-calc" data-aos="fade-up">
                <div class="card-header-premium mb-4">
                    <div class="d-flex flex-column flex-md-row align-items-center gap-3">
                        <div class="calc-icon-box">
                            <i class="fa-solid fa-earth-americas text-white fs-1"></i>
                        </div>
                        <div class="text-center text-md-start">
                            <div class="badge bg-primary-premium rounded-pill mb-2 px-3">
                                <i class="fa-solid fa-globe me-1"></i> GLOBAL EDITION
                            </div>
                            <h2 class="fw-bold mb-1 text-gradient-gold" style="font-size: 2.5rem; letter-spacing: -1px;">
                                ${t('title', 'Global Fitrana Calculator')}
                            </h2>
                            <p class="text-muted mb-0 fs-6">${t('desc', 'Calculate Sadaqat-ul-Fitr values for your family.')}</p>
                        </div>
                    </div>
                </div>

                <div class="row g-4">
                    <!-- Step 1: Family Members -->
                    <div class="col-md-4">
                        <div class="input-group-premium">
                            <label class="label-premium">${t('members_label', 'Family Members')}</label>
                            <div class="d-flex align-items-center bg-surface-elevated rounded-pill p-1 border">
                                <button class="btn btn-icon-round" onclick="window.fitranaCalc.adjustMembers(-1)">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <input type="number" id="fc-members" class="form-control-minimal" value="${this.data.members}" min="1" readonly>
                                <button class="btn btn-icon-round" onclick="window.fitranaCalc.adjustMembers(1)">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Region Selector -->
                    <div class="col-md-4">
                        <div class="input-group-premium">
                            <label class="label-premium">${t('region_label', 'Select Region')}</label>
                            <select id="fc-region" class="form-select-premium" onchange="window.fitranaCalc.updateRegion(this.value)">
                                <option value="india" ${this.data.region === 'india' ? 'selected' : ''}>${t('regions.india', 'India (INR)')}</option>
                                <option value="pakistan" ${this.data.region === 'pakistan' ? 'selected' : ''}>${t('regions.pakistan', 'Pakistan (PKR)')}</option>
                                <option value="bangladesh" ${this.data.region === 'bangladesh' ? 'selected' : ''}>${t('regions.bangladesh', 'Bangladesh (BDT)')}</option>
                                <option value="middle_east" ${this.data.region === 'middle_east' ? 'selected' : ''}>${t('regions.middle_east', 'Middle East')}</option>
                                <option value="europe" ${this.data.region === 'europe' ? 'selected' : ''}>${t('regions.europe', 'Europe (EUR)')}</option>
                                <option value="uk" ${this.data.region === 'uk' ? 'selected' : ''}>${t('regions.uk', 'United Kingdom (GBP)')}</option>
                                <option value="usa" ${this.data.region === 'usa' ? 'selected' : ''}>${t('regions.usa', 'USA (USD)')}</option>
                                <option value="canada" ${this.data.region === 'canada' ? 'selected' : ''}>${t('regions.canada', 'Canada (CAD)')}</option>
                                <option value="others" ${this.data.region === 'others' ? 'selected' : ''}>${t('regions.others', 'Other Regions')}</option>
                            </select>
                        </div>
                    </div>

                    <!-- Step 3: Food Type -->
                    <div class="col-md-4">
                        <div class="input-group-premium">
                            <label class="label-premium">${t('rate_label', 'Food Type / Rate')}</label>
                            <select id="fc-rate" class="form-select-premium" onchange="window.fitranaCalc.updateRate(this.value)">
                                <option value="2.5" ${this.data.weightRate === 2.5 ? 'selected' : ''}>2.5 kg (Standard)</option>
                                <option value="3.0" ${this.data.weightRate === 3.0 ? 'selected' : ''}>3.0 kg (Recommended)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="results-grid mt-5">
                    <div class="row g-4" id="fc-results-container">
                        <div class="col-sm-6">
                            <div class="result-tile weight">
                                <span class="tile-label">${t('result_weight', 'Total Food Weight')}</span>
                                <div class="tile-value">
                                    <span id="fc-total-weight">0.0</span> <small class="fs-4">kg</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6" id="fc-money-cell">
                            <div class="result-tile money">
                                <span class="tile-label">${t('result_money', 'Total Monetary Value')}</span>
                                <div class="tile-value">
                                    <small id="fc-currency-symbol" class="fs-3">₹</small> <span id="fc-total-money">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="calc-footer mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <div class="p-3 rounded-4 bg-surface-elevated bg-opacity-50 flex-grow-1">
                        <p class="text-muted small mb-0">
                            <i class="fa-solid fa-circle-info text-accent-color me-2"></i> ${t('note', 'Estimates based on local market rates.')}
                        </p>
                    </div>
                    <button class="btn btn-premium btn-accent-premium px-4 shadow-sm" onclick="window.fitranaCalc.shareResult()">
                        <i class="fa-solid fa-share-nodes me-2"></i> ${t('share_btn', 'Share Result')}
                    </button>
                </div>
            </div>

            <!-- Hidden Share Card Template -->
            <div id="fc-share-template" style="position: fixed; left: -9999px; top: 0;">
                <div id="fc-share-card" class="share-card-canvas" style="background: linear-gradient(135deg, #064E3B 0%, #10B981 100%); width: 400px; padding: 50px; text-align: center; color: white;">
                    <div class="card-pattern"></div>
                    <div class="card-content-inner">
                        <div class="mb-4">
                            <i class="fa-solid fa-scale-balanced" style="font-size: 4rem; color: #F59E0B;"></i>
                        </div>
                        <h2 class="fw-bold mb-4" style="font-size: 2.2rem; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 15px;">Sadaqat-ul-Fitr</h2>
                        
                        <div class="mb-4">
                            <p class="mb-1 opacity-75" style="font-size: 1.1rem;">Family Members</p>
                            <h3 id="share-members" class="fw-bold" style="font-size: 2.5rem;">1</h3>
                        </div>

                        <div class="row g-0 mb-4 bg-white bg-opacity-10 rounded-4 p-4">
                            <div class="col-6 border-end border-white border-opacity-20">
                                <p class="mb-1 opacity-75 small">Total Weight</p>
                                <h4 id="share-weight" class="fw-bold mb-0">2.5 <small>kg</small></h4>
                            </div>
                            <div class="col-6" id="share-money-container">
                                <p class="mb-1 opacity-75 small">Monetary Value</p>
                                <h4 class="fw-bold mb-0"><small id="share-symbol">₹</small> <span id="share-money">150</span></h4>
                            </div>
                        </div>

                        <div class="mt-5 pt-4 border-top border-white border-opacity-20">
                            <p class="small opacity-75 mb-0">www.eidguide.com</p>
                            <p class="small fw-bold opacity-100" style="color: #F59E0B;">Sunnah-Aligned Celebration</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.calculate();
    }

    adjustMembers(val) {
        this.data.members = Math.max(1, this.data.members + val);
        const input = document.getElementById('fc-members');
        if (input) input.value = this.data.members;
        this.calculate();
    }

    updateRegion(region) {
        this.data.region = region;
        this.calculate();
    }

    updateRate(rate) {
        this.data.weightRate = parseFloat(rate);
        this.calculate();
    }

    calculate() {
        const regionData = this.data.rates[this.data.region];
        if (!regionData) return;

        const totalWeight = (this.data.members * this.data.weightRate).toFixed(1);
        const totalMoney = Math.ceil(this.data.members * this.data.weightRate * regionData.pricePerKg);

        const weightDisplay = document.getElementById('fc-total-weight');
        const moneyDisplay = document.getElementById('fc-total-money');
        const symbolDisplay = document.getElementById('fc-currency-symbol');
        const moneyCell = document.getElementById('fc-money-cell');

        if (weightDisplay) weightDisplay.textContent = totalWeight;
        
        if (this.data.region === 'others' || regionData.pricePerKg === 0) {
            if (moneyCell) moneyCell.style.display = 'none';
        } else {
            if (moneyCell) moneyCell.style.display = 'block';
            if (moneyDisplay) moneyDisplay.textContent = totalMoney;
            if (symbolDisplay) symbolDisplay.textContent = regionData.symbol;
        }
    }

    shareResult() {
        const shareCard = document.getElementById('fc-share-card');
        if (!shareCard || typeof html2canvas === 'undefined') {
            alert('Sharing module is loading, please try again.');
            return;
        }

        const regionData = this.data.rates[this.data.region];
        const totalWeight = (this.data.members * this.data.weightRate).toFixed(1);
        const totalMoney = Math.ceil(this.data.members * this.data.weightRate * regionData.pricePerKg);

        // Update Share Card Template Content
        document.getElementById('share-members').textContent = this.data.members;
        document.getElementById('share-weight').textContent = `${totalWeight} kg`;
        
        const moneyContainer = document.getElementById('share-money-container');
        if (this.data.region === 'others' || regionData.pricePerKg === 0) {
            if (moneyContainer) moneyContainer.style.display = 'none';
        } else {
            if (moneyContainer) moneyContainer.style.display = 'block';
            document.getElementById('share-money').textContent = totalMoney;
            document.getElementById('share-symbol').textContent = regionData.symbol;
        }

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
            link.download = `Fitrana-Calculation-${this.data.region}.png`;
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
if (!window.fitranaCalc) {
    window.fitranaCalc = new FitranaCalculator();
}

