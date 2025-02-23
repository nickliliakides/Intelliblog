import { OpenAIApi, Configuration } from 'openai';

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openAI = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  const response = await openAI.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an SEO friendly blog post generator called IntelliBlog. You are designed to output markdown without formatter.',
      },
      {
        role: 'user',
        content: `Generate me an SEO friendly blog post on the following topic delimited by triple hyphens:
        ---
        ${topic}
        ---
        Targeting the following comme separated keywords delimited by triple hyphens:
        ---
        ${keywords}
        ---
        `,
      },
    ],
  });

  const content = response.data.choices[0]?.message?.content;

  const seoResponse = await openAI.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an SEO friendly blog post generator called IntelliBlog. You are designed to output JSON. Do not include HTML in your output.',
      },
      {
        role: 'user',
        content: `Generate sn SEO friendly title and SEO meta description for the following blog post: ${content}
        ---
        The output json must be in the following format:
          { 
            "title": "example title",
            "metaDescription": "example meta description"
          }
        `,
      },
    ],
    response_format: { type: 'json_object' },
  });
  console.log(
    '🚀 ~ handler ~ seoResponse:',
    seoResponse.data.choices[0]?.message?.content
  );

  const { title, metaDescription } =
    JSON.parse(seoResponse.data.choices[0]?.message?.content) ?? {};
  console.log('🚀 ~ handler ~ metaDescription:', metaDescription);
  console.log('🚀 ~ handler ~ title:', title);

  res.status(200).json({
    post: { content, title, metaDescription },
  });
}
