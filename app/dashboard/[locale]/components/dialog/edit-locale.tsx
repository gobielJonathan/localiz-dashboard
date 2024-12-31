import useGetLocaleContent, {
  NormalizedGetLocaleContent,
} from '@/app/dashboard/hooks/use-get-locale-content';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import UpdateContentForm from '../form/update-key-content';

export default function EditLocaleDialog(props: {
  data: NormalizedGetLocaleContent;
  dashboardId: number;
  locale: string;
}) {
  const { refetch: refetchLocaleContent } = useGetLocaleContent(
    props.dashboardId,
    props.locale,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Make changes to your content here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <UpdateContentForm
          dashboardId={String(props.dashboardId)}
          defaultData={props.data}
          onSuccess={refetchLocaleContent}
        />
      </DialogContent>
    </Dialog>
  );
}
