import React from 'react';

const ConfirmDelete = ({ open, onCancel, onDelete, error }) => {
  return open ? (
    <div className=' bg-gray-600 opacity-95 fixed left-[350px] top-0 right-0 bottom-0 h-full w-full z-20'>
      <div className='m-auto w-full max-w-sm bg-slate-100 p-4 pt-3 rounded-lg shadow-xl border border-slate-200 shadow-slate-20 text-center fixed top-1/2 left-[calc(50%_+_175px)] transform -translate-x-1/2 -translate-y-1/2 z-30 opacity-100 font-semibold'>
        <p className='p-2 text-2xl bg-red-300 text-center'>
          Are you sure you want to delete this post? This action is
          irreversible.
        </p>
        <div className='grid gap-2 grid-cols-2'>
          <button
            className='btn bg-slate-400 hover:bg-slate-500 text-white mb-0'
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className='btn bg-red-600 hover:bg-red-700 text-white mb-0'
            onClick={onDelete}
          >
            Confirm Delete
          </button>
        </div>
        <div className='text-red-600 text-left mt-2'>{error}</div>
      </div>
    </div>
  ) : null;
};

export default ConfirmDelete;
