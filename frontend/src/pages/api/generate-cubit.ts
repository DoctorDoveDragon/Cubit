import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = req.body;
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
    res.status(200).json({ code: completion.choices[0].message.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
