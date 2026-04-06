// src/app/api/macro/route.js
import { env } from 'node:process'

const FRED_API_KEY = env.FRED_API_KEY
const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations'

// ── 1. 데이터 Fetch 함수 (기존 코드 원상복구) ─────────────────────────

async function fetchFred(seriesId) {
  try {
    const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=5`
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // 24시간 캐시
    })
    const data = await res.json()
    // 에러 방지를 위해 data.observations가 있는지 확인 (옵셔널 체이닝 추가)
    const valid = data.observations?.filter(o => !isNaN(Number.parseFloat(o.value))) || []
    if (valid.length < 1) { return { val: 0, chg: 0 } }
    const v = Number.parseFloat(valid[0].value)
    const p = valid.length > 1 ? Number.parseFloat(valid[1].value) : v

    return { val: v, chg: v - p, date: valid[0].date }
  }
  catch (e) {
    console.error(`FRED fetch error [${seriesId}]:`, e)
    return { val: 0, chg: 0 }
  }
}

async function fetchYahoo(ticker, { scale = 1 } = {}) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2d`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 86400 },
    })
    const data = await res.json()
    const result = data?.chart?.result?.[0]
    if (!result) { return { val: 0, chg: 0 } }

    const m = result.meta
    const ts = result.timestamp || []
    let date
    if (Array.isArray(ts) && ts.length > 0) {
      date = new Date(ts[ts.length - 1] * 1000).toISOString().slice(0, 10)
    }

    const valRaw = m.regularMarketPrice
    const prevRaw = m.chartPreviousClose
    if (typeof valRaw !== 'number' || typeof prevRaw !== 'number') {
      return { val: 0, chg: 0, date }
    }

    const val = valRaw * scale
    const prev = prevRaw * scale
    return { val, chg: val - prev, date }
  }
  catch (e) {
    console.error(`Yahoo fetch error [${ticker}]:`, e)
    return { val: 0, chg: 0 }
  }
}

// ── Fear & Greed 데이터 fetch ─────────────────────────
async function fetchFearAndGreed() {
  try {
    const url = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata'
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        Referer: 'https://edition.cnn.com/',
        Origin: 'https://edition.cnn.com',
      },
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Fear & Greed API HTTP Error: ${res.status} - ${errorText.substring(0, 50)}...`)
      return { val: 50, text: 'NEUTRAL' } // 화면이 깨지지 않도록 기본값(중립) 반환
    }

    const data = await res.json()
    return {
      val: Math.round(data.fear_and_greed.score),
      text: data.fear_and_greed.rating.toUpperCase(),
    }
  }
  catch (e) {
    console.error('Fear & Greed fetch error:', e.message)
    // 네트워크 오류 등 발생 시에도 화면이 깨지지 않게 기본값을 줍니다.
    return { val: 50, text: 'NEUTRAL' }
  }
}

// ── YCharts TGA 실시간 데이터 fetch (웹 스크래핑) ─────────────────────────
async function fetchYChartsTGA() {
  try {
    const url = 'https://ycharts.com/indicators/treasury_general_account_closing_balance'
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 }, // 1시간 캐시 (원하시면 조절 가능)
    })

    if (!res.ok) { throw new Error(`HTTP Error: ${res.status}`) }
    const html = await res.text() // Next.js에서는 res.text()로 HTML을 읽어옵니다.

    const getVal = (label) => {
      const regex = new RegExp(`>\\s*${label}\\s*<\\/td>\\s*<td[^>]*>\\s*([\\d\\.,]+[BKMGT]?)`, 'i')
      const match = html.match(regex)
      return match ? match[1] : null
    }

    const lastValueRaw = getVal('Last Value')
    const yestValueRaw = getVal('Value from Yesterday')

    if (!lastValueRaw) { throw new Error('데이터 패턴 매칭 실패') }

    const parseNumber = (str) => {
      if (!str) { return 0 }
      let numStr = str.replace(/,/g, '')
      let isBillion = false
      let isTrillion = false

      // 단위 파악 및 제거
      if (numStr.toUpperCase().includes('B')) {
        isBillion = true
        numStr = numStr.replace(/B/gi, '')
      }
      else if (numStr.toUpperCase().includes('T')) {
        isTrillion = true
        numStr = numStr.replace(/T/gi, '')
      }

      let v = Number.parseFloat(numStr)

      // FRED WDTGAL(Millions 기준)과 단위를 맞추기 위한 변환 작업
      // 기존 라우트에서 'tga.val / 1000'을 통해 Trillions(조 달러)로 변환하고 있으므로,
      // 여기서 Millions 단위로 맞춰서 리턴해 주어야 공식이 딱 맞습니다.
      if (isBillion) { v = v * 1000 }
      if (isTrillion) { v = v * 1000000 }
      return v
    }

    const val = parseNumber(lastValueRaw)
    const yestVal = parseNumber(yestValueRaw)
    const chg = val - yestVal

    // 오늘 날짜를 YYYY-MM-DD 형식으로 생성
    const today = new Date().toISOString().slice(0, 10)

    return { val, chg, date: today }
  }
  catch (e) {
    console.error('YCharts TGA fetch error:', e.message)
    return { val: 0, chg: 0, date: null }
  }
}

// ── 2. 항목별 라우팅 처리 로직 ─────────────────────────

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'all'

  try {
    const updatedAt = new Date().toISOString()

    if (category === 'fng') {
      const fng = await fetchFearAndGreed()
      return Response.json({ ...fng, updatedAt })
    }

    if (category === 'rates') {
      const [dff, t2, t5, t10] = await Promise.all([
        fetchFred('DFF'),
        fetchFred('DGS2'),
        fetchFred('DGS5'),
        fetchFred('DGS10'),
      ])
      const spread_2_10 = {
        val: (t10?.val || 0) - (t2?.val || 0),
        chg: (t10?.chg || 0) - (t2?.chg || 0),
      }
      return Response.json({ dff, t2, t5, t10, spread_2_10, updatedAt })
    }

    // 1. VIX 단독 호출
    if (category === 'vix') {
      const [vix, vvix] = await Promise.all([fetchYahoo('^VIX'), fetchYahoo('^VVIX')])
      return Response.json({ vix, vvix, updatedAt })
    }

    // 2. MOVE 단독 호출
    if (category === 'move') {
      const move = await fetchYahoo('^MOVE')
      return Response.json({ move, updatedAt })
    }

    // 3. DXY 단독 호출
    if (category === 'dxy') {
      const dxy = await fetchYahoo('DX-Y.NYB')
      return Response.json({ dxy, updatedAt })
    }

    if (category === 'liquidity') {
      // fetchYChartsTGA() 를 Promise.all 배열에 추가하고, tga_daily 로 받습니다.
      const [bal, tga, tga_daily, onrrp, resrv] = await Promise.all([
        fetchFred('WALCL'),
        fetchFred('WDTGAL'),
        fetchYChartsTGA(),
        fetchFred('RRPONTSYD'),
        fetchFred('WRESBAL'),
      ])
      return Response.json({
        bal: { val: (bal?.val || 0) / 1000, chg: (bal?.chg || 0) / 1000, date: bal?.date },
        tga: { val: (tga?.val || 0) / 1000, chg: (tga?.chg || 0) / 1000, date: tga?.date },
        // tga_daily 응답 추가 (Trillions 단위로 동일하게 변환)
        tga_daily: { val: (tga_daily?.val || 0) / 1000, chg: (tga_daily?.chg || 0) / 1000, date: tga_daily?.date },
        onrrp,
        resrv: { val: (resrv?.val || 0) / 1000, chg: (resrv?.chg || 0) / 1000, date: resrv?.date },
        updatedAt,
      })
    }

    // 1. 실질금리 단독 호출
    if (category === 'realRates') {
      const [tips10, bei10, tips5, bei5] = await Promise.all([
        fetchFred('DFII10'),
        fetchFred('T10YIE'),
        fetchFred('DFII5'),
        fetchFred('T5YIE'),
      ])
      return Response.json({ tips10, bei10, tips5, bei5, updatedAt })
    }

    // 2. 머니마켓 단독 호출
    if (category === 'moneyMarket') {
      const [sofr, iorb] = await Promise.all([
        fetchFred('SOFR'),
        fetchFred('IORB'),
      ])
      const sofr_iorb = {
        val: ((sofr?.val || 0) - (iorb?.val || 0)) * 100,
        chg: ((sofr?.chg || 0) - (iorb?.chg || 0)) * 100,
      }
      return Response.json({ sofr, iorb, sofr_iorb, updatedAt })
    }

    if (category === 'credit') {
      const [hy, ig] = await Promise.all([fetchFred('BAMLH0A0HYM2'), fetchFred('BAMLC0A0CM')])
      return Response.json({ hy, ig, updatedAt })
    }

    // 요약 카드용 전체 호출
    if (category === 'all') {
      const [
        fng,
        dff,
        t2,
        t5,
        t10,
        tips10,
        bei10,
        tips5,
        bei5,
        sofr,
        iorb,
        hy,
        ig,
        bal,
        tga,
        tga_daily,
        onrrp,
        resrv,
        move,
        vix,
        vvix,
        dxy, // tga_daily 추가
      ] = await Promise.all([
        fetchFearAndGreed(),
        fetchFred('DFF'),
        fetchFred('DGS2'),
        fetchFred('DGS5'),
        fetchFred('DGS10'),
        fetchFred('DFII10'),
        fetchFred('T10YIE'),
        fetchFred('DFII5'),
        fetchFred('T5YIE'),
        fetchFred('SOFR'),
        fetchFred('IORB'),
        fetchFred('BAMLH0A0HYM2'),
        fetchFred('BAMLC0A0CM'),
        fetchFred('WALCL'),
        fetchFred('WDTGAL'),
        fetchYChartsTGA(),
        fetchFred('RRPONTSYD'),
        fetchFred('WRESBAL'), // fetchYChartsTGA() 추가
        fetchYahoo('^MOVE'),
        fetchYahoo('^VIX'),
        fetchYahoo('^VVIX'),
        fetchYahoo('DX-Y.NYB'),
      ])

      const spread_2_10 = { val: (t10?.val || 0) - (t2?.val || 0), chg: (t10?.chg || 0) - (t2?.chg || 0) }
      const sofr_iorb = { val: ((sofr?.val || 0) - (iorb?.val || 0)) * 100, chg: ((sofr?.chg || 0) - (iorb?.chg || 0)) * 100 }

      return Response.json({
        updatedAt,
        fng,
        rates: { dff, t2, t5, t10, spread_2_10 },
        realRates: { tips10, bei10, tips5, bei5 },
        risk: { move, vix, vvix },
        liquidity: {
          bal: { val: (bal?.val || 0) / 1000, chg: (bal?.chg || 0) / 1000, date: bal?.date },
          tga: { val: (tga?.val || 0) / 1000, chg: (tga?.chg || 0) / 1000, date: tga?.date },
          tga_daily: { val: (tga_daily?.val || 0) / 1000, chg: (tga_daily?.chg || 0) / 1000, date: tga_daily?.date }, // tga_daily 결과 추가
          onrrp,
          resrv: { val: (resrv?.val || 0) / 1000, chg: (resrv?.chg || 0) / 1000, date: resrv?.date },
        },
        moneyMarket: { sofr, iorb, sofr_iorb },
        credit: { hy, ig },
        dollar: { dxy },
      })
    }

    return Response.json({ error: 'Invalid category' }, { status: 400 })
  }
  catch (e) {
    console.error('API route error:', e)
    return Response.json({ error: 'Failed to fetch macro data' }, { status: 500 })
  }
}
