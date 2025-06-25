'use client'

import Link from 'next/link'
import { Breadcrumbs, Typography } from '@mui/material'
import { getLocale } from '@/utils/commons'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[]
}

const locale = getLocale() // e.g. "en", "fr", "ar"

export default function BreadcrumbsNav({ items }: BreadcrumbsNavProps) {
  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
      {items.map((item, idx) => {
        if (item.href) {
          return (
            <Link key={idx} href={`/${locale}/${item.href}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {item.label}
            </Link>
          )
        } else {
          return (
            <Link key={idx} href={`/${locale}`} color='text.primary'>
              {item.label}
            </Link>
          )
        }
      })}
    </Breadcrumbs>
  )
}
