/**
 * Eid Preparation Checklist feature
 * Handles local storage saving, dynamic rendering, and progress updates.
 */

class ChecklistManager {
  constructor() {
    this.storageKey = 'eidGuideChecklist';
    this.totalTasks = 9;
    this.state = this.loadState();
    
    this.init();
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
    const initialState = {};
    for (let i = 1; i <= this.totalTasks; i++) {
      initialState[`task${i}`] = false;
    }
    return initialState;
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.updateProgress();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to ensure language data might be loaded if components are slow
      setTimeout(() => this.renderChecklist(), 100);
      
      // Listen for language changes to re-render
      document.addEventListener('languageChanged', () => this.renderChecklist());
    });
  }

  renderChecklist() {
    const container = document.getElementById('checklist-items');
    if (!container) return;

    container.innerHTML = '';
    
    // Create Progress Header
    const progressHeader = document.createElement('div');
    progressHeader.className = 'checklist-progress-header mb-4';
    progressHeader.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold text-dark small" data-i18n="checklist.progress_label">Preparation Progress:</span>
        <span id="checklist-progress-text" class="fw-bold text-primary">0%</span>
      </div>
      <div class="progress" style="height: 10px; border-radius: 10px; background-color: var(--accent-soft);">
        <div id="checklist-progress-bar" class="progress-bar" role="progressbar" 
          style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `;
    container.appendChild(progressHeader);

    const itemsList = document.createElement('div');
    itemsList.className = 'checklist-items-list';

    for (let i = 1; i <= this.totalTasks; i++) {
        const taskId = `task${i}`;
        const item = document.createElement('div');
        item.className = 'checklist-item d-flex align-items-center p-3 mb-2 rounded-3 transition';
        item.style.backgroundColor = 'rgba(46, 139, 87, 0.03)';
        
        item.innerHTML = `
            <div class="form-check me-3">
                <input class="form-check-input checklist-checkbox fs-5" type="checkbox" 
                    id="${taskId}" data-task-id="${taskId}" ${this.state[taskId] ? 'checked' : ''}>
            </div>
            <label class="form-check-label checklist-text text-dark fw-medium flex-grow-1 cursor-pointer" 
                for="${taskId}" data-i18n="checklist.items.${taskId}">
                Task ${i}
            </label>
        `;
        itemsList.appendChild(item);
    }

    container.appendChild(itemsList);
    this.bindEvents();
    this.updateProgress();

    // Re-trigger translation for the newly injected items
    if (window.LanguageManager) {
        window.LanguageManager.applyTranslations();
    }
  }

  bindEvents() {
    const container = document.getElementById('checklist-items');
    container.addEventListener('change', (e) => {
      if (e.target.classList.contains('checklist-checkbox')) {
        const taskId = e.target.getAttribute('data-task-id');
        this.state[taskId] = e.target.checked;
        this.saveState();
      }
    });

    // Toggle based on label click is handled by the 'for' attribute, 
    // but we add a visual feedback helper
  }

  updateProgress() {
    const completed = Object.values(this.state).filter(status => status).length;
    const percentage = Math.round((completed / this.totalTasks) * 100);
    
    const progressBar = document.getElementById('checklist-progress-bar');
    const progressText = document.getElementById('checklist-progress-text');
    
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      progressBar.setAttribute('aria-valuenow', percentage);
    }
    if (progressText) progressText.textContent = `${percentage}%`;
  }
}

// Initialize
if (typeof window !== 'undefined') {
  window.eidChecklist = new ChecklistManager();
}
