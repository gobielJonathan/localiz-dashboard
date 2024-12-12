import createResponse from "@/function/create-response"
import { supabase } from "@/function/db"
import isInTeam from "@/middleware/is-in-team"
import getAuthUser from "@/repository/auth/get-auth-user"
import { localeSchema } from "@/schema/locale"

export function GET() {
    return Response.json({
        data: []
    })
}

export async function POST(req: Request) {
    const body = await req.json()

    const localeSchemaParsed = localeSchema.safeParse(body)
    if (localeSchemaParsed.error) {
        return createResponse({
            type: "failed",
            error: localeSchemaParsed.error.formErrors,
            status: 500
        })
    }

    const { dashboard_id, locale } = localeSchemaParsed.data

    const [hasInTeam, user] = await isInTeam(Number(dashboard_id))
    if (hasInTeam) {
        return createResponse({
            type: "failed",
            error: "Please invite your account to dashboard",
            status: 401
        })
    }

    const localeInsertResponse = await supabase.from("locale").insert({ dashboard_id: dashboard_id, locale: locale, created_by: user?.id }).select()

    if (localeInsertResponse.error) {
        return createResponse({
            type: "failed",
            error: localeInsertResponse.error.message,
            status: localeInsertResponse.status
        })
    }

    return createResponse({
        type: "success",
        payload: localeInsertResponse.data,
        status: 200
    })
}