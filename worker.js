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

export default {
  async fetch(request, env) {

    // ── CORS preflight (lets your HTML page talk to this worker) ──
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // ── Only allow POST to /chat ──
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not found', { status: 404 });
    }

    // ── Read the request body from the frontend ──
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON body', { status: 400 });
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow your HTML page to read the response
      },
    });
  },
};
