import { NextRequest } from 'next/server';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('text') ?? '';

  if (query.length === 0) {
    return createResponse({
      type: 'success',
      payload: [],
      status: 200,
    });
  }

  const usersResponse = await supabase
    .from('users')
    .select('user_id, email')
    .like('email', `%${query.toLowerCase()}%`);

  if (usersResponse.error) {
    return createResponse({
      type: 'failed',
      error: usersResponse.error.message,
      status: usersResponse.status,
    });
  }

  return createResponse({
    type: 'success',
    payload: usersResponse.data,
    status: usersResponse.status,
  });
}
