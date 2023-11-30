"use client";
import { Tab, Tabs, Typography } from "@acme/ui"
import { useTranslation } from "~/app/i18n/client"
import { useSearchParams } from "next/navigation"

interface SkinDataTabsProps {
	skinId: string
	lng: string
	initialActiveTab?: string
}

const SkinDataTabs = ({ skinId, lng, initialActiveTab }: SkinDataTabsProps) => {
	const {t} = useTranslation(lng, ["common", "admin"])
	const searchParams = useSearchParams()

	return (
		<Tabs className="max-w-[280px] min-h-[50px] min-w-[280px]"
		      initialActiveTab={initialActiveTab}>
			<Tab className="justify-center items-center" href={`/${lng}/admin/skins/${skinId}/table${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
			     key="table">
				<Typography className="text-center" variant={"body"}>
					{t ("admin:skins.skinId.tabs.table")}
				</Typography>
			</Tab>

			<Tab className="justify-center items-center" href={`/${lng}/admin/skins/${skinId}/graphs${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
			     key="graphs">
				<Typography className="text-center" variant={"body"}>
					{t ("admin:skins.skinId.tabs.charts")}
				</Typography>
			</Tab>
		</Tabs>
	)
}

export default SkinDataTabs
