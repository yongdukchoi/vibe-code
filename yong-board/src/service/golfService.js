import golfCourses from './golfCourses.json'

// 골프장 목록: scripts/collectGolf.mjs 로 수집해 golfCourses.json 에 저장한다.
// (현재 데이터: OpenStreetMap 기반 약 467곳, 좌표는 OSM 값. 누락/오기 가능성이 있어 검증 필요)
export const GOLF_COURSES = golfCourses

// 길안내 옵션
export const ROUTE_OPTIONS = [
  { value: 'recommend', label: '추천길' },
  { value: 'fast', label: '빠른 시간 길' },
]

// 딥링크 방식으로 연동하는 내비 앱
// - app: 모바일 앱 URL 스킴 / web: 웹 길찾기 URL (없으면 모바일 전용)
// - routeOptions: 딥링크로 경로 옵션(추천/빠른길)을 전달할 수 있는지 여부
//   현재 세 앱 모두 공개된 URL 스킴에 경로 옵션 파라미터를 확인하지 못해 false 로 둔다.
export const NAV_APPS = [
  {
    id: 'tmap',
    name: '티맵',
    routeOptions: false,
    app: (c) => `tmap://route?goalname=${encodeURIComponent(c.name)}&goalx=${c.lng}&goaly=${c.lat}`,
    web: null,
  },
  {
    id: 'kakao',
    name: '카카오맵',
    routeOptions: false,
    app: (c) => `kakaomap://route?ep=${c.lat},${c.lng}&by=CAR`,
    web: (c) => `https://map.kakao.com/link/to/${encodeURIComponent(c.name)},${c.lat},${c.lng}`,
  },
  {
    id: 'naver',
    name: '네이버지도',
    routeOptions: false,
    app: (c) =>
      `nmap://route/car?dlat=${c.lat}&dlng=${c.lng}&dname=${encodeURIComponent(c.name)}&appname=yong-board`,
    web: (c) => `https://map.naver.com/v5/directions/-/${c.lng},${c.lat},${encodeURIComponent(c.name)}/-/car`,
  },
]

export const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

// 길안내 시작: 모바일은 앱 스킴, PC 는 웹 길찾기(없으면 null 반환)
export const buildNavUrl = (navApp, course) => {
  if (isMobile()) return navApp.app(course)
  return navApp.web ? navApp.web(course) : null
}
