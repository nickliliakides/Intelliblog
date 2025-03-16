import { UserProvider } from '@auth0/nextjs-auth0/client';
import { DM_Sans, DM_Serif_Display } from '@next/font/google';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { PostProvider } from '../context/postContext';

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
});

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <UserProvider>
      <PostProvider>
        <main className={`${dmSans.variable} ${dmSerif.variable} font-body`}>
          {getLayout(<Component {...pageProps} />, pageProps)}
        </main>
      </PostProvider>
    </UserProvider>
  );
}

export default MyApp;
