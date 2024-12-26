import { NextRequest } from 'next/server';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import isInTeam from '@/middleware/is-in-team';
import { localeContentSchema } from '@/schema/locale';

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const dashboardId = req.nextUrl.searchParams.get('dashboard_id') || '';

  const [hasInTeam] = await isInTeam(Number(dashboardId));
  if (!hasInTeam) {
    return createResponse({
      type: 'failed',
      error: 'Please invite your account to dashboard',
      status: 401,
    });
  }

  const deletedResponse = await supabase
    .from('locale_content')
    .delete()
    .eq('id', Number(id));
  if (deletedResponse.error) {
    return createResponse({
      type: 'failed',
      error: deletedResponse.error.message,
      status: deletedResponse.status,
    });
  }

  return createResponse({
    type: 'success',
    payload: deletedResponse.data,
    status: 200,
  });
}

export async function GET(req: NextRequest) {
  const dashboardId = req.nextUrl.searchParams.get('dashboard_id') || '';
  const locale = req.nextUrl.searchParams.get('locale') || '';

  const [hasInTeam] = await isInTeam(Number(dashboardId));
  if (!hasInTeam) {
    return createResponse({
      type: 'failed',
      error: 'Please invite your account to dashboard',
      status: 401,
    });
  }

  const localeResponse = await supabase
    .from('locale_content')
    .select()
    .eq('locale_id', locale);

  if (localeResponse.error) {
    return createResponse({
      type: 'failed',
      error: localeResponse.error.message,
      status: localeResponse.status,
    });
  }

  return createResponse({
    type: 'success',
    payload: localeResponse.data,
    status: 200,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const localeContentSchemaParsed = localeContentSchema.safeParse(body);
  if (localeContentSchemaParsed.error) {
    return createResponse({
      type: 'failed',
      error: localeContentSchemaParsed.error.formErrors,
      status: 500,
    });
  }

  const locale_id = req.nextUrl.searchParams.get('locale_id') || '';
  const dashboard_id = req.nextUrl.searchParams.get('dashboard_id') || '';

  if (!locale_id || !dashboard_id) {
    return createResponse({
      type: 'failed',
      error: 'locale_id and dashboard_id are required',
      status: 500,
    });
  }

  const { content, key } = localeContentSchemaParsed.data;

  const [hasInTeam, user] = await isInTeam(Number(dashboard_id));
  if (!hasInTeam) {
    return createResponse({
      type: 'failed',
      error: 'Please invite your account to dashboard',
      status: 401,
    });
  }

  const localeContentInsertResponse = await supabase
    .from('locale_content')
    .insert({
      locale_id: Number(locale_id),
      content: content,
      key: key,
      created_by: user?.id,
    })
    .select()
    .single();

  if (localeContentInsertResponse.error) {
    return createResponse({
      type: 'failed',
      error: localeContentInsertResponse.error.message,
      status: localeContentInsertResponse.status,
    });
  }

  return createResponse({
    type: 'success',
    payload: localeContentInsertResponse.data,
    status: 200,
  });
}
