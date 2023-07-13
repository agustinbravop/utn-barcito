/**
 * @param date la fecha de la cual el año
 * @returns un string de tipo 'YYYY-MM-DD'
 */
export function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}
