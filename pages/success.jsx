import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import { getAppProps } from '../utils/getAppProps';
import { getLayout } from '../utils/getLayout';

const TokenTopUp = () => {
  return (
    <div>
      <h1>Thank you for your purchase!</h1>
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
