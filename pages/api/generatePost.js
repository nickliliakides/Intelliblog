import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { OpenAIApi, Configuration } from 'openai';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db('IntelliBlogDB');
  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openAI = new OpenAIApi(config);
  const { topic, keywords } = req.body;

  if (!topic || !keywords || topic.length > 255 || keywords.length > 255) {
    res.status(422);
    return;
  }

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

  const { title, metaDescription } =
    JSON.parse(seoResponse.data.choices[0]?.message?.content) ?? {};

  const post = { content, title, metaDescription };

  await db.collection('users').updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  const postInserted = await db.collection('posts').insertOne({
    ...post,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });

  res.status(200).json({
    postId: postInserted.insertedId,
  });
});
