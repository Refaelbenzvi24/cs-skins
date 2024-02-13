import DefaultHeadersInjector from "./utils/DefaultHeadersInjector"
import GlobalHelpers from "./utils/GlobalHelpers"

export const setDefaultHeadersInjector = DefaultHeadersInjector.setHeaders;
export { Consumer, Producer } from "./MessageBroker";
export { buildConnectionString, type BuildConnectionStringProps } from "./connectionUtils";
export const setApmInstance = GlobalHelpers.setApmInstance
