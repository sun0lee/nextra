import type Ko from '@/i18n/ko'
import 'server-only'

const dictionaries = {
  en: () => import('@/i18n/en').then((module) => module.default),
  ko: () => import('@/i18n/ko').then((module) => module.default),
}

export const getDictionary = async (
  locale: string, // 타입을 string으로 넓혀서 방어 로직을 구축합니다.
): Promise<typeof Ko> => {
  // 1. 해당 언어 설정이 있는지 확인하고, 없으면 기본값인 'ko'를 사용합니다.
  const loadDictionary = dictionaries[locale as keyof typeof dictionaries]
    || dictionaries.ko

  // 2. 안전하게 함수를 호출하여 결과를 반환합니다.
  return loadDictionary()
}

export const getDirection = (locale: string) => {
  // 어떤 언어가 들어오더라도 안전하게 'ltr'을 반환하도록 처리
  return 'ltr' as const
}
