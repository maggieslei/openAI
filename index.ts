import OpenAI from 'openai';
import 'dotenv/config';

const openAI = new OpenAI();

async function main() {
  const stream = await openAI.responses.create({
    model: 'gpt-4',
    input: 'Write a one sentence bedtime story about a mermaid',
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === 'response.output_text.delta') {
      process.stdout.write(event.delta);
    }
  }
}

main();
