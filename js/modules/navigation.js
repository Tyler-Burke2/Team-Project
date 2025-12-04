// Navigation module - handles responsive dropdown menu
export function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!navToggle || !navMenu) {
    console.warn('Navigation elements not found');
    return;
  }
  
  // Toggle mobile menu
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Close menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
  
  // Close menu on window resize if screen becomes large
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

export default initNavigation;