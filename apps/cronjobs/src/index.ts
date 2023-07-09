import { CronJob } from "cron"
import { getIntervalInSec } from "./utils/scheduling"
import { prisma } from "@acme/db"
import { Producer } from "@acme/message-broker"


export const publishScrapingMessage = async (keywords: string, interval: number) => {
  console.log(`sending message for '${keywords}' search`)
  const producer = new Producer("scraper")
  await producer.initializeProducer()
  await producer.sendMessage({ keywords, interval, payload: "interval_scrape" })
}

export const sendMessagesForAllSearches = async (intervalInMili: number) => {
  const searchesList = await prisma.search.findMany()
  
  const messagesToSend = searchesList.map(async search => await publishScrapingMessage(search.keywords, intervalInMili))
  
  Promise.all(messagesToSend)
}

export const initialJob = async () => {
  console.log("sending initial message...")
  const intervalInMili = getIntervalInSec({ hours: 4 })
  await sendMessagesForAllSearches(intervalInMili)
}

export const cronJobsInitializer = () => {
  const intervalInMili = getIntervalInSec({ hours: 1 })
  
  const job = new CronJob("0 0 */1 * * *", () => {
    console.log("sending intervaled message...");
    
    (async () => await sendMessagesForAllSearches(intervalInMili))()
  })
  
  job.start()
}


export const serviceInitializer = () => {
  (async () => await initialJob())()
  cronJobsInitializer()
}

serviceInitializer()
