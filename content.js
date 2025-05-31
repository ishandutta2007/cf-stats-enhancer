// Helper function to generate random integer between 5000 and 10000
function randomInt(min, ma) {
  return Math.floor(Math.random() * (ma - min + 1)) + min;
}

// Country population data (in millions) - 2023 estimates
const COUNTRY_POPULATIONS = {
  'Afghanistan': 40,
  'Algeria': 45,
  'Andorra': 0.079,
  'Angola': 36.7,
  'Antarctica': 0.001,
  'Antigua and Barbuda': 0.093,
  'Argentina': 46,
  'Armenia': 3.0,
  'Australia': 26,
  'Austria': 9.0,
  'Azerbaijan': 10.3,
  'Bahrain': 0.16,
  'Bangladesh': 167,
  'Belarus': 9.5,
  'Belgium': 11.6,
  'Bolivia': 12,
  'Botswana': 2.48,
  'Brazil': 216,
  'British Virgin Islands': 0.039,
  'Bulgaria': 6.9,
  'Cambodia': 17,
  'Canada': 39,
  'Chile': 19.5,
  'China': 1412,
  'Colombia': 52,
  'Costa Rica': 5.2,
  'Croatia': 3.9,
  'Cuba': 11.3,
  'Cyprus': 1.2,
  'Czech Republic': 10.5,
  'Czechia': 10.9,
  'Denmark': 5.9,
  'Dominican Republic': 11,
  'Ecuador': 18,
  'Egypt': 105,
  'El Salvador': 6.5,
  'Estonia': 1.3,
  'Ethiopia': 128.7,
  'Falkland Islands': 0.003,
  'Finland': 5.5,
  'France': 68,
  'Georgia': 3.7,
  'Germany': 84,
  'Ghana': 33,
  'Greece': 10.4,
  'Guatemala': 18,
  'Haiti': 11.6,
  'Honduras': 10.4,
  'Hong Kong': 7.5,
  'Hungary': 9.7,
  'Iceland': 0.37,
  'India': 1408,
  'Indonesia': 275,
  'Iran': 85,
  'Iraq': 42,
  'Ireland': 5.3,
  'Israel': 9.5,
  'Italy': 59,
  'Jamaica': 2.8,
  'Japan': 125,
  'Jordan': 11,
  'Kazakhstan': 19.6,
  'Kenya': 55,
  'Kiribati': 0.13,
  'Kyrgyzstan': 6.7,
  'Laos': 7.66,
  'Latvia': 1.9,
  'Lebanon': 5.5,
  'Libya': 6.9,
  'Liechtenstein': 0.038,
  'Lithuania': 2.8,
  'Luxembourg': 0.64,
  'Macao': 0.68,
  'Macedonia': 2.1,
  'Malaysia': 33,
  'Malta': 0.52,
  'Mexico': 129,
  'Moldova': 2.6,
  'Monaco': 0.039,
  'Mongolia': 3.4,
  'Morocco': 37,
  'Myanmar': 55,
  'Nepal': 30,
  'Netherlands': 17.5,
  'New Zealand': 5.2,
  'Nicaragua': 6.9,
  'Niger': 26.2,
  'Nigeria': 218,
  'North Korea': 26.4,
  'Norway': 5.4,
  'Pakistan': 231,
  'Panama': 4.4,
  'Paraguay': 7.2,
  'Peru': 33,
  'Philippines': 112,
  'Poland': 38,
  'Portugal': 10.3,
  'Puerto Rico': 3.2,
  'Rwanda': 14,
  'Romania': 19,
  'Russia': 144,
  'Samoa': 0.22,
  'San Marino': 0.034,
  'Saudi Arabia': 33.3,
  'Serbia': 6.8,
  'Seychelles': 0.12,
  'Singapore': 5.9,
  'Slovakia': 5.4,
  'Slovenia': 2.1,
  'South Africa': 60,
  'South Korea': 52,
  'Spain': 47,
  'Sri Lanka': 22,
  'Sweden': 10.5,
  'Switzerland': 8.8,
  'Syria': 22,
  'Taiwan': 23.4,
  'Tajikistan': 9.8,
  'Thailand': 70,
  'Tunisia': 12,
  'Turkey': 85,
  'Turkmenistan': 6.1,
  'Türkiye': 85,
  'Turkiye': 85,
  'Ukraine': 44,
  'United Arab Emirates': 10.5,
  'United Kingdom': 67,
  'United States': 334,
  'United States Minor Outlying Islands': 0.0003,
  'Uruguay': 3.4,
  'Uzbekistan': 35,
  'Vatican': 0.0008,
  'Venezuela': 28,
  'Vietnam': 98,
  'Wallis and Futuna': 0.011
};

class CodeforceStatsEnhancer {
  constructor() {
    this.redCoderCache = new Map();
    this.isProcessing = false;
    this.sortState = {
      column: null,
      ascending: true
    };
  }

  async init() {
    console.log('CodeforceStatsEnhancer.init() called'); // Debug log
    
    if (this.isAlreadyEnhanced()) {
      console.log('Already enhanced, skipping'); // Debug log
      return;
    }
    
    console.log('Adding new columns...'); // Debug log
    this.addNewColumns();
    this.makeTableSortable();
    
    console.log('Starting to populate red coder data...'); // Debug log
    await this.populateRedCoderData();
  }

  isAlreadyEnhanced() {
    const result = document.querySelector('.red-coders-column') !== null;
    console.log('isAlreadyEnhanced:', result); // Debug log
    return result;
  }

  addNewColumns() {
    console.log('addNewColumns() called'); // Debug log
    
    const table = document.querySelector('.datatable table');
    if (!table) {
      console.error('Table . not found!'); // Debug log
      return;
    }

    console.log('Table found:', table); // Debug log

    // Add headers
    const headerRow = table.querySelector('thead tr');
    if (headerRow) {
      const redCodersHeader = document.createElement('th');
      redCodersHeader.className = 'red-coders-column';
      redCodersHeader.innerHTML = `
        <span class="sortable-header" data-sort="red-coders">
          Red Coders (2400+)
          <span class="sort-indicator"></span>
        </span>
      `;
      
      const perCapitaHeader = document.createElement('th');
      perCapitaHeader.className = 'per-capita-column';
      perCapitaHeader.innerHTML = `
        <span class="sortable-header" data-sort="per-capita">
          Red/Million
          <span class="sort-indicator"></span>
        </span>
      `;
      
      headerRow.appendChild(redCodersHeader);
      headerRow.appendChild(perCapitaHeader);
    }

    // Add empty cells to data rows
    const dataRows = table.querySelectorAll('tbody tr');
    dataRows.forEach(row => {
      const redCodersCell = document.createElement('td');
      redCodersCell.className = 'red-coders-data';
      redCodersCell.innerHTML = '<div class="loading-spinner">Loading...</div>';
      
      const perCapitaCell = document.createElement('td');
      perCapitaCell.className = 'per-capita-data';
      perCapitaCell.innerHTML = '-';
      
      row.appendChild(redCodersCell);
      row.appendChild(perCapitaCell);
    });
  }

  async populateRedCoderData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const table = document.querySelector('.datatable table');
    if (!table) return;

    const dataRows = table.querySelectorAll('tbody tr');
    
    // Process countries in batches to avoid overwhelming the server
    const batchSize = 2;
    // console.log('dataRows:', dataRows);
    for (let i = 0; i < dataRows.length; i += batchSize) {
      const batch = Array.from(dataRows).slice(i, i + batchSize);
      // console.log(i, 'batch:', batch); 
      
      await Promise.all(batch.map(row => this.processCountryRow(row)));
      
      // Add delay between batches
      if (i + batchSize < dataRows.length) {
        let r = randomInt(5000, 10000);
        await this.delay(r);
      }
    }
    
    this.isProcessing = false;
  }

  async processCountryRow(row) {
    try {
      const countryLink = row.querySelector('a[href*="/ratings/country/"]');
      if (!countryLink) return;

      const countryUrl = countryLink.href;
      const countryName = countryUrl.split('/').pop();
      console.log("processCountryRow:countryName=", countryName)
      console.log("processCountryRow:countryUrl=", countryUrl)

      // Check cache first
      if (this.redCoderCache.has(countryName)) {
        this.updateRowData(row, countryName, this.redCoderCache.get(countryName));
        console.log("Loaded from cache", countryName, this.redCoderCache.get(countryName));
        return;
      }

      const redCoderCount = await this.fetchRedCoderCount(countryUrl);
      this.redCoderCache.set(countryName, redCoderCount);
      this.updateRowData(row, countryName, redCoderCount);

    } catch (error) {
      console.error(`Error processing country row:`, error);
      this.updateRowWithError(row);
    }
  }

  async fetchRedCoderCount(countryUrl) {
    try {
      console.log("fetchRedCoderCount", countryUrl);
      const response = await fetch(countryUrl);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const rows = doc.querySelectorAll('.datatable table tbody tr');
      let redCoderCount = 0;
      
      for (const row of rows) {
        const ratingCell = row.querySelector('td:nth-child(4)'); // Rating column
        if (ratingCell) {
          const rating = parseInt(ratingCell.textContent.trim());
          if (rating >= 2400) {
            redCoderCount++;
          }
        }
      }
      
      return redCoderCount;
    } catch (error) {
      console.error('Error fetching red coder count:', error);
      return 0;
    }
  }

  updateRowData(row, countryName, redCoderCount) {
    const redCodersCell = row.querySelector('.red-coders-data');
    const perCapitaCell = row.querySelector('.per-capita-data');
    
    if (redCodersCell) {
      redCodersCell.textContent = redCoderCount.toString();
      redCodersCell.setAttribute('data-value', redCoderCount);
    }
    
    if (perCapitaCell) {
      const population = COUNTRY_POPULATIONS[countryName.replace('%20', ' ')];
      console.log("updateRowData:countryName=", countryName, "population=", population);
      if (population) {
        const perCapita = (redCoderCount / population).toFixed(2);
        perCapitaCell.textContent = perCapita;
        perCapitaCell.setAttribute('data-value', perCapita);
      } else {
        if (redCoderCount == 0)
          perCapitaCell.textContent = '0.0';
        else
          perCapitaCell.textContent = 'N/A';
        perCapitaCell.setAttribute('data-value', '0');
      }
    }
  }

  updateRowWithError(row) {
    const redCodersCell = row.querySelector('.red-coders-data');
    const perCapitaCell = row.querySelector('.per-capita-data');
    
    if (redCodersCell) {
      redCodersCell.textContent = 'Error';
      redCodersCell.setAttribute('data-value', '0');
    }
    
    if (perCapitaCell) {
      perCapitaCell.textContent = 'Error';
      perCapitaCell.setAttribute('data-value', '0');
    }
  }

  makeTableSortable() {
    const sortableHeaders = document.querySelectorAll('.sortable-header');
    sortableHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        const sortType = e.target.closest('.sortable-header').getAttribute('data-sort');
        this.sortTable(sortType);
      });
    });
  }

  sortTable(sortType) {
    const table = document.querySelector('.datatable table');
    if (!table) return;

    const tbody = table.querySelector('tbody') || table;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Toggle sort direction if clicking same column
    if (this.sortState.column === sortType) {
      this.sortState.ascending = !this.sortState.ascending;
    } else {
      this.sortState.column = sortType;
      this.sortState.ascending = false; // Default to descending for counts
    }

    rows.sort((a, b) => {
      let aVal, bVal;
      
      if (sortType === 'red-coders') {
        aVal = parseFloat(a.querySelector('.red-coders-data')?.getAttribute('data-value') || '0');
        bVal = parseFloat(b.querySelector('.red-coders-data')?.getAttribute('data-value') || '0');
      } else if (sortType === 'per-capita') {
        aVal = parseFloat(a.querySelector('.per-capita-data')?.getAttribute('data-value') || '0');
        bVal = parseFloat(b.querySelector('.per-capita-data')?.getAttribute('data-value') || '0');
      }
      
      const result = this.sortState.ascending ? aVal - bVal : bVal - aVal;
      return result;
    });

    // Update sort indicators
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
      indicator.textContent = '';
    });
    
    const currentHeader = document.querySelector(`[data-sort="${sortType}"] .sort-indicator`);
    if (currentHeader) {
      currentHeader.textContent = this.sortState.ascending ? ' ↑' : ' ↓';
    }

    // Reorder rows in DOM
    rows.forEach(row => tbody.appendChild(row));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create global instance for popup communication
let globalEnhancer = null;

// Initialize when DOM is ready
function initializeEnhancer() {
  console.log("initializeEnhancer", globalEnhancer)
  if (!globalEnhancer) {
    globalEnhancer = new CodeforceStatsEnhancer();
    window.codeforcesEnhancer = globalEnhancer; // Expose globally
  }
  globalEnhancer.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnhancer);
} else {
  initializeEnhancer();
}

// Expose functions for popup communication
window.checkEnhancementStatus = function() {
  console.log('checkEnhancementStatus called'); // Debug log
  const enhanced = document.querySelector('.red-coders-column') !== null;
  const processing = document.querySelector('.loading-spinner') !== null;
  const countryRows = document.querySelectorAll('.datatable table tbody tr').length;
  
  return {
    isEnhanced: enhanced,
    isProcessing: processing,
    countryCount: countryRows
  };
};

window.refreshEnhancement = function() {
  console.log('refreshEnhancement called'); // Debug log
  
  // Remove existing enhancement
  const existingColumns = document.querySelectorAll('.red-coders-column, .per-capita-column');
  existingColumns.forEach(col => col.remove());
  
  const existingCells = document.querySelectorAll('.red-coders-data, .per-capita-data');
  existingCells.forEach(cell => cell.remove());
  
  // Clear cache and reinitialize
  if (globalEnhancer) {
    globalEnhancer.redCoderCache.clear();
    globalEnhancer.isProcessing = false;
    globalEnhancer.init();
  } else {
    initializeEnhancer();
  }
  
  return 'Enhancement refreshed';
};

window.clearCache = function() {
  console.log('clearCache called'); // Debug log
  if (globalEnhancer && globalEnhancer.redCoderCache) {
    globalEnhancer.redCoderCache.clear();
    return 'Cache cleared';
  }
  return 'No cache to clear';
};