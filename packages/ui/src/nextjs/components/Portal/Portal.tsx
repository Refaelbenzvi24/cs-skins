"use client";
import {createPortal} from "react-dom"
import type {ReactNode} from "react";


const Portal = ({children}: { children: ReactNode | ReactNode[] }) => {
	const mount = document.querySelector("#portals-root") as Element

	return createPortal(children, mount)
}

export default Portal
