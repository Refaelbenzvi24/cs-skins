import type { MiddlewareFactory } from "~/middleware/stackHandler"
import { NextResponse } from "next/server"

export const withPathname: MiddlewareFactory = (_next) => (request, _next) => {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-pathname", request.nextUrl.pathname);

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}
