import en from './en'
import ko from './ko'

export const locales = ['ko', 'en'] as const
export const i18nConfig = Object.freeze({
  en,
  ko,
})

export type I18nLangKeys = keyof typeof i18nConfig
export interface I18nLangAsyncProps {
  lang: I18nLangKeys
}

// 모든 언어 객체의 유니온 타입 가져오기
export type AllLocales = typeof i18nConfig[I18nLangKeys]


type DeepKeys<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K & string | number}.${DeepKeys<T[K]>}`
    : `${K & string | number}`
}[keyof T & (string | number)]


export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

// 모든 가능한 키 가져오기
export type LocaleKeys = NestedKeyOf<AllLocales>


type DeepObject = Record<string, any>

// 주어진 경로의 값 타입 추출
export type PathValue<T, P extends string> =
  P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? PathValue<T[Key], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never

// 중첩된 값 가져오기
export function getNestedValue<T extends DeepObject, K extends string>(obj: T, path: K): PathValue<T, K> {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj) as PathValue<T, K>
}


// 문자열 내 변수 치환
export function interpolateString(template: string, context: Record<string, any>): string {
  return template.replace(/\{\{\s*(\w+(\.\w+)*)\s*\}\}/g, (_, path) => {
    const value = getNestedValue(context, path.trim())
    return value !== undefined ? value : `{{${path.trim()}}}`
  })
}
