import { NextResponse } from 'next/server'
import type { MiddlewareFactory } from "~/middleware/stackHandler"
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from "~/app/i18n/settings"
export const withLanguage: MiddlewareFactory = (_next) => (request) => {
	if (request.nextUrl.pathname.indexOf('icon') > -1 || request.nextUrl.pathname.indexOf('chrome') > -1) return NextResponse.next()
	let lng: string | null | undefined
	if (request.cookies.has(cookieName)) lng = acceptLanguage.get(request.cookies.get(cookieName)!.value)
	if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
	if (!lng) lng = fallbackLng

	if (
		!languages.some(loc => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
		!request.nextUrl.pathname.startsWith('/_next')
	) {
		return NextResponse.redirect(new URL(`/${lng}${request.nextUrl.pathname}`, request.url))
	}

	if (request.headers.has('referer')) {
		const refererUrl = new URL(request.headers.get('referer')!)
		const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
		const response = NextResponse.next()
		if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
		return response
	}

	return NextResponse.next()
}
