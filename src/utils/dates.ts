const locale = "en-GB"

/**
 * Given a duration represented in seconds and returns a string with hours and minutes.
 * Example: 7552 => 2h6m
 */
export const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const parts = [`${hours}h`]
  if (minutes) {
    parts.push(`${minutes}m`)
  }
  return parts.join("")
}

/**
 * Given a date, returns a string with format: HH:mm
 */
export const dateToStrTime = (date: Date): string =>
  new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)

/**
 * Given a date, returns a string with format YYYY-MM-DD
 */
export const dateToStrDate = (date: Date): string =>
  new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)

/**
 * Given a date, returns a string with format YYYY-MM-DD HH:mm
 */
export const dateToStrDateTime = (date: Date): string =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(date)

export const dayOfTheWeek = (date: Date): string =>
  new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "Europe/Madrid",
  }).format(date)
