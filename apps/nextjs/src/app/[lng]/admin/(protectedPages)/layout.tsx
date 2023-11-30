import AdminAppBar from "~/components/Admin/AdminAppBar"
import { Main } from "@acme/ui"
import type { LayoutWithLocaleProps } from "~/types"
import SideBar from "~/components/layouts/SideBar"
import { auth } from "@acme/auth"
import { redirect } from "next/navigation"


const Layout = async (props: LayoutWithLocaleProps) => {
	const session = await auth ();
	if (!session) redirect (`/${props.params.lng}/admin/login`)

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
