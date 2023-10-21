"use client";
import { Button, Typography } from "@acme/ui"

const MainComponent = () => {
	return (
	<>
		<Button>
			<Typography variant={"body"}>
				Submit
			</Typography>
		</Button>
		<Button>
			<Typography variant={"body"}>
				Cancel
			</Typography>
		</Button>
		<Button>
			<Typography variant={"body"}>
				Close
			</Typography>
		</Button>
	</>
  );
}

export default MainComponent
