const locale = 'en-GB'

/**
 * Given a duration represented in seconds and returns a string with hours and minutes.
 * Example: 7552 => 2h6m
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds % 3600) / 60)

  if (hours === 0) {
    return `${minutes}m`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h${minutes}m`
}

/**
 * Given a date, returns a string with format: HH:mm
 */
export const dateToStrTime = (date: Date | string): string => {
  let newDate = typeof date === 'string' ? new Date(date) : (date as Date)
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
  }).format(newDate)
}

/**
 * Given a date, returns a string with format YYYY-MM-DD
 */
export const dateToStrDate = (date: Date): string =>
  new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

/**
 * Given a date, returns a string with format YYYY-MM-DD HH:mm
 */
export const dateToStrDateTime = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(date)

export const dayOfTheWeek = (date: Date): string =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    timeZone: 'Europe/Madrid',
  }).format(date)

export const hourToSeconds = (hour: string): number => {
  const [hours, minutes] = hour.split(':')
  return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60
}
