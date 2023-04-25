import { authService } from '../../App'

export type ApiError = {
    message: string
    cause: string
}

export const CLIENT_API_URL =
    process.env.REACT_APP_ENV === 'prod' ? 'https://kappasupport.danielkrejci.cz/api/client' : 'http://localhost:8081'
export const ADMIN_API_URL =
    process.env.REACT_APP_ENV === 'prod' ? 'https://kappasupport.danielkrejci.cz/api/admin' : 'http://localhost:8080/admin'

export function isApiError<T>(result: T | ApiError): result is ApiError {
    return result && Object.hasOwn(result, 'message') && Object.hasOwn(result, 'cause')
}

export class ApiService {
    static async get<T>(url: string): Promise<T | ApiError> {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    ...(authService.token ? { Authorization: `Bearer ${authService.token}` } : {}),
                    ...{ 'Content-Type': 'application/json' },
                },
            })
            const result = await response.json()

            if (!response.ok) {
                return {
                    message: `HTTP error! Status: ${response.status}`,
                    cause: `${result.body.detail}`,
                }
            }

            return result as T
        } catch (e) {
            return {
                message: 'Error occured',
                cause: `${e}`,
            }
        }
    }

    static async post<T>(url: string, data: string): Promise<T | ApiError> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...(authService.token ? { Authorization: `Bearer ${authService.token}` } : {}),
                    ...{ 'Content-Type': 'application/json' },
                },
                body: data,
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    message: `HTTP error! Status: ${response.status}`,
                    cause: `${result.body.detail}`,
                }
            }

            return result as T
        } catch (e) {
            return {
                message: 'Error occured',
                cause: `${e}`,
            }
        }
    }

    static async delete<T>(url: string, data?: string): Promise<T | ApiError> {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    ...(authService.token ? { Authorization: `Bearer ${authService.token}` } : {}),
                    ...{ 'Content-Type': 'application/json' },
                },
                body: data,
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    message: `HTTP error! Status: ${response.status}`,
                    cause: `${result.body.detail}`,
                }
            }

            return result as T
        } catch (e) {
            return {
                message: 'Error occured',
                cause: `${e}`,
            }
        }
    }
}
