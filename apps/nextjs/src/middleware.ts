import { createI18nMiddleware } from "next-international/middleware";
import type { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware ({
	locales:       ["en", "he"],
	defaultLocale: "en"
});

export function middleware(request: NextRequest) {
	return I18nMiddleware (request);
}

export const config = {
	// matcher: '/:lng*'
	matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"]
}

