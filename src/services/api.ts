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

export type VerifyResponse = {
  citation: string;
  status: string;
  score: number;
  matched_case?: ApiCitation | null;
};

function shouldAttachAuth(path: string) {
  return path.includes("/query") || path.includes("/verify");
}

async function request(path: string, init: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const headers = new Headers(init.headers ?? {});

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (shouldAttachAuth(path)) {
    const token = localStorage.getItem("jwt");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    localStorage.removeItem("jwt");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail ?? "Request failed");
  }

  return response.json();
}

export async function submitQuery(query: string): Promise<ApiResponse> {
  return request("/query", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export async function verifyCitation(citation: string): Promise<VerifyResponse> {
  return request("/verify", {
    method: "POST",
    body: JSON.stringify({ citation }),
  });
}

export async function register(email: string, password: string) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  // Intentionally skip Authorization header for login
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem("jwt", data.access_token);
  }
  return data;
}
