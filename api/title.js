export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userText, aiReply } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 20,
        system: 'Generate a short, punchy, memorable chat title (3-5 words max) that captures the essence of the startup idea discussed. Rules: Be creative and specific to the idea. Sound like a product name or startup pitch title. Use ONE relevant emoji at the end. Never start with "Chat about". Reply with ONLY the title.',
        messages: [{ role: 'user', content: 'User said: "' + userText + '"\nAI replied: "' + aiReply.slice(0, 120) + '"' }]
      })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Title failed', details: err.message });
  }
}
