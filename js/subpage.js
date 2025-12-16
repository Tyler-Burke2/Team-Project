// Import modules
import { initNavigation } from './modules/navigation.js';
import { saveProgress, loadProgress, clearProgress } from './modules/storage.js';
import { getUrlParameter, updateUrlParameter } from './modules/urlParams.js';

// Initialize navigation
initNavigation();

const stepsWrapper = document.getElementById('stepsWrapper');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const currentStepNum = document.getElementById('currentStepNum');
const totalStepsDisplay = document.getElementById('totalSteps');
const resetBtn = document.getElementById('resetProgress');
const shareBtn = document.getElementById('shareBtn');
const currentUrlDisplay = document.getElementById('currentUrl');
const shareModal = document.getElementById('shareModal');
const closeShareModalBtn = document.getElementById('closeShareModal');

let currentStep = 0;
let tutorialSteps = [];
let totalSteps = 0;

// Fetch tutorial steps from JSON
async function loadTutorialSteps() {
  try {
    const response = await fetch('js/data/tutorial-steps.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    tutorialSteps = data.steps;
    totalSteps = tutorialSteps.length;
    
    // Update total steps display
    totalStepsDisplay.textContent = totalSteps;
    
    // Render steps
    renderSteps();
    
    // Initialize after steps are loaded
    init();
  } catch (error) {
    console.error('Error loading tutorial steps:', error);
    stepsWrapper.innerHTML = '<div class="error-message"><p>Failed to load tutorial steps. Please try again later.</p></div>';
  }
}

// Render all steps in the DOM
function renderSteps() {
  stepsWrapper.innerHTML = '';
  
  tutorialSteps.forEach((step, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step';
    stepDiv.dataset.step = index + 1;
    
    // Check if this is the Ball and Chain warning step
    if (step.requiresBallAndChain && index > 0 && !tutorialSteps[index - 1].requiresBallAndChain) {
      // Insert warning before this step
      const warningDiv = document.createElement('div');
      warningDiv.className = 'step part-2-warning';
      warningDiv.innerHTML = `
        <div class="warning-box">
          <h2>⚠️ Part 2: Ball and Chain Required</h2>
          <p class="warning-text">
            <strong>STOP HERE if you don't have the Ball and Chain weapon yet!</strong>
          </p>
          <p>You must obtain the Ball and Chain weapon before continuing with Part 2 of this puzzle. The Ball and Chain is needed to break ice blocks.</p>
          <p>Once you have the weapon, continue to the next step.</p>
        </div>
        <img src="images/ball.png" alt="Ball and Chain weapon" class="step-image">
      `;
      stepsWrapper.appendChild(warningDiv);
    }
    
    // Build step content
    let stepHTML = `<h2>Step ${step.stepNumber}: ${step.title}</h2>`;
    stepHTML += `<p>${step.description}</p>`;
    
    if (step.imageUrl) {
      stepHTML += `<img src="${step.imageUrl}" alt="${step.imageAlt}" class="step-image">`;
    }
    
    if (step.successMessage) {
      stepHTML += `<p class="success-text">🎉 <strong>${step.successMessage}</strong> 🎉</p>`;
    }
    
    if (step.congratulations) {
      stepHTML += `<p>${step.congratulations}</p>`;
    }
    
    stepDiv.innerHTML = stepHTML;
    stepsWrapper.appendChild(stepDiv);
  });
}

// Initialize - check URL parameter first, then localStorage
function init() {
  const urlStep = getUrlParameter('step');
  
  if (urlStep) {
    // If URL has step parameter, use it
    const stepNum = parseInt(urlStep) - 1;
    if (stepNum >= 0 && stepNum < totalSteps) {
      currentStep = stepNum;
    }
  } else {
    // Otherwise check localStorage
    const savedStep = loadProgress('tutorialStep');
    if (savedStep !== null && savedStep >= 0 && savedStep < totalSteps) {
      currentStep = savedStep;
    }
  }
  
  showStep();
  updateUrlDisplay();
}

function showStep() {
  // Get all actual step elements (excluding warning)
  const allStepElements = stepsWrapper.querySelectorAll('.step:not(.part-2-warning)');
  const warningElement = stepsWrapper.querySelector('.part-2-warning');
  
  // Hide all steps and warning
  allStepElements.forEach((step) => {
    step.classList.remove('active');
  });
  if (warningElement) {
    warningElement.classList.remove('active');
  }
  
  // Show current step
  if (allStepElements[currentStep]) {
    allStepElements[currentStep].classList.add('active');
  }
  
  // Show warning if we're on step 7 (first Ball and Chain step)
  if (warningElement && currentStep === 6) {
    warningElement.classList.add('active');
  }
  
  // Update progress bar (based on actual steps, not including warning)
  const progress = ((currentStep + 1) / totalSteps) * 100;
  progressFill.style.width = progress + '%';
  
  // Update step counter
  currentStepNum.textContent = currentStep + 1;
  
  // Update button states
  prevBtn.disabled = currentStep === 0;
  nextBtn.disabled = currentStep === totalSteps - 1;
  
  // Save progress to localStorage
  saveProgress('tutorialStep', currentStep);
  
  // Update URL parameter
  updateUrlParameter('step', currentStep + 1);
  
  // Update URL display
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

// Reset progress button - use modal instead of alert
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

// Share button - copy URL to clipboard
shareBtn.addEventListener('click', async () => {
  const currentUrl = window.location.href;
  
  try {
    await navigator.clipboard.writeText(currentUrl);
    showShareModal();
  } catch (err) {
    // Fallback for older browsers
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

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && currentStep > 0) {
    currentStep--;
    showStep();
  } else if (e.key === 'ArrowRight' && currentStep < totalSteps - 1) {
    currentStep++;
    showStep();
  }
});

// Load tutorial steps on page load
loadTutorialSteps();