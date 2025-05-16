module.exports = {
  siteUrl: 'https://nextra-ten-rose.vercel.app',
  generateRobotsTxt: false,
  outDir: './public/en', // en 폴더에만 저장
  generateIndexSitemap: false,
  additionalPaths: async () => {
    const fs = require('fs')
    const path = require('path')
    const paths = []

    // 'src/content/en' 내에 있는 .mdx 파일만 처리
    const traverse = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true })
    
      files.forEach((file) => {
        const filePath = path.join(dir, file.name)

        // 'en' 폴더 내의 .mdx 파일만 처리
        if (file.isFile() && file.name.endsWith('.mdx') && filePath.includes('/en/')) {
          const urlPath = path.posix.join('/en', file.name.replace('.mdx', '')) // 경로에 'en' 추가
          paths.push({
            loc: `https://nextra-ten-rose.vercel.app${urlPath}`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: 0.7,
          })
        }
      })
    }

    // 'src/content' 디렉토리 내 'en' 폴더만 탐색
    traverse(path.join(__dirname, 'src', 'content', 'en'))
    return paths
  },
}