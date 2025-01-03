import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import FieldInfo from '@/components/form/FieldInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import { FORGET_PASSWORD_STEP_EMAIL_VALUE } from '@/constants/storage/auth';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';

export default function EmaiResetForm(props: { onNext: () => void }) {
  const emailForm = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: z.object({
        email: z.string().email(),
      }),
      onSubmitAsync: async ({ value }) => {
        const [error] = await asyncTryCatch(() =>
          fetcher('/api/auth/otp', {
            body: JSON.stringify(value),
            method: 'POST',
          }),
        );

        if (error) {
          toast.error(error.message, { position: 'top-right' });
          return;
        }

        localStorage.setItem(FORGET_PASSWORD_STEP_EMAIL_VALUE, value.email);
        props.onNext();
        return null;
      },
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        emailForm.handleSubmit();
      }}
    >
      <h2 className="text-xl font-bold">Forgot Password</h2>
      <p className="text-gray-600 font-medium text-xs mt-2">
        Don't worry! nter your email address below, and we'll send you a link to
        reset your password.
      </p>
      <emailForm.Field
        name="email"
        children={(field) => (
          <div className="space-y-2 my-2 p-1">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter your email"
            />
            <FieldInfo field={field} />
          </div>
        )}
      />
      <emailForm.Subscribe
        children={(field) => (
          <Button type="submit" className="w-full">
            {field.isSubmitting && <Loading />}
            Next
          </Button>
        )}
      />
    </form>
  );
}
