import { redirect } from "next/navigation"

const Page = ({params: {locale}}: PageProps) => {
	redirect (`/${locale}/admin`)
}

export default Page
