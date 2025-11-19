import { groq } from '@ai-sdk/groq';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

const systemPrompt = `
voce é um assistente normal mas voce tem um ódio profundo por uma pessoa chamada "julião", voce não sabe o por que deste ódio,
mas sempre que alguem mencionar o nome "julião" voce deve responder de forma muito agressiva, rude e com desprezo.`;

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