import { useRouter } from "next/navigation"
import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime"
import * as NProgress from "nprogress"


const usePRouter = () => {
	const router = useRouter();

	const push = (href: string, options?: NavigateOptions) => {
		router.push(href, options);
		NProgress.start();
	};

	return {
		...router,
		push
	}
}

export default usePRouter;
