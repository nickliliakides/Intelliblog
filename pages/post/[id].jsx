import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { ObjectId } from 'mongodb';
import Markdown from 'react-markdown';
import clientPromise from '../../lib/mongodb';
import { getLayout } from '../../utils/getLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';

const Post = (props) => {
  return (
    <div className='overflow-auto h-full'>
      <div className=' max-w-xl mx-auto'>
        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-md'>
          SEO title and meta description
        </div>
        <div className='p-4 my-2 border border-stone-200 rounded-md'>
          <div className='text-blue-600 text-2xl font-bold'>{props.title}</div>
          <div className='mt-2'>{props.metaDescription}</div>
        </div>
        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-md'>
          Keywords
        </div>
        <div className='flex flex-wrap pt-2 gap-1'>
          {props.keywords.split(',').map((k, i) => (
            <div key={i} className='p-2 rounded-full bg-slate-800 text-white'>
              <FontAwesomeIcon icon={faHashtag} /> {k}
            </div>
          ))}
        </div>
        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-md'>
          Blog Post
        </div>
        <Markdown>{props.content || ''}</Markdown>
      </div>
    </div>
  );
};

Post.getLayout = getLayout;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db('IntelliBlogDB');
    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub,
    });
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params.id),
      userId: user._id,
    });

    if (!post) {
      return { redirect: { destination: '/post/new', permanent: false } };
    }

    return {
      props: {
        content: post.content,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
      },
    };
  },
});

export default Post;
