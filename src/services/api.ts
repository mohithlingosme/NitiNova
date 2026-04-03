const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export type ApiVerification = {
  match_type: string;
  score: number;
  verified: boolean;
  warning?: string | null;
};

export type ApiCitation = {
  raw: string;
  canonical: string;
  case_name: string;
  court: string;
  date: string;
  status: string;
  verification: ApiVerification;
};

export type ApiResponse = {
  request_id: string;
  query: string;
  answer: string;
  citations: ApiCitation[];
  overall_confidence: number;
  unverified_count: number;
  processing_time_ms: number;
  re_run_count: number;
};

export async function submitQuery(query: string): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail ?? "Query failed");
  }

  return response.json();
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}
