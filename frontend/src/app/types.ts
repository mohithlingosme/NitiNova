export interface Case {
  id: string;
  name: string;
  court: string;
  date: string;
  summary: string;
  facts?: string;
  issues?: string;
  judgment?: string;
  ratio?: string;
  judges?: string[];
}

export interface SearchResult extends Case {
  score?: number;
}

