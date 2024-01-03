import { withPathname } from "~/middleware/pathname"
import { withLanguage } from "~/middleware/language"
import { stackMiddlewares } from "~/middleware/stackHandler"
import acceptLanguage from 'accept-language'


// TODO: move to settings
const languages = ['en', 'he']

acceptLanguage.languages(languages)

export const middlewares = [
	withPathname,
	withLanguage,
]

export default stackMiddlewares(middlewares)

export const config = {
	// matcher: '/:lng*'
	matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
}

