# Codeforces Country Stats Enhancer

A Chrome extension that enhances the Codeforces country rankings page by adding two new columns:
- **Red Coders (2400+)**: Number of coders rated above 2400 in each country
- **Red/Million**: Number of red coders per million population (per capita)

## Features

- ✅ Real-time data fetching from individual country pages
- ✅ Sortable columns with visual indicators
- ✅ Built-in country population data for per capita calculations
- ✅ Caching to avoid redundant requests
- ✅ Loading indicators and error handling
- ✅ Responsive design that matches Codeforces styling
- ✅ Popup interface for monitoring and control

## Installation

### Method 1: Developer Mode (Recommended for testing)

1. **Download the extension files**:
   - Create a new folder called `cf-stats-enhancer`
   - Save all the provided files in this folder:
     - `manifest.json`
     - `content.js`
     - `styles.css`
     - `popup.html`
     - `popup.js`

2. **Install in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `cf-stats-enhancer` folder
   - The extension should now appear in your extensions list

3. **Usage**:
   - Navigate to https://codeforces.com/ratings/countries
   - The extension will automatically add the two new columns
   - Data will load progressively for each country
   - Use the extension popup to monitor progress and refresh data

## How It Works

### Data Collection
- The extension scans each country's individual rating page (e.g., `/ratings/country/China`)
- Counts coders with ratings ≥ 2400 in real-time
- Uses batched requests (3 countries at a time) to avoid overwhelming the server
- Includes 1-second delays between batches to be respectful to Codeforces

### Population Data
- Contains hardcoded population data for 100+ countries (2023 estimates)
- Calculates per capita as: `(Red Coders / Population in Millions)`
- Shows "N/A" for countries without population data

### Caching
- Caches red coder counts to avoid redundant requests
- Cache persists during the session
- Can be cleared via the popup interface

## Features Detail

### Sortable Columns
- Click column headers to sort by red coder count or per capita
- Visual indicators show sort direction (↑ ascending, ↓ descending)
- Maintains Codeforces' existing sorting functionality

### Loading States
- Shows "Loading..." with spinner while fetching data
- Progressive loading - countries populate as data becomes available
- Error handling for failed requests

### Responsive Design
- Matches Codeforces' existing table styling
- Mobile-friendly responsive layout
- Hover effects and visual feedback

## Extension Popup

The popup provides:
- **Page Status**: Confirms you're on the correct Codeforces page
- **Data Status**: Shows if enhancement is active and loading state
- **Country Count**: Number of countries being processed
- **Refresh Data**: Manually refresh all data
- **Clear Cache**: Clear stored data to force fresh requests

## Technical Implementation

### Architecture
- **Content Script**: Main logic that modifies the page
- **Popup**: Control interface for user interaction
- **CSS**: Styling that integrates with Codeforces design
- **Manifest V3**: Latest Chrome extension format

### Rate Limiting
- Processes countries in batches of 3
- 1-second delay between batches
- Caches results to minimize requests
- Respectful to Codeforces infrastructure

### Error Handling
- Graceful handling of network failures
- Fallback values for missing data
- User feedback for error states
- Retry mechanisms built-in

## Troubleshooting

### Extension Not Working
1. Ensure you're on `https://codeforces.com/ratings/countries`
2. Check if the extension is enabled in `chrome://extensions/`
3. Try refreshing the page
4. Use the popup to check status and refresh data

### Data Not Loading
1. Check your internet connection
2. Codeforces might be experiencing high traffic
3. Try clearing cache via the popup
4. Wait a few minutes and refresh

### Performance Issues
- The extension is designed to be lightweight
- Uses progressive loading to avoid blocking the page
- Caches data to reduce redundant requests
- Batched processing prevents server overload

## Customization

### Adding More Countries
Edit the `COUNTRY_POPULATIONS` object in `content.js` to add population data for additional countries.

### Changing Batch Size
Modify the `batchSize` variable in the `populateRedCoderData()` function to process more/fewer countries simultaneously.

### Adjusting Delays
Change the delay value in the batch processing loop to make requests faster or slower.

## Privacy & Permissions

The extension requires:
- **activeTab**: To access the current Codeforces page
- **scripting**: To inject the enhancement code
- **host_permissions**: Only for codeforces.com domain

The extension:
- ✅ Only works on Codeforces pages
- ✅ Does not collect or transmit personal data
- ✅ Does not access other websites or tabs
- ✅ All data processing happens locally

## Contributing

To modify or improve the extension:

1. Edit the relevant files in your local copy
2. Test changes by reloading the extension in `chrome://extensions/`
3. The content script automatically reinjects when the page is refreshed

### Development Tips
- Use Chrome DevTools Console to debug issues
- Check the Network tab to monitor Codeforces requests
- The popup provides real-time status information
- Cache can be cleared for testing without reinstalling

## Limitations

- Depends on Codeforces page structure (may break if they change their HTML)
- Population data is static (updated manually)
- Rate limited to be respectful to Codeforces servers
- Only works on the country rankings page

## Version History

**v1.0** - Initial release
- Basic red coder counting functionality
- Per capita calculations
- Sortable columns
- Popup interface
- Caching system