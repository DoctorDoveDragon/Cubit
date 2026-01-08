import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
import { safeErrorMessage } from '../../utils/safeError';

// Defensive: ensure API key is present and log an explicit message if not.
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY ?? '';
if (!DEEPSEEK_API_KEY && process.env.NODE_ENV !== 'production') {
  // Only warn in development, not in production where it might be logged
  console.warn('DEEPSEEK_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: DEEPSEEK_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!DEEPSEEK_API_KEY) {
    // Don't log in production to avoid exposing configuration details
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
      // Log error in development only, avoid logging full response in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('generate-cubit: unexpected response structure from upstream API');
      }
      return res.status(502).json({ error: 'Upstream service returned an unexpected response' });
    }

    return res.status(200).json({ code });
  } catch (err: unknown) {
    // Log sanitized error server-side for debugging (avoid logging sensitive data)
    if (process.env.NODE_ENV !== 'production') {
      console.error('generate-cubit: error while calling upstream API:', safeErrorMessage(err));
    }

    const msg = safeErrorMessage(err);
    return res.status(500).json({ error: `API error: ${msg}` });
  }
}
