import { API_URL } from '@renderer/lib/env'
import { ofetch } from 'ofetch'

const apiFetch = ofetch.create({
  baseURL: API_URL,
})

export const Get = <T = object>(url: string, params?: object): Promise<T> =>
  apiFetch(url, { query: params })

export const Post = <T = object>(url: string, data?: object): Promise<T> =>
  apiFetch(url, { method: 'POST', body: data })

export const Delete = <T = object>(url: string, params?: object): Promise<T> =>
  apiFetch(url, { method: 'DELETE', query: params })
