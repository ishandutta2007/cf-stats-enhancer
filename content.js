// Country population data (in millions) - 2023 estimates
const COUNTRY_POPULATIONS = {
  'China': 1412,
  'United States': 334,
  'Russia': 144,
  'India': 1408,
  'Ukraine': 44,
  'Germany': 84,
  'Japan': 125,
  'Poland': 38,
  'Belarus': 9.5,
  'Canada': 39,
  'United Kingdom': 67,
  'France': 68,
  'South Korea': 52,
  'Brazil': 216,
  'Iran': 85,
  'Turkey': 85,
  'Italy': 59,
  'Romania': 19,
  'Vietnam': 98,
  'Bangladesh': 167,
  'Kazakhstan': 19.6,
  'Taiwan': 23.4,
  'Netherlands': 17.5,
  'Australia': 26,
  'Czech Republic': 10.5,
  'Spain': 47,
  'Indonesia': 275,
  'Egypt': 105,
  'Mexico': 129,
  'Bulgaria': 6.9,
  'Georgia': 3.7,
  'Hungary': 9.7,
  'Israel': 9.5,
  'Sweden': 10.5,
  'Serbia': 6.8,
  'Finland': 5.5,
  'Norway': 5.4,
  'Lithuania': 2.8,
  'Latvia': 1.9,
  'Slovakia': 5.4,
  'Croatia': 3.9,
  'Singapore': 5.9,
  'Moldova': 2.6,
  'Estonia': 1.3,
  'Armenia': 3.0,
  'Mongolia': 3.4,
  'Greece': 10.4,
  'Denmark': 5.9,
  'Switzerland': 8.8,
  'Belgium': 11.6,
  'Austria': 9.0,
  'Portugal': 10.3,
  'Macedonia': 2.1,
  'Slovenia': 2.1,
  'Algeria': 45,
  'Morocco': 37,
  'Pakistan': 231,
  'Philippines': 112,
  'Thailand': 70,
  'Syria': 22,
  'Iraq': 42,
  'Jordan': 11,
  'Azerbaijan': 10.3,
  'Uzbekistan': 35,
  'Kyrgyzstan': 6.7,
  'Tajikistan': 9.8,
  'Turkmenistan': 6.1,
  'Afghanistan': 40,
  'Nepal': 30,
  'Sri Lanka': 22,
  'Myanmar': 55,
  'Cambodia': 17,
  'Malaysia': 33,
  'Hong Kong': 7.5,
  'New Zealand': 5.2,
  'South Africa': 60,
  'Nigeria': 218,
  'Kenya': 55,
  'Ghana': 33,
  'Tunisia': 12,
  'Libya': 6.9,
  'Lebanon': 5.5,
  'Uruguay': 3.4,
  'Argentina': 46,
  'Chile': 19.5,
  'Colombia': 52,
  'Peru': 33,
  'Venezuela': 28,
  'Ecuador': 18,
  'Bolivia': 12,
  'Paraguay': 7.2,
  'Costa Rica': 5.2,
  'Panama': 4.4,
  'Guatemala': 18,
  'Honduras': 10.4,
  'El Salvador': 6.5,
  'Nicaragua': 6.9,
  'Jamaica': 2.8,
  'Cuba': 11.3,
  'Dominican Republic': 11,
  'Haiti': 11.6,
  'Puerto Rico': 3.2,
  'Malta': 0.52,
  'Cyprus': 1.2,
  'Luxembourg': 0.64,
  'Iceland': 0.37,
  'Liechtenstein': 0.038,
  'Monaco': 0.039,
  'San Marino': 0.034,
  'Andorra': 0.079,
  'Vatican': 0.0008
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
    
    const table = document.querySelector('.datatable');
    if (!table) {
      console.error('Table . not found!'); // Debug log
      return;
    }

    console.log('Table found:', table); // Debug log

    // Add headers
    const headerRow = table.querySelector('tr');
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
    const dataRows = table.querySelectorAll('tr:not(:first-child)');
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

    const table = document.querySelector('.datatable');
    if (!table) return;

    const dataRows = table.querySelectorAll('tr:not(:first-child)');
    
    // Process countries in batches to avoid overwhelming the server
    const batchSize = 3;
    console.log('dataRows:', dataRows); 
    for (let i = 0; i < dataRows.length; i += batchSize) {
      const batch = Array.from(dataRows).slice(i, i + batchSize);
      
      await Promise.all(batch.map(row => this.processCountryRow(row)));
      
      // Add delay between batches
      if (i + batchSize < dataRows.length) {
        await this.delay(1000);
      }
    }
    
    this.isProcessing = false;
  }

  async processCountryRow(row) {
    try {
      const countryLink = row.querySelector('a[href*="/ratings/country/"]');
      if (!countryLink) return;

      const countryName = countryLink.textContent.trim();
      const countryUrl = countryLink.href;

      // Check cache first
      if (this.redCoderCache.has(countryName)) {
        this.updateRowData(row, countryName, this.redCoderCache.get(countryName));
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
      const response = await fetch(countryUrl);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const rows = doc.querySelectorAll('.datatable tr:not(:first-child)');
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
      const population = COUNTRY_POPULATIONS[countryName];
      if (population) {
        const perCapita = (redCoderCount / population).toFixed(2);
        perCapitaCell.textContent = perCapita;
        perCapitaCell.setAttribute('data-value', perCapita);
      } else {
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
    const table = document.querySelector('.datatable');
    if (!table) return;

    const tbody = table.querySelector('tbody') || table;
    const rows = Array.from(tbody.querySelectorAll('tr:not(:first-child)'));
    
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
  const countryRows = document.querySelectorAll('.datatable tr:not(:first-child)').length;
  
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