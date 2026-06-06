function parseOpenAIText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(501).json({
      error: "OPENAI_API_KEY is not configured for the 7K Lab coach.",
    });
  }

  const body = parseBody(request.body);
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const context = body.context && typeof body.context === "object" ? body.context : {};

  if (!prompt) {
    return response.status(400).json({ error: "Prompt is required." });
  }

  const systemPrompt = [
    "You are the 7K Lab AI coach for 7K Running Club in Ulaanbaatar.",
    "Give practical running advice for club events, pacing, recovery, race prep, and form review.",
    "Use the supplied runner/event context when helpful.",
    "Be concise, direct, calm, and slightly witty in the 7K voice.",
    "Do not diagnose injuries. For sharp pain, chest pain, dizziness, or symptoms that change stride, tell the runner to stop and seek professional medical help.",
    "Avoid long essays. Prefer 3-6 actionable bullets or one tight paragraph.",
  ].join(" ");

  try {
    const coachResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: systemPrompt,
        input: `Runner context:\n${JSON.stringify(context, null, 2)}\n\nRunner question:\n${prompt}`,
        max_output_tokens: 300,
      }),
    });

    const data = await coachResponse.json();
    if (!coachResponse.ok) {
      return response.status(coachResponse.status).json({
        error: data?.error?.message || "OpenAI request failed.",
      });
    }

    const reply = parseOpenAIText(data);
    return response.status(200).json({
      reply: reply || "I could not build a useful answer from that prompt. Ask me about pace, recovery, form, or your next event.",
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    });
  } catch (error) {
    return response.status(500).json({
      error: error?.message || "7K Lab coach failed to answer.",
    });
  }
};
