import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faSignOut } from '@fortawesome/free-solid-svg-icons';
import Logo from './Logo';
import bgImage from '../public/bg-image.jpg';
import PostsContext from '../context/postContext';

const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  createdAt,
}) => {
  const { user } = useUser();
  const { setPostsFromSSR, posts, getPosts, noMorePosts } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exists = postsFromSSR.find((p) => p._id === postId);
      if (!exists) {
        getPosts({ lastPostDate: createdAt, getNewerPosts: true });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, getPosts, createdAt]);

  return (
    <div className='grid grid-cols-[350px_1fr] h-screen max-h-screen'>
      <div className='flex flex-col text-white overflow-hidden relative z-10'>
        <div className='bg-indigo-900 px-2'>
          <Logo />
          <Link href='/post/new' className='btn'>
            New Post
          </Link>
          <Link href='/token-topup' className='block mt-2 text-center'>
            <FontAwesomeIcon icon={faCoins} className='text-yellow-500' />
            <span className='ml-2'>{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className='px-4 pt-3 flex-1 overflow-auto bg-gradient-to-b from-indigo-900 to-sky-700'>
          <div className='text-white/50 underline'>Post History</div>
          {posts.map((p) => (
            <Link
              key={p._id}
              href={`/post/${p._id}`}
              className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-md ${
                postId === p._id ? 'bg-white/20 border-white' : ''
              }`}
            >
              {p.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              className='hover:underline text:sm text-slate-400 text-center cursor-pointer mt-4'
              role='button'
              onClick={() =>
                getPosts({ lastPostDate: posts[posts.length - 1].created })
              }
            >
              Load more posts ...
            </div>
          )}
        </div>
        <div className='bg-sky-700 flex items-center gap-2 border-t border-t-black/20 p-2'>
          {user ? (
            <>
              <div className='min-w-[60px]'>
                <Image
                  src={user.picture}
                  width={60}
                  height={60}
                  alt={user.name}
                  className='rounded-full'
                />
              </div>
              <div className='flex-1'>
                <div className='text-sm font-bold'>{user.email}</div>
                <Link className='text-xs' href='/api/auth/logout'>
                  <FontAwesomeIcon icon={faSignOut} /> Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href='/api/auth/login'>Login</Link>
          )}
        </div>
      </div>
      <div className='h-screen overflow-auto p-8'>
        <Image src={bgImage} alt='Hero' fill className='object-cover' />
        <div className='absolute left-0 top-o right-0 bottom-0 w-full h-full bg-slate-50 opacity-80'></div>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
