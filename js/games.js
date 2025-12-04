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
    
    gamesGrid.appendChild(gameCard);
  });
}

// Filter games by console
function filterGames() {
  const selectedConsole = consoleFilter.value;
  
  let filteredGames = allGames;
  
  if (selectedConsole !== 'all') {
    filteredGames = allGames.filter(game => game.console === selectedConsole);
  }
  
  displayGames(filteredGames);
}

// Sort games by year
function toggleSort() {
  sortedByYear = !sortedByYear;
  
  let gamesToDisplay = [...allGames];
  
  // Apply filter if one is selected
  const selectedConsole = consoleFilter.value;
  if (selectedConsole !== 'all') {
    gamesToDisplay = gamesToDisplay.filter(game => game.console === selectedConsole);
  }
  
  if (sortedByYear) {
    gamesToDisplay.sort((a, b) => a.year - b.year);
    sortBtn.textContent = 'Sort by Name';
  } else {
    gamesToDisplay.sort((a, b) => a.name.localeCompare(b.name));
    sortBtn.textContent = 'Sort by Year';
  }
  
  displayGames(gamesToDisplay);
}

// Event listeners
consoleFilter.addEventListener('change', filterGames);
sortBtn.addEventListener('click', toggleSort);

// Load games on page load
loadGames();