module.exports = {
  siteUrl: 'https://nextra-ten-rose.vercel.app',
  generateRobotsTxt: false,
  outDir: './public', // 루트에 sitemap.xml 생성
  generateIndexSitemap: false,
  additionalPaths: async () => {
    const fs = require('node:fs')
    const path = require('node:path')
    const paths = []

    const traverse = (baseDir, dir, prefix) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          traverse(baseDir, fullPath, prefix)
          return
        }

        if (!entry.isFile() || !entry.name.endsWith('.mdx')) { return }

        const rel = path.relative(baseDir, fullPath)
        const slug = rel.replace(/\\/g, '/').replace(/\.mdx$/, '')
        const urlPath = path.posix.join(prefix, slug)

        paths.push({
          loc: `https://nextra-ten-rose.vercel.app${urlPath}`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.7,
        })
      })
    }

    const koBase = path.join(__dirname, 'src', 'content', 'ko')
    const enBase = path.join(__dirname, 'src', 'content', 'en')
    traverse(koBase, koBase, '/ko')
    traverse(enBase, enBase, '/en')

    return paths
  },
}

