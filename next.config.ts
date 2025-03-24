import createWithNextra from 'nextra'

const withNextra = createWithNextra({
  latex: {
    renderer: 'katex',
    options: {
      output: 'mathml',
      strict: false, // ⚡ 모든 엄격한 검사를 비활성화
    },
  },
  defaultShowCopyCode: true,
  unstable_shouldAddLocaleToLinks: true,
})


/**
 * @type {import("next").NextConfig}
 */
export default withNextra({
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  cleanDistDir: true,
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
})
