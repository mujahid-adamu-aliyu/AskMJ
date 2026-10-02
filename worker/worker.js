/**
 * AskMJ — Cloudflare Worker Proxy
 * 
 * This worker sits between your frontend and the Groq API.
 * The GROQ_API_KEY is stored as a secret in Cloudflare (never in your HTML).
 *
 * Setup:
 *  1. In Cloudflare Dashboard → Workers & Pages → your worker
 *  2. Go to Settings → Variables and Secrets
 *  3. Add a Secret named: GROQ_API_KEY  (paste your Groq key as the value)
 *  4. Deploy this worker
 *  5. Replace YOUR_WORKER_URL in index.html with your actual worker URL
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ── CORS headers added to every response ──
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // ── CORS preflight ──
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ── Only allow POST to /chat ──
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not found', { status: 404, headers: CORS_HEADERS });
    }

    // ── Read the request body from the frontend ──
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // ── Forward to Groq with the secret key (injected by Cloudflare) ──
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`, // ✅ Secret, never exposed
      },
      body: JSON.stringify(body),
    });

    // ── Send Groq's response back to the frontend ──
    const data = await groqResponse.json();
    return new Response(JSON.stringify(data), {
      status: groqResponse.status,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  },
};
