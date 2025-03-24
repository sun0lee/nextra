import type Ko from '@/i18n/ko'
import 'server-only'

// We enumerate all dictionaries here for better linting and TypeScript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('@/i18n/en'),
  ko: () => import('@/i18n/ko'),
} as const satisfies Record<string, () => Promise<{ default: typeof Ko }>>

export const getDictionary = async (
  locale: keyof typeof dictionaries,
): Promise<typeof Ko> => (await dictionaries[locale]()).default

export const getDirection = (locale: keyof typeof dictionaries) => {
  switch (locale) {
    case 'en':
    case 'ko':
    default:
      return 'ltr' as const
  }
}
