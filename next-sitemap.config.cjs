/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nextra-ten-rose.vercel.app', // 루트 URL을 사용해야 함
  generateRobotsTxt: true, // robots.txt 파일도 함께 생성하려면 true
  outDir: './public',

  // 모든 mdx 파일을 탐색해서 추가하는 설정
  additionalPaths: async (config) => {
    const fs = require('node:fs')
    const path = require('node:path')

    const locales = ['ko', 'en'] // 다국어 처리
    const paths = []

    // 'src/content' 경로를 기준으로 탐색
    const contentDir = path.join(__dirname, 'src', 'content')

    const traverseDirectory = (directory, prefix = '') => {
      const files = fs.readdirSync(directory, { withFileTypes: true })

      files.forEach((file) => {
        const filePath = path.join(directory, file.name)
        const fileUrl = path.join(prefix, file.name)

        if (file.isDirectory()) {
          // 하위 디렉토리일 경우 재귀적으로 탐색
          traverseDirectory(filePath, fileUrl)
        }
        else if (file.isFile() && file.name.endsWith('.mdx')) {
          // .mdx 파일일 경우 URL로 변환
          const url = fileUrl.replace('.mdx', '') // 확장자를 제거한 URL
          paths.push({
            loc: `https://nextra-ten-rose.vercel.app${url}`, // URL 경로
            lastmod: new Date().toISOString(), // 마지막 수정 날짜
          })
        }
      })
    }

    // 'src/content' 디렉토리 내 모든 파일을 탐색
    locales.forEach((locale) => {
      const localeDir = path.join(contentDir, locale)
      traverseDirectory(localeDir, `/${locale}`)
    })

    return paths
  },
}
