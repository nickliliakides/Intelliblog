import Cors from 'micro-cors';
import stripeInit from 'stripe';
import verifyStripe from '@webdeveducation/next-verify-stripe';
import clientPromise from '../../../lib/mongodb';

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const cors = Cors({ allowMethods: ['Post', 'Head'] });
export const config = {
  api: { bodyParser: false },
};

async function handler(req, res) {
  if (req.method === 'POST') {
    let event;
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      });
    } catch (error) {
      console.log('🚀 ~ handler ~ error:', error);
    }
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const client = await clientPromise;
        const db = client.db('IntelliBlogDB');
        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;

        await db.collection('users').updateOne(
          {
            auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id,
            },
          },
          {
            upsert: true,
          }
        );
        break;
      }
      default:
        console.log('Unhandled event', event.type);
    }
    res.status(200).json({ received: true });
  }
}
export default cors(handler);
