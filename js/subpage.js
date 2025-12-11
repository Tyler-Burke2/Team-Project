import { initNavigation } from './modules/navigation.js';
import { saveProgress, loadProgress, clearProgress } from './modules/storage.js';
import { getUrlParameter, updateUrlParameter } from './modules/urlParams.js';

initNavigation();

const stepsWrapper = document.querySelector('.steps-wrapper');
const steps = document.querySelectorAll('.step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const currentStepNum = document.getElementById('currentStepNum');
const resetBtn = document.getElementById('resetProgress');
const shareBtn = document.getElementById('shareBtn');
const currentUrlDisplay = document.getElementById('currentUrl');
const shareModal = document.getElementById('shareModal');
const closeShareModalBtn = document.getElementById('closeShareModal');

let currentStep = 0;
const totalSteps = steps.length;

function init() {
  const urlStep = getUrlParameter('step');
  
  if (urlStep) {
    const stepNum = parseInt(urlStep) - 1;
    if (stepNum >= 0 && stepNum < totalSteps) {
      currentStep = stepNum;
    }
  } else {
    const savedStep = loadProgress('tutorialStep');
    if (savedStep !== null && savedStep >= 0 && savedStep < totalSteps) {
      currentStep = savedStep;
    }
  }
  
  showStep();
  updateUrlDisplay();
}

function showStep() {
  steps.forEach((step) => {
    step.classList.remove('active');
  });
  
  steps[currentStep].classList.add('active');
  
  const progress = ((currentStep + 1) / totalSteps) * 100;
  progressFill.style.width = progress + '%';
  
  currentStepNum.textContent = currentStep + 1;
  
  prevBtn.disabled = currentStep === 0;
  nextBtn.disabled = currentStep === totalSteps - 1;
  
  // LOCAL STORAGE
  saveProgress('tutorialStep', currentStep);
  
  updateUrlParameter('step', currentStep + 1);
  
  updateUrlDisplay();
}

function updateUrlDisplay() {
  const currentUrl = window.location.href;
  const urlParts = currentUrl.split('?');
  const displayUrl = urlParts[0].split('/').pop() + (urlParts[1] ? '?' + urlParts[1] : '');
  currentUrlDisplay.textContent = displayUrl;
}

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    showStep();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    showStep();
  }
});

// RESET PROGRESS
resetBtn.addEventListener('click', () => {
  showResetModal();
});

function showResetModal() {
  const modalHtml = `
    <div class="modal-content">
      <h3>⚠️ Reset Progress?</h3>
      <p>Are you sure you want to reset your progress? You will return to Step 1.</p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-primary" id="confirmReset">Yes, Reset</button>
        <button class="btn btn-secondary" id="cancelReset">Cancel</button>
      </div>
    </div>
  `;
  
  const resetModal = document.createElement('div');
  resetModal.className = 'modal show';
  resetModal.innerHTML = modalHtml;
  document.body.appendChild(resetModal);
  
  document.getElementById('confirmReset').addEventListener('click', () => {
    clearProgress('tutorialStep');
    currentStep = 0;
    showStep();
    resetModal.remove();
  });
  
  document.getElementById('cancelReset').addEventListener('click', () => {
    resetModal.remove();
  });
  
  resetModal.addEventListener('click', (e) => {
    if (e.target === resetModal) {
      resetModal.remove();
    }
  });
}

// SHARE BUTTON
shareBtn.addEventListener('click', async () => {
  const currentUrl = window.location.href;
  
  try {
    await navigator.clipboard.writeText(currentUrl);
    showShareModal();
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = currentUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showShareModal();
  }
});

function showShareModal() {
  shareModal.classList.add('show');
}

closeShareModalBtn.addEventListener('click', () => {
  shareModal.classList.remove('show');
});

shareModal.addEventListener('click', (e) => {
  if (e.target === shareModal) {
    shareModal.classList.remove('show');
  }
});

// KEYBOARD NAV
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && currentStep > 0) {
    currentStep--;
    showStep();
  } else if (e.key === 'ArrowRight' && currentStep < totalSteps - 1) {
    currentStep++;
    showStep();
  }
});

init();