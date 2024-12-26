import { useQuery } from '@tanstack/react-query';

import fetcher from '@/lib/fetch';
import { useUserContext } from '@/provider/user';

interface NormalizedTeam {
  id: number;
  dashboard: {
    id: number;
    name: string;
  };
}

export default function useGetUserTeams() {
  const userId = useUserContext((store) => store.userId);
  const { data, isLoading, error } = useQuery({
    queryKey: ['teams', userId],
    queryFn: () => fetcher(`/api/team`),
  });

  return { data: (data?.data ?? []) as NormalizedTeam[], isLoading, error };
}
