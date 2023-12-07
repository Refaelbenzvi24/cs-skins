import { trpcRsc } from "~/utils/apiServer"
import NotFound from "~/app/[lng]/not-found"
import SkinIdWithDataTable from "./_components/SkinIdWithDataTable"
import { auth } from "@acme/auth"
import { redirect } from "next/navigation"
import moment from "moment/moment"


interface AdminPageProps {
	params: { lng: string, skinId: string }
	searchParams: { search?: string, startDate?: string, endDate?: string };
}

const Page = async ({ params: { lng, skinId }, searchParams: { startDate, endDate, ...searchParams } }: AdminPageProps) => {
	const session = await auth();
	// TODO: refactor all redirect to be with return
	if(!session) return redirect(`/${lng}/admin/login`)
	console.log({ startDate, endDate })
	const skinData = await trpcRsc.skin.getByIdWithData.fetch({
		skinId,
		limit:     20,
		search:    searchParams.search,
		dateRange: {
			start: startDate ? moment(startDate).toDate() : undefined,
			end:   endDate ? moment(endDate).toDate() : undefined
		}
	})
	const skin     = await trpcRsc.skin.getById.fetch(skinId)

	if(!skin) return NotFound()

	return (
		<SkinIdWithDataTable lng={lng} initialData={skinData} searchQuery={searchParams.search} skinId={skinId}/>
	)
}

export default Page
