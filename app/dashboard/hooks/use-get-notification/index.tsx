import { useQuery } from '@tanstack/react-query';

import fetcher from '@/lib/fetch';
import { NotificationValue } from '@/model/notification';
import { useUserContext } from '@/provider/user';

export default function useGetNotification() {
  const userId = useUserContext((store) => store.userId);

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => fetcher('/api/auth/notification'),
    refetchInterval: 120_000,
  });

  return { data: (data?.data ?? []) as NotificationValue[], isLoading, error };
}
