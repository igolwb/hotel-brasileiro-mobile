import { groq } from '@ai-sdk/groq';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

const systemPrompt = `
` ;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...convertToModelMessages(messages),
    ],
  });

  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}