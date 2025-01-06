'use client';

import { Suspense } from 'react';

import LoginForm from './components/login-form';

export default function Client() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Log in to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to access your account.
        </p>
      </div>
      <div className="grid gap-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
