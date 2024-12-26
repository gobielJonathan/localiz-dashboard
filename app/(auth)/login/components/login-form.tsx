import { useRouter, useSearchParams } from 'next/navigation';

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
import { loginSchema } from '@/schema/auth';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    validators: {
      onChange: loginSchema,
      onSubmitAsync: async ({ value }) => {
        const [error] = await asyncTryCatch(() =>
          fetcher('/api/auth/email/login', {
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

        router.replace(String(searchParams.get('cb') || '/dashboard'));
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
      <div className="grid gap-2">
        <form.Field
          name="email"
          children={(field) => (
            <div className="grid gap-1">
              <Input
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
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

        <form.Field
          name="password"
          children={(field) => (
            <div className="grid gap-1">
              <Input
                id={field.name}
                name={field.name}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Password"
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
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="w-full" disabled={!canSubmit}>
              {isSubmitting && <Loading />}
              Sign In with Email
            </Button>
          )}
        />
      </div>
    </form>
  );
}
