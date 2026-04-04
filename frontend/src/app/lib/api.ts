const API_BASE = 'http://localhost:8000/api';

export async function queryAPI(query: string) {
  const response = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

export async function verifyAPI(query: string) {
  const response = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function getCase(id: string): Promise<any> {
  const response = await fetch(`${API_BASE}/cases/${id}`);
  if (!response.ok) throw new Error('Case not found');
  return response.json();
}

export async function uploadFile(formData: FormData) {
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function searchCases(query: string) {
  return queryAPI(query);
}
