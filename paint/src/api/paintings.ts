const API_URL = "http://localhost:3001/api/paintings";

export async function getPaintings() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function savePainting(painting: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(painting),
  });
  return res.json();
}

export async function updatePainting(id: string, updates: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deletePainting(id: string) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
