import { authService } from '../../App'

export type ApiError = {
    message: string
    cause: string
}

export function isApiError<T>(result: T | ApiError): result is ApiError {
    return result && Object.hasOwn(result, 'message') && Object.hasOwn(result, 'cause')
}

export class ApiService {
    static async get<T>(url: string): Promise<T | ApiError> {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authService.token}`,
                'Content-Type': 'application/json',
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
    }

    static async post<T>(url: string, data: string): Promise<T | ApiError> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    }

    static async delete<T>(url: string): Promise<T | ApiError> {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
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
    }
}
