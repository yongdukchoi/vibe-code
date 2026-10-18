// 카카오 로컬 키워드 검색으로 전국 골프장을 수집해 src/service/golfCourses.json 을 만든다.
// 사용: .env.local 에 KAKAO_REST_KEY=... (또는 VITE_KAKAO_REST_KEY) 를 넣고
//       node scripts/collectGolf.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const readEnv = () => {
  if (!existsSync('.env.local')) return {}
  return Object.fromEntries(
    readFileSync('.env.local', 'utf-8')
      .split(/\r?\n/)
      .filter((l) => l.includes('=') && !l.startsWith('#'))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  )
}
const env = readEnv()
const KEY = process.env.KAKAO_REST_KEY || env.KAKAO_REST_KEY || env.VITE_KAKAO_REST_KEY
if (!KEY) {
  console.error('카카오 REST 키가 없습니다. .env.local 에 KAKAO_REST_KEY 를 설정하세요.')
  process.exit(1)
}

// 골프장이 있는 주요 시·군 (필요하면 추가)
const REGIONS = `서울 부산 대구 인천 광주 대전 울산 세종
수원 성남 용인 고양 안양 군포 의왕 광명 시흥 안산 화성 평택 오산 안성 이천 여주 광주시 하남 남양주 구리 양주 포천 동두천 의정부 파주 김포 가평 양평 연천 부천
춘천 원주 강릉 동해 태백 속초 삼척 홍천 횡성 영월 평창 정선 철원 화천 양구 인제 고성 양양
청주 충주 제천 보은 옥천 영동 증평 진천 괴산 음성 단양
천안 공주 보령 아산 서산 논산 계룡 당진 금산 부여 서천 청양 홍성 예산 태안
전주 군산 익산 정읍 남원 김제 완주 진안 무주 장수 임실 순창 고창 부안
목포 여수 순천 나주 광양 담양 곡성 구례 고흥 보성 화순 장흥 강진 해남 영암 무안 함평 영광 장성 완도 진도 신안
포항 경주 김천 안동 구미 영주 영천 상주 문경 경산 군위 의성 청송 영양 영덕 청도 고령 성주 칠곡 예천 봉화 울진 울릉
창원 진주 통영 사천 김해 밀양 거제 양산 의령 함안 창녕 고성군 남해 하동 산청 함양 거창 합천
제주 서귀포`.split(/\s+/)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const search = async (query, page) => {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15&page=${page}`
  const res = await fetch(url, { headers: { Authorization: `KakaoAK ${KEY}` } })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return res.json()
}

// 골프장만 남기고 연습장/스크린/파크골프/용품점 등은 제외
const isCourse = (d) => {
  const cat = d.category_name || ''
  if (!cat.includes('골프장')) return false
  return !/연습장|스크린|파크골프|골프용품|골프샵|미니골프/.test(cat + d.place_name)
}

const found = new Map()
for (const region of REGIONS) {
  for (let page = 1; page <= 3; page++) {
    let data
    try {
      data = await search(`${region} 골프장`, page)
    } catch (e) {
      console.error(`[${region}] 실패:`, e.message)
      break
    }
    for (const d of data.documents.filter(isCourse)) {
      if (!found.has(d.id)) found.set(d.id, d)
    }
    if (data.meta.is_end) break
    await sleep(80)
  }
  console.log(`${region}: 누적 ${found.size}곳`)
}

const list = [...found.values()]
  .map((d) => {
    const address = d.road_address_name || d.address_name
    return {
      name: d.place_name,
      region: address.split(' ').slice(0, 2).join(' '),
      address,
      lat: Number(d.y),
      lng: Number(d.x),
    }
  })
  .sort((a, b) => a.region.localeCompare(b.region, 'ko') || a.name.localeCompare(b.name, 'ko'))
  .map((c, i) => ({ id: i + 1, ...c }))

writeFileSync('src/service/golfCourses.json', JSON.stringify(list, null, 1), 'utf-8')
console.log(`완료: ${list.length}곳 → src/service/golfCourses.json`)
