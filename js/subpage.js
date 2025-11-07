// Select elements
const stepsWrapper = document.querySelector('.steps-wrapper');
const steps = document.querySelectorAll('.step');
const prevBtn = document.querySelector('.tutorial-container button:first-of-type');
const nextBtn = document.querySelector('.tutorial-container button:last-of-type');

let currentStep = 0;

// Function to show only the current step
function showStep() {
  steps.forEach((step, index) => {
    step.style.display = index === currentStep ? 'flex' : 'none';
  });
}

// Button events
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

// Initialize first step
showStep();
