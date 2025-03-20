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
    title: '소개',
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
    },
  },
  upgrade: {
    title: (
      <span className="flex items-center leading-[1]">
        업데이트
        <TitleBadge />
      </span>
    ),
    type: 'page',
  },
} satisfies MetaRecord
