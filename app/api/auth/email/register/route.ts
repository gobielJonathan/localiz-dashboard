import createResponse from "@/function/create-response";
import { supabase } from "@/function/db";
import { registerSchema } from "@/schema/auth";
import decrypt from "@/utils/decrypt";
import tryCatch from "@/utils/try-catch";

export async function POST(req: Request) {
    const body = await req.json()
    const resultParsed = registerSchema.safeParse(body)

    if (!resultParsed.success) {
        return createResponse({
            type: "failed",
            status: 500,
            error: resultParsed.error.formErrors.fieldErrors,
        })
    }

    const { email, password: encryptedPassword, phone } = resultParsed.data

    //try to decrypt the password first
    const [errorDecryptPassword, password] = tryCatch(() => decrypt(encryptedPassword))
    if (errorDecryptPassword) {
        return createResponse({
            type: "failed",
            status: 500,
            error: errorDecryptPassword.message,
        })
    }

    if (!password) return

    const { data, error: registerError } = await supabase.auth.signUp({
        email: email,
        password: password,
        phone: phone
    })

    if (registerError) {
        return createResponse({
            type: "failed",
            status: 500,
            error: registerError.message,
        })
    }

    return createResponse({
        type: "success",
        payload: {
            email: data.user?.email, phone: data.user?.phone
        },
        status: 200,
    })
}