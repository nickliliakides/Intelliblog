import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
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
    <div className='h-full overflow-hidden'>
      <div className='w-full h-full flex flex-col overflow-auto'>
        <div className='m-auto w-full max-w-sm bg-slate-100 p-4 rounded-lg shadow-xl border border-slate-200 shadow-slate-20 text-center relative z-10'>
          <h2 className=' text-3xl text-green-800'>Token Top Up</h2>
          <p className='text-xl'>
            Add 10 tokens to your account to be able to use AI tool.
          </p>
          <button className='btn text-white mt-3 mb-1' onClick={handleClick}>
            Add tokens
          </button>
        </div>
      </div>
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
