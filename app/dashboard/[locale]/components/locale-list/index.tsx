import { use, useMemo, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';

import useGetLocaleContent, {
  NormalizedGetLocaleContent,
} from '@/app/dashboard/hooks/use-get-locale-content';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import { DataTableLoader } from '@/components/ui/data-table/loader';
import Loading from '@/components/ui/loading';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import fetcher from '@/lib/fetch';

export default function LocaleList({
  dashboardId,
  locale,
}: {
  dashboardId: number;
  locale: string;
}) {
  const {
    mutateAsync: deleteLocaleContent,
    isPending: loadingDeleteLocaleContent,
  } = useMutation({
    mutationFn: (vars: any) =>
      fetcher(`/api/locale/content?id=${vars.id}&dashboard_id=${dashboardId}`, {
        method: 'DELETE',
      }),
  });

  const [deletedKey, setDeletedKey] = useState<number | undefined>(undefined);

  const {
    data,
    isLoading,
    refetch: refetchGetLocaleContent,
  } = useGetLocaleContent(dashboardId, String(locale));

  const onDeleteLocaleContent = async (id: number) => {
    await deleteLocaleContent(
      { id },
      {
        onError: (error) => {
          toast.error(error.message, { position: 'top-right' });
        },
        onSuccess: () => {
          toast.success('Locale content deleted', { position: 'top-right' });
          setDeletedKey(undefined);
          refetchGetLocaleContent();
        },
      },
    );
  };

  const columns: ColumnDef<NormalizedGetLocaleContent>[] = useMemo(
    () => [
      {
        accessorKey: 'key',
        header: 'Key',
      },
      {
        accessorKey: 'content',
        header: 'Content',
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const content: NormalizedGetLocaleContent = row.original;

          return (
            <div>
              <Popover open={content.id === deletedKey}>
                <PopoverTrigger onClick={() => setDeletedKey(content.id)}>
                  Delete
                </PopoverTrigger>
                <PopoverContent className="w-fit space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onDeleteLocaleContent(content.id)}
                  >
                    {loadingDeleteLocaleContent && <Loading />}
                    Confirm
                  </Button>
                  <PopoverClose onClick={() => setDeletedKey(undefined)}>
                    Cancel
                  </PopoverClose>
                </PopoverContent>
              </Popover>
            </div>
          );
        },
      },
    ],
    [deletedKey, loadingDeleteLocaleContent],
  );

  if (isLoading) {
    return <DataTableLoader />;
  }

  return <DataTable columns={columns} data={data} />;
}
