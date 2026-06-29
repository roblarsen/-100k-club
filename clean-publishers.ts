import { readFileSync, writeFileSync } from 'fs';

// 1. Establish your definitive string-matching keyword mapping
const publisherInferenceMap: Record<string, string[]> = {
  'dccomics': ['superman', 'batman', 'action-comics', 'detective-comics', 'flash', 'green-lantern', 'wonder-woman', 'all-star'],
  'marvelcomics': ['journey-into-mystery', 'amazing-fantasy', 'hulk', 'x-men', 'avengers', 'fantastic-four', 'spider-man', 'thor', 'captain-america'],
  'archiecomics': ['archie', 'pep-comics', 'jughead'],
  'eccomics': ['tales-from-the-crypt', 'vault-of-horror', 'weird-science'],
  'fawcettcomics': ['whiz-comics', 'captain-marvel']
};

function enrichUnknownPublishers(filePath: string) {
  const fileRaw = readFileSync(filePath, 'utf-8');
  const assets = JSON.parse(fileRaw);
  let enrichmentCount = 0;

  console.log(`🔍 Scanning ${assets.length} records for 'Unknown' publisher artifacts...`);

  const correctedAssets = assets.map((asset: any) => {
    // Catch either 'Unknown' in customMetadata OR an unindexed ':unknown:' slug in the URN
    const exactUrnParts = asset.urn.split(':');
    const currentUrnPublisher = exactUrnParts[3]; // urn:altasset:assetClass:PUBLISHER:title...

    if (asset.customMetadata?.publisher?.toLowerCase() === 'unknown' || currentUrnPublisher === 'unknown') {
      const titleSlug = exactUrnParts[4] || '';
      let matchedPublisher = 'unknown';

      // Scan our keyword maps to match against the title slug string
      for (const [pubName, keywords] of Object.entries(publisherInferenceMap)) {
        if (keywords.some(keyword => titleSlug.includes(keyword))) {
          matchedPublisher = pubName;
          break;
        }
      }

      if (matchedPublisher !== 'unknown') {
        enrichmentCount++;
        
        // Repair the custom metadata block formatting
        const formattedDisplayNames: Record<string, string> = {
          'dccomics': 'DC Comics',
          'marvelcomics': 'Marvel Comics',
          'archiecomics': 'Archie Comics',
          'eccomics': 'EC Comics',
          'fawcettcomics': 'Fawcett Comics'
        };
        asset.customMetadata.publisher = formattedDisplayNames[matchedPublisher] || matchedPublisher;

        // Repair the active structural identity URN string
        exactUrnParts[3] = matchedPublisher;
        asset.urn = exactUrnParts.join(':');
        
        console.log(`✅ Fixed [${asset.customMetadata.title} #${asset.customMetadata.issueNumber}]: Assigned to ${asset.customMetadata.publisher}`);
      }
    }
    return asset;
  });

  if (enrichmentCount > 0) {
    writeFileSync(filePath, JSON.stringify(correctedAssets, null, 2));
    console.log(`\n🏁 Done! Successfully enriched and rewritten ${enrichmentCount} 'Unknown' records in your source file.`);
  } else {
    console.log('\n✨ Clear! Zero unindexed publisher fields left behind.');
  }
}

// Run the pass directly over your spec payload file
enrichUnknownPublishers('./data/books.json');