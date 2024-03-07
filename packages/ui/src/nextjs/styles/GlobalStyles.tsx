import { Global } from "@emotion/react"
import tw, { css, theme } from "twin.macro"

import { default as uiTheme } from "../utils/theme"


// const customStyles = css ({
// 	body: {
// 		WebkitTapHighlightColor: theme`colors.purple.500`,
// 		...tw`antialiased`,
// 	}
// })

const GlobalStyles = () => (
	<>
		{/*<Global styles={customStyles}/>*/}
		<Global styles={css`
          html,
          body,
          #__next,
          #root {
            margin: 0;
            height: 100%;
          }

          html {
            overflow-x: hidden;
          }

          //body {
          //  transition: all 0.4s linear;
          //}

          :root {
            --toastify-color-light: ${uiTheme.colorScheme.light};
            --toastify-color-dark: ${uiTheme.colorScheme.overlaysDark};
            --toastify-text-color-light: ${uiTheme.colorScheme.body1};
            --toastify-text-color-dark: ${uiTheme.colorScheme.accent};
          }

          #app {
            height: 100%;
            margin: 0;
            padding: 0;
          }

          #nprogress {
            pointer-events: none;
          }

          #nprogress .bar {
            z-index: 1031;
            background: #4592ea;
          }

          /* Designing for scroll-bar */

          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          /* Track */

          ::-webkit-scrollbar-track {
            border-radius: 20px;
            background-color: #FAFCFE;
            transition: all 400ms linear;
          }

          .dark ::-webkit-scrollbar-track {
            background-color: #2A2A36;
            transition: all 400ms linear;
          }

          /* Handle */

          ::-webkit-scrollbar-thumb {
            background: #afafaf;
            border-radius: 60px;
          }

          /* Handle on hover */

          ::-webkit-scrollbar-thumb:hover {
            background: #d5d5d5;
          }

          #nprogress .bar {
            position: fixed;
            z-index: 1031;
            top: 0;
            left: 0;

            width: 100%;
            height: 4px;
          }

          * {
            font-family: 'Work Sans', 'Heebo', sans-serif;
          }
		`}/>
	</>
)

export default GlobalStyles
