'use client';

import { useForm } from '@tanstack/react-form';
import toast, { Toaster } from 'react-hot-toast';
import * as z from 'zod';

import FieldInfo from '@/components/form/FieldInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage/auth';
import encrypt from '@/lib/encrypt';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';
import { FormError } from '@/model/form';

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function UpdatePasswordPage() {
  const form = useForm({
    defaultValues: {
      confirmPassword: '',
      password: '',
    },

    validators: {
      onChange: formSchema,
      onSubmitAsync: async ({ value }) => {
        const qs = new URLSearchParams('?' + window.location.hash.slice(1));

        const [error] = await asyncTryCatch(() =>
          fetcher('/api/user/update-password', {
            method: 'POST',
            body: JSON.stringify({
              password: encrypt(value.password),
              refresh_token: qs.get(REFRESH_TOKEN),
              access_token: qs.get(ACCESS_TOKEN),
            }),
          }),
        );

        if (error instanceof FormError) {
          return { fields: error.fieldError };
        }

        if (error) {
          toast.error(error.message, { position: 'top-right' });
          return;
        }

        window.location.assign('/dashboard');
        return null;
      },
    },
  });

  return (
    <>
      <Toaster />
      <div>
        <div className="mb-5">
          <h1 className="font-bold text-2xl">Reset Password</h1>
          <p className="text-gray-600 font-medium">
            Enter your new password below. Choose a strong password and don't
            reuse it for other accounts
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col space-y-4"
        >
          <form.Field
            name="password"
            children={(field) => (
              <div>
                <Label className="font-bold">Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter your new Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
          <form.Field
            name="confirmPassword"
            children={(field) => (
              <div>
                <Label className="font-bold">Confirmation Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Confirm your new Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.isSubmitting]}
            children={([isSubmitting]) => (
              <Button>
                {isSubmitting && <Loading />}
                <span>Reset Password</span>
              </Button>
            )}
          />
        </form>
      </div>
    </>
  );
}
