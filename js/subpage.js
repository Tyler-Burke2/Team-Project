// Import modules
import { initNavigation } from './modules/navigation.js';
import { saveProgress, loadProgress, clearProgress } from './modules/storage.js';
import { getUrlParameter, updateUrlParameter } from './modules/urlParams.js';

// Initialize navigation
initNavigation();

const stepsWrapper = document.querySelector('.steps-wrapper');
const steps = document.querySelectorAll('.step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const currentStepNum = document.getElementById('currentStepNum');
const resetBtn = document.getElementById('resetProgress');

let currentStep = 0;

// Initialize - check URL parameter first, then localStorage
function init() {
  const urlStep = getUrlParameter('step');
  
  if (urlStep) {
    // If URL has step parameter, use it
    const stepNum = parseInt(urlStep) - 1;
    if (stepNum >= 0 && stepNum < steps.length) {
      currentStep = stepNum;
    }
  } else {
    // Otherwise check localStorage
    const savedStep = loadProgress('tutorialStep');
    if (savedStep !== null && savedStep >= 0 && savedStep < steps.length) {
      currentStep = savedStep;
    }
  }
  
  showStep();
}

function showStep() {
  // Hide all steps
  steps.forEach((step) => {
    step.classList.remove('active');
  });
  
  // Show current step
  steps[currentStep].classList.add('active');
  
  // Update progress bar
  const progress = ((currentStep + 1) / steps.length) * 100;
  progressFill.style.width = progress + '%';
  
  // Update step counter
  currentStepNum.textContent = currentStep + 1;
  
  // Update button states
  prevBtn.disabled = currentStep === 0;
  nextBtn.disabled = currentStep === steps.length - 1;
  
  // Save progress to localStorage
  saveProgress('tutorialStep', currentStep);
  
  // Update URL parameter
  updateUrlParameter('step', currentStep + 1);
}

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    showStep();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep();
  }
});

// Reset progress button
resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset your progress?')) {
    clearProgress('tutorialStep');
    currentStep = 0;
    showStep();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && currentStep > 0) {
    currentStep--;
    showStep();
  } else if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
    currentStep++;
    showStep();
  }
});

// Initialize on page load
init();