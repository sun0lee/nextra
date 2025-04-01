import type { MetaRecord } from 'nextra'
import { TitleBadge } from '@/components/TitleBadge'

export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      timestamp: false,
      layout: 'full',
      toc: false,
    },
  },
  introduction: {
    type: 'page',
    title: 'This is Introduction',
    theme: {
      navbar: true,
      toc: true,
    },
  },
  ics: {
    title: 'ICS',
    type: 'page',
    theme: {
      navbar: true,
      toc: true,
      collapsed: false,
    },
  },
  kics: {
    title: (
      <span className="flex items-center leading-[1]">
        K-ICS
        <TitleBadge />
      </span>
    ),
    type: 'page',
    theme: {
      navbar: true,
      toc: true,
      collapsed: false,
    },
  },
} satisfies MetaRecord
