"use client";
import { css } from "@emotion/css"
import clsx from "clsx"
import type { HTMLMotionProps } from "framer-motion"
import { AnimatePresence } from "framer-motion"

import Backdrop from "../Backdrop/Backdrop"
import Card from "../Cards/Card"
import Portal from "../Portal/Portal"
import theme from "../../utils/theme"
import { useMain } from "../../index";
import { useEffect } from "react";
import ModalWrapper from "./ModalWrapper"
import { withTheme } from "@emotion/react"


export interface ModalWrapperProps {
	centered?: boolean
	showAppBar?: boolean
	appBarHeight?: number
	isAppBarActive?: boolean
}

export interface ModalProps {
	isOpen: boolean
	height?: string
	width?: string
	onBackdropClick?: () => void
	animation?: "left" | "right" | "up" | "down" | "none" | "fade"
	fullScreen?: boolean
	noBackdrop?: boolean
	removeBackdropBackground?: boolean
	animationDuration?: number
}

const Modal = (props: ModalProps & Omit<ModalWrapperProps, "appBarHeight" | "isAppBarActive"> & HTMLMotionProps<"div">) => {
	const {
		      children, className,
		      noBackdrop, fullScreen,
		      isOpen, removeBackdropBackground,
		      height            = "200px",
		      width             = "200px",
		      onBackdropClick   = () => "",
		      centered          = false,
		      animation         = "fade",
		      animationDuration = 0.3,
		      showAppBar        = false,
		      ...restProps
	      }                           = props
	const { appBarState, appBarOpts } = useMain()

	useEffect(() => {
		const initialModals = document.querySelectorAll(".modal-wrapper")
		const closeOnEscape = (e: KeyboardEvent) => {
			const currentModals = document.querySelectorAll(".modal-wrapper")

			if(e.key === "Escape" && currentModals.length <= initialModals.length) onBackdropClick?.()
		}

		document.addEventListener("keydown", closeOnEscape)

		return () => {
			document.removeEventListener("keydown", closeOnEscape)
		}
	}, [onBackdropClick])

	return (
		<AnimatePresence>
			{isOpen && (
				<Portal>
					<ModalWrapper
						className="modal-wrapper"
						showAppBar={showAppBar}
						appBarHeight={appBarOpts.height}
						isAppBarActive={appBarState}
						initial={animation === "none" ? {} :
							animation === "fade" ?
								{
									opacity: 0
								} : {
									translateY: animation === "up" ? "100%" : animation === "down" ? "-100%" : "0",
									translateX: animation === "left" ? "-100%" : animation === "right" ? "100%" : "0",
								}
						}
						transition={animation === "none" ? {} :
							{
								duration: animationDuration,
							}
						}
						animate={animation === "none" ? {} :
							animation === "fade" ?
								{
									opacity: 1
								} : {
									translateY: "0%",
									translateX: "0%",
								}}
						exit={animation === "none" ? {} :
							animation === "fade" ? {
									opacity: 0
								}
								:
								{
									translateY: animation === "up" ? "100%" : animation === "down" ? "-100%" : "0",
									translateX: animation === "left" ? "-100%" : animation === "right" ? "100%" : "0",
								}}
						{...{ centered }}>
						{!noBackdrop && (
							<Backdrop onClick={onBackdropClick}
							          noBackground={removeBackdropBackground}
							          active/>
						)}
						<div className="flex flex-col h-full w-full relative justify-center items-center">
							<Card {...restProps}
							      noPadding
							      backgroundColor={'colorScheme.light'}
							      backgroundColorDark={'colorScheme.dark'}
							      zIndex={'modal'}
							      className={`${css`
								      /** TODO: check this */
								      position: inherit;
							      `} ${clsx(className)}`}
							      height={fullScreen ? "100%" : height}
							      width={fullScreen ? "100%" : width}>
								{children}
							</Card>
						</div>
					</ModalWrapper>
				</Portal>
			)}
		</AnimatePresence>
	)
}

export default withTheme(Modal)
