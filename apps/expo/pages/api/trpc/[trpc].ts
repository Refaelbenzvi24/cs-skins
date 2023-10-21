import {createNextApiHandler} from "@trpc/server/adapters/next"
import {appRouter, createTRPCContext} from "@acme/api"
import getEmailProvider from "../../../../nextjs/src/utils/emailProvider";
import { messageBrokerConnectionParams } from "../../../../nextjs/src/modules/vars"

// export API handler
export default createNextApiHandler({
	router: appRouter,
	createContext: async (opts) => {
		const emailProvider = await getEmailProvider()

		return createTRPCContext(opts, emailProvider, messageBrokerConnectionParams)
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
