"use client";
import { useState } from "react"
import { Button, Icon, LinkButton, Row, Tooltip, Typography, } from "@acme/ui"
import SimpleSideBar from "@acme/ui/src/nextjs/components/SideBar/SimpleSideBar"
import type { ComponentWithLocaleProps } from "~/types"
import { useTranslation } from "~/app/i18n/client"
import { AnimatePresence, motion } from "framer-motion"
import _ from "lodash"


interface SideBarProps extends ComponentWithLocaleProps {

}

const sideBarOptions = [
	{
		href:                  "/",
		icon:                  <IconCarbonDashboard/>,
		displayTranslationKey: "admin:dashboard",
	},
	{
		href:                  "/skins-data",
		icon:                  <IconCarbonDb2Database/>,
		displayTranslationKey: "admin:skinsData",
	},
	{
		href:                  "/sources",
		icon:                  <IconCarbonLink/>,
		displayTranslationKey: "admin:sources",
	},
	{
		href:                  "/weapons",
		icon:                  <IconGameIconsWinchesterRifle/>,
		displayTranslationKey: "admin:weapons",
	},
	{
		href:                  "/skins",
		icon:                  <IconAntDesignSkinOutlined/>,
		displayTranslationKey: "admin:skins",
	},
	{
		href:                  "/qualities",
		icon:                  <IconCarbonSkillLevel/>,
		displayTranslationKey: "admin:qualities",
	},
	{
		href:                  "/users",
		icon:                  <IconCarbonUserAvatar/>,
		displayTranslationKey: "admin:users",
	},
] as const

const SideBar = (props: SideBarProps) => {
	const [sideBarState, setSideBarState] = useState(false)

	const { t, i18n } = useTranslation(props.lng, ["common", "admin"])
	const dir         = i18n.dir(props.lng)

	return (
		<SimpleSideBar className="flex flex-col px-2 pt-4 space-y-4"
		               value={sideBarState}>
			<Row className="justify-end">
				<Tooltip wrapperClassName="flex justify-end w-full"
				         offsetX={20}
				         placement={dir === "ltr" ? "center-right" : "center-left"}
				         tooltip={sideBarState ? t("common:close") : t("common:open")}>
					<Button onClick={() => setSideBarState(!sideBarState)}
					        height={60}
					        width="fit-content"
					        color={"colorScheme.header2"}
					        colorDark={"colorScheme.white"}
					        colorsForStates={"white"}
					        colorsForStatesDark={"overlaysDark2"}>
						<Icon
							className="ltr:rotate-180 rtl:rotate-0"
							animate={{
								rotate:     dir === "ltr" ? (sideBarState ? 0 : 180) : (sideBarState ? 180 : 0),
								transition: {
									duration: 0.5,
									type:     "spring",
								}
							}}
							size={24}>
							<IconCarbonChevronLeft/>
						</Icon>
					</Button>
				</Tooltip>
			</Row>

			{sideBarOptions.map((option) => (
				<Tooltip wrapperClassName="w-full"
				         hideTooltip={sideBarState}
				         offsetX={20}
				         placement={dir === "ltr" ? "center-right" : "center-left"}
				         key={option.href}
				         tooltip={t(option.displayTranslationKey)}>
					<LinkButton className="overflow-x-hidden"
					            href={`/${props.lng}/admin${option.href}`}
					            width="100%"
					            height={60}
					            color={"colorScheme.header2"}
					            colorDark={"colorScheme.white"}
					            colorsForStates={"light"}
					            colorsForStatesDark={"overlaysDark2"}>
						<Row className="h-full items-center">
							<Icon size={20}>
								{option.icon}
							</Icon>
							<motion.div
								className="ltr:ml-5 rtl:mr-5">
								<AnimatePresence initial={false}>
									{sideBarState && (
										<motion.div initial={{ opacity: 0, x: dir === "ltr" ? 50 : -50 }}
										            animate={{ opacity: 1, x: 0 }}
										            exit={{ opacity: 0, x: dir === "ltr" ? 50 : -50 }}
										            transition={{ duration: 0.5 }}>
											<Typography className="overflow-hidden whitespace-nowrap"
											            variant={"body"}
											            color={"colorScheme.header2"}
											            colorDark={"colorScheme.white"}>
												{t(option.displayTranslationKey)}
											</Typography>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						</Row>
					</LinkButton>
				</Tooltip>
			))}
		</SimpleSideBar>
	)
}

export default SideBar
