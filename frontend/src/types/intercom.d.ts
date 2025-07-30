// Intercom TypeScript declarations
declare global {
  interface Window {
    Intercom: (command: string, options?: any) => void
    intercomSettings: any
  }
}

export {}
