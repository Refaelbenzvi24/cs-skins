import { redirect } from "next/navigation"

const Page = ({params: {lng}}: TranslatedRouteProps) => {
	redirect (`/${lng}/admin`)
}

export default Page
