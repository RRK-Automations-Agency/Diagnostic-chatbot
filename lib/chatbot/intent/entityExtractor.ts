/**
 * Entity extraction for tests, names, phone numbers, dates, and services.
 */

import { ExtractedEntities } from "./types";
import { normalizeText } from "./normalizer";

// Canonical test dictionary mapping canonical name to alias patterns
export const TEST_CANONICAL_MAP: Record<string, { canonical: string; aliases: string[] }> = {
  CBC: {
    canonical: "Complete Blood Count (CBC)",
    aliases: [
      "cbc",
      "complete blood count",
      "blood count",
      "hemogram",
      "haemogram",
      "full blood count",
      "complete blood picture",
      "cbp",
    ],
  },
  BLOOD_SUGAR: {
    canonical: "Blood Sugar (Fasting / PP)",
    aliases: [
      "blood sugar",
      "sugar test",
      "fasting blood sugar",
      "fbs",
      "post prandial",
      "ppbs",
      "glucose",
      "glucose test",
      "fasting sugar",
      "pp sugar",
      "rbs",
      "random blood sugar",
      "sugar",
    ],
  },
  HBA1C: {
    canonical: "HbA1c (Glycated Haemoglobin)",
    aliases: [
      "hba1c",
      "hb a1c",
      "hba 1c",
      "a1c",
      "glycated haemoglobin",
      "glycated hemoglobin",
      "glycosylated hemoglobin",
      "3 month sugar",
      "three month sugar",
    ],
  },
  LIPID_PROFILE: {
    canonical: "Lipid Profile",
    aliases: [
      "lipid",
      "lipid profile",
      "lipid panel",
      "cholesterol test",
      "cholesterol",
      "triglycerides",
      "hdl",
      "ldl",
      "lipid test",
    ],
  },
  THYROID_PROFILE: {
    canonical: "Thyroid Profile (T3, T4, TSH)",
    aliases: [
      "thyroid",
      "thyroid test",
      "thyroid profile",
      "thyroid function",
      "thyroid function test",
      "thyroid panel",
      "tsh",
      "t3",
      "t4",
      "tft",
    ],
  },
  VITAMIN_D: {
    canonical: "Vitamin D (25-OH)",
    aliases: [
      "vitamin d",
      "vit d",
      "d3 test",
      "vitamin d3",
      "vitamin d test",
      "25 oh vitamin d",
      "25 hydroxy vitamin d",
    ],
  },
  LFT: {
    canonical: "Liver Function Test (LFT)",
    aliases: [
      "lft",
      "liver function",
      "liver test",
      "liver function test",
      "liver panel",
      "bilirubin",
      "sgot",
      "sgpt",
    ],
  },
  KFT: {
    canonical: "Kidney Function Test (KFT / RFT)",
    aliases: [
      "kft",
      "rft",
      "kidney function",
      "kidney test",
      "kidney function test",
      "renal function test",
      "renal function",
      "creatinine",
      "blood urea",
    ],
  },
};

/**
 * Extracts test entity from user input text.
 */
export function extractTest(text: string): { canonical?: string; raw?: string } {
  const norm = normalizeText(text);

  // Sort entries so more specific multi-word aliases match before shorter substrings
  const entries = Object.values(TEST_CANONICAL_MAP);
  
  // Sort aliases by length descending
  const allAliases: { alias: string; canonical: string }[] = [];
  for (const item of entries) {
    for (const alias of item.aliases) {
      allAliases.push({ alias, canonical: item.canonical });
    }
  }
  allAliases.sort((a, b) => b.alias.length - a.alias.length);

  for (const { alias, canonical } of allAliases) {
    // Word boundary regex
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(norm)) {
      return { canonical, raw: alias };
    }
  }

  return {};
}

/**
 * Extracts and normalizes an Indian mobile number (10 digits starting with 6-9).
 * Handles formats like:
 * - 9876543210
 * - +91 9876543210
 * - +91-98765-43210
 * - 09876543210
 * - 98765 43210
 *
 * Rejects numbers that do not start with 6-9, are longer than 10 digits
 * (never truncates), or are too short.
 */
export function extractPhone(text: string): string | undefined {
  if (!text) return undefined;

  // Normalize spacing / separators so we can reason about the digit run.
  const compact = text.replace(/[\s\-().]+/g, "");

  // Prefixed forms: +91 / 91 / 0 followed by exactly 10 digits starting with 6-9.
  const prefixed = compact.match(/(?:\+?91|0)([6-9]\d{9})(?!\d)/);
  if (prefixed) {
    return prefixed[1];
  }

  // Bare 10-digit number. (?<!\d) ensures it is not part of a longer digit run
  // (so "99999999999" can never match its first or last 10 digits) and (?!\d)
  // prevents trailing truncation.
  const bare = compact.match(/(?<!\d)([6-9]\d{9})(?!\d)/);
  if (bare) {
    return bare[1];
  }

  return undefined;
}

/**
 * Extracts a person's name using conversational patterns or slot context.
 */
export function extractName(text: string, isNamePromptContext: boolean = false): string | undefined {
  if (!text) return undefined;

  const raw = text.trim();

  // Pattern 1: "my name is [Name]", "i am [Name]", "myself [Name]", "this is [Name]"
  const patternMatch = raw.match(
    /(?:my name is|i am|i'm|myself|this is|name\s*[:=-])\s+([A-Za-z\s.'-]{2,40})/i
  );
  if (patternMatch) {
    const candidate = patternMatch[1].trim();
    const cleaned = cleanNameCandidate(candidate);
    if (isValidName(cleaned)) return cleaned;
  }

  // Pattern 2: "book ... for [Name]", "... for [Name]", "... name [Name]"
  // Only capitalized word sequences are treated as names so that arbitrary
  // questions ("what is cbc for", "for my family") are not captured.
  // The (?![\w]) lookahead stops fragments of test names like "HbA" from
  // "HbA1c" (or "Vitamin D3") being captured as person names, and prevents
  // the regex from backtracking to a shorter word fragment.
  const forMatch = raw.match(
    /(?:\bfor\s+|\bname\s+)([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,3})(?![\w])/i
  );
  if (forMatch) {
    const cleaned = cleanNameCandidate(forMatch[1]);
    if (isValidName(cleaned)) return cleaned;
  }

  // If in COLLECTING_NAME dialog state context, treat the whole trimmed text as candidate
  if (isNamePromptContext) {
    const cleaned = cleanNameCandidate(raw);
    if (isValidName(cleaned)) return cleaned;
  }

  return undefined;
}

function cleanNameCandidate(name: string): string {
  return name
    .replace(/^(?:mr\.?|mrs\.?|ms\.?|dr\.?)\s+/i, "")
    .replace(/\s+(?:and\s+my\s+phone|and\s+my\s+number|and\s+phone|and\s+number|and\s+i\s+want|and\s+want|and\s+my|and\s+i|phone|number|mobile|want|book|for|test|please).*$/i, "")
    .replace(/[^\w\s.'-]/g, " ")
    .replace(/\.+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 50) return false;
  // Cannot be pure digits or phone number
  if (/^\d+$/.test(name.replace(/\s/g, ""))) return false;
  // Cannot be a system command
  const reservedWords = [
    "hi", "hello", "hey", "yes", "no", "cancel", "submit", "stop",
    "cbc", "test", "book", "appointment", "help", "price", "fasting"
  ];
  if (reservedWords.includes(name.toLowerCase())) return false;
  if (!/^[A-Za-z\s.'-]+$/.test(name)) return false;

  // Reject phrases / question words / test names that could never be a
  // person's name. This stops questions ("where are you located"), refusals
  // ("i don't want home collection") and test names following "for"
  // ("... for blood sugar", "... for LFT") from being stored as names.
  const phrasePattern =
    /\b(where|what|when|how|why|who|which|want|need|not|don'?t|dont|do\s+not|never|stop|cancel|book|booking|price|fast|fasting|location|timing|timings|home|collection|offer|available|report|please|help|tell|give|test|blood|sugar|glucose|thyroid|lipid|vitamin|hba1c|a1c|cholesterol|creatinine|hemogram|haemoglobin|hemoglobin|liver|kidney|lft|kft|tsh|profile|panel|count|function|fasting\s+sugar|sugar\s+test)\b/i;
  return !phrasePattern.test(name);
}

/**
 * Extracts appointment/enquiry preference date.
 */
export function extractDate(text: string): string | undefined {
  if (!text) return undefined;

  const norm = normalizeText(text);

  // Relative dates
  if (/\b(today|this evening|this morning|this afternoon)\b/i.test(norm)) {
    return "Today";
  }
  if (/\b(tomorrow|tmrw|tmr)\b/i.test(norm)) {
    return "Tomorrow";
  }
  if (/\b(day after tomorrow)\b/i.test(norm)) {
    return "Day after tomorrow";
  }

  // Days of week
  const dayMatch = text.match(/\b(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (dayMatch) {
    const prefix = dayMatch[1] ? "Next " : "";
    const day = dayMatch[2].charAt(0).toUpperCase() + dayMatch[2].slice(1).toLowerCase();
    return `${prefix}${day}`;
  }

  // Date formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
  const dateRegex = /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/;
  const dateMatch = text.match(dateRegex);
  if (dateMatch) {
    return dateMatch[1];
  }

  // Word dates: "15th Aug", "August 15", "15 August"
  const wordDateMatch = text.match(
    /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?)\b/i
  );
  if (wordDateMatch) {
    return wordDateMatch[1];
  }

  return undefined;
}

/**
 * Extracts general service categories.
 */
export function extractService(text: string): string | undefined {
  const norm = normalizeText(text);

  if (/\b(home\s*sample|home\s*collection|doorstep\s*collection|sample\s*from\s*home)\b/i.test(norm)) {
    return "Home Sample Collection";
  }
  if (/\b(blood\s*tests?|haematology|hematology)\b/i.test(norm)) {
    return "Blood Tests";
  }
  if (/\b(pathology|pathological|lab\s*tests?|biochemistry)\b/i.test(norm)) {
    return "Pathology";
  }
  if (/\b(health\s*checkup|master\s*health|preventive\s*package|checkup\s*package)\b/i.test(norm)) {
    return "Health Checkups";
  }

  return undefined;
}

/**
 * Comprehensive entity extraction helper.
 */
export function extractAllEntities(text: string, isNamePrompt: boolean = false): ExtractedEntities {
  const testRes = extractTest(text);
  const phone = extractPhone(text);
  const name = extractName(text, isNamePrompt);
  const date = extractDate(text);
  const service = extractService(text);

  return {
    test: testRes.canonical,
    rawTest: testRes.raw,
    phone,
    name,
    date,
    service,
  };
}
