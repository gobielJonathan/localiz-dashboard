import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { supabase } from '@/function/db';

import Client from './page.client';

export default async function Page() {
  const cookiesStore = await cookies();

  const { error: errorUser, data: user } = await supabase.auth.getUser(
    cookiesStore.get('access_token')?.value,
  );

  if (errorUser) {
    return redirect('/login');
  }

  const teams = await supabase
    .from('team')
    .select('id, dashboard ( id , name )')
    .eq('user_id', user.user.id || '')
    .not('dashboard', 'is', null);

  if (teams.error) {
    throw teams.error;
  }

  return (
    <Client
      dashboard={teams.data.map((team) => ({
        id: team.dashboard?.id ?? 0,
        name: team.dashboard?.name ?? '',
      }))}
      user={{ email: user.user.email ?? '', name: user.user.email ?? '' }}
    />
  );
}
