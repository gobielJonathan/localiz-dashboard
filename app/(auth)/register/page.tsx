'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import FieldInfo from '@/components/form/FieldInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema } from '@/schema/auth';
import encrypt from '@/utils/encrypt';

export default function View() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      phone: '',
      name: '',
    },

    validators: {
      onChange: registerSchema,
      onSubmitAsync: async ({ value }) => {
        // Do something with form data

        const response = await fetch('api/auth/email/register', {
          method: 'POST',
          body: JSON.stringify({
            ...value,
            password: encrypt(value.password),
          }),
        }).then((res) => res.json());

        if (response.status !== 200) {
          toast.error(response.error, { position: 'top-right' });
          return;
        }

        toast.success(
          'Please check your email for the confirmation link to complete the process.',
          { position: 'top-right' },
        );

        // router.push('/login');

        return null;
      },
    },
  });

  return (
    <>
      <Toaster />
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:block bg-black text-white relative p-12">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="border rounded-lg p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            </div>
            Acme Inc
          </div>
          <div className="absolute bottom-12 left-12 right-12">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "This library has saved me countless hours of work and helped me
                deliver stunning designs to my clients faster than ever before."
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to create your account
              </p>
            </div>
            <div className="grid gap-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="grid gap-4">
                  <form.Field
                    name="name"
                    children={(field) => (
                      <div className="grid gap-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          id={field.name}
                          name={field.name}
                          placeholder="John Doe"
                          type="text"
                          autoCapitalize="words"
                          autoComplete="name"
                          autoCorrect="off"
                        />
                        <FieldInfo field={field} />
                      </div>
                    )}
                  />
                  <form.Field
                    name="email"
                    children={(field) => (
                      <div className="grid gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          id={field.name}
                          name={field.name}
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                        />
                        <FieldInfo field={field} />
                      </div>
                    )}
                  />
                  <form.Field
                    name="password"
                    children={(field) => (
                      <div className="grid gap-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          id={field.name}
                          name={field.name}
                          placeholder="••••••••"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="new-password"
                        />
                        <FieldInfo field={field} />
                      </div>
                    )}
                  />
                  <form.Field
                    name="phone"
                    children={(field) => (
                      <div className="grid gap-1">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          id={field.name}
                          name={field.name}
                          placeholder="+1 (555) 000-0000"
                          type="tel"
                          autoCapitalize="none"
                          autoComplete="tel"
                        />
                        <FieldInfo field={field} />
                      </div>
                    )}
                  />
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <Button disabled={!canSubmit} className="w-full">
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign Up
                      </Button>
                    )}
                  />
                </div>
              </form>
              {/* <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
    <Button variant="outline" className="w-full" asChild>
      <Link href="#">
        <Mail className="mr-2 h-4 w-4" />
        Google
      </Link>
    </Button> */}
            </div>
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
      By clicking continue, you agree to our{' '}
      <Link
        href="#"
        className="underline underline-offset-4 hover:text-primary"
      >
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link
        href="#"
        className="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </Link>
      .
    </p> */}
          </div>
        </div>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 md:right-8 md:top-8"
          asChild
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </>
  );
}
