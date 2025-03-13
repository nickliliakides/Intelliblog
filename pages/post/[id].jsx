import React, { useContext, useState } from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { ObjectId } from 'mongodb';
import Markdown from 'react-markdown';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import clientPromise from '../../lib/mongodb';
import { getLayout } from '../../utils/getLayout';
import { getAppProps } from '../../utils/getAppProps';
import ConfirmDelete from '../../components/ConfirmDelete';
import PostsContext from '../../context/postContext';

const Post = ({ postId, title, metaDescription, content, keywords }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { deletePost } = useContext(PostsContext);

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch('/api/deletePost', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      const json = await res.json();

      if (json.success) {
        setError('');
        setShowConfirmDelete(false);
        deletePost(postId);
        router.replace('/post/new');
      } else {
        setError('Error on deleting post. Please try again later.');
      }
    } catch (error) {
      console.log('🚀 ~ Post deletion error: ', error);
      setError('Error on deleting post. Please try again later.');
    }
  };

  return (
    <div className='overflow-auto h-full relative z-10 '>
      <div className='max-w-xl mx-auto bg-white py-2 px-4 rounded-lg'>
        <div className='text-sm font-bold mt-2 p-2 bg-stone-200 rounded-md'>
          SEO title and meta description
        </div>
        <div className='p-4 my-2 border border-stone-200 rounded-md'>
          <div className='text-blue-600 text-2xl font-bold'>{title}</div>
          <div className='mt-2'>{metaDescription}</div>
        </div>
        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-md'>
          Keywords
        </div>
        <div className='flex flex-wrap pt-2 gap-1'>
          {keywords.split(',').map((k, i) => (
            <div key={i} className='p-2 rounded-full bg-slate-800 text-white'>
              <FontAwesomeIcon icon={faHashtag} /> {k}
            </div>
          ))}
        </div>
        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-md'>
          Blog Post
        </div>
        <Markdown>{content || ''}</Markdown>
        <div className='my-4 '>
          {!showConfirmDelete ? (
            <button
              className='btn bg-red-600 hover:bg-red-700 text-white'
              onClick={() => setShowConfirmDelete(true)}
            >
              Delete Post
            </button>
          ) : (
            <ConfirmDelete
              open={showConfirmDelete}
              onCancel={() => setShowConfirmDelete(false)}
              onDelete={handleConfirmDelete}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};

Post.getLayout = getLayout;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
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
        createdAt: post.created.toString(),
        ...props,
      },
    };
  },
});

export default Post;
