
import { useMDXComponents } from '@/mdx-components'
import { notFound } from 'next/navigation'
import { importPage } from 'nextra/pages'
import slugData from 'public/slugData.json'

export async function generateMetadata({ params }: { params: Promise<PageProps['params']> }) {
  const resolvedParams = await params
  const { lang, category, slug } = resolvedParams

  const pageData = slugData.find(
    (item) => item.lang === lang && item.category === category && item.targetUrl === `/${lang}/${category}/${slug}`,
  )

  if (!pageData) {
    return null
  }

  const { metadata } = await importPage(pageData.actualUrl.split('/'), lang)
  return metadata
}

type PageProps = Readonly<{
  params: {
    lang: string
    category: string
    slug: string
  }
}>

const Wrapper = useMDXComponents().wrapper

export default async function Page({ params }: { params: Promise<PageProps['params']> }) {
  const resolvedParams = await params
  const { lang, category, slug } = resolvedParams
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
      <MDXContent params={resolvedParams} />
    </Wrapper>
  )
}
