import React, { useRef, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { getLayout } from '../../utils/getLayout';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';

const NewPost = () => {
  const topicRef = useRef(null);
  const keywordsRef = useRef(null);
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState();

  const clearFields = () => {
    topicRef.current.value = '';
    keywordsRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !topicRef?.current?.value.trim() ||
      !keywordsRef?.current?.value.trim()
    ) {
      setError('Both fields are required.');
      return;
    } else {
      setError();
    }
    setGenerating(true);
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
      setGenerating(false);
    }
  };

  return (
    <div className='h-full overflow-hidden'>
      <div className='w-full h-full flex flex-col overflow-auto'>
        {generating ? (
          <div className='text-green-700 flex flex-col justify-center items-center h-full animate-pulse relative z-10'>
            <FontAwesomeIcon icon={faBrain} className='text-8xl' />
            <h6>Generating...</h6>
          </div>
        ) : (
          <form
            className='m-auto w-full max-w-sm bg-slate-100 p-4 rounded-lg shadow-xl border border-slate-200 shadow-slate-20 z-10'
            onSubmit={handleSubmit}
          >
            <div>
              <label>
                <strong>Generate a blog post on the topic of:</strong>
              </label>
              <textarea
                ref={topicRef}
                className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-md'
                required
                maxLength={255}
              ></textarea>
            </div>
            <div>
              <label>
                <strong>Targeting the following keywords:</strong>
              </label>
              <textarea
                ref={keywordsRef}
                className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-md'
                required
                maxLength={255}
              ></textarea>
              <small className='block -mt-1 text-gray-500'>
                Separate keywords with a comma.
              </small>
            </div>
            <button
              type='submit'
              className='btn my-2 text-white disabled:cursor-default disabled:bg-gray-400'
            >
              Generate Post
            </button>
            <div className='w-full flex justify-end'>
              <button className='ml-auto text-red-600' onClick={clearFields}>
                Clear fields
              </button>
            </div>
            {error && <small className=' text-red-600'>{error}</small>}
          </form>
        )}
      </div>
    </div>
  );
};

NewPost.getLayout = getLayout;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-topup',
        },
      };
    }

    return {
      props,
    };
  },
});

export default NewPost;
