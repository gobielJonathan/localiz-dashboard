import { ReactNode } from 'react';

import Image from 'next/image';

import { Toaster } from 'react-hot-toast';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:block bg-black text-white relative p-12">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Image
              src="/logo.webp"
              width={32}
              height={32}
              alt="Localiz-logo"
              className="rounded-sm"
            />
            <span>Localiz</span>
          </div>
          <div className="absolute bottom-12 left-12 right-12">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Effortlessly streamline your localization projects with tools
                that simplify translations, boost team collaboration, and keep
                progress on track. Start globalizing with ease today!"
              </p>
            </blockquote>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
