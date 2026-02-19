// src/middleware.ts
export { middleware } from 'nextra/locales'

export const config = {
  matcher: [
    /*
     * 1. 아래 단어로 시작하는 모든 경로 제외
     * 2. 아래 확장자로 끝나는 모든 정적 파일 제외 (이미지, 폰트, json 등)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|img|_pagefind|robots|sitemap|ads\\.txt|security\\.txt|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml|pdf|woff2?|css|js)$).*)',
  ],
}