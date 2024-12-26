import { useParams } from 'next/navigation';

import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';
import { FormError } from '@/model/form';

export default function UpdateContentForm(props: {
  dashboardId: string;
  defaultData?: { key: string; content: string };
  onSuccess: () => void;
}) {
  console.log('props', props);
  const { locale } = useParams();

  const form = useForm({
    defaultValues: {
      key: props.defaultData?.key || '',
      content: props.defaultData?.content || '',
    },

    validators: {
      onSubmitAsync: async ({ value }) => {
        const [error] = await asyncTryCatch(() =>
          fetcher(
            `/api/locale/content?id=${locale}&dashboard_id=${props.dashboardId}`,
            {
              method: 'PUT',
              body: JSON.stringify(value),
            },
          ),
        );

        if (error instanceof FormError) {
          return { fields: error.fieldError };
        }

        if (error) {
          toast.error(error.message, { position: 'top-right' });
          return;
        }

        props.onSuccess();
        return null;
      },
    },
  });

  return (
    <>
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
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  value={field.form.getFieldValue('key')}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled
                  className="col-span-3"
                />
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
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </>
  );
}
