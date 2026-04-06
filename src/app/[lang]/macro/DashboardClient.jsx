// src/app/[lang]/macro/DashboardClient.jsx
'use client'

import { useEffect, useState } from 'react'

// ── 1. 유틸 함수 및 공통 UI 컴포넌트 (내부용) ─────────────────────────
function fmt(val, digits = 2) {
  if (val === undefined || val === null || isNaN(val)) { return '–' }
  return Number(val).toFixed(digits)
}

function fmtT(val, digits = 1) {
  if (val === undefined || val === null || isNaN(val)) { return '–' }
  return `$${Number(val).toFixed(digits)}T`
}

function ChgBadge({ chg, digits = 2, suffix = '' }) {
  if (chg === undefined || chg === null || isNaN(chg)) { return null }
  const isPos = chg > 0
  const isNeg = chg < 0
  const color = isPos ? 'text-red-500' : isNeg ? 'text-blue-500' : 'text-gray-400'
  const sign = isPos ? '+' : ''
  return (
    <span className={`text-xs font-mono ${color}`}>
      {sign}
      {fmt(chg, digits)}
      {suffix}
    </span>
  )
}

function Row({ label, value, chg, digits = 2, suffix = '', chgSuffix = '', date }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 w-32 shrink-0">{label}</span>
      <span className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-100 flex items-baseline gap-1">
        {value}
        {suffix}
        {date && (
          <span className="text-xs font-normal text-gray-400">
            {date}
            {' '}
            (UTC)
          </span>
        )}
      </span>
      <ChgBadge chg={chg} digits={digits} suffix={chgSuffix} />
    </div>
  )
}

function SectionTitle({ children, color = 'amber' }) {
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    red: 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    teal: 'text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    amber: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    purple: 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  }
  return (
    <h3 className={`text-xs font-bold tracking-widest uppercase mb-2 pb-1 border-b ${colors[color]}`}>
      {children}
    </h3>
  )
}

function Card({ children, className = 'w-full md:w-[60%] min-w-[300px] mx-auto my-6' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 ${className}`}>
      {children}
    </div>
  )
}

function FearGreedGauge({ val }) {
  const getColor = (v) => {
    if (v <= 25) { return 'text-red-500' }
    if (v <= 45) { return 'text-orange-400' }
    if (v <= 55) { return 'text-gray-400' }
    if (v <= 75) { return 'text-green-400' }
    return 'text-green-600'
  }
  const getLabel = (v) => {
    if (v <= 25) { return '극단적 공포' }
    if (v <= 45) { return '공포' }
    if (v <= 55) { return '중립' }
    if (v <= 75) { return '탐욕' }
    return '극단적 탐욕'
  }
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <span className={`text-5xl font-bold font-mono ${getColor(val)}`}>{val}</span>
      <span className={`text-sm font-semibold mt-1 ${getColor(val)}`}>{getLabel(val)}</span>
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-3">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
          style={{ width: `${val}%` }}
        />
      </div>
      <div className="flex justify-between w-full mt-1">
        <span className="text-xs text-gray-400">공포 0</span>
        <span className="text-xs text-gray-400">100 탐욕</span>
      </div>
    </div>
  )
}

const CardState = ({ loading, error }) => {
  if (loading) { return <div className="text-gray-400 text-sm animate-pulse flex h-full items-center justify-center min-h-[150px]">데이터 불러오는 중...</div> }
  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 min-h-[150px]">
        데이터 로드 실패:
        {' '}
        {error}
      </div>
    )
  }
  return null
}

// ── 2. 데이터 페칭 커스텀 훅 ───────────────────────────
function useMacroData(category) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/macro?category=${category}`)
      .then(r => r.json())
      .then((d) => {
        if (d.error) { throw new Error(d.error) }
        setData(d)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [category])

  return { data, loading, error }
}

// ── 3. 개별 카드 컴포넌트들 ───────────────────────────

export function FearGreedCard() {
  const { data, loading, error } = useMacroData('fng')
  return (
    <Card>
      <SectionTitle>Fear & Greed Index</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && <FearGreedGauge val={data.val} />}
    </Card>
  )
}

export function RatesCard() {
  const { data, loading, error } = useMacroData('rates')
  return (
    <Card>
      <SectionTitle>Rates and Yields</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && (
        <>
          <Row label="Fed Funds" value={fmt(data.dff?.val)} suffix="%" chg={data.dff?.chg} chgSuffix="%" date={data.dff?.date} />
          <Row label="US 2Y" value={fmt(data.t2?.val)} suffix="%" chg={data.t2?.chg} chgSuffix="%" date={data.t2?.date} />
          <Row label="US 5Y" value={fmt(data.t5?.val)} suffix="%" chg={data.t5?.chg} chgSuffix="%" date={data.t5?.date} />
          <Row label="US 10Y" value={fmt(data.t10?.val)} suffix="%" chg={data.t10?.chg} chgSuffix="%" date={data.t10?.date} />
          <Row label="2Y 10Y 스프레드" value={fmt(data.spread_2_10?.val)} suffix="pt" chg={data.spread_2_10?.chg} chgSuffix="pt" />
        </>
      )}
    </Card>
  )
}

// ── 분리된 변동성 및 달러 카드들 ───────────────────────────

export function VixCard({ className }) {
  const { data, loading, error } = useMacroData('vix')
  return (
    <Card className={className}>
      <SectionTitle>VIX (주식 변동성)</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && (
        <>
          <Row label="VIX Index" value={fmt(data.vix?.val)} chg={data.vix?.chg} date={data.vix?.date} />
          <Row label="VVIX Index" value={fmt(data.vvix?.val)} chg={data.vvix?.chg} date={data.vvix?.date} />
        </>
      )}
    </Card>
  )
}

export function MoveCard({ className }) {
  const { data, loading, error } = useMacroData('move')
  return (
    <Card className={className}>
      <SectionTitle>MOVE (채권 변동성)</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && (
        <Row label="MOVE Index" value={fmt(data.move?.val)} chg={data.move?.chg} date={data.move?.date} />
      )}
    </Card>
  )
}

export function DxyCard({ className }) {
  const { data, loading, error } = useMacroData('dxy')
  return (
    <Card className={className}>
      <SectionTitle>달러 인덱스</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && (
        <Row label="DXY" value={fmt(data.dxy?.val)} chg={data.dxy?.chg} date={data.dxy?.date} />
      )}
    </Card>
  )
}

export function LiquidityCard() {
  const { data, loading, error } = useMacroData('liquidity')
  return (
    <Card>
      <SectionTitle color="blue">연준 유동성 (USD Trillions)</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && (
        <>
          <Row label="Fed 대차대조표" value={fmtT(data.bal?.val)} chg={data.bal?.chg} digits={3} chgSuffix="T" date={data.bal?.date} />
          {/* TGA 잔고를 주간과 일간 두 줄로 나누어 표시합니다 */}
          <Row label="TGA 잔고 (주간)" value={fmtT(data.tga?.val)} chg={data.tga?.chg} digits={3} chgSuffix="T" date={data.tga?.date} />
          <Row label="TGA 잔고 (일간)" value={fmtT(data.tga_daily?.val)} chg={data.tga_daily?.chg} digits={3} chgSuffix="T" date={data.tga_daily?.date} />
          <Row label="ON RRP" value={fmt(data.onrrp?.val)} suffix="B" chg={data.onrrp?.chg} digits={1} chgSuffix="B" date={data.onrrp?.date} />
          <Row label="은행 지급준비금" value={fmtT(data.resrv?.val)} chg={data.resrv?.chg} digits={3} chgSuffix="T" date={data.resrv?.date} />
        </>
      )}
    </Card>
  )
}

export function RealRatesCard({ className }) {
  const { data, loading, error } = useMacroData('realRates')
  return (
    <Card className={className}>
      <SectionTitle>실질금리</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && (
        <>
          <Row label="TIPS 5Y" value={fmt(data.tips5?.val)} suffix="%" chg={data.tips5?.chg} chgSuffix="%" date={data.tips5?.date} />
          <Row label="BEI 5Y (기대인플레)" value={fmt(data.bei5?.val)} suffix="%" chg={data.bei5?.chg} chgSuffix="%" date={data.bei5?.date} />
          <Row label="TIPS 10Y" value={fmt(data.tips10?.val)} suffix="%" chg={data.tips10?.chg} chgSuffix="%" date={data.tips10?.date} />
          <Row label="BEI 10Y (기대인플레)" value={fmt(data.bei10?.val)} suffix="%" chg={data.bei10?.chg} chgSuffix="%" date={data.bei10?.date} />
        </>
      )}
    </Card>
  )
}

export function MoneyMarketCard({ className }) {
  const { data, loading, error } = useMacroData('moneyMarket')
  return (
    <Card className={className}>
      <SectionTitle>머니마켓</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && (
        <>
          <Row label="SOFR" value={fmt(data.sofr?.val)} suffix="%" chg={data.sofr?.chg} chgSuffix="%" date={data.sofr?.date} />
          <Row label="IORB" value={fmt(data.iorb?.val)} suffix="%" chg={data.iorb?.chg} chgSuffix="%" date={data.iorb?.date} />
          <Row label="SOFR-IORB 스프레드" value={fmt(data.sofr_iorb?.val)} suffix="bp" chg={data.sofr_iorb?.chg} digits={2} chgSuffix="bp" />
        </>
      )}
    </Card>
  )
}

export function CreditCard() {
  const { data, loading, error } = useMacroData('credit')
  return (
    <Card>
      <SectionTitle>신용 스프레드</SectionTitle>
      <CardState loading={loading} error={error} />
      {data && (
        <>
          <Row label="HY OAS" value={fmt(data.hy?.val)} suffix="%" chg={data.hy?.chg} chgSuffix="%" date={data.hy?.date} />
          <Row label="IG OAS" value={fmt(data.ig?.val)} suffix="%" chg={data.ig?.chg} chgSuffix="%" date={data.ig?.date} />
        </>
      )}
    </Card>
  )
}

export function SignalSummaryCard() {
  const { data, loading, error } = useMacroData('all')

  if (loading) {
    return (
      <Card>
        <SectionTitle>현재 시장 신호 요약</SectionTitle>
        <CardState loading={loading} error={error} />
      </Card>
    )
  }
  if (error) {
    return (
      <Card>
        <SectionTitle>현재 시장 신호 요약</SectionTitle>
        <CardState loading={loading} error={error} />
      </Card>
    )
  }
  if (!data) { return null }

  const { rates, risk, credit, liquidity } = data
  const signals = []

  // 데이터 안전성 체크 (에러 방지용)
  if (rates?.spread_2_10?.val !== undefined) {
    const spread = rates.spread_2_10.val
    if (spread < 0) {
      signals.push({ text: `수익률 곡선 역전 (${fmt(spread)}pt) — 경기침체 선행 신호`, type: 'bear' })
    }
    else if (spread < 0.3) {
      signals.push({ text: `수익률 곡선 평탄화 (${fmt(spread)}pt) — 주의 구간`, type: 'warn' })
    }
    else {
      signals.push({ text: `수익률 곡선 정상 (${fmt(spread)}pt)`, type: 'bull' })
    }
  }

  if (risk?.vix?.val !== undefined) {
    if (risk.vix.val >= 30) {
      signals.push({ text: `VIX ${fmt(risk.vix.val)} — 공포 구간`, type: 'bear' })
    }
    else if (risk.vix.val >= 20) {
      signals.push({ text: `VIX ${fmt(risk.vix.val)} — 불확실성 상승`, type: 'warn' })
    }
    else {
      signals.push({ text: `VIX ${fmt(risk.vix.val)} — 안정 구간`, type: 'bull' })
    }
  }

  if (credit?.hy?.val !== undefined) {
    if (credit.hy.val >= 6) {
      signals.push({ text: `HY OAS ${fmt(credit.hy.val)}% — 신용 스트레스`, type: 'bear' })
    }
    else if (credit.hy.val >= 4.5) {
      signals.push({ text: `HY OAS ${fmt(credit.hy.val)}% — 주의`, type: 'warn' })
    }
    else {
      signals.push({ text: `HY OAS ${fmt(credit.hy.val)}% — 안정`, type: 'bull' })
    }
  }

  if (liquidity?.resrv?.val !== undefined) {
    if (liquidity.resrv.val < 2) {
      signals.push({ text: `지급준비금 $${fmt(liquidity.resrv.val, 1)}T — 임계 수준 접근`, type: 'bear' })
    }
    else {
      signals.push({ text: `지급준비금 $${fmt(liquidity.resrv.val, 1)}T — 충분`, type: 'bull' })
    }
  }

  const colors = {
    bull: 'text-green-600 dark:text-green-400',
    warn: 'text-amber-500 dark:text-amber-400',
    bear: 'text-red-500 dark:text-red-400',
  }
  const icons = { bull: '↑', warn: '→', bear: '↓' }

  return (
    <Card>
      <SectionTitle>현재 시장 신호 요약</SectionTitle>
      <ul className="space-y-2">
        {signals.map((s, i) => (
          <li key={i} className={`text-xs flex gap-2 ${colors[s.type]}`}>
            <span className="font-bold shrink-0">{icons[s.type]}</span>
            <span>{s.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
