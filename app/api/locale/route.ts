import { supabase } from '@/function/db';
import createResponse from '@/lib/create-response';
import safeParse from '@/lib/safe-parse';
import isInTeam from '@/middleware/is-in-team';
import getAuthUser from '@/repository/auth/get-auth-user';
import { localeSchema } from '@/schema/locale';

export async function GET(req: Request) {
  const dashboardId = new URL(req.url).searchParams.get('dashboard_id');

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

export async function POST(req: Request) {
  const body = await req.json();

  const localeSchemaParsed = localeSchema.safeParse(body);
  if (localeSchemaParsed.error) {
    return createResponse({
      type: 'failed',
      error: localeSchemaParsed.error.formErrors,
      status: 500,
    });
  }

  const { dashboard_id, locale } = localeSchemaParsed.data;

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
    .select();

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
