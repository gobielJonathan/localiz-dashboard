import createResponse from "@/function/create-response"
import { supabase } from "@/function/db"
import isInTeam from "@/middleware/is-in-team"
import getAuthUser from "@/repository/auth/get-auth-user"
import getUserDashboard from "@/repository/dashboard/get-user-dashboard"
import { dashboardCreationSchema } from "@/schema/dashboard"
import { asyncTryCatch } from "@/utils/try-catch"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const dashboardId = url.searchParams.get("id")

    const [hasInTeam, user] = await isInTeam(Number(dashboardId))
    if (hasInTeam) {
        return createResponse({
            type: "failed",
            error: "Please invite your account to dashboard",
            status: 401
        })
    }

    const [dashboardError, dashboards] = await getUserDashboard(user?.id || "")
    if (dashboardError) {
        return createResponse({
            type: "failed",
            status: 500,
            error: dashboardError.message,
        })
    }

    return createResponse({
        type: "success",
        payload: dashboards,
        status: 200
    })
}

export async function POST(req: Request) {
    const body = await req.json()

    const resultParsed = dashboardCreationSchema.safeParse(body)

    if (!resultParsed.success) {
        return createResponse({
            type: "failed",
            status: 500,
            error: resultParsed.error.formErrors.fieldErrors,
        })
    }

    const { name } = resultParsed.data

    const [errorUser, user] = await asyncTryCatch(() => getAuthUser())
    if (errorUser) {
        return createResponse({
            type: "failed",
            status: 500,
            error: errorUser.message,
        })
    }

    const { data: dashboard, error: createDashboardError } = await supabase.from("dashboard").insert({ name: name, created_by: user?.user.id }).select().limit(1).single()

    const { data: team, error: createTeamError } = await supabase.from("team").insert({ dashboard_id: dashboard?.id, user_id: user?.user.id }).select()


    if (createDashboardError || createTeamError) {
        return createResponse({
            type: "failed",
            status: 500,
            error: createDashboardError?.message || createTeamError?.message || "",
        })
    }

    return createResponse({
        type: "success",
        payload: { ...dashboard, team: team },
        status: 200
    })
}