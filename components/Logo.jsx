import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

const Logo = () => {
  return (
    <div className='text-3xl text-center py-4 font-heading'>
      IntelliBlog{' '}
      <FontAwesomeIcon icon={faBrain} className='text-2xl text-indigo-400' />
    </div>
  );
};

export default Logo;
