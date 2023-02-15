/**
 * Helper methods related to work with date and time in format ISO8601.
 * 
 * See: 
 *  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
 *  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
 */

export module DateUtils {

    /**
     * Converts given date to string acceptable by input element with type date.
     * @param date date to be converted to string. Or empty string in case null or undefined date.
     */
    export function toDateString(date: Date): string {
        if (date) {
            const dateParts = date.toISOString().split("T")
            if (dateParts && dateParts[0]) {
                return dateParts[0]
            } else {
                console.error('Failed to parse date into string from:', date)
            }
        }
        return ''
    }

    /**
     * Sets time to given date and returns updated instance.
     * @param date date to which will be time set.
     * @param timeStr time as string from html input value.
     */
    export function setTimeTo(date: Date, timeStr: string): Date {
        const timeParts = timeStr.split(':')
        if (!isNaN(+timeParts[0]) && !isNaN(+timeParts[1])) {
            date.setHours(+timeParts[0])
            date.setMinutes(+timeParts[1])
        } else {
            console.error('Cannot parse time from:', timeStr)
        }
        return date
    }

    /**
     * Computes delta between two times in minutes.
     * @param timeOne first time.
     * @param timeTwo second time.
     */
    export function timeDelta(timeOne: string, timeTwo: string): number {
        const dateOne = setTimeTo(new Date(2000, 1, 1, 0, 0, 0), timeOne)
        const dateTwo = setTimeTo(new Date(2000, 1, 1, 0, 0, 0), timeTwo)
        return (dateOne.getTime() - dateTwo.getTime()) / 1000 / 60
    }

    /**
     * Converts given date into time string in format for html input with type time.
     * @param date date from which will be time read.
     */
    export function toTimeString(date: Date): string {
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    /**
     * Returns localised name of week. Now support only EN.
     * @param dateStr date as string value.
     */
    export function toDayName(dateStr: string, dayNames?: string[]): string {
        const selectedDayNames = dayNames && dayNames.length === 7 ? dayNames : defaultDayNames
        return selectedDayNames[new Date(dateStr).getDay()]
    }

    /**
     * Returns first day of next month.
     * @param baseDate date from which will be search next month. When missing, current date is used.
     */
     export function firstDayOfNextMonth(baseDate?: Date): Date {
        const today = baseDate || new Date()

        return new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 1))
    }

    /**
     * Returns first day of month.
     * @param baseDate date, when missing, current date is used.
     */
     export function firstDayOfMonth(baseDate?: Date): Date {
        const today = baseDate || new Date()
        return new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1))
    }

      /**
     * Returns last day of month.
     * @param baseDate date, when missing, current date is used.
     */
       export function lastDayOfMonth(baseDate?: Date): Date {
        const today = baseDate || new Date()
        return new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0))
    }

    /**
     * Returns date with nearest next day of week.
     * @param dayOfWeek day of week specified as number 0 - 6
     * @param sourceDate date from which will be nearest day of week searched.
     */
    export function nextDayOfWeek(dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6, sourceDate: Date): Date {
        if (sourceDate.getUTCDay() === dayOfWeek) {
            return new Date(sourceDate)
        } else {
            const curDay = sourceDate.getUTCDay()
            if (dayOfWeek > curDay) {
                const shift = Math.abs(dayOfWeek - sourceDate.getUTCDay())
                return new Date(sourceDate.getTime() + shift * (24 * 60 * 60 * 1000))
            } else {
                const shift = Math.abs(7 - sourceDate.getUTCDay() + dayOfWeek)
                return new Date(sourceDate.getTime() + shift * (24 * 60 * 60 * 1000))
            }
        }
    }

    /**
     * Creates new date based on given date and added number of days.
     * @param days number of days to be added.
     * @param date base date.
     */
    export function addDaysTo(days: number, date: Date): Date {
        const result = new Date(date)
        result.setDate(date.getDate() + days)
        return result
    }

    /**
     * Creates new date with added amount of minutes.
     * @param minutes minutes to be added.
     * @param date base date.
     */
    export function addMinutesTo(minutes: number, date: Date): Date {
        return new Date(date.getTime() + minutes * 60 * 1000)
    }

    /**
     * Calculates time span between current and given datetime.
     * @param date base date.
     */
    export function timeSpanString(date: Date): string {

        let diffInMilliSeconds = Math.abs(new Date().getTime() - date.getTime()) / 1000

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400)
        diffInMilliSeconds -= days * 86400

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24
        diffInMilliSeconds -= hours * 3600

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60
        diffInMilliSeconds -= minutes * 60

        if (days > 0) {
            return (days === 1) ? `${days} day` : `${days} days`
        }

        if (hours > 0) {
            return (hours === 1) ? `${hours} hour` : `${hours} hours`
        }

        if (minutes > 0) {
            return (minutes === 1) ? `${minutes} minute` : `${minutes} minutes`
        }

        return 'less than a minute'
    }

    /**
     * Given ISO date time string or number with date in millis converts to UI label with current user locale formar.
     * @param date ISO formatted date. 
     */
    export function toUITime(date: string | undefined | null | number) {
        if (date === null || date === undefined || date === '') {
            return '--'
        } else {
            const asDate = new Date(!isNaN(+date) ? date : +date)
            if (isNaN(asDate.getDate())) {
                return '--'
            } else {
                return `${asDate.toLocaleTimeString()}`
            }
        }
    }

    /**
     * Given ISO date time string or number with date in millis converts to UI label with current user locale formar.
     * @param date ISO formatted date. 
     */
    export function toUIDateTime(date: string | undefined | null | number) {
        if (date === null || date === undefined || date === '') {
            return '--'
        } else {
            const asDate = new Date(isNaN(+date) ? date : +date)
            if (isNaN(asDate.getDate())) {
                return '--'
            } else {
                return `${asDate.toLocaleDateString()} ${asDate.toLocaleTimeString()}`
            }
        }
    }

    /**
     * Given ISO date string or number with date in millis converts to UI label with current user locale formar.
     * @param date ISO formatted date. 
     */
    export function toUIDate(date: string | undefined | null | number) {
        if (date === null || date === undefined || date === '') {
            return '--'
        } else {
            const asDate = new Date(isNaN(+date) ? date : +date)
            if (isNaN(asDate.getDate())) {
                return '--'
            } else {
                return `${asDate.toLocaleDateString()}`
            }
        }
    }

    /**
     * Returns Date without its time value
     * @param stringDate Date from which time will be removed
     */
    export function getDateWithoutTime(stringDate: string) {
        const date = new Date(stringDate)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    export function getAgeFromDate(birthDate: string) {
        const birthDay = new Date(birthDate);
        const today = new Date();

        const years = today.getUTCFullYear() - birthDay.getUTCFullYear();
        if (today.getUTCMonth() > birthDay.getUTCMonth() || (today.getUTCMonth() === birthDay.getUTCMonth() && today.getUTCDate() >= birthDay.getUTCDate())) {
            return years
        }
        return years - 1;
    }

    const defaultDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    function pad(num: number): string {
        if (num.toString().length < 2) {
            return '0' + num
        } else {
            return num.toString()
        }
    }
}