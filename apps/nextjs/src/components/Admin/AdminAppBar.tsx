"use client";
import type { ComponentProps } from "react";
import React, { useState } from "react";
import { AppBar, Modal, Row, ThemeToggle, Tooltip } from "@acme/ui";
import LanguageSelector from "~/components/LanguageSelector";
import clsx from "clsx";
import Button from "@acme/ui/src/nextjs/components/Buttons/Button";
import { signOut } from "next-auth/react";
import IconCarbonLogout from "~icons/carbon/logout"
import IconCarbonSettings from "~icons/carbon/settings"
import Settings from "~/components/Admin/Settings";
import { useTranslation } from "~/app/i18n/client"
import { useRouter } from "next/navigation"
import type { ComponentWithLocaleProps } from "~/types"


export interface AdminAppBarProps extends Partial<ComponentProps<typeof AppBar>>, ComponentWithLocaleProps {
	removeLogoutButton?: boolean
	removeSettingsButton?: boolean
}


const AdminAppBar = (props: AdminAppBarProps) => {
	const {
		className,
		removeLogoutButton = false,
		removeSettingsButton = false,
		lng,
		...restProps
	} = props

	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean> (false)

	const router = useRouter ()
	const { t } = useTranslation (lng, ["common"])

	const handleLogout = async () => {
		await signOut ({ redirect: false })
		router.push (`/${lng}/admin/login`)
	}

	const openSettings = () => {
		setIsSettingsModalOpen (true)
	}

	return (
		<>
			<Modal
				className="my-10"
				height={"100%"}
				width={"500px"}
				isOpen={isSettingsModalOpen}
				centered
				onBackdropClick={() => setIsSettingsModalOpen (false)}>
				<Settings onBackButtonClick={() => setIsSettingsModalOpen (false)}/>
			</Modal>

			<AppBar
				{...restProps}
				className={`justify-between px-16 max-[700px]:pl-8 max-[700px]:pr-4 ${clsx (className)}`}>
				<Row className="items-center">
					{/*<Image src={"/Logo.svg"} alt={'logo'} width={38} height={45}/>*/}
				</Row>

				<Row className="space-s-2">
					<Row className="ltr:pl-2 rtl:pr-2">
						{!removeSettingsButton && (
							<Tooltip tooltip={t ("common:settings")}
							         color={"colorScheme.overlaysDark"}
							         placement="bottom-center">
								<Button
									text
									noPadding
									size={"22px"}
									className="p-[10px]"
									aria-label="setting"
									id="setting-button"
									onClick={openSettings}>
									<IconCarbonSettings/>
								</Button>
							</Tooltip>
						)}

						<Tooltip tooltip={t ("common:language")}
						         color={"colorScheme.overlaysDark"}
						         placement="bottom-center">
							<LanguageSelector/>
						</Tooltip>

						<Tooltip tooltip={t ("common:theme")}
						         color={"colorScheme.overlaysDark"}
						         placement="bottom-center">
							<ThemeToggle/>
						</Tooltip>

						{!removeLogoutButton && (
							<Tooltip tooltip={t ("common:logout")}
							         color={"colorScheme.overlaysDark"}
							         placement="bottom-center">
								<Button
									text
									noPadding
									size={"22px"}
									className="p-[10px]"
									aria-label="logout"
									id="logout-button"
									onClick={handleLogout}>
									<IconCarbonLogout/>
								</Button>
							</Tooltip>
						)}
					</Row>
				</Row>
			</AppBar>
		</>
	)
}

export default AdminAppBar
