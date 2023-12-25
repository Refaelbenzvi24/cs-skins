import * as amqplib from "amqplib";
import { buildConnectionString, BuildConnectionStringProps, Consumer } from "../../src"
import mockRequire from "mock-require"

// describe ("message-broker", () => {
// 	beforeAll (() => {
// 		jest.useFakeTimers ();
// 		mockRequire ("amqplib", "mock-amqplib");
// 	});
// 	afterAll (() => {
// 		mockRequire.stop ("amqplib")
// 		jest.useRealTimers ();
// 	});
//
// 	describe ("index", () => {
// 		it ("should connect to the message broker", async () => {
// 			const connectionParams: BuildConnectionStringProps = {
// 				host:     "localhost",
// 				port:     "5672",
// 				password: "guest",
// 				user:     "guest",
// 				protocol: "amqp",
// 			}
// 			const connectionString = buildConnectionString (connectionParams);
// 			const consumer = new Consumer ("test" as any);
// 			consumer.initializeConsumer (connectionParams)
// 			jest.spyOn (amqplib, "connect")
// 			expect (amqplib.connect).toBeCalledWith (connectionString, expect.any (Function));
// 		})
// 	})
// });
