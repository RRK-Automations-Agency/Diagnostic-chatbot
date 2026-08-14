/**
 * Text normalizer for standardizing user queries prior to classification.
 */

// Common contractions mapping
const CONTRACTIONS: Record<string, string> = {
  "can't": "cannot",
  "cant": "cannot",
  "don't": "do not",
  "dont": "do not",
  "doesn't": "does not",
  "doesnt": "does not",
  "didn't": "did not",
  "didnt": "did not",
  "won't": "will not",
  "wont": "will not",
  "i'm": "i am",
  "im": "i am",
  "i've": "i have",
  "ive": "i have",
  "i'll": "i will",
  "ill": "i will",
  "you're": "you are",
  "youre": "you are",
  "it's": "it is",
  "what's": "what is",
  "whats": "what is",
  "where's": "where is",
  "wheres": "where is",
  "how's": "how is",
  "hows": "how is",
  "there's": "there is",
  "theres": "there is",
  "let's": "let us",
};

// Common medical / test typos and phonetic variants
const TEST_TYPO_MAP: [RegExp, string][] = [
  [/\b(thryoid|thyriod|thyrod|throid)\b/g, "thyroid"],
  [/\b(choles?terol|cholestrol|colesterol|colestrol)\b/g, "cholesterol"],
  [/\b(ha?emoglob[ie]n|heamoglobin|hb)\b/g, "haemoglobin"],
  [/\b(gluco[sz]e|gulcose|gloucose|glusose)\b/g, "glucose"],
  [/\b(sug[ae]r|shugar)\b/g, "sugar"],
  [/\b(vit\s*d|vitamind|vit-d|vitmin\s*d)\b/g, "vitamin d"],
  [/\b(kidny|kidey)\b/g, "kidney"],
  [/\b(livr|liiver)\b/g, "liver"],
  [/\b(fastng|faasting|fastin)\b/g, "fasting"],
  [/\b(appointmnt|apppointment|apointment)\b/g, "appointment"],
  [/\b(diabetis|diabates|diabietes)\b/g, "diabetes"],
  [/\b(toopran|tupran|thoorpan)\b/g, "toopran"],
];

/**
 * Normalizes text:
 * 1. Lowercase
 * 2. Removes punctuation while preserving important digits, +, etc.
 * 3. Expands contractions
 * 4. Resolves common diagnostic typos
 * 5. Normalizes excessive whitespaces
 */
export function normalizeText(text: string): string {
  if (!text) return "";

  let cleaned = text.toLowerCase();

  // Strip excessive repeated characters (e.g. "pleaaase" -> "please", "heeeelp" -> "help", "cbc???" -> "cbc?")
  cleaned = cleaned.replace(/([a-z])\1{2,}/g, "$1$1");

  // Expand contractions
  const words = cleaned.split(/\s+/);
  const expandedWords = words.map((w) => {
    // Strip trailing/leading punctuation for contraction check
    const raw = w.replace(/^[^\w']+|[^\w']+$/g, "");
    return CONTRACTIONS[raw] || w;
  });
  cleaned = expandedWords.join(" ");

  // Correct common test typos
  for (const [pattern, replacement] of TEST_TYPO_MAP) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  // Replace punctuation with spaces, but preserve + for phone numbers and hyphens if needed
  cleaned = cleaned.replace(/[^\w\s+]/g, " ");

  // Collapse multiple whitespaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Checks whether the input string contains clear negation around a topic.
 * E.g. "I do not want to book", "no fasting required", "don't need an appointment"
 */
export function hasNegation(text: string, targetContext?: string): boolean {
  const norm = normalizeText(text);

  const negationPatterns = [
    /\b(do not|did not|does not|will not|cannot|never|no|not|don't|dont|wont|won't)\b/,
  ];

  const hasNegativeWord = negationPatterns.some((pattern) => pattern.test(norm));

  if (!hasNegativeWord) return false;

  if (!targetContext) return true;

  // Check if negation occurs near target context
  const normTarget = normalizeText(targetContext);
  const regex = new RegExp(
    `(do not|did not|does not|cannot|never|no|not)\\s+(?:want|need|wish|have|require|take)?\\s*(?:to\\s+)?(?:${normTarget})`,
    "i"
  );
  return regex.test(norm);
}
