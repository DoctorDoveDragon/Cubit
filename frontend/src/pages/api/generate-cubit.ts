import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';

// Defensive: ensure API key is present and log an explicit message if not.
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY ?? '';
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: DEEPSEEK_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!DEEPSEEK_API_KEY) {
    console.error('generate-cubit: missing DEEPSEEK_API_KEY environment variable')
    return res.status(500).json({ error: 'Server misconfiguration: missing API key' })
  }

  const body = req.body as unknown;
  const prompt = typeof body === 'object' && body !== null && 'prompt' in (body as Record<string, unknown>)
    ? (body as Record<string, unknown>)['prompt']
    : undefined;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes Cubit code.' },
        { role: 'user', content: prompt }
      ],
      model: 'deepseek-chat',
    });

    // Defensive parsing: ensure the expected fields are present before accessing
    type MinimalChoice = { message?: { content?: string } }
    type MinimalCompletion = { choices?: MinimalChoice[] }
    const maybe = completion as unknown as MinimalCompletion
    const code = maybe?.choices?.[0]?.message?.content
    if (!code || typeof code !== 'string') {
      console.error('generate-cubit: unexpected response from OpenAI:', completion);
      return res.status(502).json({ error: 'Upstream service returned an unexpected response' });
    }

    return res.status(200).json({ code });
  } catch (error: unknown) {
    // Log the full error server-side for debugging and return a safe message to client
    console.error('generate-cubit: error while calling upstream API', error);

    let msg = 'Unknown error';
    if (error instanceof Error) {
      msg = error.message || msg;
    } else if (typeof error === 'string') {
      msg = error;
    } else {
      try {
        msg = JSON.stringify(error);
      } catch {
        // keep default
      }
    }

    return res.status(500).json({ error: `API error: ${msg}` });
  }
}
