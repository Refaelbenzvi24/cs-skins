/** @jsxImportSource @emotion/react */
"use client"
import "@fontsource/work-sans/400.css"
import "@fontsource/work-sans/500.css"
import "@fontsource/work-sans/700.css"
import "../../../../packages/ui/src/nextjs/styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import tw from "twin.macro"
import { Button } from "@acme/ui"
import { ReactElement } from "react"

const styles = {
	// Move long class sets out of jsx to keep it scannable
	container: ({ hasBackground }: {
		hasBackground: boolean
	}) => [
		tw`flex flex-col items-center justify-center h-screen`
	],
}

const App = (props: {children: ReactElement}) => {
	console.log (props)
	return (
		<div css={styles.container ({ hasBackground: true })}>
			<div tw="flex flex-col justify-center h-full gap-y-5">
				<Button>Submit</Button>
				<Button>Cancel</Button>
				<Button>Close</Button>

				{props.children}
			</div>
		</div>
	)
}

export default App
