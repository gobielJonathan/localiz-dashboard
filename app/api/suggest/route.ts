import { openai } from '@/function/openai';
import createResponse from '@/lib/create-response';
import { asyncTryCatch } from '@/lib/try-catch';

export async function POST(req: Request) {
  const body = await req.json();

  const [errorGeneration, response] = await asyncTryCatch(() =>
    openai.chat.completions.create({
      messages: [{ role: 'user', content: body.text }],
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
    }),
  );

  if (errorGeneration) {
    return createResponse({
      type: 'failed',
      error: errorGeneration.message,
      status: 500,
    });
  }

  return createResponse({
    type: 'success',
    payload: response?.choices[0].message,
    status: 200,
  });
}
