import React, { useRef } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getLayout } from '../../utils/getLayout';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';

const NewPost = () => {
  const topicRef = useRef(null);
  const keywordsRef = useRef(null);
  const router = useRouter();

  const clearFields = () => {
    topicRef.current.value = '';
    keywordsRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/generatePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          topic: topicRef.current.value,
          keywords: keywordsRef.current.value,
        }),
      });

      const json = await res.json();

      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (error) {
      console.log('🚀 ~ handleClick ~ json error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            ref={topicRef}
            className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-md'
          ></textarea>
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            ref={keywordsRef}
            className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-md'
          ></textarea>
        </div>
        <button type='submit' className='btn mt-6 text-white'>
          Generate Post
        </button>
        <div className='w-full flex justify-end'>
          <button className='ml-auto text-red-600' onClick={clearFields}>
            Clear fields
          </button>
        </div>
      </form>
    </div>
  );
};

NewPost.getLayout = getLayout;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});

export default NewPost;
