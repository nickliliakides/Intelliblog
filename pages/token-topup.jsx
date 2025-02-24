import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import { getLayout } from '../utils/getLayout';

const TokenTopUp = () => {
  const handleClick = async () => {
    await fetch(`/api/addTokens`, {
      method: 'POST',
    });
  };

  return (
    <div>
      <h1>Token Top Up</h1>
      <button className='btn' onClick={handleClick}>
        Add tokens
      </button>
    </div>
  );
};

TokenTopUp.getLayout = getLayout;

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {
      test: 'test',
    },
  };
});

export default TokenTopUp;
