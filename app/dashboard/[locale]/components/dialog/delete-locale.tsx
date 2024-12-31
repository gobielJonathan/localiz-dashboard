import toast from 'react-hot-toast';

import useGetLocaleContent from '@/app/dashboard/hooks/use-get-locale-content';
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';

export default function DeleteLocaleDialog(props: {
  dashboardId: number;
  locale: string;
  id: number;
}) {
  const { refetch: refetchGetLocaleContent } = useGetLocaleContent(
    props.dashboardId,
    props.locale,
  );

  const onDeleteLocaleContent = async () => {
    const [error] = await asyncTryCatch(() =>
      fetcher(
        `/api/locale/content?id=${props.id}&dashboard_id=${props.dashboardId}`,
        {
          method: 'DELETE',
        },
      ),
    );

    if (error) {
      toast.error(error.message, { position: 'top-right' });
      return;
    }
    toast.success('Locale content deleted', { position: 'top-right' });
    refetchGetLocaleContent();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteLocaleContent}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
