import { useSearchParams } from 'next/navigation';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import fetcher from '@/lib/fetch';
import { FormError } from '@/model/form';
import { asyncTryCatch } from '@/utils/try-catch';

export default function AddNewLocaleForm(props: {
  defaultDashboardId: number;
  onSucess: () => void;
}) {
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get('id') || props.defaultDashboardId;

  const { mutateAsync: addNewLocale, isPending: loadingAddNewLocale } =
    useMutation({
      mutationFn: (vars: any) =>
        fetcher('/api/locale', {
          method: 'POST',
          body: JSON.stringify(vars),
        }),
    });

  const form = useForm({
    defaultValues: {
      locale: '',
    },

    validators: {
      onChange: z.object({
        locale: z.string().min(1, 'locale is required'),
      }),
      onSubmitAsync: async ({ value }) => {
        const [error] = await asyncTryCatch(() =>
          addNewLocale({
            dashboard_id: Number(dashboardId),
            ...value,
          }),
        );

        if (error instanceof FormError) {
          return { fields: error.fieldError };
        }

        if (error) {
          toast.error(error.message, { position: 'top-right' });
          return;
        }

        props.onSucess();
        return null;
      },
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="grid gap-4 py-4">
        <form.Field
          name="locale"
          children={(field) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                Locale Name
              </Label>
              <Input
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="col-span-3"
                placeholder="e.g., en-US, fr-FR, es-ES"
              />
            </div>
          )}
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="submit">
          {loadingAddNewLocale && <Loading />}
          Add Locale
        </Button>
      </div>
    </form>
  );
}
