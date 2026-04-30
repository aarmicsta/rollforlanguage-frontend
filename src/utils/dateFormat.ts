/**
 * Shared date formatting utilities.
 *
 * Notes:
 * - Keeps display formatting out of individual components
 * - Uses a default admin-friendly format for now
 * - Future user settings can route preferred date formats here
 */

export type DateFormatPreference = 'MON_DD_YYYY' | 'DD_MON_YYYY'

export function formatDisplayDate(
  date: string | null,
  preference: DateFormatPreference = 'MON_DD_YYYY'
): string {
  if (!date) return '—'

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return '—'

  if (preference === 'DD_MON_YYYY') {
    return parsed.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}