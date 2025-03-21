import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Bleed, Callout, Cards, FileTree, Pre, Steps, Table, Tabs, withIcons } from 'nextra/components'
import { GitHubIcon } from 'nextra/icons'
import Image from 'next/image'

export const useMDXComponents: typeof getDocsMDXComponents = () => ({
  ...getDocsMDXComponents({
    pre: withIcons(Pre, { js: GitHubIcon }),
  }),
  Bleed,
  Callout,
  Cards,
  Image,
  FileTree,
  Steps,
  Tabs,
  Table,
})
