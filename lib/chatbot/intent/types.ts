/**
 * Type definitions for the deterministic intent-based chatbot engine.
 */

export type IntentType =
  | "GREETING"
  | "GOODBYE"
  | "THANK_YOU"
  | "HELP"
  | "CENTRE_INFO"
  | "LOCATION"
  | "TIMINGS"
  | "CONTACT"
  | "SERVICES"
  | "TEST_AVAILABILITY"
  | "TEST_INFORMATION"
  | "TEST_PREPARATION"
  | "TEST_PRICE"
  | "REPORT_INFORMATION"
  | "HOME_SAMPLE_COLLECTION"
  | "BOOK_TEST"
  | "MEDICAL_ADVICE"
  | "EMERGENCY"
  | "UNKNOWN";

export type DialogState =
  | "IDLE"
  | "COLLECTING_TEST"
  | "COLLECTING_NAME"
  | "COLLECTING_PHONE"
  | "CONFIRMING"
  | "SUBMITTED";

export interface BookingSlots {
  test?: string;
  name?: string;
  phone?: string;
  date?: string;
}

export interface ExtractedEntities {
  test?: string;
  rawTest?: string;
  name?: string;
  phone?: string;
  date?: string;
  service?: string;
}

export interface ClassificationResult {
  intent: IntentType;
  confidence: number;
  entities: ExtractedEntities;
  isNegated?: boolean;
  matchedPattern?: string;
}

export interface DialogResponse {
  content: string;
  nextState?: DialogState;
  isEnquiryConfirmation?: boolean;
  enquiryData?: {
    name: string;
    phone: string;
    test: string;
    date?: string;
  };
}

export interface IntentDefinition {
  name: IntentType;
  description: string;
  priority: number;
  patterns: (string | RegExp)[];
  keywords: string[];
  requiresEntity?: keyof ExtractedEntities;
  negationTriggers?: string[];
}
