/**
 * Deterministic intent classifier for diagnostic centre chatbot.
 * Zero external LLMs or APIs.
 */

import { ClassificationResult, DialogState, IntentType } from "./types";
import { INTENT_DEFINITIONS } from "./intents";
import { normalizeText, hasNegation } from "./normalizer";
import { extractAllEntities } from "./entityExtractor";

interface ScoredIntent {
  intent: IntentType;
  score: number;
  matchedPattern?: string;
}

/**
 * Classifies user text into an intent with confidence and extracted entities.
 */
export function classifyIntent(
  rawText: string,
  dialogState: DialogState = "IDLE"
): ClassificationResult {
  const normalized = normalizeText(rawText);
  const entities = extractAllEntities(
    rawText,
    dialogState === "COLLECTING_NAME"
  );

  if (!normalized || normalized.trim().length === 0) {
    return {
      intent: "UNKNOWN",
      confidence: 0,
      entities,
    };
  }

  // 1. Check Emergency First (Highest Priority Safety Check)
  const emergencyDef = INTENT_DEFINITIONS.find((d) => d.name === "EMERGENCY");
  if (emergencyDef) {
    for (const pattern of emergencyDef.patterns) {
      if (typeof pattern === "string" ? normalized.includes(pattern) : pattern.test(normalized)) {
        return {
          intent: "EMERGENCY",
          confidence: 1.0,
          entities,
          matchedPattern: String(pattern),
        };
      }
    }
  }

  // 2. Check Medical Advice / Clinical Safety Check
  const medicalDef = INTENT_DEFINITIONS.find((d) => d.name === "MEDICAL_ADVICE");
  if (medicalDef) {
    for (const pattern of medicalDef.patterns) {
      if (typeof pattern === "string" ? normalized.includes(pattern) : pattern.test(normalized)) {
        return {
          intent: "MEDICAL_ADVICE",
          confidence: 0.95,
          entities,
          matchedPattern: String(pattern),
        };
      }
    }
  }

  // 3. Check Centre Information queries
  const isCentreQuery = /\b(about\s+(?:the\s+)?centre|about\s+asha\s+jyothi|tell\s+me\s+about\s+(?:the\s+)?centre|tell\s+me\s+about\s+asha\s+jyothi|what\s+is\s+(?:this\s+)?diagnostic\s+centre|who\s+are\s+you|what\s+is\s+asha\s+jyothi)\b/i.test(normalized);
  if (isCentreQuery) {
    return {
      intent: "CENTRE_INFO",
      confidence: 0.95,
      entities,
    };
  }

  // 4. Check for specific context rules (Price vs Prep vs Booking vs Info vs Availability)
  const isPrepQuery = /\b(fast|fasting|empty\s+stomach|water\s+before|prepare|preparation)\b/i.test(normalized) ||
    (/\b(eat|food)\b/i.test(normalized) && /\b(before|fast|test)\b/i.test(normalized));
  const isPriceQuery = /\b(price|cost|how\s+much|charge|rate|charges|fee|fees)\b/i.test(normalized);
  const isBookingQuery =
    /\b(book|booking|appointment|schedule|reserve|slot)\b/i.test(normalized) ||
    (Boolean(entities.name) && Boolean(entities.test)) ||
    /\b(i\s+want\s+(?:to\s+get\s+)?(?:cbc|blood\s+sugar|thyroid|lipid|vitamin|lft|kft|test))\b/i.test(normalized);

  const isHomeCollectionQuery = /\b(home\s+sample|home\s+collection|doorstep|sample\s+at\s+home|sample\s+from\s+home)\b/i.test(normalized);
  const isLocationQuery = /\b(where\s+are\s+you|where\s+is|address|toopran|location|reach\s+you|directions)\b/i.test(normalized);
  const isTimingQuery = /\b(timings?|hours?|opening|closing|sunday)\b/i.test(normalized) ||
    (/\b(open|close)\b/i.test(normalized) && /\b(when|what\s+time|today|tomorrow|centre|lab)\b/i.test(normalized));
  const isContactQuery = /\b(phone|contact|number|call|whatsapp|email|customer\s+care)\b/i.test(normalized);

  // Negation check
  const negatedBooking = hasNegation(rawText, "book") || hasNegation(rawText, "appointment");

  // If user says "I don't want to book", do not classify as BOOK_TEST
  if (isBookingQuery && !negatedBooking) {
    return {
      intent: "BOOK_TEST",
      confidence: 0.95,
      entities,
    };
  }

  if (isHomeCollectionQuery) {
    return {
      intent: "HOME_SAMPLE_COLLECTION",
      confidence: 0.95,
      entities,
    };
  }

  if (isPrepQuery) {
    return {
      intent: "TEST_PREPARATION",
      confidence: 0.95,
      entities,
      isNegated: hasNegation(rawText, "fast"),
    };
  }

  if (isPriceQuery) {
    return {
      intent: "TEST_PRICE",
      confidence: 0.95,
      entities,
    };
  }

  // Check Location, Timings, Contact
  if (isLocationQuery) {
    return {
      intent: "LOCATION",
      confidence: 0.95,
      entities,
    };
  }

  if (isTimingQuery) {
    return {
      intent: "TIMINGS",
      confidence: 0.95,
      entities,
    };
  }

  if (isContactQuery) {
    return {
      intent: "CONTACT",
      confidence: 0.95,
      entities,
    };
  }

  // 5. Score all intents across catalogue
  const scoredIntents: ScoredIntent[] = [];

  for (const def of INTENT_DEFINITIONS) {
    if (def.name === "UNKNOWN") continue;

    // Check negation triggers
    if (def.negationTriggers?.some((trig) => normalized.includes(trig))) {
      continue;
    }

    let score = 0;
    let matchedPattern: string | undefined;

    // Exact pattern matching
    for (const pattern of def.patterns) {
      if (typeof pattern === "string") {
        if (normalized === pattern) {
          score = Math.max(score, 1.0);
          matchedPattern = pattern;
        } else if (new RegExp(`\\b${pattern}\\b`, "i").test(normalized)) {
          score = Math.max(score, 0.85);
          matchedPattern = pattern;
        }
      } else if (pattern.test(normalized)) {
        score = Math.max(score, 0.90);
        matchedPattern = String(pattern);
      }
    }

    // Keyword counting with word boundaries
    let kwHits = 0;
    for (const kw of def.keywords) {
      const kwRegex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (kwRegex.test(normalized)) {
        kwHits++;
      }
    }

    if (kwHits > 0) {
      const kwScore = Math.min(0.85, 0.5 + kwHits * 0.15);
      score = Math.max(score, kwScore);
    }

    // Bonus if intent relates to test and test entity is present
    if (entities.test) {
      if (def.name === "TEST_INFORMATION" && score > 0) {
        score += 0.1;
      } else if (def.name === "TEST_AVAILABILITY" && score > 0) {
        score += 0.1;
      }
    }

    if (score > 0) {
      scoredIntents.push({
        intent: def.name,
        score,
        matchedPattern,
      });
    }
  }

  // Sort candidates by score descending, then by definition priority descending
  scoredIntents.sort((a, b) => {
    if (Math.abs(a.score - b.score) > 0.05) {
      return b.score - a.score;
    }
    const defA = INTENT_DEFINITIONS.find((d) => d.name === a.intent)?.priority || 0;
    const defB = INTENT_DEFINITIONS.find((d) => d.name === b.intent)?.priority || 0;
    return defB - defA;
  });

  const bestMatch = scoredIntents[0];

  // If a test entity is present alone (e.g. "CBC", "thyroid test"), classify as TEST_INFORMATION
  if (entities.test && (!bestMatch || bestMatch.score < 0.80)) {
    return {
      intent: "TEST_INFORMATION",
      confidence: 0.85,
      entities,
    };
  }

  if (!bestMatch || bestMatch.score < 0.55) {
    return {
      intent: "UNKNOWN",
      confidence: bestMatch ? bestMatch.score : 0,
      entities,
    };
  }

  return {
    intent: bestMatch.intent,
    confidence: bestMatch.score,
    entities,
    matchedPattern: bestMatch.matchedPattern,
  };
}
