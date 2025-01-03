'use client';

import Link from 'next/link';

import { useForm } from '@tanstack/react-form';
import toast, { Toaster } from 'react-hot-toast';

import FieldInfo from '@/components/form/FieldInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';
import { FormError } from '@/model/form';
import { updateUserSchema } from '@/schema/auth';

export default function Client(props: { email: string; name: string }) {
  const form = useForm({
    defaultValues: {
      name: props.name,
      email: props.email,
    },

    validators: {
      onChange: updateUserSchema,
      onSubmitAsync: async ({ value }) => {
        const [error] = await asyncTryCatch(() =>
          fetcher('/api/user/update-user', {
            method: 'POST',
            body: JSON.stringify(value),
          }),
        );

        if (error instanceof FormError) {
          return { fields: error.fieldError };
        }

        if (error) {
          toast.error(error.message, { position: 'top-right' });
          return;
        }

        toast.success('Profile updated', { position: 'top-right' });

        return null;
      },
    },
  });

  return (
    <>
      <Toaster />
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          children={(field) => (
            <div className="grid gap-1">
              <Label>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                defaultValue={field.form.getFieldValue(field.name)}
                onChange={(e) => field.handleChange(e.target.value)}
                autoCapitalize="none"
                autoComplete="email"
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
              <Label>Email</Label>
              <Input
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                defaultValue={field.form.getFieldValue(field.name)}
                onChange={(e) => field.handleChange(e.target.value)}
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

        <Link href="/forget-password">
          <Button
            variant="link"
            type="button"
            className="text-sm text-blue-500 hover:underline"
          >
            Reset Password
          </Button>
        </Link>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button disabled={!canSubmit}>
              {isSubmitting && <Loading />}
              <span>Save</span>
            </Button>
          )}
        />
      </form>
    </>
  );
}
