import { supabase } from "@/function/db";
import { asyncTryCatch } from "@/utils/try-catch";

export default async function getDetailDashboard(id: number) {
    return asyncTryCatch(async () => {
        const dashboardResponse = await supabase.from("dashboard").select(`
            id, name,
            locale ( id , locale, dashboard_id, locale_content ( id, key , content ) )
        `)
            .eq("id", id)
            .single()

        if (dashboardResponse.error) {
            throw Error(dashboardResponse.error.message)
        }
        return dashboardResponse.data
    })
}