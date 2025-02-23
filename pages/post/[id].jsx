import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';

const Post = () => {
  return <div>Post</div>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {
      test: 'test',
    },
  };
});

export default Post;
