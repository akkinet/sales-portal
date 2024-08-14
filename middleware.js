import { NextResponse } from 'next/server';

export function middleware(request) {
  const domain = request.headers.get('host');
  const protocol = request.nextUrl.protocol;
  const response = NextResponse.next();
  response.headers.set('x-domain', domain);
  response.headers.set('x-protocol', protocol);
  response.headers.set('x-hostname', `${protocol}//${domain}`);
  return response;
}
