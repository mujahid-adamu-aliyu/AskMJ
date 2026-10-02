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
