import { NextRequest } from 'next/server';

import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import safeParse from '@/lib/safe-parse';
import isInTeam from '@/middleware/is-in-team';
import { localeSchema } from '@/schema/locale';

export async function GET(req: NextRequest) {
  const dashboardId = req.nextUrl.searchParams.get('dashboard_id');

  const [hasInTeam] = await isInTeam(Number(dashboardId));
  if (!hasInTeam) {
    return createResponse({
      type: 'failed',
      error: 'Please invite your account to dashboard',
      status: 401,
    });
  }

  const localResponse = await supabase
    .from('locale')
    .select('*, users ( data ),  locale_content ( * , users ( data ) ) ')
    .eq('dashboard_id', Number(dashboardId));

  if (localResponse.error) {
    return createResponse({
      type: 'failed',
      error: localResponse.error.message,
      status: localResponse.status,
    });
  }

  //transform user info
  localResponse.data = localResponse.data.map((locale) => {
    locale.users.data = safeParse(locale.users.data, { email: '' }).email;

    locale.locale_content = locale.locale_content.map((localeContent) => {
      localeContent.users.data = safeParse(localeContent.users.data, {
        email: '',
      })?.email;
      return localeContent;
    });

    return locale;
  });

  return createResponse({
    type: 'success',
    payload: localResponse.data,
    status: 200,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const localeSchemaParsed = localeSchema.safeParse(body);
  if (localeSchemaParsed.error) {
    return createResponse({
      type: 'failed',
      error: localeSchemaParsed.error.formErrors,
      status: 500,
    });
  }

  const { dashboard_id, locale, copy_from_locale } = localeSchemaParsed.data;

  const [hasInTeam, user] = await isInTeam(Number(dashboard_id));
  if (!hasInTeam) {
    return createResponse({
      type: 'failed',
      error: 'Please invite your account to dashboard',
      status: 401,
    });
  }

  const localeInsertResponse = await supabase
    .from('locale')
    .insert({
      dashboard_id: dashboard_id,
      locale: locale,
      created_by: user?.id,
    })
    .select()
    .single();

  //we sync between each locale, so we get previous locale to copy the locale content into the new one
  if (copy_from_locale) {
    const copiedLocaleContentKeys = await supabase
      .from('locale_content')
      .select('key')
      .eq('locale_id', Number(copy_from_locale));

    const cloneLocaleKey =
      copiedLocaleContentKeys.data?.map((locale) => ({
        locale_id: localeInsertResponse.data?.id ?? 0,
        key: locale.key ?? '',
        content: '',
        created_by: user?.id ?? '',
      })) ?? [];

    await supabase.from('locale_content').upsert(cloneLocaleKey);
  }

  if (localeInsertResponse.error) {
    return createResponse({
      type: 'failed',
      error: localeInsertResponse.error.message,
      status: localeInsertResponse.status,
    });
  }

  return createResponse({
    type: 'success',
    payload: localeInsertResponse.data,
    status: 200,
  });
}
