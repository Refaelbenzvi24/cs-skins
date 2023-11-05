"use client";
import AdminAppBar from "~/components/Admin/AdminAppBar"
import { Main } from "@acme/ui"
import type { ReactNode } from "react"
import TranslationProvider from "~/components/TranslationProvider"

const Layout = (props: {
	children: ReactNode,
	params: {
		locale: string
	}
}) => {
	return (
		<div className="h-full">
			<TranslationProvider locale={props.params.locale}>
				<AdminAppBar/>
			</TranslationProvider>
			<Main>
				{props.children}
			</Main>
		</div>
	);
}

export default Layout
