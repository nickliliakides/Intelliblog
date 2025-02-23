import React, { useRef, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getLayout } from '../../utils/getLayout';
import Markdown from 'react-markdown';

const NewPost = () => {
  const [post, setPost] = useState({});
  const topicRef = useRef(null);
  const keywordsRef = useRef(null);

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
      setPost(json.post);
    } catch (error) {
      console.log('🚀 ~ handleClick ~ json error:', error);
    }
  };

  console.log('🚀 ~ handleClick ~ content:', post.content);
  console.log('🚀 ~ handleClick ~ title:', post.title);
  console.log('🚀 ~ handleClick ~ description:', post.metaDescription);

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
        <button type='submit' className='btn'>
          Generate Post
        </button>
        <button className='ml-auto' onClick={clearFields}>
          Clear fields
        </button>
      </form>
      {post && (
        <>
          <h1>{post.title}</h1>
          <h3>{post.metaDescription}</h3>
          <Markdown>{post.content}</Markdown>
        </>
      )}
    </div>
  );
};

NewPost.getLayout = getLayout;

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {
      test: 'test',
    },
  };
});

export default NewPost;
