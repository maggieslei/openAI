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
    model: 'gpt-5',
    input: prompt,
    stream: true,
    tools: [{ type: 'web_search' }],
  });

  let aiResponse = '';

  for await (const event of stream) {
    if (event.type === 'response.output_text.delta') {
      process.stdout.write(event.delta);
      aiResponse += event.delta;
    } else if (event.type === 'response.web_search_call.searching') {
      process.stdout.write('Searching the web...');
    } else if (event.type === 'response.web_search_call.completed') {
      process.stdout.write('Done \n');
    }
  }

  console.log('\n\n');

  conversationHistory += `Assistant: ${aiResponse}\n\n`;
}

rl.close();
