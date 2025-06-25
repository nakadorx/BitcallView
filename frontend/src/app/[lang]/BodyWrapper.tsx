'use client'

import { useState, useEffect } from 'react'

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return <body className={mounted ? 'flex is-full min-bs-full flex-auto flex-col' : undefined}>{children}</body>
}
