import OpenAI from 'openai';
import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const openAI = new OpenAI();
const rl = createInterface({ input, output });

let conversationHistory =
  'Your are a helpful assistant. Be conversational, friendly, and remember what the user tells you throughout the chat.';

console.log('🤖 Simple ChatGPT 1.0');
console.log("Type 'exit' or 'quit' to end chat.\n");

while (true) {
  const userMessage = await rl.question('You: ');

  if (
    userMessage.toLowerCase() === 'exit' ||
    userMessage.toLowerCase() === 'quit'
  ) {
    console.log('\n🤖 Exiting chat. Goodbye!');
    break;
  }

  conversationHistory += `\nUser: ${userMessage}`;
  const prompt = conversationHistory + 'Assistant:';

  console.log('\n🤖 AI:');

  const stream = await openAI.responses.create({
    model: 'gpt-4',
    input: prompt,
    stream: true,
  });

  let aiResponse = '';

  for await (const event of stream) {
    if (event.type === 'response.output_text.delta') {
      process.stdout.write(event.delta);
      aiResponse += event.delta;
    }
  }

  console.log('\n\n');

  conversationHistory += `Assistant: ${aiResponse}\n\n`;
}

rl.close();
