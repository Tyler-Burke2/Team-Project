// Data Fetcher module - handles fetching JSON data

/**
 * Fetch Zelda games data
 * This would normally fetch from an external API or JSON file
 * For now, we'll use a local data structure
 * @returns {Promise<Array>} Array of game objects
 */
export async function fetchGamesData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, you would fetch from a JSON file like this:
  // const response = await fetch('data/games.json');
  // const data = await response.json();
  // return data;
  
  // For this demo, return hardcoded data
  return [
    {
      name: "The Legend of Zelda",
      console: "NES",
      year: 1986,
      description: "The original adventure that started it all. Guide Link through Hyrule to rescue Princess Zelda."
    },
    {
      name: "Zelda II: The Adventure of Link",
      console: "NES",
      year: 1987,
      description: "A unique side-scrolling adventure with RPG elements."
    },
    {
      name: "A Link to the Past",
      console: "SNES",
      year: 1991,
      description: "A masterpiece featuring the Light and Dark Worlds of Hyrule."
    },
    {
      name: "Link's Awakening",
      console: "Switch",
      year: 2019,
      description: "A charming remake of the Game Boy classic with beautiful art."
    },
    {
      name: "Ocarina of Time",
      console: "N64",
      year: 1998,
      description: "The revolutionary 3D adventure that defined a generation."
    },
    {
      name: "Majora's Mask",
      console: "N64",
      year: 2000,
      description: "A darker tale with time-traveling mechanics and memorable masks."
    },
    {
      name: "The Wind Waker",
      console: "GameCube",
      year: 2002,
      description: "Sail the Great Sea in this cel-shaded oceanic adventure."
    },
    {
      name: "Twilight Princess",
      console: "Wii",
      year: 2006,
      description: "A darker, more mature Zelda featuring wolf transformation abilities."
    },
    {
      name: "Skyward Sword",
      console: "Wii",
      year: 2011,
      description: "The origin story of the Master Sword with motion controls."
    },
    {
      name: "Breath of the Wild",
      console: "Switch",
      year: 2017,
      description: "Open-world masterpiece that redefined the series."
    },
    {
      name: "Tears of the Kingdom",
      console: "Switch",
      year: 2023,
      description: "The epic sequel with crafting and sky exploration."
    }
  ];
}

/**
 * Fetch data from a JSON file
 * @param {string} filepath - Path to the JSON file
 * @returns {Promise<*>} Parsed JSON data
 */
export async function fetchJsonFile(filepath) {
  try {
    const response = await fetch(filepath);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    throw error;
  }
}

export default { fetchGamesData, fetchJsonFile };