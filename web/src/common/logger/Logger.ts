const logUrl = '/api/log/error'

interface LogData {
    appCodeName?: string;
    appName?: string;
    appVersion?: string;
    body?: string;
    language?: string;
    onLine?: boolean;
    platform?: string;
    product?: string;
    request?: string;
    timezoneOffset?: number;
}

export class Logger {

    static logError(msg: string, reponse?: any) {
        const navigator = window.navigator
        const logData: LogData = {
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            platform: navigator.platform,
            product: navigator.product,
            language: navigator.language,
            onLine: navigator.onLine,
            timezoneOffset: new Date().getTimezoneOffset(),
            body: msg
        }

        // Perform POST request on server
        fetch(logUrl, {
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(logData)
        })
    }
}