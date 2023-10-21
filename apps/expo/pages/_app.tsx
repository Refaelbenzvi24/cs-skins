import '@fontsource/work-sans/400.css'
import '@fontsource/work-sans/500.css'
import '@fontsource/work-sans/700.css'
import "../../../packages/ui/src/nextjs/styles/globals.css"
import 'react-toastify/dist/ReactToastify.css'
import type {Session} from "next-auth"
import {SessionProvider} from "next-auth/react"
import type {AppContextType} from "next/dist/shared/lib/utils"

import {api} from "../../nextjs/src/utils/api"
import {MainProvider, ThemeProvider} from "../../../packages/ui"
import {getCookie} from "cookies-next"
import type {ThemeOptions} from "../../../packages/ui/src/nextjs/components/Theme/types"
import ToastifyContainer from "../../nextjs/src/components/ToastifyContainer"
import type {NextComponentType, NextPage} from "next";
import type {ReactNode} from "react";
import type {AppInitialProps, NextPageContext} from "next/dist/shared/lib/utils";
import type {NextRouter} from "next/dist/shared/lib/router/router";

const getInitialProps = ({ctx}: AppContextType) => {
	const defaultTheme = 'light' as const
	const theme = (getCookie('theme', ctx) as ThemeOptions | undefined | null) || defaultTheme

	return {pageProps: {theme, defaultTheme}}
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactNode) => ReactNode
	getTransition?: (page: ReactNode) => ReactNode
}

export declare type AppPropsType<Router extends NextRouter = NextRouter, PageProps = {}> = AppInitialProps<PageProps> & {
	Component: NextComponentType<NextPageContext, any, any> & NextPageWithLayout
	router: Router;
	__N_SSG?: boolean;
	__N_SSP?: boolean;
}

export type AppType<P = object> = NextComponentType<AppContextType, P, AppPropsType<any, P>>

const MyApp: AppType<{ session: Session | null } & ReturnType<typeof getInitialProps>['pageProps']> = (props) => {
	const {
		Component,
		pageProps: {
			session,
			theme,
			defaultTheme,
			...pageProps
		}
	} = props

	const getLayout = Component.getLayout ?? ((page) => page)
	const getTransition = Component.getTransition ?? ((page) => page)

	return (
		<div className="h-full">
			<ThemeProvider
				initialTheme={theme}
				defaultTheme={defaultTheme}>
				<MainProvider defaults={{isAnimationsActive: false}}>
					<SessionProvider session={session}>
						<ToastifyContainer/>
						{getLayout(getTransition(
							<Component {...pageProps} />
						))}
					</SessionProvider>
				</MainProvider>
			</ThemeProvider>
		</div>
	)
}

MyApp.getInitialProps = getInitialProps as unknown as typeof MyApp['getInitialProps']

export default api.withTRPC(MyApp);
