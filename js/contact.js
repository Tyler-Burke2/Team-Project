// Import modules
import { initNavigation } from './modules/navigation.js';
import { saveProgress } from './modules/storage.js';

// Initialize navigation
initNavigation();

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Form validation functions
function validateName(name) {
  return name.trim().length >= 2;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateSubject(subject) {
  return subject !== '';
}

function validateMessage(message) {
  return message.trim().length >= 10;
}

// Show error message
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest('.form-group');
  const errorText = document.getElementById(fieldId + 'Error');
  
  formGroup.classList.add('error');
  errorText.textContent = message;
}

// Clear error message
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest('.form-group');
  const errorText = document.getElementById(fieldId + 'Error');
  
  formGroup.classList.remove('error');
  errorText.textContent = '';
}

// Real-time validation
document.getElementById('name').addEventListener('input', (e) => {
  if (e.target.value.length > 0) {
    if (validateName(e.target.value)) {
      clearError('name');
    } else {
      showError('name', 'Name must be at least 2 characters long');
    }
  } else {
    clearError('name');
  }
});

document.getElementById('email').addEventListener('input', (e) => {
  if (e.target.value.length > 0) {
    if (validateEmail(e.target.value)) {
      clearError('email');
    } else {
      showError('email', 'Please enter a valid email address');
    }
  } else {
    clearError('email');
  }
});

document.getElementById('subject').addEventListener('change', (e) => {
  if (validateSubject(e.target.value)) {
    clearError('subject');
  }
});

document.getElementById('message').addEventListener('input', (e) => {
  if (e.target.value.length > 0) {
    if (validateMessage(e.target.value)) {
      clearError('message');
    } else {
      showError('message', 'Message must be at least 10 characters long');
    }
  } else {
    clearError('message');
  }
});

// Form submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const newsletter = document.getElementById('newsletter').checked;
  
  // Clear all errors
  clearError('name');
  clearError('email');
  clearError('subject');
  clearError('message');
  
  // Validate all fields
  let isValid = true;
  
  if (!validateName(name)) {
    showError('name', 'Name must be at least 2 characters long');
    isValid = false;
  }
  
  if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!validateSubject(subject)) {
    showError('subject', 'Please select a subject');
    isValid = false;
  }
  
  if (!validateMessage(message)) {
    showError('message', 'Message must be at least 10 characters long');
    isValid = false;
  }
  
  if (isValid) {
    // Create form data object
    const formData = {
      name,
      email,
      subject,
      message,
      newsletter,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage (simulating form submission)
    saveProgress('lastContactForm', formData);
    
    // Hide form and show success message
    contactForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Log to console (in real app, this would send to server)
    console.log('Form submitted:', formData);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = 'flex';
      successMessage.style.display = 'none';
    }, 5000);
  }
});