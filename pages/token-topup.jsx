import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import { getAppProps } from '../utils/getAppProps';
import { getLayout } from '../utils/getLayout';

const TokenTopUp = () => {
  const handleClick = async () => {
    const res = await fetch(`/api/addTokens`, {
      method: 'POST',
    });

    const json = await res.json();
    window.location.href = json.session.url;
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

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});

export default TokenTopUp;
