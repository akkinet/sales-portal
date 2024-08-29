import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { authOptions } from "./app/utils/authOptions";

export async function middleware(req) {
  console.log("Request Method:", req.method);
  // console.log('Request URL:', req.url);
  console.log("Request Query:", req.query);
  const parsedURL = new URL(req.url);
  console.log("Request pathname:", parsedURL.pathname);
  const domain = req.headers.get("host");
  const protocol = req.nextUrl.protocol;
  const response = NextResponse.next();
  response.headers.set("x-domain", domain);
  response.headers.set("x-protocol", protocol);
  response.headers.set("x-hostname", `${protocol}//${domain}`);
  // if (parsedURL.pathname.startsWith("/api")) {
  //   const session = await getSession(authOptions);
  //   if (!session) return NextResponse.redirect(new URL("/login", req.url));
  // }
  return response;
}

export const config = {
  matcher: [
    // "/invoice",
    // "/load-db/:path*",
    // "/package",
    // "/payment",
    // "/prices/:path*",
    // "/products/:path*",
    // "/stripe",
    // "/suits",
    "/:path*",
  ],
};
