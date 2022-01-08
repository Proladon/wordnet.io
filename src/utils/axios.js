import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.conceptnet.io/c',
})

// Handler
const handleSuccessRes = (response) => {
  return [response.data, null]
}
const handleErrorRes = (error) => {
  return [null, error.response || error]
}

// Res
api.interceptors.response.use(handleSuccessRes, handleErrorRes)
// Req
api.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bot ${process.env.BOT_TOKEN}`
  return config
})
