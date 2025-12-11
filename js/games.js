// Import modules
import { initNavigation } from './modules/navigation.js';
import { fetchGamesData } from './modules/dataFetcher.js';

// Initialize navigation
initNavigation();

const gamesGrid = document.getElementById('gamesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const consoleFilter = document.getElementById('consoleFilter');
const sortBtn = document.getElementById('sortBtn');
const gameModal = document.getElementById('gameModal');
const modalGameContent = document.getElementById('modalGameContent');
const closeModalBtn = document.getElementById('closeModal');

let allGames = [];
let sortedByYear = false;

// Fetch and display games
async function loadGames() {
  try {
    loadingSpinner.style.display = 'flex';
    errorMessage.style.display = 'none';
    gamesGrid.innerHTML = '';
    
    // Fetch games data
    allGames = await fetchGamesData();
    
    displayGames(allGames);
    loadingSpinner.style.display = 'none';
  } catch (error) {
    console.error('Error loading games:', error);
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'block';
  }
}

// Display games in grid
function displayGames(games) {
  gamesGrid.innerHTML = '';
  
  if (games.length === 0) {
    gamesGrid.innerHTML = '<p style="grid-column: 1/-1; color: #e5d283;">No games found matching your criteria.</p>';
    return;
  }
  
  games.forEach((game, index) => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    gameCard.style.animationDelay = `${index * 0.1}s`;
    
    gameCard.innerHTML = `
      <h3>${game.name}</h3>
      <span class="game-console">${game.console}</span>
      <p class="game-year">Released: ${game.year}</p>
      <p class="game-description">${game.description}</p>
    `;
    
    // Add click handler to open modal
    gameCard.addEventListener('click', () => openGameModal(game));
    
    gamesGrid.appendChild(gameCard);
  });
}

// Open modal with game details
function openGameModal(game) {
  modalGameContent.innerHTML = `
    <h2>${game.name}</h2>
    <span class="modal-console">${game.console}</span>
    <p class="modal-year">📅 Released: ${game.year}</p>
    <p class="modal-description">${game.description}</p>
    <div class="modal-details">
      <p><strong>Platform:</strong> ${game.console}</p>
      <p><strong>Year:</strong> ${game.year}</p>
      <p><strong>Series:</strong> The Legend of Zelda</p>
      <p><strong>Developer:</strong> Nintendo</p>
    </div>
  `;
  
  gameModal.classList.add('show');
}

// Close modal
function closeModal() {
  gameModal.classList.remove('show');
}

closeModalBtn.addEventListener('click', closeModal);

gameModal.addEventListener('click', (e) => {
  if (e.target === gameModal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && gameModal.classList.contains('show')) {
    closeModal();
  }
});

// Filter games by console
function filterGames() {
  const selectedConsole = consoleFilter.value;
  
  let filteredGames = allGames;
  
  if (selectedConsole !== 'all') {
    filteredGames = allGames.filter(game => game.console === selectedConsole);
  }
  
  displayGames(filteredGames);
}

// Sort games by year or name
function toggleSort() {
  sortedByYear = !sortedByYear;
  
  let gamesToDisplay = [...allGames];
  
  // Apply filter if one is selected
  const selectedConsole = consoleFilter.value;
  if (selectedConsole !== 'all') {
    gamesToDisplay = gamesToDisplay.filter(game => game.console === selectedConsole);
  }
  
  if (sortedByYear) {
    // Sort by year (oldest to newest)
    gamesToDisplay.sort((a, b) => {
      const yearA = parseInt(a.year);
      const yearB = parseInt(b.year);
      return yearA - yearB;
    });
    sortBtn.textContent = 'Sort by Name';
  } else {
    // Sort alphabetically by name
    gamesToDisplay.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    sortBtn.textContent = 'Sort by Year';
  }
  
  displayGames(gamesToDisplay);
}

// Event listeners
consoleFilter.addEventListener('change', filterGames);
sortBtn.addEventListener('click', toggleSort);

// Load games on page load
loadGames();