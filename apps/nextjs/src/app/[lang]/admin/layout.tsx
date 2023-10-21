"use client";
import AdminAppBar from "~/components/Admin/Login/AdminAppBar"
import { Main } from "@acme/ui"

export default function Layout(props: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-full">
			<AdminAppBar/>
			<Main>
				{props.children}
			</Main>
		</div>
	);
}
