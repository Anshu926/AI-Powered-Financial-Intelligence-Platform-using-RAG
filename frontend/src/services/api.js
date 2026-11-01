const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function fetchFinancials(docName = 'Apple.pdf', forceRefresh = false) {
  const params = new URLSearchParams({ doc_name: docName, force_refresh: forceRefresh });
  const res = await fetch(`${API_BASE}/financials?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to load financials' }));
    throw new Error(errorData.detail || 'Failed to load financials');
  }
  return res.json();
}

export async function uploadAnnualReport(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function sendChatMessage(question, topK = 5, docFilter = null) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, top_k: topK, doc_filter: docFilter }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Chat query failed' }));
    throw new Error(err.detail || 'Chat query failed');
  }
  return res.json();
}

export async function fetchSampleQueries() {
  const res = await fetch(`${API_BASE}/sample-queries`);
  if (!res.ok) throw new Error('Failed to load sample queries');
  return res.json();
}
