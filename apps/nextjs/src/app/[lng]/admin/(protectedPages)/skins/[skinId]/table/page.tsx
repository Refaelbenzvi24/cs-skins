import { trpcRsc } from "~/trpc/apiServer"
import SkinIdWithDataTable from "./_components/SkinIdWithDataTable"
import { auth } from "@acme/auth"
import { redirect } from "next/navigation"
import moment from "moment/moment"
import managedRsc from "~/components/managedRsc"


interface AdminPageProps {
	params: { lng: string, skinId: string }
	searchParams: { search?: string, startDate?: string, endDate?: string };
}

const Page = managedRsc(async ({ params: { lng, skinId }, searchParams: { startDate, endDate, ...searchParams } }: AdminPageProps) => {
	const session = await auth();
	if(!session) return redirect(`/${lng}/admin/login`)
	const skinData = await trpcRsc.skin.getByIdWithData({
		skinId,
		limit:     20,
		search:    searchParams.search,
		dateRange: {
			start: startDate ? moment(startDate).toDate() : undefined,
			end:   endDate ? moment(endDate).toDate() : undefined
		}
	})

	return (
		<SkinIdWithDataTable lng={lng} initialData={skinData} searchQuery={searchParams.search} skinId={skinId}/>
	)
})

export default Page
