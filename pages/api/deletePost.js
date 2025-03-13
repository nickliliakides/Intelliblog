import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('IntelliBlogDB');
  const {
    user: { sub },
  } = await getSession(req, res);
  const userProfile = await db.collection('users').findOne({
    auth0Id: sub,
  });

  try {
    await db.collection('posts').deleteOne({
      userId: userProfile._id,
      _id: new ObjectId(req.body.postId),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log('🚀 ~ Error on deleting post: ', error);
  }
});
