/**
 * Converts an ISO date string into a user-friendly SEO format.
 * Example input:  "2025-02-06T14:57:24.901Z"
 * Example output: "February 6, 2025"
 */
export const formatDate = (isoDate: string): string => {
  if (!isoDate) return ''

  // ✅ Convert to JavaScript Date object
  const date = new Date(isoDate)

  // ✅ Format the date (e.g., "February 6, 2025")
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
