export module ApiErrorUtils {
    /**
     * Represents error from REST API.
     */
    export interface RestApiError {
        version: string
        id: string
        message: string
        errorCodes: string[]
        stackTrace: string
        develMode: boolean
    }

    export function parseError(error: unknown): RestApiError {
        if (error) {
            const errorObj = typeof error === 'string' ? JSON.parse(error) : error
            return {
                version: errorObj['version'] || 'devel',
                id: errorObj['id'] || errorObj['requestId'] || '',
                message: errorObj['message'] || errorObj['error'] || '',
                errorCodes: errorObj['errorCodes'] || errorObj['status'] || [],
                stackTrace: errorObj['stackTrace'] || '',
                develMode: errorObj['develMode'] || true,
            }
        } else {
            console.error('Cannot parse REST API error from: ', error)
            return empty()
        }
    }

    function empty(): RestApiError {
        return {
            version: 'devel',
            id: '',
            message: '',
            errorCodes: [],
            stackTrace: '',
            develMode: false,
        }
    }
}
