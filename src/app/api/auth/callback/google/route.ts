use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from 'next/navigation';
import { getUserProfile } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const profile = await getUserProfile(code);

    if (!profile) {
      return NextResponse.json({ error: "Failed to get user profile" }, { status: 500 });
    }

    // Set the user information in a cookie
    cookies().set("user", JSON.stringify(profile));

    // Redirect the user to the home page or desired route
    redirect('/');

    // Return a NextResponse (though the redirect will handle navigation)
    return NextResponse.redirect(new URL('/', request.url));

  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
