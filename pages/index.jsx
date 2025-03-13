import Image from 'next/image';
import Link from 'next/link';
import HeroImage from '../public/hero.webp';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div className='w-screen h-screen overflow-hidden flex justify-center items-center relative'>
      <Image src={HeroImage} alt='Hero' fill className='object-cover' />
      <div className='relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-indigo-900/90 rounded-lg backdrop-blur-sm'>
        <Logo />
        <p className='mb-3'>
          The AI-powered SAAS solution to generate SEO-optimized blog posts with
          high-quality content in seconds without sacrificing your time.
        </p>
        <Link className='btn' href='/post/new'>
          Let&apos;s start
        </Link>
      </div>
    </div>
  );
}
