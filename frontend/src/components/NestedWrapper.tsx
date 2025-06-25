'use client'

import { ReactNode } from 'react'

interface JustAWrapperProps {
  dir: 'ltr' | 'rtl'
  children: ReactNode
}

export default function Wrapper({ dir, children }: JustAWrapperProps) {
  return <div dir={dir}>{children}</div>
}
