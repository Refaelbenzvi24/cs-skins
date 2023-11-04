import { redirect } from "next/navigation"

const Page = ({params: {lng}}: PageProps) => {
	redirect (`/${lng}/admin`)
}

export default Page
