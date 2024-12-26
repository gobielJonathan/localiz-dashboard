import { useRouter } from 'next/navigation';

import { Label } from '@radix-ui/react-label';
import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';

import FieldInfo from '@/components/form/FieldInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import encrypt from '@/lib/encrypt';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';
import { FormError } from '@/model/form';
import { registerSchema } from '@/schema/auth';

export default function RegisterForm() {
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

        const [error] = await asyncTryCatch(() =>
          fetcher('/api/auth/email/register', {
            method: 'POST',
            body: JSON.stringify({
              ...value,
              password: encrypt(value.password),
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

        toast.success(
          'Please check your email for the confirmation link to complete the process.',
          { position: 'top-right' },
        );

        router.replace('/login');

        return null;
      },
    },
  });

  return (
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
              {isSubmitting && <Loading />}
              Sign Up
            </Button>
          )}
        />
      </div>
    </form>
  );
}
