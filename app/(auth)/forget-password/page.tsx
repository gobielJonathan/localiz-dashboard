'use client';

import dynamic from 'next/dynamic';

import { Toaster } from 'react-hot-toast';

const Form = dynamic(() => import('./components/form'), { ssr: false });

export default function ForgetPassword() {
  return (
    <>
      <Toaster />
      <div className="w-full max-w-md mx-auto p-6">
        <div className="relative overflow-hidden" style={{ height: '350px' }}>
          <Form />
        </div>
      </div>
    </>
  );
}
