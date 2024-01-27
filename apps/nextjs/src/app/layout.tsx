import "elastic-apm-node"
import type { ReactNode } from "react"
import { withTransaction } from '@elastic/apm-rum-react';

const Layout = ({children}: {children: ReactNode}) => {
	return children
}

export default Layout
