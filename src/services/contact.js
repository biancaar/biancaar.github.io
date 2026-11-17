/** Keep delivery separate from the form UI so the provider can be replaced. */
export async function submitContact(endpoint, data, send = fetch) {
  const response = await send(endpoint, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('Contact submission failed');
}
