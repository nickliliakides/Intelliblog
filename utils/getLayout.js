import AppLayout from '../components/AppLayout';

export const getLayout = (page, pageProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};
