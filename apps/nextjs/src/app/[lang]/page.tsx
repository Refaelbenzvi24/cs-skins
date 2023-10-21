/** @jsxImportSource @emotion/react */
"use client"
import tw from "twin.macro"
import { Button, Typography } from "@acme/ui"

const styles = {
	// Move long class sets out of jsx to keep it scannable
	container: ({ hasBackground }: { hasBackground: boolean }) => [
		tw`flex flex-col items-center justify-center h-screen`
	],
}

const App = () => (
	<div css={styles.container ({ hasBackground: true })}>
		<div className="flex flex-col justify-center h-full gap-y-5">
			<Button>
				<Typography variant={'body'}>
					Submit
				</Typography>
			</Button>
			<Button>
				<Typography variant={'body'}>
					Cancel
				</Typography>
			</Button>
			<Button>
				<Typography variant={'body'}>
					Close
				</Typography>
			</Button>
		</div>
	</div>
)

export default App
