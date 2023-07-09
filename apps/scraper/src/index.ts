import { prisma } from "@acme/db"
import { Job, listJobs } from "./linkedin/getJobsInPage"
import { getJobDetails, JobExtended } from "./linkedin/getJobDetails"
import { initBrowser } from "./utils/puppeteer"
import { Consumer } from "@acme/message-broker"
import { wait } from "./utils/utils"


export const saveJobToDb = async (jobDetails: Job & JobExtended) => {
  try {
    await prisma.job.create({
      data: {
        title: jobDetails.title,
        search: {
          connect: {
            keywords: jobDetails.keywords
          }
        },
        link: jobDetails.link,
        description: "",
        location: jobDetails.location,
        postDate: new Date(jobDetails.postDate),
        applicants: jobDetails.applicants,
        employmentType: jobDetails.employmentType,
        seniorityLevel: jobDetails.seniorityLevel,
        company: jobDetails.company,
        companyImage: jobDetails.companyImage,
        easyApply: jobDetails.easyApply
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const getJobsDetails = async (jobs: Job[]) => {
  await initBrowser()
  
  for (const [index, job] of jobs.entries()) {
    console.log(index)
    
    await wait(3000)
    
    const jobDetails = {
      ...job,
      ...(await getJobDetails(job.link))
    }
    
    await saveJobToDb(jobDetails)
  }
}

export const filterRole = (job, roles: string[]) => {
  const passedRoles = roles.filter(role => job.description.toLowerCase().includes(roles[role].toLowerCase()) ||
    job.title.toLowerCase().includes(roles[role].toLowerCase()))
  
  const notPassedRoles = roles.filter(role =>
    !(
      job.description.toLowerCase().includes(roles[role].toLowerCase()) ||
      job.title.toLowerCase().includes(roles[role].toLowerCase())
    ) &&
    !job.title.toLowerCase().includes(roles[role].toLowerCase())
  )
  
  return [passedRoles, notPassedRoles]
}

export const intervalScrape = async (keywords: string, interval?: number) => {
  const jobs = await listJobs(keywords, { secondary: true, time: interval })
  
  if (jobs.length <= 0) {
    console.log("no jobs found")
    return
  }
  
  await getJobsDetails(jobs)
  
  const timeFinished = new Date().toISOString()
  
  await prisma.search.update({
    where: { keywords },
    data: { lastScraped: timeFinished }
  })
}

export const initialScrape = async (keywords: string) => {
  const jobs = await listJobs(keywords)
  
  
  if (jobs.length <= 0) {
    console.log("no jobs found")
    return
  }
  
  await getJobsDetails(jobs)
  
  const timeFinished = new Date().toISOString()
  
  await prisma.search.update({
    where: { keywords },
    data: { lastScraped: timeFinished }
  })
}

export const linkedin = async () => {
  const consumer = new Consumer("scraper")
  await consumer.initializeConsumer()
  
  await Consumer.channel.prefetch(1)
  
  await consumer.consumeMessages(async (message) => {
    
    const messageObject: Record<string, any> = JSON.parse(message.content.toString())
    
    
    if (messageObject.payload === "initial_scrape") {
      Consumer.channel.ack(message)
      await initialScrape(messageObject.keywords)
    }
    
    if (messageObject.payload === "interval_scrape") {
      await intervalScrape(messageObject.keywords, messageObject.interval)
      Consumer.channel.ack(message)
    }
  }, {})
}

console.info("server has started and is waiting for messages!");
(async () => await linkedin())()
