// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './function/db';
import { cookies } from 'next/headers';
import { authAccessSchema } from './schema/auth';
import createResponse from './function/create-response';

export async function middleware(req: NextRequest) {
    const cookiesStore = await cookies()

    const authAccessSchemaParsed = authAccessSchema.safeParse({
        refresh_token: cookiesStore.get("refresh_token")?.value,
        access_token: cookiesStore.get("access_token")?.value,
    })


    // If no token is found, redirect to the login page
    if (!authAccessSchemaParsed.success) {
        return createResponse({
            type: "failed",
            status: 500,
            error: authAccessSchemaParsed.error.formErrors,
        })
    }

    // Validate the token using Supabase
    const { data: user, error } = await supabase.auth.setSession({
        refresh_token: authAccessSchemaParsed.data.refresh_token,
        access_token: authAccessSchemaParsed.data.access_token,
    })


    // If token is invalid, redirect to the login page
    if (error || !user) {
        return NextResponse.redirect(new URL('/login', req.url), { status: 301 });
    }

    // Allow the request to continue if valid
    return NextResponse.next();
}

// Configure the middleware matcher
export const config = {
    matcher: [
        '/api/dashboard/:path*',
        '/api/invitation/:path*',
        '/api/locale/:path*',
        '/api/team/:path*',
        '/api/user/:path*',
    ],
};
