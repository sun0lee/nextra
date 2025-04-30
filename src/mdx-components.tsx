import type { ReactNode } from 'react'
import OverlayDemo from '@/components/ui/overlayDemo'
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
  GMath,
  G2Col,
  GTooltip,
  GTooltipIcon,
  GCaption,
  GLv1,
  GLv2,
  GImg,
})
