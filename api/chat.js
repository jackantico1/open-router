// Proxies one model's chat completion to OpenRouter and streams the SSE response back.
export async function POST(request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return Response.json({ error: "OPENROUTER_API_KEY is not set" }, { status: 500 });

  const password = process.env.APP_PASSWORD;
  if (password && request.headers.get("x-app-password") !== password) {
    return Response.json({ error: "Wrong or missing access password" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { model, messages } = body;
  if (typeof model !== "string" || !Array.isArray(messages)) {
    return Response.json({ error: "Expected { model, messages }" }, { status: 400 });
  }

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": new URL(request.url).origin,
      "X-Title": "OpenRouter Model Compare",
    },
    body: JSON.stringify({ model, messages, stream: true, usage: { include: true } }),
    signal: request.signal,
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    let message = text;
    try { message = JSON.parse(text).error?.message ?? text; } catch {}
    return Response.json({ error: message }, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
