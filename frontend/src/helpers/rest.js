export async function fetchJSON(endpoint, body) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    throw new Error(response);
  }

  return response.json();
}
