import { redirect } from "next/navigation"
import type { PageWithLocaleProps } from "~/types"

const Page = ({params: {lng}}: PageWithLocaleProps) => {
	redirect (`/${lng}/admin`)
}

export default Page
