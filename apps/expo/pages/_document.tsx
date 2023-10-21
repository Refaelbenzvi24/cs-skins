import {Html, Head, Main, NextScript} from 'next/document'
import type {NextComponentType, NextPageContext} from 'next'
import type {DocumentInitialProps, DocumentProps} from 'next/dist/shared/lib/utils'
import type {ThemeOptions} from "../../../packages/ui/src/nextjs/components/Theme/types"

const Document: NextComponentType<NextPageContext, DocumentInitialProps, DocumentProps & {
	__NEXT_DATA__: { props: { pageProps: { theme: ThemeOptions } } }
}> = (props) => {
	const {__lang, pageProps} = props.__NEXT_DATA__.props;
	const dir = __lang === 'he' ? 'rtl' : 'ltr';

	return (
		<Html
			dir={dir}
			lang={__lang}
			className={pageProps.theme === 'dark' ? 'dark' : ''}>
			<Head>
				<link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'/>
				<link href='https://fonts.googleapis.com/css?family=Heebo' rel='stylesheet'/>
			</Head>
			<body>
			<div id="portals-root"></div>
			<Main/>
			<NextScript/>
			</body>
		</Html>
	)
}


export default Document
