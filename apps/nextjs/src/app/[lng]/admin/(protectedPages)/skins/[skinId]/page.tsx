import { redirect } from "next/navigation"
import { trpcRsc } from "~/utils/apiServer"
import { getTranslation } from "~/app/i18n"
import { auth } from "@acme/auth"
import type { GenerateMetadataWithLocaleProps } from "~/types"


interface AdminPageProps {
	params: { lng: string, skinId: string }
}

const Page = async ({ params: { lng, skinId } }: AdminPageProps) => {
	const session = await auth ();
	// TODO: refactor all redirect to be with return
	if (!session) return redirect (`/${lng}/admin/login`)
	return redirect(`/${lng}/admin/skins/${skinId}/table`)
}

export default Page
