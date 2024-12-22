import { use } from 'react';

import useGetLocaleContent from '@/app/dashboard/hooks/use-get-locale-content';
import DataTable from '@/components/ui/data-table';
import { DataTableLoader } from '@/components/ui/data-table/loader';

import { columns } from './columns';

export default function LocaleList({
  dashboardId,
  locale,
}: {
  dashboardId: number;
  locale: string;
}) {
  const { data, isLoading } = useGetLocaleContent(dashboardId, String(locale));

  if (isLoading) {
    return <DataTableLoader />;
  }

  return <DataTable columns={columns} data={data} />;
}
