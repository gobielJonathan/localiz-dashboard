import { User } from '@supabase/supabase-js';

import { supabase } from '@/function/db';
import { asyncTryCatch } from '@/lib/try-catch';
import getAuthUser from '@/repository/auth/get-auth-user';

export default async function isInTeam(
  dashboardId: number,
): Promise<[boolean, User | undefined]> {
  const [error, user] = await asyncTryCatch(() => getAuthUser());

  if (error) {
    return [false, user?.user];
  }

  const inTeamResponse = await supabase
    .from('team')
    .select('id')
    .eq('dashboard_id', dashboardId)
    .eq('user_id', user?.user.id || '');
  if (inTeamResponse.data?.length == 0) {
    return [false, user?.user];
  }

  return [true, user?.user];
}
