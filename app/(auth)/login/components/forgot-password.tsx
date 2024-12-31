import { ReactNode } from 'react';

import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';

export default function ForgotPassword(props: { children: ReactNode }) {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      async onSubmitAsync({ value }) {
        const [error] = await asyncTryCatch(() =>
          fetcher('/api/auth/email/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email: value.email }),
          }),
        );
        if (error) {
          toast.error(error.message, { position: 'top-right' });
          return;
        }

        toast.success(
          `Reset password email sent, please check ${value.email} inbox/spam folder`,
          { position: 'top-right', duration: 3_000 },
        );

        return null;
      },
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trouble logging in?</DialogTitle>
          <DialogDescription>
            Enter your email, and we'll send you a link to get back into your
            account.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <form.Field
              name="email"
              children={(field) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field.name} className="text-right">
                    Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    defaultValue={field.form.getFieldValue(field.name)}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Reset Password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
