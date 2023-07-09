import axios, { AxiosRequestConfig } from "axios"
import { wrapper } from "axios-cookiejar-support"
import { CookieJar } from "tough-cookie"


const jar = new CookieJar()
const client = wrapper(axios.create({ jar }))

let longRetryWaitCount = 0
let retryCount = 0
let timeToWait = 800

export const getPage = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await axios.get(url, config)
    retryCount = 0
    timeToWait = 800
    return response
  } catch (error) {
    // console.log(error)
    
    if (retryCount < 4) {
      timeToWait += 400
      console.log("retrying...")
      retryCount++
      return await getPage(url)
    }
  }
}
