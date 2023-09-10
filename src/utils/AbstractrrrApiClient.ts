import Axios, { AxiosInstance } from "axios";

export class AbstractrrrApiClient {
  private axios: AxiosInstance

  constructor({
    port,
    host,
    token,
    ssl,
    broadcasterId,
  }: {
    port: string
    host: string
    broadcasterId: string | null
    token: string | null
    ssl: boolean
  }) {
    this.axios = Axios.create({
      baseURL: `${ssl ? 'https' : 'http'}://${host}:${port}/`,
      headers: {
        Authorization: `Bearer ${token}`,
        'X-User-ID': broadcasterId,
      }
    })
  }

  makeGet<ResType>(url: string) {
    return this.axios.get<ResType>(url)
  }

  makePost<ReqType, ResType>(url: string, data: ReqType) {
    return this.axios.post<ResType>(url, data)
  }
}