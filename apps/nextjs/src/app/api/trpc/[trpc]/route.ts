import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@acme/api";
import { auth } from "@acme/auth";
import getEmailProvider from "~/utils/emailProvider";
import { messageBrokerConnectionParams } from "~/modules/vars"


interface ErrorResponse {
	'0': { error: { json: { data: { code: string, httpStatus: number } } } }
}

interface ResultResponse {
	'0': { result: unknown }
}

type ResponseOptions = ErrorResponse | ResultResponse

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
function setCorsHeaders(res: Response){
	res.headers.set("Access-Control-Allow-Origin", "*");
	res.headers.set("Access-Control-Request-Method", "*");
	res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
	res.headers.set("Access-Control-Allow-Headers", "traceparent, tracestate, *");
}

export function OPTIONS(){
	const response = new Response(null, {
		status: 204,
	});
	setCorsHeaders(response);
	return response;
}

const handler = auth(async (req) => {
	const response = await fetchRequestHandler({
		endpoint:      "/api/trpc",
		router:        appRouter,
		req,
		createContext: async () => createTRPCContext({ session: req.auth, headers: req.headers }, { messageBrokerConnectionParams, emailProvider: await getEmailProvider(), isServer: false }),
	});

	const clonedResponse = response.clone();
	const body           = await clonedResponse.json() as unknown as ResponseOptions
	if('error' in body["0"]){
		const code     = body['0'].error.json.data.code
		const httpCode = body['0'].error.json.data.httpStatus
		return new Response(response.body, {
			status:     httpCode,
			statusText: code,
			headers:    response.headers,
		});
	}

	setCorsHeaders(response);
	return response
});

export { handler as GET, handler as POST };
