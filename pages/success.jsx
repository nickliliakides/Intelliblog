import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { getAppProps } from '../utils/getAppProps';
import { getLayout } from '../utils/getLayout';

const Success = () => {
  return (
    <div className='h-full overflow-hidden'>
      <div className='w-full h-full flex flex-col overflow-auto'>
        <div className='m-auto w-full max-w-sm bg-slate-100 p-4 rounded-lg shadow-xl border border-slate-200 shadow-slate-20 text-center relative z-10'>
          <h2 className=' text-3xl text-green-800'>
            Thank you for your purchase!
          </h2>
          <p className='text-xl'>
            You can now use you tokens to create content.
          </p>
          <Link href='/post/new' className='btn text-white mt-3 mb-1'>
            Go to post creation page
          </Link>
        </div>
      </div>
    </div>
  );
};

Success.getLayout = getLayout;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});

export default Success;
