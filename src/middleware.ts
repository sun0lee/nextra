import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { middleware as nextraMiddleware } from 'nextra/locales'
import { defaultLocale, locales } from './i18n' // i18n 설정에서 locales을 가져옵니다.

export const middleware = (req: NextRequest) => {
  // 먼저 nextra의 기본 미들웨어를 실행합니다.
  const nextResponse = nextraMiddleware(req)

  if (nextResponse) {
    // 이미 nextra에서 처리된 응답이 있으면 반환합니다.
    return nextResponse
  }

  const { pathname } = req.nextUrl

  // 예외 처리: sitemap 경로에서는 언어 리디렉션을 하지 않음
  if (pathname === '/sitemap') {
    return NextResponse.next()
  }

  // 기본적으로 요청 경로에 언어 코드가 없으면 리디렉션 처리
  const locale = pathname.split('/')[1]

  if (!locales.includes(locale)) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|img|_pagefind).*)', // 기존 설정
  ],
}
