import {createNextApiHandler} from "@trpc/server/adapters/next"
import {appRouter, createTRPCContext} from "@acme/api"
import {getTransporter} from "@acme/api/src/services/email/emailProvider";
import getEmailProvider from "~/utils/emailProvider";

// export API handler
export default createNextApiHandler({
	router: appRouter,
	createContext: async (opts) => {
		const emailProvider = await getEmailProvider()
		
		return createTRPCContext(opts, emailProvider)
	}
});

// If you need to enable cors, you can do so like this:
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // Enable cors
//   await cors(req, res);

//   // Let the tRPC handler do its magic
//   return createNextApiHandler({
//     router: appRouter,
//     createContext,
//   })(req, res);
// };

// export default handler;
