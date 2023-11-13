/**
 * Given a duration represented in seconds and returns a string with hours and minutes.
 * Example: 7552 => 2h6m
 */
export const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours}h${minutes}m`;
};

/**
 * Given a date, returns a string with format: HH:mm
 */
export const dateToStrTime = (date: Date): string => {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Given a date, returns a string with format YYYY-MM-DD
 */
export const dateToStrDate = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

/**
 * Given a date, returns a string with format YYYY-MM-DD HH:mm
 */
export const dateToStrDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(date);
};
