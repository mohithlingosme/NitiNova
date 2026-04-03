import { GoogleGenAI } from "@google/genai";
import { SUPREME_COURT_DATASET, LegalCase } from "../data/legalDataset";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface VerificationResult {
  citation: string;
  matchedCase?: LegalCase;
  score: number; // 0 to 1
  status: "verified" | "partial" | "unverified" | "hallucinated";
}

export interface LegalResponse {
  answer: string;
  verifications: VerificationResult[];
  overallConfidence: number;
}

/**
 * Simple RAG simulation: Find cases in our dataset that match keywords in the query
 */
function retrieveContext(query: string): LegalCase[] {
  const keywords = query.toLowerCase().split(/\s+/);
  return SUPREME_COURT_DATASET.filter(c => {
    const caseText = `${c.title} ${c.summary} ${c.keyPoints.join(" ")}`.toLowerCase();
    return keywords.some(k => k.length > 3 && caseText.includes(k));
  });
}

/**
 * Extract citations from text using regex
 * Matches common Indian legal citation patterns like (Year) Vol SCC Page or AIR Year SC Page
 */
function extractCitations(text: string): string[] {
  // This is a simplified regex for demo purposes
  const patterns = [
    /\(\d{4}\)\s+\d+\s+SCC\s+\d+/g,
    /AIR\s+\d{4}\s+SC\s+\d+/g,
    /[A-Z][a-z]+\s+v\.\s+[A-Z][a-z]+/g // Case names
  ];
  
  const citations: Set<string> = new Set();
  patterns.forEach(p => {
    const matches = text.match(p);
    if (matches) matches.forEach(m => citations.add(m));
  });
  
  return Array.from(citations);
}

/**
 * Verify a citation against the dataset
 */
function verifyCitation(citation: string): VerificationResult {
  const normalizedCitation = citation.toLowerCase().replace(/\s+/g, "");
  
  // Try exact match on citation string
  const exactMatch = SUPREME_COURT_DATASET.find(c => 
    c.citation.toLowerCase().replace(/\s+/g, "") === normalizedCitation
  );
  
  if (exactMatch) {
    return { citation, matchedCase: exactMatch, score: 1.0, status: "verified" };
  }
  
  // Try partial match on case name
  const partialMatch = SUPREME_COURT_DATASET.find(c => 
    citation.toLowerCase().includes(c.title.toLowerCase()) || 
    c.title.toLowerCase().includes(citation.toLowerCase())
  );
  
  if (partialMatch) {
    return { citation, matchedCase: partialMatch, score: 0.7, status: "partial" };
  }
  
  return { citation, score: 0.2, status: "unverified" };
}

export async function processLegalQuery(query: string): Promise<LegalResponse> {
  const contextCases = retrieveContext(query);
  const contextString = contextCases.map(c => 
    `Case: ${c.title}\nCitation: ${c.citation}\nSummary: ${c.summary}`
  ).join("\n\n");

  const systemInstruction = `
    You are NitiNova, a specialized Legal AI for the Indian Legal System.
    Your goal is to provide accurate legal information based on Supreme Court precedents.
    
    CRITICAL: You must only use real citations. If you are unsure about a citation, state that it needs verification.
    
    Context from our verified database:
    ${contextString}
    
    When answering:
    1. Cite specific cases using their full name and citation (e.g., Kesavananda Bharati v. State of Kerala (1973) 4 SCC 225).
    2. Explain the legal principle clearly.
    3. If the query is about a topic not in the provided context, use your general knowledge but warn the user.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction,
      temperature: 0.2, // Low temperature for factual accuracy
    },
  });

  const answer = response.text || "I'm sorry, I couldn't generate a response.";
  
  // Post-generation verification
  const foundCitations = extractCitations(answer);
  const verifications = foundCitations.map(verifyCitation);
  
  const overallConfidence = verifications.length > 0 
    ? verifications.reduce((acc, v) => acc + v.score, 0) / verifications.length
    : 1.0; // No citations to verify

  return {
    answer,
    verifications,
    overallConfidence
  };
}
