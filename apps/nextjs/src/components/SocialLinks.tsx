import IconIcBaselineFacebook from "~icons/ic/baselineFacebook"
import IconIcBaselineWhatsapp from "~icons/ic/baselineWhatsapp"
import IconMdiInstagram from "~icons/mdi/instagram"
import IconIcBaselineTiktok from "~icons/ic/baselineTiktok"
import IconIcOutlineEmail from "~icons/ic/outlineEmail"
import clsx from "clsx";

import { ATagButton, Row } from "@acme/ui";
import { type ButtonProps } from "@acme/ui/src/nextjs/components/Buttons/Button";
import { ComponentProps } from "react";


interface SocialLinksProps extends Partial<ComponentProps<typeof Row>> {
	linksProps?: ButtonProps
}

const SocialLinks = (props: SocialLinksProps) => {
	const { className, linksProps, ...restProps } = props

	return (
		<Row
			{...restProps}
			className={`space-s-1.5 ${clsx(className)}`}>
			<ATagButton
				text
				icon
				size={'24px'}
				aria-label="facebook link"
				{...linksProps}>
				<IconIcBaselineFacebook/>
			</ATagButton>

			<ATagButton
				text
				icon
				size={'24px'}
				aria-label="whatsapp link"
				{...linksProps}>
				<IconIcBaselineWhatsapp/>
			</ATagButton>

			<ATagButton
				text
				icon
				size={'24px'}
				aria-label="instagram link"
				{...linksProps}>
				<IconMdiInstagram/>
			</ATagButton>

			<ATagButton
				text
				icon
				size={'24px'}
				aria-label="tiktok link"
				{...linksProps}>
				<IconIcBaselineTiktok/>
			</ATagButton>

			<ATagButton
				text
				icon
				size={'24px'}
				aria-label="email link"
				{...linksProps}>
				<IconIcOutlineEmail/>
			</ATagButton>
		</Row>
	)
}

export default SocialLinks
