import { supabase } from '@/function/db';
import { asyncTryCatch } from '@/lib/try-catch';

export default async function getUserDashboard(userId: string) {
  return asyncTryCatch(async () => {
    const dashboardResponse = await supabase
      .from('team')
      .select('id, dashboard ( id , name, users ( email ) ) ')
      .eq('user_id', userId);

    if (dashboardResponse.error) {
      throw Error(dashboardResponse.error.message);
    }
    return dashboardResponse.data;
  });
}
