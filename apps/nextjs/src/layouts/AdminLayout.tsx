import {Main} from "@acme/ui";
import AdminAppBar from "~/components/Admin/AdminAppBar";

export interface AdminLayoutProps {
	children: React.ReactNode
	adminAppBarProps?: React.ComponentProps<typeof AdminAppBar>
}

const AdminLayout = ({children, adminAppBarProps}: AdminLayoutProps) => {
	return (
		<div className="h-full">
			<AdminAppBar removeSettingsButton {...adminAppBarProps}/>

			<Main>
				{children}
			</Main>
		</div>
	)
}

export default AdminLayout
