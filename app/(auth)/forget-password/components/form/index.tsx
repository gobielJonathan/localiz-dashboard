import { useRouter } from 'next/navigation';

import {
  FORGET_PASSWORD_STEP,
  FORGET_PASSWORD_STEP_EMAIL,
  FORGET_PASSWORD_STEP_EMAIL_VALUE,
  FORGET_PASSWORD_STEP_OTP,
} from '@/constants/storage/auth';
import useLocalStorage from '@/hooks/use-local-storage';

import EmaiResetForm from './email-reset-form';
import OtpForm from './otp-form';

export default function Form() {
  const router = useRouter();
  const { value: step, setValue: setStep } = useLocalStorage(
    FORGET_PASSWORD_STEP,
    FORGET_PASSWORD_STEP_EMAIL,
  );

  const isOtpForm = step === FORGET_PASSWORD_STEP_OTP;

  const handleBack = () => {
    localStorage.removeItem(FORGET_PASSWORD_STEP_EMAIL_VALUE);
    setStep(FORGET_PASSWORD_STEP_EMAIL);
  };

  return (
    <>
      <div
        className="absolute w-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${isOtpForm ? '-100%' : '0'})` }}
      >
        <EmaiResetForm
          onNext={() => {
            setStep(FORGET_PASSWORD_STEP_OTP);
          }}
        />
      </div>
      <div
        className="absolute w-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${isOtpForm ? '0' : '100%'})` }}
      >
        <OtpForm
          handleBack={handleBack}
          onSuccess={() => {
            router.push('/login');
          }}
        />
      </div>
    </>
  );
}
