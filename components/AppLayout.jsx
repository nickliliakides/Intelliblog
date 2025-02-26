import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faSignOut } from '@fortawesome/free-solid-svg-icons';
import Logo from './Logo';

const AppLayout = ({ children, availableTokens, posts, postId }) => {
  const { user } = useUser();
  return (
    <div className='grid grid-cols-[350px_1fr] h-screen max-h-screen'>
      <div className='flex flex-col text-white overflow-hidden'>
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
      <div className='h-screen overflow-auto p-8'>{children}</div>
    </div>
  );
};

export default AppLayout;
