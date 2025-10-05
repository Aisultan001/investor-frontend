const API_URL = "http://127.0.0.1:8000/api";

export async function fetchAssets(token) {
  const res = await fetch(`${API_URL}/assets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addAsset(asset, token) {
  const res = await fetch(`${API_URL}/assets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(asset),
  });
  return res.json();
}

export async function deleteAsset(id, token) {
  await fetch(`${API_URL}/assets/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
