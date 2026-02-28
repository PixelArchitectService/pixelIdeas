export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        system: 'You are a content moderator for a teen startup mentoring app (ages 13-19). Reply with only "BLOCK" or "ALLOW". BLOCK if the message contains sexual content, adult themes, violence, drugs, alcohol, gambling, hate speech, or anything inappropriate for teenagers. ALLOW if it is about startups, business ideas, technology, creativity, school projects, or general conversation.',
        messages: [{ role: 'user', content: text }]
      })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Moderation failed', details: err.message });
  }
}
