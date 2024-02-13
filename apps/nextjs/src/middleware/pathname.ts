import type { MiddlewareFactory } from "~/middleware/stackHandler"
import { NextResponse } from "next/server"


export const withPathname: MiddlewareFactory = (_next) => (request, _next) => {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-pathname", request.nextUrl.pathname);
	requestHeaders.set("x-search-params", request.nextUrl.searchParams.toString());

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		}
	});
}
