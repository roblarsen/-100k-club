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
 * Normalizes a scraped date string to a full ISO 8601 date (YYYY-MM-DD) when
 * day information is available, or a month token (YYYY-MM) otherwise.
 * Handles single-digit month/day components (e.g., "2013-9-25" → "2013-09-25").
 */
function normalizeDate(rawDate: string): string {
  const clean = rawDate.trim();

  // Handle ISO-like date formats: YYYY-M-D, YYYY-MM-D, YYYY-M-DD, YYYY-MM-DD, YYYY-MM
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3] ? isoMatch[3].padStart(2, '0') : null;
    return day ? `${year}-${month}-${day}` : `${year}-${month}`;
  }

  // Handle text-based dates like "March 2010", "Apr 2010"
  const lc = clean.toLowerCase();
  const yearMatch = lc.match(/\b(\d{4})\b/);
  const year = yearMatch ? yearMatch[1] : '2026';

  const months: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };

  let month = '01';
  for (const [key, val] of Object.entries(months)) {
    if (lc.includes(key)) { month = val; break; }
  }
  return `${year}-${month}`;
}

function migrateRecord(legacy: any, idx: number) {
const serialNumber = legacy.cgcid || legacy.cbcsid || undefined;

  const titleSlug = legacy.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const issueSlug = legacy.issue.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // 1. Core Publisher Inference Dictionary
  let inferredPublisher = legacy.publisher?.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'unknown';
  if (inferredPublisher === 'unknown') {
    const pubMap: Record<string, string> = {
      'superman': 'dccomics',
      'batman': 'dccomics',
      'action-comics': 'dccomics',
      'detective-comics': 'dccomics',
      'suspense-comics': 'continentalmagazines',
      'journey-into-mystery': 'marvelcomics',
      'amazing-fantasy': 'marvelcomics'
    };
    if (pubMap[titleSlug]) {
      inferredPublisher = pubMap[titleSlug];
    }
  }

  const certToken = serialNumber ? `:${serialNumber}` : `:inst-${idx}`;
  const urn = `urn:altasset:comic:${inferredPublisher}:${titleSlug}:${issueSlug}${certToken}`;
  const parsedGrade = legacy.grade ? parseFloat(legacy.grade) : undefined;

  const ledger = (legacy.sales || []).map((sale: any, sIdx: number) => {
    // Fix 2: Safeguard against completely empty sale date parameters
    let finalDate = "2015-01"; // Neighborhood default fallback for this specific block match
    if (sale.salesDate && sale.salesDate.trim() !== "") {
      finalDate = normalizeDate(sale.salesDate);
    }

    // Fix 3: Preserve decimal cents — use parseFloat so "192120.15" stays 192120.15
    let finalPrice = 0;
    if (sale.price) {
      finalPrice = typeof sale.price === 'string' 
        ? parseFloat(sale.price.replace(/[^0-9.]/g, '')) 
        : sale.price;
    }

    return {
      eventId: `evt_${titleSlug}_${issueSlug}_sale_${idx}_${sIdx}`,
      eventType: 'auction_sale' as const,
      date: finalDate,
      platform: sale.venue,
      sourceLink: sale.link,
      financials: finalPrice > 0 ? {
        amount: finalPrice,
        currency: 'USD'
      } : undefined
    };
  });

  return {
    urn,
    schemaVersion: '1.0.0',
    assetClass: 'comic' as const,
    currentAuthentication: {
      grader: legacy.gradeSrc || 'RAW',
      certNumber: serialNumber,
      numericGrade: isNaN(parsedGrade as number) ? undefined : parsedGrade,
      rawGradeString: legacy.grade || 'RAW',
      isActive: true,
      qualifiers: legacy.pedigree ? [legacy.pedigree] : []
    },
    provenanceLedger: ledger,
    tags: legacy.tags ? legacy.tags.split(',').map((t: string) => t.trim()) : undefined,
    generalCommentary: legacy.generalCommentary || undefined,
    customMetadata: {
      publisher: legacy.publisher || 'Unknown',
      title: legacy.title,
      issueNumber: legacy.issue,
      publicationDate: legacy.coverDate ? normalizeDate(legacy.coverDate).substring(0, 7) : 'Unknown'
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

writeFileSync('./data/books.json', JSON.stringify(migrated, null, 2));
console.log(`🏁 Done! Output ${migrated.length} validated items to books.json.`);