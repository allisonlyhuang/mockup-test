export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const endpoint = process.env.SHEET_ENDPOINT;
  if (!endpoint) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    await fetch(endpoint, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(req.body),
    });
    return res.status(200).json({ result: "success" });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Failed to submit" });
  }
}
