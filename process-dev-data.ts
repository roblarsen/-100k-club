import { readFileSync, writeFileSync } from 'fs';
import { isAltAsset, validateProvenanceLedger } from 'alt-asset-spec';


// Simple type mapping mirroring your raw books.dev.json properties
interface LegacyBookRecord {
  title: string;
  issue: string;
  publisher?: string;
  coverDate?: string;
  grade?: string;
  gradeSrc?: string; // CGC, CBCS, etc.
  cgcid?: string;
  pedigree?: string;
  generalCommentary?: string;
  tags?: string;
  sales?: Array<{
    salesDate: string;
    venue: string;
    price: number;
    link?: string;
  }>;
}

/**
 * Cleanly formats scraped date strings into ISO 8601 month tokens (YYYY-MM)
 */
function normalizeDate(rawDate: string): string {
  const clean = rawDate.toLowerCase();
  const yearMatch = clean.match(/\b\d{4}\b/);
  const year = yearMatch ? yearMatch[0] : '2026';

  const months: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };

  let month = '01';
  for (const [key, val] of Object.entries(months)) {
    if (clean.includes(key)) { month = val; break; }
  }
  return `${year}-${month}`;
}

function migrateRecord(legacy: LegacyBookRecord, idx: number) {
  const titleSlug = legacy.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const issueSlug = legacy.issue.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const certToken = legacy.cgcid ? `:${legacy.cgcid}` : `:inst-${idx}`;
  
  const urn = `urn:altasset:comic:${legacy.publisher?.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'unknown'}:${titleSlug}:${issueSlug}${certToken}`;
  const parsedGrade = legacy.grade ? parseFloat(legacy.grade) : undefined;

  const ledger = (legacy.sales || []).map((sale, sIdx) => ({
    eventId: `evt_${titleSlug}_${issueSlug}_sale_${idx}_${sIdx}`,
    eventType: 'auction_sale' as const,
    date: normalizeDate(sale.salesDate),
    platform: sale.venue,
    sourceLink: sale.link,
    financials: {
      amount: sale.price,
      currency: 'USD'
    }
  }));

  return {
    urn,
    schemaVersion: '1.0.0',
    assetClass: 'comic' as const,
    currentAuthentication: {
      grader: legacy.gradeSrc || 'RAW',
      certNumber: legacy.cgcid || undefined,
      numericGrade: isNaN(parsedGrade as number) ? undefined : parsedGrade,
      rawGradeString: legacy.grade || 'RAW',
      isActive: true,
      qualifiers: legacy.pedigree ? [legacy.pedigree] : []
    },
    provenanceLedger: ledger,
    tags: legacy.tags ? legacy.tags.split(',').map(t => t.trim()) : undefined,
    generalCommentary: legacy.generalCommentary || undefined,
    customMetadata: {
      publisher: legacy.publisher || 'Unknown',
      title: legacy.title,
      issueNumber: legacy.issue,
      publicationDate: legacy.coverDate ? normalizeDate(legacy.coverDate) : 'Unknown'
    }
  };
}

// --- Execution Loop ---
const fileContent = readFileSync('./data/data/books.dev.json', 'utf-8');
const parsedData = JSON.parse(fileContent);

// Safeguard against object wrappers (e.g., { books: [...] })
let rawData: any[] = [];
if (Array.isArray(parsedData)) {
  rawData = parsedData;
} else if (parsedData && typeof parsedData === 'object') {
  // Dynamically find the first array property inside the object container
  const arrayKey = Object.keys(parsedData).find(key => Array.isArray(parsedData[key]));
  if (arrayKey) {
    rawData = parsedData[arrayKey];
    console.log(`ℹ️ Extracted dataset from wrapped key field: "${arrayKey}"`);
  }
}

if (!Array.isArray(rawData) || rawData.length === 0) {
  console.error('❌ Error: Could not locate a valid data array inside books.dev.json.');
  process.exit(1);
}

console.log(`📥 Ingesting ${rawData.length} records from books.dev.json...`);

const migrated = rawData.map((item: LegacyBookRecord, i: number) => {
  const specObj = migrateRecord(item, i);
  
  // Runtime audit checkpoints
  if (!isAltAsset(specObj)) {
    console.error(`❌ Validation failed on: ${item.title} #${item.issue}`);
    return null;
  }
  
  return specObj;
}).filter(Boolean);

writeFileSync('./data/data/books.spec.json', JSON.stringify(migrated, null, 2));
console.log(`🏁 Done! Output ${migrated.length} validated items to books.spec.json.`);