import type { MetaRecord } from 'nextra'

export default {
  index: {
    title: 'introduction',
    type: 'doc',
  },
  '01-intro': {
    title: 'I. 총칙',
    type: 'doc',
    theme: { navbar: true },
  },
  '02-valuation': { title: 'II. 자산 및 부채평가', type: 'doc' },
  '03-ac': { title: 'III. 지급여력금액', type: 'doc' },
  '04-scr': { title: 'IV. 지급여력기준금액', type: 'doc' },
  '05-doc': { title: 'V. 문서화', type: 'doc' },
  '06-trans': { title: 'VI. 경과조치', type: 'doc' },
} satisfies MetaRecord
