import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'he'];

export default createIntlMiddleware({
	locales,
	defaultLocale: 'en'
});

export const config = {
	// Skip all paths that should not be internationalized
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
