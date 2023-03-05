/**
 * Sleep returns a promise that resolves after ms milliseconds.
 * @param {number} ms - The number of milliseconds to wait before resolving the
 * promise.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Given a date, return a string that can be used as a cron job string, only
 * considering seconds, minutes, hours, date and month.
 * @param {Date} date - Date - The date you want to convert to a cron job string
 */
const formatDateToCronJobStringSMHDM = (date: Date) =>
  `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`

export { sleep, formatDateToCronJobStringSMHDM }
