module.exports = {
  siteUrl: 'https://nextra-ten-rose.vercel.app',
  generateRobotsTxt: false,
  outDir: './public/ko', // ko 폴더에만 저장
  generateIndexSitemap: false,
  additionalPaths: async () => {
    const fs = require('fs')
    const path = require('path')
    const paths = []

    // 'src/content/ko' 내에 있는 .mdx 파일만 처리
    const traverse = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true })
      
      files.forEach((file) => {
        const filePath = path.join(dir, file.name)

        // 'ko' 폴더 내의 .mdx 파일만 처리
        if (file.isFile() && file.name.endsWith('.mdx') && filePath.includes('/ko/')) {
          const urlPath = path.posix.join('/ko', file.name.replace('.mdx', '')) // 경로에 'ko' 추가
          paths.push({
            loc: `https://nextra-ten-rose.vercel.app${urlPath}`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: 0.7,
          })
        }
      })
    }

    // 'src/content' 디렉토리 내 'ko' 폴더만 탐색
    traverse(path.join(__dirname, 'src', 'content', 'ko'))
    return paths
  },
}