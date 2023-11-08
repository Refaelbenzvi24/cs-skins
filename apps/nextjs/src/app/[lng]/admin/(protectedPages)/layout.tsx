import AdminAppBar from "~/components/Admin/AdminAppBar"
import { Main } from "@acme/ui"
import type { LayoutWithLocaleProps } from "~/types"
import SideBar from "~/components/layouts/SideBar"


const Layout = (props: LayoutWithLocaleProps) => {
	return (
		<div className="h-full">
			<AdminAppBar lng={props.params.lng}/>
			<SideBar lng={props.params.lng}/>

			<Main>
				{props.children}
			</Main>
		</div>
	);
}

export default Layout
