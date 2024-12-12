import { supabase } from "@/function/db";
import { asyncTryCatch } from "@/utils/try-catch";

export default async function getUserDashboard(userId: string) {
    return asyncTryCatch(async () => {
        const dashboardResponse = await supabase.from("dashboard").select(`
            id, name,
            locale ( id , locale, dashboard_id, locale_content ( id, key , content ) )
        `)
            .eq("created_by", userId)

        if (dashboardResponse.error) {
            throw Error(dashboardResponse.error.message)
        }
        return dashboardResponse.data
    })
}