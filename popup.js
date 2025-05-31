document.addEventListener('DOMContentLoaded', async function() {
  const pageStatus = document.getElementById('pageStatus');
  const dataStatus = document.getElementById('dataStatus');
  const countryCount = document.getElementById('countryCount');
  const refreshBtn = document.getElementById('refreshBtn');
  const refreshText = document.getElementById('refreshText');
  const clearCacheBtn = document.getElementById('clearCacheBtn');

  console.log('Popup loaded'); // Debug log

  // Check if we're on the correct page
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('Current tab URL:', tab.url); // Debug log
    
    if (tab.url && tab.url.includes('codeforces.com/ratings/countries')) {
      pageStatus.textContent = 'Codeforces Rankings';
      pageStatus.style.color = '#28a745';
      
      // Check if enhancement is already active
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // This function runs in the page context
            console.log('Checking enhancement status in page context');
            return window.checkEnhancementStatus ? window.checkEnhancementStatus() : null;
          }
        });
        
        console.log('Enhancement check results:', results); // Debug log
        
        if (results && results[0] && results[0].result) {
          const status = results[0].result;
          dataStatus.textContent = status.isEnhanced ? 'Enhanced' : 'Not enhanced';
          dataStatus.style.color = status.isEnhanced ? '#28a745' : '#ffc107';
          countryCount.textContent = status.countryCount || '0';
          
          if (status.isProcessing) {
            refreshText.innerHTML = '<span class="loading"></span>Loading...';
            refreshBtn.disabled = true;
          }
        } else {
          dataStatus.textContent = 'Not loaded';
          dataStatus.style.color = '#6c757d';
        }
      } catch (scriptError) {
        console.error('Script execution error:', scriptError);
        dataStatus.textContent = 'Script error';
        dataStatus.style.color = '#dc3545';
      }
    } else {
      pageStatus.textContent = 'Wrong page';
      pageStatus.style.color = '#dc3545';
      refreshBtn.disabled = true;
    }
  } catch (error) {
    pageStatus.textContent = 'Error';
    pageStatus.style.color = '#dc3545';
    console.error('Error checking page status:', error);
  }

  // Refresh button handler
  refreshBtn.addEventListener('click', async function() {
    console.log('Refresh button clicked'); // Debug log
    
    try {
      refreshText.innerHTML = '<span class="loading"></span>Refreshing...';
      refreshBtn.disabled = true;
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // This function runs in the page context
          console.log('Executing refresh in page context');
          if (window.refreshEnhancement) {
            return window.refreshEnhancement();
          } else {
            console.error('refreshEnhancement function not found');
            return 'Function not found';
          }
        }
      });
      
      console.log('Refresh results:', results); // Debug log
      
      // Update status after a short delay
      setTimeout(async () => {
        try {
          const statusResults = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              return window.checkEnhancementStatus ? window.checkEnhancementStatus() : null;
            }
          });
          
          if (statusResults && statusResults[0] && statusResults[0].result) {
            const status = statusResults[0].result;
            dataStatus.textContent = status.isProcessing ? 'Loading...' : 'Enhanced';
            dataStatus.style.color = status.isProcessing ? '#ffc107' : '#28a745';
            countryCount.textContent = status.countryCount || '0';
          }
        } catch (statusError) {
          console.error('Status check error:', statusError);
        }
        
        refreshText.textContent = 'Refresh Data';
        refreshBtn.disabled = false;
      }, 1000);
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      refreshText.textContent = 'Error';
      setTimeout(() => {
        refreshText.textContent = 'Refresh Data';
        refreshBtn.disabled = false;
      }, 2000);
    }
  });

  // Clear cache button handler
  clearCacheBtn.addEventListener('click', async function() {
    console.log('Clear cache button clicked'); // Debug log
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          console.log('Executing clear cache in page context');
          if (window.clearCache) {
            return window.clearCache();
          } else {
            console.error('clearCache function not found');
            return 'Function not found';
          }
        }
      });
      
      console.log('Clear cache results:', results); // Debug log
      
      dataStatus.textContent = 'Cache cleared';
      dataStatus.style.color = '#28a745';
      
      setTimeout(() => {
        dataStatus.textContent = 'Ready';
        dataStatus.style.color = '#6c757d';
      }, 2000);
      
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  });
});