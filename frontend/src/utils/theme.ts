// export function getCurrentTheme(): 'light' | 'dark' {
//   if (typeof localStorage === 'undefined') return 'light'

//   const theme = localStorage.getItem('bitcall-mui-template-mode')

//   return theme as 'light' | 'dark'
// }

export function getCurrentTheme(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null
  console.log('cookieHeader:  ', cookieHeader)
  const match = cookieHeader.split('; ').find(row => row.startsWith('themeColor='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}
//   const html = document.documentElement
//   const theme = getCurrentTheme()

//   if (theme === 'dark') {
//     html.classList.add('dark')
//   } else {
//     html.classList.remove('dark')
//   }

//   if (typeof localStorage !== 'undefined') {
//     localStorage.setItem('bitcall-mui-template-mode', theme)
//   }

//   return theme
// }

// export function toggleTheme(): 'light' | 'dark' {
//   const html = document.documentElement
//   const currentTheme = getCurrentTheme()
//   const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

//   if (newTheme === 'dark') {
//     html.classList.add('dark')
//   } else {
//     html.classList.remove('dark')
//   }

//   if (typeof localStorage !== 'undefined') {
//     localStorage.setItem('bitcall-mui-template-mode', newTheme)
//   }

//   return newTheme
// }

// export function setTheme(theme: 'light' | 'dark'): 'light' | 'dark' {
//   const html = document.documentElement

//   if (theme === 'dark') {
//     html.classList.add('dark')
//   } else {
//     html.classList.remove('dark')
//   }

//   if (typeof localStorage !== 'undefined') {
//     localStorage.setItem('bitcall-mui-template-mode', theme)
//   }

//   return theme
// }

// export function isDarkMode(): boolean {
//   return getCurrentTheme() === 'dark'
// }
// utils/setCookie.ts
export function setThemeCookie(mode: string) {
  const name = 'themeColor'

  // Step 1: Remove the old cookie (optional, but explicit)
  document.cookie = `${encodeURIComponent(name)}=;  max-age=0`

  // Step 2: Set the new one with updated value
  const maxAge = 60 * 60 * 24 * 365 // 1 year
  const sameSite = 'Lax'
  const secure = location.protocol === 'https:' // Set only on HTTPS

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(mode)};  max-age=${maxAge}; SameSite=${sameSite}`
  if (secure) cookie += '; Secure'

  document.cookie = cookie
}
