import { useSearchParams } from 'next/navigation';

import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import FieldInfo from '@/components/form/FieldInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';
import { FormError } from '@/model/form';

import useGetLocale from '../../hooks/use-get-locale';

export default function AddNewLocaleForm(props: {
  defaultDashboardId: number;
  onSucess: () => void;
}) {
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get('id') || props.defaultDashboardId;

  const { data: locales } = useGetLocale(Number(dashboardId));

  const form = useForm({
    defaultValues: {
      locale: '',
      copy_from_locale: '',
    },

    validators: {
      onChange: z.object({
        locale: z.string().min(1, 'locale is required'),
        copy_from_locale: z.string().min(1, 'copy from is required').optional(),
      }),
      onSubmitAsync: async ({ value }) => {
        const [error] = await asyncTryCatch(() =>
          fetcher('/api/locale', {
            method: 'POST',
            body: JSON.stringify({
              dashboard_id: Number(dashboardId),
              ...value,
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
              <div className="col-span-3">
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., en-US, fr-FR, es-ES"
                />
                <FieldInfo field={field} />
              </div>
            </div>
          )}
        />

        <form.Field
          name="copy_from_locale"
          children={(field) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                Copy From
              </Label>

              <div className="col-span-3">
                <Select onValueChange={field.handleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a locale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {locales.map((locale) => (
                        <SelectItem key={locale.id} value={String(locale.id)}>
                          {locale.locale}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldInfo field={field} />
              </div>
            </div>
          )}
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <form.Subscribe
          children={(field) => (
            <Button type="submit">
              {field.isSubmitting && <Loading />}
              Add Locale
            </Button>
          )}
        />
      </div>
    </form>
  );
}
