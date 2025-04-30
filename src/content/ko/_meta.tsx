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
  blog: {
    type: 'page',
    title: 'blog',
    theme: {
      navbar: true,
      toc: true,
      collapsed: true,
    },
  },
  gesg: {
    type: 'page',
    title: 'ESG',
    theme: {
      navbar: true,
      toc: true,
      collapsed: true,
    },
  },
  ics: {
    title: (
      <span className="flex items-center leading-[1]">
        ICS
        <TitleBadge />
      </span>
    ),
    type: 'page',
    theme: {
      navbar: true,
      collapsed: true,
      toc: true,
    },
  },
  kics: {
    title: 'K-ICS',
    type: 'page',
    theme: {
      typesetting: 'default',
      navbar: true,
      collapsed: true,
      toc: true,
    },
  },
} satisfies MetaRecord
