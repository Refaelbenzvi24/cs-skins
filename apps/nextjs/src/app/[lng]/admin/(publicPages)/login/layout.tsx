"use client";
import AdminAppBar from "~/components/Admin/AdminAppBar"
import { Main } from "@acme/ui"
import type { ReactNode } from "react"

const Layout = (props: { children: ReactNode }) => {
	return (
		<div className="h-full">
			<AdminAppBar removeSettingsButton={true} removeLogoutButton={true}/>
			<Main>
				{props.children}
			</Main>
		</div>
	);
}

export default Layout
