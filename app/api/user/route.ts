import createResponse from "../(functions)/create-response"
import { supabase } from "../(functions)/db"

export async function GET() {
    const users = await supabase.from("user").select()
    return Response.json(createResponse({
        type : "success",
        status : 200,
         payload: users.data
    }))
}

export function POST() {
    return Response.json({
        data: []
    })
}