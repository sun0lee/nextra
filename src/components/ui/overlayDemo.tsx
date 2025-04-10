'use client'
import Link from 'next/link'
import { Button } from 'primereact/button'
import { Tooltip } from 'primereact/tooltip'
import JSON from 'public/kics/kics-index.json'
import React from 'react'

export default function OverlayDemo({ id }: { id: string }) {
  const data = JSON

  if (!data) {
    return <>{id}</>
  }

  const aaa = data.find((s) => s.id === id)
  if (!aaa) {
    return (
      <>
        {' '}
        {id}
        {' '}
      </>
    )
  }

  // console.log("bbb :" + aaa.id);
  //    참조위치를 설명하고 이동하는 링크기능과 + 용어설명의 용도를 추가하기 위해 구분함. (용어설명은 url, 및 hierachy 를 구분하는 LEVEL은 없고, id, title, desc로 구성되며 해당용어에 대한 설명만을 기술함. )
  //    const label = aaa.title + ' ('+ aaa.desc + ')';

  const isLink = !!(aaa && aaa.url)
  const url = isLink && aaa.url ? aaa.url : '/'
  const label = isLink ? `${aaa.title} (${aaa.desc})` : aaa.title

  const desc = isLink
    ? aaa.LEVEL1
    + (aaa.LEVEL2
      ? ` > ${aaa.LEVEL2}${aaa.LEVEL3 ? ` > ${aaa.LEVEL3} > ` : '>'}`
      : '>')
    + aaa.desc
    : aaa.desc

  return (
    <>
      <Tooltip target=".custom-target-icon" />
      {isLink ? (
        <Link
          target="blank"
          href={url}
          className="custom-target-icon !py-0 text-current underline underline-offset-4 decoration-dashed decoration-sky-500/50 "
          data-pr-tooltip={desc}
          data-pr-position="left"
          data-pr-at="left bottom+2"
          data-pr-my="left top"
        >
          {label}
        </Link>
      ) : (
        <Button
          severity="warning"
          link
          label={label}
          className="custom-target-icon !bg-transparent !p-0 !text-inherit !font-bold underline underline-offset-4 decoration-dashed decoration-red-500/50 ;"
          // className="custom-target-icon pb-0 pr-2 font-italic text-base text-primary underline"
          data-pr-tooltip={desc}
          data-pr-position="left"
          data-pr-at="left bottom"
          data-pr-my="left top"
        />
      )}
    </>
  )
}
