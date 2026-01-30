import OpenAI from 'openai';
import 'dotenv/config';
import z, { custom } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

const openAI = new OpenAI();

const CustomerFeedbackSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  summary: z.string(),
  customer_name: z.string(),
});

const customerEmail = `
FROM: John Doe <jdoe@example.com>
SUBJECT: Amazing Course!

Wow, I just wanted to say that this course is fantastic. The instructor is clear, the examples are practical and I finally 'get" how to use these APIs.
I've already built a mini-version of my own document search.
Thanks for putting this together!
`;

const response = await openAI.responses.parse({
  model: 'gpt-4o-2024-08-06',
  input: [
    // system
    {
      role: 'system',
      content:
        'You are a customer support agent. Extract key information from customer emails and respond in requested format.',
    },
    // user
    {
      role: 'user',
      content: customerEmail,
    },
    // assistant
  ],
  text: {
    format: zodTextFormat(
      CustomerFeedbackSchema,
      'customer_feedback_extraction',
    ),
  },
});

const feedback = response.output_parsed;

console.log("\n Here's the output");
console.log(JSON.stringify(feedback, null, 2));
