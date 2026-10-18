import axios from 'axios'

// 카카오(카카오모빌리티 길찾기)·티맵(SK Open API) 경로 조회로 예상 소요시간을 비교한다.
// 키는 .env.local 의 VITE_KAKAO_REST_KEY / VITE_TMAP_APP_KEY 에 넣는다.
// CORS 회피를 위해 개발 서버 프록시(/kakao-navi, /tmap-api)를 거친다. (vite.config.js)
const KAKAO_KEY = import.meta.env.VITE_KAKAO_REST_KEY
const TMAP_KEY = import.meta.env.VITE_TMAP_APP_KEY

// 경로 옵션별 각 업체 파라미터
const KAKAO_PRIORITY = { recommend: 'RECOMMEND', fast: 'TIME' }
const TMAP_SEARCH_OPTION = { recommend: 0, fast: 2 }

// 각 업체: 경로 계산 지원 여부(키 보유)와 조회 함수. 반환: { duration(초), distance(m) }
export const ROUTE_PROVIDERS = {
  kakao: {
    enabled: Boolean(KAKAO_KEY),
    fetch: async (from, to, option) => {
      const res = await axios.get('/kakao-navi/v1/directions', {
        headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
        params: {
          origin: `${from.lng},${from.lat}`,
          destination: `${to.lng},${to.lat}`,
          priority: KAKAO_PRIORITY[option],
        },
      })
      const route = res.data.routes?.[0]
      if (!route || route.result_code !== 0) throw new Error(route?.result_msg || '경로를 찾을 수 없습니다.')
      return { duration: route.summary.duration, distance: route.summary.distance }
    },
  },
  tmap: {
    enabled: Boolean(TMAP_KEY),
    fetch: async (from, to, option) => {
      const res = await axios.post(
        '/tmap-api/tmap/routes?version=1',
        {
          startX: from.lng,
          startY: from.lat,
          endX: to.lng,
          endY: to.lat,
          reqCoordType: 'WGS84GEO',
          resCoordType: 'WGS84GEO',
          searchOption: TMAP_SEARCH_OPTION[option],
        },
        { headers: { appKey: TMAP_KEY } }
      )
      const p = res.data.features?.[0]?.properties
      if (!p) throw new Error('경로를 찾을 수 없습니다.')
      return { duration: p.totalTime, distance: p.totalDistance }
    },
  },
}

export const currentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('위치 정보를 사용할 수 없는 브라우저입니다.'))
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => reject(new Error('현재 위치를 가져올 수 없습니다. 위치 권한을 허용해주세요.')),
      { timeout: 10000 }
    )
  })

// 가능한 업체 모두 조회 → { kakao: {duration, distance} | {error}, tmap: ... }
export const compareRoutes = async (from, to, option) => {
  const entries = await Promise.all(
    Object.entries(ROUTE_PROVIDERS)
      .filter(([, p]) => p.enabled)
      .map(async ([id, p]) => {
        try {
          return [id, await p.fetch(from, to, option)]
        } catch (e) {
          return [id, { error: e.response?.data?.msg || e.response?.data?.message || e.message }]
        }
      })
  )
  return Object.fromEntries(entries)
}

// 소요시간이 가장 짧은 업체 id (없으면 null)
export const fastestProvider = (results) => {
  let best = null
  for (const [id, r] of Object.entries(results)) {
    if (r.error) continue
    if (!best || r.duration < results[best].duration) best = id
  }
  return best
}

export const formatDuration = (sec) => {
  const m = Math.round(sec / 60)
  return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분`
}
export const formatDistance = (m) => `${(m / 1000).toFixed(1)}km`
