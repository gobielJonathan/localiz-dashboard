import { NextRequest } from 'next/server';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import safeParse from '@/lib/safe-parse';
import isInTeam from '@/middleware/is-in-team';

export async function GET(req: NextRequest) {
  const dashboardId = Number(req.nextUrl.searchParams.get('dashboard') || 0);

  const [hasInTeam] = await isInTeam(dashboardId);
  if (!hasInTeam) {
    return createResponse({
      type: 'failed',
      error: 'Please invite your account to dashboard',
      status: 401,
    });
  }

  const teamResponse = await supabase
    .from('team')
    .select('* , users ( data ) ')
    .eq('dashboard_id', dashboardId);

  if (teamResponse.error) {
    return createResponse({
      type: 'failed',
      error: teamResponse.error.message,
      status: 500,
    });
  }

  teamResponse.data = teamResponse.data.map((team) => {
    return {
      ...team,
      users: {
        email: safeParse(team.users.data, { email: '' }).email,
      },
    };
  });

  return createResponse({
    type: 'success',
    payload: teamResponse.data,
    status: 200,
  });
}
