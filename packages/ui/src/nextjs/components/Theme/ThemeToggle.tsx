"use client";
import { useTheme } from "../../index";
import IconCarbonLight from "~icons/carbon/light"
import IconCarbonMoon from "~icons/carbon/moon"
import Button from "../Buttons/Button";
import clsx from "clsx";
import { ComponentProps } from "react";
import { css } from "@emotion/css"
import tw from "twin.macro"
import { withTheme } from "@emotion/react"


const ThemeToggle = (props: ComponentProps<typeof Button>) => {
	const { className, ...restProps } = props

	const { theme, toggleTheme } = useTheme ()

	return (
		<Button
			text
			noPadding
			size={"22px"}
			className={`${css`
              ${tw`p-[10px]`};
			`} ${clsx (className)}`}
			{...restProps}
			aria-label="theme"
			id="theme-toggle-button"
			onClick={toggleTheme}>
			{theme === "dark" && <IconCarbonMoon/>}
			{theme === "light" && <IconCarbonLight/>}
		</Button>
	)
}

export default withTheme(ThemeToggle)
