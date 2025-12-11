import { initNavigation } from './modules/navigation.js';
import { fetchGamesData } from './modules/dataFetcher.js';

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

async function loadGames() {
  try {
    loadingSpinner.style.display = 'flex';
    errorMessage.style.display = 'none';
    gamesGrid.innerHTML = '';
    
    allGames = await fetchGamesData();
    
    displayGames(allGames);
    loadingSpinner.style.display = 'none';
  } catch (error) {
    console.error('Error loading games:', error);
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'block';
  }
}

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
    
    gameCard.addEventListener('click', () => openGameModal(game));
    
    gamesGrid.appendChild(gameCard);
  });
}

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

function closeModal() {
  gameModal.classList.remove('show');
}

closeModalBtn.addEventListener('click', closeModal);

gameModal.addEventListener('click', (e) => {
  if (e.target === gameModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && gameModal.classList.contains('show')) {
    closeModal();
  }
});

// FILTER BY CONSOLE
function filterGames() {
  const selectedConsole = consoleFilter.value;
  
  let filteredGames = allGames;
  
  if (selectedConsole !== 'all') {
    filteredGames = allGames.filter(game => game.console === selectedConsole);
  }
  
  displayGames(filteredGames);
}

// SORT BY YEAR
function toggleSort() {
  sortedByYear = !sortedByYear;
  
  let gamesToDisplay = [...allGames];
  
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

consoleFilter.addEventListener('change', filterGames);
sortBtn.addEventListener('click', toggleSort);

loadGames();