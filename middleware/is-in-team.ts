import { User } from "@supabase/supabase-js";
import { supabase } from "@/function/db";
import getAuthUser from "@/repository/auth/get-auth-user";
import { asyncTryCatch } from "@/utils/try-catch";

export default async function isInTeam(dashboardId: number): Promise<[boolean, User | undefined]> {
    const [error, user] = await asyncTryCatch(() => getAuthUser())

    if (error) {
        return [false, user?.user]
    }

    const isIncludedInTeam = await supabase.from("team").select("id").eq('dashboard_id', dashboardId).eq("user_id", user?.user.id || "")
    if (isIncludedInTeam.count === 0) {
        return [false, user?.user]
    }

    return [true, user?.user]
}