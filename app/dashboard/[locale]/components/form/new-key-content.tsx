import { useParams, useSearchParams } from 'next/navigation';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';

import useGetLocaleContent from '@/app/dashboard/hooks/use-get-locale-content';
import FieldInfo from '@/components/form/FieldInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import fetcher from '@/lib/fetch';
import { FormError } from '@/model/form';
import { localeContentSchema } from '@/schema/locale';
import { asyncTryCatch } from '@/utils/try-catch';

export default function NewKeyContentForm(props: {
  dashboardId: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
}) {
  const { locale } = useParams();

  const { refetch: getLocaleContent } = useGetLocaleContent(
    props.dashboardId,
    String(locale),
  );

  const { mutateAsync } = useMutation({
    mutationFn: (vars: any) =>
      fetcher(
        `/api/locale/content?locale_id=${locale}&dashboard_id=${props.dashboardId}`,
        {
          method: 'POST',
          body: JSON.stringify(vars),
        },
      ),
  });

  const form = useForm({
    defaultValues: {
      key: '',
      content: '',
    },

    validators: {
      onChange: localeContentSchema,
      onSubmitAsync: async ({ value }) => {
        // Do something with form data

        const [error, response] = await asyncTryCatch(() => mutateAsync(value));

        if (error instanceof FormError) {
          return { fields: error.fieldError };
        }

        if (response.status !== 200) {
          props.onError(new Error(response.message));
          return;
        }

        getLocaleContent();

        props.onSuccess();

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
          name="key"
          children={(field) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                Key
              </Label>

              <div className="col-span-3">
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., welcome_message"
                />
                <FieldInfo field={field} />
              </div>
            </div>
          )}
        />
        <form.Field
          name="content"
          children={(field) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                Content
              </Label>
              <div className="col-span-3">
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter the localized content"
                />
                <FieldInfo field={field} />
              </div>
            </div>
          )}
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="submit">Add Key</Button>
      </div>
    </form>
  );
}
