import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

export interface NormalizedGetLocaleContent {
  id: number;
  created_at: string;
  key: string;
  content: string;
  locale_id: number;
  deleted_at: any;
  created_by: string;
}

export default function useGetLocaleContent(
  dashboardId: number,
  locale: string,
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['locale_content', locale, dashboardId],
    queryFn: () =>
      fetch(
        `/api/locale/content?dashboard_id=${dashboardId}&locale=${locale}`,
      ).then((res) => res.json()),
  });

  return useMemo(
    () => ({
      data: (data?.data ?? []) as NormalizedGetLocaleContent[],
      isLoading,
      error,
      refetch,
    }),
    [data, isLoading, error, refetch],
  );
}
