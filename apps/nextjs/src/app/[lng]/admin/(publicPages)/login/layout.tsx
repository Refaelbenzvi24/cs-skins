"use client";
import AdminAppBar from "~/components/Admin/AdminAppBar"
import { Main } from "@acme/ui"
import type { LayoutWithLocaleProps } from "~/types"


const Layout = ({ children, params: { lng } }: LayoutWithLocaleProps) => {
	return (
		<div className="h-full">
			<AdminAppBar lng={lng} removeSettingsButton={true} removeLogoutButton={true}/>
			<Main>
				{children}
			</Main>
		</div>
	);
}

export default Layout
