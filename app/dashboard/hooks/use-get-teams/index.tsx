import { useQuery } from '@tanstack/react-query';

export interface Team {
  id: number;
  created_at: string;
  dashboard_id: number;
  user_id: string;
  deleted_at: any;
  users: Users;
}

interface Users {
  email: string;
}

export default function useGetTeams(dashboardId: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: () =>
      fetch(`/api/team/dashboard?dashboard=${dashboardId}`).then((res) =>
        res.json(),
      ),
  });

  return { data: (data?.data ?? []) as Team[], isLoading, error };
}
