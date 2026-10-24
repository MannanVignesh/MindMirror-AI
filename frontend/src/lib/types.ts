/**
 * TypeScript Interfaces for MindMirror AI
 */

export type SourceType = 'typed_text' | 'pdf' | 'screenshot' | 'photograph' | 'image';

export type ContextType = 
  | 'personal_journal'
  | 'message_conversation'
  | 'work_academic'
  | 'social_media'
  | 'fiction_general'
  | 'unsure';

export interface ExtractionResult {
  source_type: SourceType;
  extracted_text: string;
  page_count: number;
  word_count: number;
  char_count: number;
  ocr_applied: boolean;
  ocr_confidence: number | null;
  warnings: string[];
  status: 'success' | 'warning' | 'error';
}

export interface StressClassification {
  model_version: string;
  calibrated_score: number;
  uncertainty_interval: [number, number];
  predicted_label: string;
  predicted_category_name: string;
  binary_decision: number;
  score_semantics: string;
}

export interface EmotionAnalysis {
  dominant_emotion: string;
  scores: Record<string, number>;
  interpretation: string;
}

export interface LinguisticFeatures {
  total_words: number;
  total_sentences: number;
  first_person_singular_count: number;
  first_person_singular_ratio: number;
  first_person_plural_count: number;
  first_person_plural_ratio: number;
  cognitive_terms_count: number;
  cognitive_terms_ratio: number;
  affective_stress_terms_count: number;
  affective_stress_terms_ratio: number;
  type_token_ratio: number;
  flesch_reading_ease: number;
  avg_sentence_length: number;
  exclamation_mark_count: number;
  question_mark_count: number;
  all_caps_word_ratio: number;
}

export interface PracticalSuggestion {
  title: string;
  description: string;
  category: string;
}

export interface CrisisResource {
  name: string;
  contact: string;
}

export interface GuidanceResult {
  interpretation: string;
  context_applied: string;
  context_label: string;
  context_warnings: string[];
  raw_score_preserved: boolean;
  practical_suggestions: PracticalSuggestion[];
  support_advisory: string;
  crisis_resources: CrisisResource[];
}

export interface AnalysisResponse {
  text_summary: {
    character_count: number;
    word_count: number;
  };
  stress_classification: StressClassification;
  emotion_analysis: EmotionAnalysis;
  linguistic_features: LinguisticFeatures;
  guidance: GuidanceResult;
}

export interface AttributionItem {
  term: string;
  attribution_delta: number;
  score_without_term: number;
  is_phrase: boolean;
}

export interface TokenMapItem {
  word: string;
  start: number;
  end: number;
  delta: number;
  type: 'stress_driver' | 'mitigating_driver' | 'neutral';
}

export interface ExplanationResponse {
  status: string;
  base_score: number;
  explanation_method: string;
  method_semantics: string;
  stability_status: 'stable_contrast' | 'low_contrast_inconclusive' | 'narrow_evidence';
  stability_note: string;
  positive_attributions: AttributionItem[];
  negative_attributions: AttributionItem[];
  token_map: TokenMapItem[];
}

export interface CommunityResult {
  community: string;
  domain: string;
  sample_count: number;
  accuracy: number;
  precision: number;
  recall: number;
  macro_f1: number;
  confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
}

export interface DomainResult {
  domain: string;
  subreddits: string[];
  total_samples: number;
  mean_accuracy: number;
  mean_precision: number;
  mean_recall: number;
  mean_macro_f1: number;
}

export interface CrossDomainResponse {
  experiment_name: string;
  total_communities: number;
  total_evaluated_samples: number;
  overall_macro_f1: number;
  overall_accuracy: number;
  overall_precision: number;
  overall_recall: number;
  overall_confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
  per_community: Record<string, CommunityResult>;
  per_domain: Record<string, DomainResult>;
}

export interface OcrTier {
  noise_level_label: string;
  simulated_error_rate: number;
  mean_cer: number;
  mean_wer: number;
  mean_score_shift: number;
  label_flip_rate: number;
  degraded_accuracy: number;
  clean_accuracy: number;
}

export interface OcrQualityResponse {
  experiment_name: string;
  samples_evaluated: number;
  degradation_tiers: OcrTier[];
  paired_examples: Array<{
    clean_text: string;
    ocr_text: string;
    clean_score: number;
    ocr_score: number;
    score_delta: number;
    label_flipped: boolean;
  }>;
  conclusions: string[];
}

export interface ModelBenchmarkItem {
  id: string;
  name: string;
  type: string;
  macro_f1: number;
  accuracy: number;
  precision: number;
  recall: number;
  brier_score: number;
  expected_calibration_error: number;
  inference_latency_ms: number;
  parameter_count: string;
  calibration_method: string;
}

export interface ModelComparisonResponse {
  models: ModelBenchmarkItem[];
  calibration_analysis: {
    description: string;
    curve: {
      prob_true: number[];
      prob_pred: number[];
    };
  };
}

export interface DailyReflectionEntry {
  id: string;
  date: string;
  timestamp: number;
  moodRating: number; // 1 to 5
  stressLevel: number; // 1 to 10
  notes: string;
}
