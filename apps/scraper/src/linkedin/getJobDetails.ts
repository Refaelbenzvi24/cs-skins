import { wait } from "../utils/utils"
import * as cheerio from "cheerio"
import { page } from "../utils/puppeteer"
import { getPage } from "./requests"
import { AxiosRequestConfig } from "axios"


export interface JobExtended {
  companyImage: string;
  description: string;
  easyApply: boolean;
  seniorityLevel: string;
  employmentType: string;
  applicants: string;
}

const config: AxiosRequestConfig = {
  maxBodyLength: Infinity,
  headers: {
    'authority': 'www.linkedin.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'cookie': 'bcookie="v=2&324a48e7-a2e4-4f8e-8b3e-580ddfc7c75a"; lidc="b=TGST01:s=T:r=T:a=T:p=T:g=2993:u=1:x=1:i=1676236553:t=1676322953:v=2:sig=AQFhP4wO1_k8qVFzl6EP59X2SSl_B4pk"; JSESSIONID=ajax:0088448350659841712; bscookie="v=1&20230212211554ad1b464c-8437-4a84-8260-6033c39eb91cAQEoAhcevktsFDmR4DYQsdRd2auOiEBt"; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19401%7CMCMID%7C32033721643336813170860925716017655985%7CMCAAMLH-1676841355%7C6%7CMCAAMB-1676841355%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1676243755s%7CNONE%7CvVersion%7C5.1.1; _gcl_au=1.1.1175609739.1676236560; aam_uuid=32233164612342439500809997417814016890; lang="v=2&lang=en-us"; recent_history=AQEna7oTTifwHwAAAYZHfJLQSZjbBNv0T-ykKcxcyPooW9tpWDp0RP9lZ3e85nmVHaK1CaGCNStMfel5-ssMuIs2_7QaU7L_sBYcM4rhuoycKzG6mZbNqptVmzZJS1OU3Lxjcrszw1X_cVFhU5L-Y5IT_0yzpG4XIULFWNGmGjuf-fGd3nAur8nAXyA1SWSA1i_92mnaiOpXHSvReCOTXF-AguxBwPG9UH74GXgBqe8IHVsqLwlMi2OdSHrIxjnT0Hv6gC4fgyuSDGB6Hz7oDZwQkQHZAAO6p-MwX7oDqRwWjmg; bcookie="v=2&296f3488-d0c5-4e85-8bba-caeb27256331"; li_mc=MTswOzE2NzUzNzIxMzQ7MTswMjGNuvdbE/QHuNkpbLZZUi9MKMXXSGXVzgK4QiVJCyZ8Bg==; bscookie="v=1&20210713133036a6868469-9456-4293-8453-9ca9fdd2fa41AQGpcuKqVW1MxLQ49zLW0PlpqCcW4jo1"',
    'pragma': 'no-cache',
    'referer': 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search',
    'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  }
}

export const getJobDetails = async (url: string, index?: number): Promise<JobExtended> => {
  if (index) console.log(index)
  
  try {
    const response = await getPage(url, config)
    
    const $ = cheerio.load(response.data)
    const hasDescription = await $(".show-more-less-html__markup").get()[0]
    
    if (hasDescription === null) {
      await wait(1000)
      return getJobDetails(url)
    }
  } catch (error) {
    console.log(error)
  }
  
  const pageContent = await page.content()
  
  const $ = cheerio.load(pageContent)
  
  const applicants = $("span.num-applicants__caption")
    .text()
    .replace(/[\n\t]/g, "")
    .trim()
  
  const description = $(
    "#main-content > section.core-rail > div > div > section.core-section-container.my-3.description > div > div > section > div"
  )
    .text()
    .replace(/[\n\t]/g, "")
    .trim()
  
  const employmentType = $(
    "#main-content > section.core-rail > div > div > section.core-section-container.my-3.description > div > ul > li:nth-child(2) > span"
  )
    .text()
    .replace(/[\n\t]/g, "")
    .trim()
  
  const seniorityLevel = $(
    "#main-content > section.core-rail > div > div > section.core-section-container.my-3.description > div > ul > li:nth-child(1) > span"
  )
    .text()
    .replace(/[\n\t]/g, "")
    .trim()
  
  const companyImage = $(
    "#main-content > section.core-rail > div > section.top-card-layout.container-lined.overflow-hidden.babybear\\:rounded-\\[0px\\] > div > a > img"
  ).attr("src")
  
  const easyApply =
    $("#ember828 > span")
      .text()
      .replace(/[\n\t]/g, "")
      .trim() === "Easy Apply"
  
  return {
    applicants,
    description,
    employmentType,
    seniorityLevel,
    companyImage,
    easyApply
  }
}
