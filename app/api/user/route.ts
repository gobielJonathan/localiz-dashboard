import createResponse from "@/function/create-response";
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

    return createResponse({
        type: "success",
        payload: {
            email: user?.user.email,
            id: user?.user.id
        },
        status: 200
    })
}