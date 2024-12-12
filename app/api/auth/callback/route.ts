import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
    const urlSearchParam = new URLSearchParams(`?${req.nextUrl.hash.slice(1)}`)

    console.log('urlSearchParam.get("access_token") ', urlSearchParam.get("access_token"))
    const cookieStore = await cookies()

    cookieStore.set('access_token', urlSearchParam.get("access_token") || "", { httpOnly: true });
    cookieStore.set('refresh_token', urlSearchParam.get("refresh_token") || "", { httpOnly: true });

    return redirect("/")
}