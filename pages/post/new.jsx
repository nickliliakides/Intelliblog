import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getLayout } from '../../utils/getLayout';
import Markdown from 'react-markdown';

const NewPost = ({ test }) => {
  const [postContent, setPostContent] = useState('');
  const handleClick = async () => {
    try {
      const res = await fetch(`/api/generatePost`, {
        method: 'POST',
      });

      const json = await res.json();
      console.log('🚀 ~ handleClick ~ json:', json);
      setPostContent(json.content);
    } catch (error) {
      console.log('🚀 ~ handleClick ~ json error:', error);
    }
  };

  console.log('🚀 ~ handleClick ~ content:', postContent);
  return (
    <div>
      <button className='btn' onClick={handleClick}>
        Generate Post
      </button>
      {postContent && <Markdown>{postContent}</Markdown>}
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
