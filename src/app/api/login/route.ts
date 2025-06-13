export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

// sha-256
const PASSWORD_HASH =
  "9e0fa0f7b2427321e44fac2c2f586f70cee9c0349362b56ccf053c52c991908f";

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");
  if (session?.value === "loggedin") {
    return NextResponse.json({ loggedIn: true });
  }
  return NextResponse.json({ loggedIn: false }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const hash = await hashPassword(password);

  if (hash === PASSWORD_HASH) {
    const response = NextResponse.json({ success: true });

    // session lasts a day
    response.cookies.set("session", "loggedin", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
