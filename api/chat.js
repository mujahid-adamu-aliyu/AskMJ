/**
 * AskMJ — Vercel Serverless Function
 * File location in your repo: /api/chat.js
 *
 * Setup:
 *  1. In Vercel Dashboard → your project → Settings → Environment Variables
 *  2. Add: GROQ_API_KEY = your Groq API key (mark it as Secret 🔒)
 *  3. Redeploy — done!
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default async function handler(req, res) {

  // ── CORS preflight ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // ── Only allow POST ──
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }

  // ── Forward to Groq with secret key ──
  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, // ✅ Secret, never exposed
      },
      body: JSON.stringify(req.body),
    });

    const data = await groqResponse.json();
    return res.status(groqResponse.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
}
