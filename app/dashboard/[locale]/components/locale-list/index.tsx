import { useState } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import useGetLocaleContent, {
  NormalizedGetLocaleContent,
} from '@/app/dashboard/hooks/use-get-locale-content';
import DataTable from '@/components/ui/data-table';
import { DataTableLoader } from '@/components/ui/data-table/loader';

import DeleteLocaleDialog from '../dialog/delete-locale';
import EditLocaleDialog from '../dialog/edit-locale';

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

  const { data, isLoading } = useGetLocaleContent(dashboardId, String(locale));

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
            <EditLocaleDialog
              dashboardId={dashboardId}
              locale={locale}
              data={content}
            />
            <DeleteLocaleDialog
              dashboardId={dashboardId}
              locale={locale}
              id={content.id}
            />
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
