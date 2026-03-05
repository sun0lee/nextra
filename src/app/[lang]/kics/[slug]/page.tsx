import { notFound } from 'next/navigation'
import { importPage } from 'nextra/pages'
import slugData from 'public/slugData.json'
import { useMDXComponents } from '@/mdx-components'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<PageProps['params']> }) {
  const resolvedParams = await params
  const { lang, slug } = resolvedParams
  const category = 'kics' // kics 라우트이므로 고정

  const pageData = slugData.find(
    (item) => item.lang === lang && item.category === category && item.targetUrl === `/${lang}/${category}/${slug}`,
  )

  if (!pageData) {
    return null
  }

  const { metadata } = await importPage(pageData.actualUrl.split('/'), lang)
  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
    },
  }
}

type PageProps = Readonly<{
  params: {
    lang: string
    slug: string
  }
}>

const Wrapper = useMDXComponents().wrapper

export default async function Page({ params }: { params: Promise<PageProps['params']> }) {
  const resolvedParams = await params
  const { lang, slug } = resolvedParams
  const category = 'kics' // kics 라우트이므로 고정
  const pageData = slugData.find(
    (item) => item.lang === lang && item.category === category && item.targetUrl === `/${lang}/${category}/${slug}`,
  )

  if (!pageData || !pageData.actualUrl) {
    notFound()
  }

  const actualUrl = pageData.actualUrl

  console.log(`✅ 파일경로:`, actualUrl)

  const result = await importPage(actualUrl.split('/'), lang)
  const { default: MDXContent, toc, metadata } = result

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent params={{ ...resolvedParams, category }} />
    </Wrapper>
  )
}
