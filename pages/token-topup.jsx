import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import { getLayout } from '../utils/getLayout';

const TokenTopUp = () => {
  return <div>TokenTopUp</div>;
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
