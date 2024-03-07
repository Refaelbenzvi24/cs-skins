import type { ReactNode } from "react"


export interface TranslatedRouteProps {
	params: {
		lng: string;
	}
}

export interface LayoutWithLocaleProps extends TranslatedRouteProps {
	children: ReactNode;
}

export type PageWithLocaleProps = TranslatedRouteProps

export interface ComponentWithLocaleProps {
	lng: string;
}

export interface GenerateMetadataWithLocaleProps extends TranslatedRouteProps {
	params: { lng: string };
}
