import createResponse from '@/lib/create-response';
import isInTeam from '@/middleware/is-in-team';
import getDetailDashboard from '@/repository/dashboard/get-detail-dashboard';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dashboardId = Number(url.searchParams.get('id') || 0);

  const [hasInTeam] = await isInTeam(dashboardId);
  if (!hasInTeam) {
    return createResponse({
      type: 'failed',
      error: 'Please invite your account to dashboard',
      status: 401,
    });
  }

  const [dashboardError, dashboards] = await getDetailDashboard(dashboardId);
  if (dashboardError) {
    return createResponse({
      type: 'failed',
      status: 500,
      error: dashboardError.message,
    });
  }

  return createResponse({
    type: 'success',
    payload: dashboards,
    status: 200,
  });
}
