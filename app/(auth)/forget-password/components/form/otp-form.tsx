import { useForm } from '@tanstack/react-form';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { FORGET_PASSWORD_STEP_EMAIL_VALUE } from '@/constants/storage/auth';
import useLocalStorage from '@/hooks/use-local-storage';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';

export default function OtpForm(props: {
  handleBack: () => void;
  onSuccess: () => void;
}) {
  const { value: email } = useLocalStorage(FORGET_PASSWORD_STEP_EMAIL_VALUE);

  const otpForm = useForm({
    defaultValues: {
      otp: '',
    },
    validators: {
      onChange: z.object({
        otp: z.string().length(6),
      }),
      onSubmitAsync: async ({ value }) => {
        const [error] = await asyncTryCatch(() =>
          fetcher('/api/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({
              email: email,
              otp: value.otp,
            }),
          }),
        );

        if (error) {
          toast.error(error.message, { position: 'top-right' });
          return;
        }

        localStorage.removeItem(FORGET_PASSWORD_STEP_EMAIL_VALUE);

        props.onSuccess();

        return null;
      },
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        otpForm.handleSubmit();
      }}
    >
      <div className="inline-flex items-center">
        <Button
          type="button"
          variant="ghost"
          className="p-0 mr-2 h-6 w-6"
          onClick={props.handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <h2 className="text-xl font-bold">Enter OTP</h2>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 font-medium text-xs mt-2">
          We’ve sent a One-Time Password (OTP) to your registered email address.
          Please enter the OTP below to verify your identity and proceed with
          resetting your password. If you didn’t receive the email, check your
          spam folder or click Resend OTP.
        </p>
      </div>
      <div className="space-y-2">
        <otpForm.Field
          name="otp"
          children={(field) => (
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              onChange={(value) => field.handleChange(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
      </div>
      <Button type="submit" className="w-full mt-4">
        Verify
      </Button>
    </form>
  );
}
