import { supabase } from "@/function/db"
import { cookies } from "next/headers"

export default async function getAuthUser() {
    const cookiesStore = await cookies()
    const { data: user, error } = await supabase.auth.getUser(cookiesStore.get("access_token")?.value)
    if(error) throw error
    return user
}