# 7K Lab ChatGPT Setup

The browser must never contain the OpenAI API key. The site now calls `/api/ai-coach`, and that private endpoint calls OpenAI.

## Deploy

1. Deploy the site on a host that can run serverless functions, such as Vercel.
2. Add `OPENAI_API_KEY` as a private environment variable.
3. Optional: add `OPENAI_MODEL` if you want to choose the exact model. If omitted, the endpoint uses `gpt-4.1-mini`.
4. Redeploy.

## Behavior

- Signed-in runners ask the 7K Lab coach from the website.
- The frontend sends the selected event, runner name, avatar state, RSVP count, and recent Lab notes.
- If `/api/ai-coach` is unavailable or the key is missing, the site falls back to the local prototype coach so the Lab never feels broken.

## Note

GitHub Pages cannot run `/api/ai-coach` by itself. If the public site stays fully static, host the API on Vercel, Netlify, or a Supabase Edge Function and point the frontend to that endpoint.
