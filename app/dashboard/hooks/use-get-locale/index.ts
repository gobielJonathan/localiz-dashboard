import { useQuery } from '@tanstack/react-query';

export interface NormalizeGetLocale {
  id: number;
  created_at: string;
  dashboard_id: number;
  locale: string;
  deleted_at: any;
  created_by: string;
  users: Users;
  locale_content: LocaleContent[];
}

interface Users {
  data: string;
}

interface LocaleContent {
  id: number;
  key: string;
  users: Users;
  content: string;
  locale_id: number;
  created_at: string;
  created_by: string;
  deleted_at: any;
}

export default function useGetLocale(dashboardId: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['locales', dashboardId],
    queryFn: () =>
      fetch(`/api/locale?dashboard_id=${dashboardId}`).then((res) =>
        res.json(),
      ),
  });

  return { data: (data?.data ?? []) as NormalizeGetLocale[], isLoading, error };
}
