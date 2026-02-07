(function extractHeritageList() {
    const results = [];
    // Target the specific container for search result rows in list mode
    const rows = document.querySelectorAll('.item-block.list');

    rows.forEach(row => {
            // Find the title/description
            const titleEl = row.querySelector('.item-title');
            
            const title = titleEl?.innerText.trim();

           
            const price = Number(document.querySelector('.bot-price-data').innerText.replace(/[$,]/g, ''));

            // Find the lot number
            const lotEl = row.querySelector('.item-info p');
const lotMatch = lotEl?.innerText.match(/Lot\s*(\d+)/);
const lot = lotMatch ? lotMatch[1] : null;


            
            // Find the auction date/info
            const dateEl = row.querySelector('.auction-date, .date-info');
            const date = dateEl?.innerText.trim() || document.querySelector('.auction-name-header')?.innerText.trim();

            if (title && price) {
                results.push({
                    title: title,
                    lot: lot || "N/A",
                    price: price,
                    date: date,
                    url: titleEl?.href || row.querySelector('a')?.href
                });
            }

    });

    const json = JSON.stringify(results, null, 2);
    console.log(json);
    copy(json); // This copies it to your clipboard
    console.log(`Successfully extracted ${results.length} items to your clipboard.`);
})();