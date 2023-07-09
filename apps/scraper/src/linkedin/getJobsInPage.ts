import { getPage } from "./requests"
import * as cheerio from "cheerio"
import * as chrono from "chrono-node"
import { wait } from "../utils/utils"
import { AxiosRequestConfig } from "axios"

const URL = "https://it.linkedin.com"
const POSTED_LAST_24_HOURS_QUERY = "&f_TPR=r86400"
const POSTED_LAST_10_HOURS_QUERY = "&f_TPR=r36000"

const timePostedQuery = (time: string | number) => {
  return `&f_TPR=r${time}`
}

const queryString = (
  keywords: string,
  start: number = 0,
  { page = 0, location = "israel" }: { page?: number; location?: string } = {}
) => {
  return `/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${keywords}&location=${location}&geoId=101620260&trk=homepage-jobseeker_jobs-search-bar_search-submit&currentJobId=3334548006&position=5&pageNum=${page}&start=${start}`
}

export interface Job {
  title: string
  keywords: string
  company: string
  location: string
  link: string
  postDate: string
}

const config: AxiosRequestConfig = {
  maxBodyLength: Infinity,
  headers: {
    'authority': 'www.linkedin.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'cookie': 'bcookie="v=2&324a48e7-a2e4-4f8e-8b3e-580ddfc7c75a"; JSESSIONID=ajax:0088448350659841712; bscookie="v=1&20230212211554ad1b464c-8437-4a84-8260-6033c39eb91cAQEoAhcevktsFDmR4DYQsdRd2auOiEBt"; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19401%7CMCMID%7C32033721643336813170860925716017655985%7CMCAAMLH-1676841355%7C6%7CMCAAMB-1676841355%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1676243755s%7CNONE%7CvVersion%7C5.1.1; _gcl_au=1.1.1175609739.1676236560; aam_uuid=32233164612342439500809997417814016890; lang="v=2&lang=en-us"; recent_history=AQEna7oTTifwHwAAAYZHfJLQSZjbBNv0T-ykKcxcyPooW9tpWDp0RP9lZ3e85nmVHaK1CaGCNStMfel5-ssMuIs2_7QaU7L_sBYcM4rhuoycKzG6mZbNqptVmzZJS1OU3Lxjcrszw1X_cVFhU5L-Y5IT_0yzpG4XIULFWNGmGjuf-fGd3nAur8nAXyA1SWSA1i_92mnaiOpXHSvReCOTXF-AguxBwPG9UH74GXgBqe8IHVsqLwlMi2OdSHrIxjnT0Hv6gC4fgyuSDGB6Hz7oDZwQkQHZAAO6p-MwX7oDqRwWjmg; lidc="b=VGST01:s=V:r=V:a=V:p=V:g=2824:u=1:x=1:i=1676237879:t=1676324279:v=2:sig=AQEvau8aB6DAmxRezHMh_M66gtcUO68I"; bcookie="v=2&324a48e7-a2e4-4f8e-8b3e-580ddfc7c75a"; li_mc=MTswOzE2NzUzNzIxMzQ7MTswMjGNuvdbE/QHuNkpbLZZUi9MKMXXSGXVzgK4QiVJCyZ8Bg==',
    'pragma': 'no-cache',
    'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  }
};

export const getJobsInPage = async (
  url: string,
  keywords: string
): Promise<Job[] | "no jobs results"> => {
  const response = await getPage(url, config)
  
  const $ = cheerio.load(response.data)
  const $jobs = $("li")
  
  if (!$jobs.html()) return "no jobs results"
  
  const jobs = $jobs.map((i, el) => ({
    keywords: keywords,
    title: $(el)
      .find("h3")
      .text()
      .replace(/[\n\t]/g, "")
      .trim(),
    company: $(el)
      .find("h4")
      .text()
      .replace(/[\n\t]/g, "")
      .trim(),
    location: $(el)
      .find("span.job-search-card__location")
      .text()
      .replace(/[\n\t]/g, "")
      .trim(),
    link: $(el).find("a").attr("href"),
    postDate: chrono.parseDate($(el)
      .find("div.base-search-card__info")
      .text()
      .replace(/[\n\t]/g, "")
      .trim()).toISOString()
  }))
  
  return jobs.get() as Job[]
}

export const listJobs = async (
  keywords: string,
  { secondary, time }: { secondary: boolean; time: string | number } = {
    secondary: false,
    time: 36000
  }
) => {
  const jobs = []
  
  let finishedPagination = false
  let start = 0
  
  while (!finishedPagination) {
    const query = queryString(keywords, start)
    const url = `${URL}${query}${secondary ? timePostedQuery(time) : ""}`
    
    console.log(start)
    console.log(url)
    
    await wait(2000)
    const results = await getJobsInPage(url, keywords)
    
    if (results !== "no jobs results") {
      start += 25
      jobs.push(...results)
    }
    
    if (results === "no jobs results") finishedPagination = true
  }
  
  return jobs
}
