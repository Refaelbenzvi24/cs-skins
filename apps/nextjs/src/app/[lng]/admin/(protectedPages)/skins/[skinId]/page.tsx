import { redirect } from "next/navigation"
import { auth } from "@acme/auth"


interface AdminPageProps {
	params: { lng: string, skinId: string }
}

const Page = async ({ params: { lng, skinId } }: AdminPageProps) => {
	const session = await auth();
	if(!session) return redirect(`/${lng}/admin/login`)
	return redirect(`/${lng}/admin/skins/${skinId}/table`)
}

export default Page
