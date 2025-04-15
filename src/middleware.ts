import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { middleware as nextraMiddleware } from 'nextra/locales'
import { defaultLocale, locales } from './i18n'

// locales 타입 가드 함수 정의
const isValidLocale = (locale: string): locale is (typeof locales)[number] => {
  return locales.includes(locale as (typeof locales)[number])
}

export const middleware = (req: NextRequest) => {
  // nextra의 기본 로케일 미들웨어 처리
  const nextResponse = nextraMiddleware(req)
  if (nextResponse) {
    return nextResponse
  }

  const { pathname } = req.nextUrl

  // 다국어 처리에서 제외할 특정 경로는 여기서 처리 (예: 사이트맵)
  if (pathname === '/sitemap') {
    return NextResponse.next()
  }

  const locale = pathname.split('/')[1]

  // 유효하지 않은 locale이면 defaultLocale로 리다이렉트
  if (!isValidLocale(locale)) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 로케일 처리에서 제외할 경로들 설정
    '/((?!api|_next/static|_next/image|favicon.ico|img|_pagefind).*)',
  ],
}
