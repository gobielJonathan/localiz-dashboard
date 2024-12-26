import { useRef, useState } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import useGetLocaleContent, {
  NormalizedGetLocaleContent,
} from '@/app/dashboard/hooks/use-get-locale-content';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import { DataTableLoader } from '@/components/ui/data-table/loader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import fetcher from '@/lib/fetch';
import { asyncTryCatch } from '@/lib/try-catch';

import UpdateContentForm from '../form/update-key-content';

export default function LocaleList({
  dashboardId,
  locale,
}: {
  dashboardId: number;
  locale: string;
}) {
  const [editedData, setEditedData] = useState<{
    key: string;
    content: string;
  }>({ key: '', content: '' });

  const {
    data,
    isLoading,
    refetch: refetchGetLocaleContent,
  } = useGetLocaleContent(dashboardId, String(locale));

  const onDeleteLocaleContent = async (id: number) => {
    const [error] = await asyncTryCatch(() =>
      fetcher(`/api/locale/content?id=${id}&dashboard_id=${dashboardId}`, {
        method: 'DELETE',
      }),
    );

    if (error) {
      toast.error(error.message, { position: 'top-right' });
      return;
    }
    toast.success('Locale content deleted', { position: 'top-right' });
    refetchGetLocaleContent();
  };

  const columns: ColumnDef<NormalizedGetLocaleContent>[] = [
    {
      accessorKey: 'key',
      header: 'Key',
    },
    {
      accessorKey: 'content',
      header: 'Content',
    },

    {
      accessorKey: 'info',
      header: 'Info',
      cell: ({ row }) => {
        const content: NormalizedGetLocaleContent = row.original;
        return (
          <div key={content.id}>
            <div>Created by: {content.users.email}</div>
            <div>
              Created at: {format(content.created_at, 'dd MMM yyyy, HH:mm')}
            </div>
          </div>
        );
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const content: NormalizedGetLocaleContent = row.original;

        return (
          <div className="flex flex-col space-y-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditedData({
                      content: content.content,
                      key: content.key,
                    });
                  }}
                >
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Content</DialogTitle>
                  <DialogDescription>
                    Make changes to your content here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <UpdateContentForm
                  dashboardId={String(dashboardId)}
                  defaultData={editedData}
                  onSuccess={console.log}
                />
              </DialogContent>
            </Dialog>

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
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteLocaleContent(content.id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <DataTableLoader />;
  }

  return <DataTable columns={columns} data={data} />;
}
