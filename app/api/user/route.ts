import createResponse from "@/function/create-response";
import { supabase } from "@/function/db";
import getAuthUser from "@/repository/auth/get-auth-user";
import { asyncTryCatch } from "@/utils/try-catch";

export async function GET(_req: Request) {
    const [error, user] = await asyncTryCatch(() => getAuthUser())

    if (error) {
        return createResponse({
            type: "failed",
            error: error.message,
            status: 500
        })
    }

    const  teams = await supabase.from("team").select("id, dashboard ( id , name ) ").eq("user_id", user?.user.id || "")
    
    return createResponse({
        type: "success",
        payload: {
            email: user?.user.email,
            id: user?.user.id,
            teams: teams.data
        },
        status: 200
    })
}