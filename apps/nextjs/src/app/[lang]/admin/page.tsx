"use client";
import MainComponent from "~/components/Admin/MainComponent"
import { api } from "~/utils/api"
import { Typography } from "@acme/ui"
import { useEffect } from "react"

const Page = () => {
	const {data} = api.skin.list.useQuery({

	});

	console.log(data)

	return (
		<div className="flex flex-col justify-center h-full gap-y-5 w-40">
			<Typography variant={'h2'}>
				Test
			</Typography>
			<MainComponent/>
		</div>
	)
}

export default Page
