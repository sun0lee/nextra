import type { ReactNode } from 'react'
import Image from 'next/image'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Bleed, Callout, FileTree, Pre, Steps, Tabs, withIcons } from 'nextra/components'
import { GitHubIcon } from 'nextra/icons'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Fieldset } from 'primereact/fieldset'
import { Message } from 'primereact/message'
import { ScrollPanel } from 'primereact/scrollpanel'
import { TabPanel, TabView } from 'primereact/tabview'
import { Tooltip } from 'primereact/tooltip'
import { OverviewPage } from '@/components/overview-page'
import OverlayDemo from '@/components/ui/overlayDemo'

const G2Col = ({ children }: { children: ReactNode[] }) => {
  return (
    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b p-2">
      <div>{children[0]}</div>
      <div>{children[1]}</div>
    </div>
  )
}

const severityIconMap = {
  success: 'pi pi-check-circle',
  info: 'pi pi-info-circle',
  warn: 'pi pi-exclamation-triangle',
  error: 'pi pi-times-circle',
}

const GCallout = ({
  title,
  width = '100%',
  severity,
  children,
}: {
  title: string
  severity?: 'success' | 'info' | 'warn' | 'error' | undefined
  width?: string
  children: ReactNode
}) => {
  const iconClass = severity ? severityIconMap[severity] : 'pi pi-question-circle'

  const _title = title
    ? (
        <>
          <i className={`${iconClass} mr-1`}></i>
          {title}
        </>
      )
    : ''
  const _severity = severity || 'info'
  const _width = width || '100%'

  return (
    <div className="my-3">
      <Message
        style={{
          justifyContent: 'left',
          alignItems: 'start',
          padding: '1rem',
          width: _width,
        }}
        severity={_severity}
        content={(
          <div style={{ width: '100%', textAlign: 'left' }}>
            {title && (
              <div style={{ fontWeight: '700', marginBottom: '0.7rem', fontSize: '1.03rem' }}>
                {_title}
              </div>
            )}
            {children && (
              <div style={{ width: '100%' }}>{children}</div>
            )}
          </div>
        )}
      />
    </div>
  )
}

const KicsParagraph = ({
  children,
  width = '100%',
}: {
  children: ReactNode
  width?: string
}) => {
  return (
    <div className="my-3 kics-paragraph-wrapper">
      <Message
        style={{
          justifyContent: 'left',
          alignItems: 'start',
          padding: '1.2rem 1rem',
          width: width || '100%',
          borderLeft: '4px solid #cbd5e1',
        }}
        severity="info"
        content={(
          /* [&_>_:first-child]:!mt-0 설명:
             이 div 바로 아래에 오는 첫 번째 자식 요소가 무엇이든
             margin-top을 강제로(! 중요도 포함) 0으로 만듭니다.
          */
          <div
            className="[&_>_:first-child]:!mt-0"
            style={{
              width: '100%',
              textAlign: 'left',
              color: 'var(--text-color)',
            }}
          >
            {children}
          </div>
        )}
      />
    </div>
  )
}

const GMath = ({
  title,
  width = '100%',
  severity,
  children,
}: {
  title: string
  severity?: 'success' | 'info' | 'warn' | 'error' | undefined
  width?: string
  children: ReactNode
}) => {
  const _title = title
    ? (
        <>
          <i className="pi pi-chevron-circle-down mr-1"></i>
          {title}
        </>
      )
    : ''
  const _severity = severity || 'contrast'
  const _width = width || '100%'

  return (
    <div className="my-2">
      <Message
        style={{
          padding: '0.7rem',
          paddingLeft: '1rem',
          width: _width,
        }}
        severity={_severity}
        content={(
          <div style={{ width: '100%', textAlign: 'left' }}>
            {title && (
              <div style={{ fontWeight: '600', marginBottom: '0.7rem', fontSize: '0.9rem' }}>
                {_title}
              </div>
            )}
            {children && (
              <div style={{ width: '100%', textAlign: 'center', overflowX: 'auto', overflowY: 'hidden', scrollbarGutter: 'stable' }}>
                <div style={{ display: 'inline-block', whiteSpace: 'nowrap', paddingBottom: '0.5rem' }}>
                  {children}
                </div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}

const GTooltip = ({ label, desc }: { label: string, desc: string }) => {
  return (
    <>
      <Tooltip target=".tooltip-target" />
      <Button
        severity="warning"
        link
        label={label}
        className="tooltip-target !bg-transparent !border-none !shadow-none  !py-0 !px-0 !mx-0 !text-inherit underline underline-offset-4 decoration-dashed decoration-yellow-500/50 "
        data-pr-tooltip={desc}
        data-pr-position="mouse"
        data-pr-at="left bottom"
        data-pr-my="left top"
      />
    </>
  )
}

const GTooltipIcon = ({
  desc,
  icon = 'pi pi-question-circle',
  severity = 'info', //  secondary
}: {
  desc: string
  icon: string
  severity: 'success' | 'info' | 'warning' | 'secondary' | 'danger'
}) => {
  return (
    <>
      <Tooltip target=".tooltip-target" />
      <Button
        icon={icon}
        text
        rounded
        severity={severity}
        className="tooltip-target !py-0 !px-0 !align-baseline !w-6"
        data-pr-tooltip={desc}
        data-pr-position="mouse"
        data-pr-at="left bottom+4"
        data-pr-my="left top"
      />
    </>
  )
}
const OverlayDemoBasel = ({ id }: { id?: string }) => <>{id}</>
/* const GCmt = ({ children }: { children?: React.ReactNode }) => <>{children}</> */

const GCaption = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-center text-[0.9rem]  italic text-gray-500 dark:text-gray-400 mt-0 mb-4">
      〈
      {' '}
      {children}
      {' '}
      〉
    </div>
  )
}

const GCmt = ({
  title,
  severity,
  children,
}: {
  title?: string
  severity?: 'success' | 'info' | 'warn' | 'error' | undefined
  children: ReactNode
}) => {
  const _severity = severity || 'contrast'
  return (
    <div className="my-2">
      <Message
        style={{
          marginTop: ['success', 'info', 'warn', 'error', 'contrast'].includes(_severity) ? '-0.5rem' : '0rem',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
          // paddingBottom: ['success', 'info', 'warn', 'error'].includes(severity) ? '0.5rem' : '-0.5rem',
          width: '100%',
        }}
        severity={_severity}
        content={(
          <div style={{ width: '100%', textAlign: 'left' }}>
            {title && (
              <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                {title}
              </div>
            )}
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: '400',
                color: 'var(--surface-700)',
                letterSpacing: '-0.04em',
              }}
            >
              {children}
            </div>
          </div>
        )}
      />
    </div>
  )
}

const GLv1 = ({ children }: { children: ReactNode }) => (
  <div className="italic text-blue-900 dark:text-blue-200 ">
    {children}
  </div>
)

const GLv2 = ({ children }: { children: ReactNode }) => (
  <div className="border-l-4 border-gray-400 pl-1 my-2  text-gray-800 dark:text-gray-300">
    {children}
  </div>
)

interface GImgProps {
  children: React.ReactNode
  caption?: string
  maxWidth?: string
}

const GImg = ({ children, caption, maxWidth = '500px' }: GImgProps) => (
  <div
    className="mx-auto text-center border border-surface-300 rounded-md px-5 pt-2 my-2"
    style={{ maxWidth }}
  >
    <div className="[&>img]:max-w-full [&>img]:h-auto">{children}</div>
    {caption && (
      <div className="text-center text-[0.9rem] italic text-gray-500 dark:text-gray-400 mt-0 mb-2">
        〈
        {' '}
        {caption}
        {' '}
        〉
      </div>
    )}
  </div>
)

const GLink = ({ href, children }: { href: string, children?: React.ReactNode }) => {
  const isDefault = !children

  return (
    <a
      href={href}
      className="
        font-bold
        text-inherit
        hover:text-blue-600
        transition-colors
        cursor-pointer
        group
        whitespace-nowrap
      "
    >
      {isDefault
        ? (
            <span className="text-slate-400 dark:text-slate-500 font-medium">↩ back</span>
          )
        : (
            <span className="inline-flex items-baseline gap-1 align-baseline whitespace-nowrap [text-indent:0]">
              <span>{children}</span>
              <i className="pi pi-search text-[0.9em] opacity-80 transition-opacity shrink-0" />
            </span>
          )}
    </a>
  )
}

export const useMDXComponents: typeof getDocsMDXComponents = () => ({
  ...getDocsMDXComponents({
    pre: withIcons(Pre, { js: GitHubIcon }),
  }),
  Bleed,
  Callout,
  Image,
  FileTree,
  Steps,
  Tabs,
  OverviewPage,
  Button,
  Card,
  Fieldset,
  AccordionTab,
  Accordion,
  Tooltip,
  TabPanel,
  TabView,
  ScrollPanel,
  OverlayDemo,
  OverlayDemoBasel,
  GCmt,
  GCallout,
  KicsParagraph,
  GMath,
  G2Col,
  GTooltip,
  GTooltipIcon,
  GCaption,
  GLv1,
  GLv2,
  GImg,
  GLink,
})

export const GTag = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) { return null } // 태그가 없으면 아무것도 안 보여줌

  return (
    <div className="flex flex-wrap gap-2 mb-6 mt-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
        >
          #
          {' '}
          {tag}
        </span>
      ))}
    </div>
  )
}
