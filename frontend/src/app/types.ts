export interface Case {
  id: number;
  title: string;
  name?: string;
  court: string;
  year: string;
  judges?: string[];
  date?: string;
  summary: string;
  facts: string;
  issues: string;
  ratio: string;
  judgment?: string;
}

export interface SearchResult {
  id: number;
  title: string;
  court: string;
  score: number;
  snippet: string;
}

export interface ApiResponse {
  answer: string;
  citations: Citation[];
  overall_confidence: number;
}

export interface Citation {
  text: string;
  verified: boolean;
  score: number;
}

