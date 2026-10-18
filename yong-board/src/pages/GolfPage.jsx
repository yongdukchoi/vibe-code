import { useMemo, useState } from 'react'
import { GOLF_COURSES, NAV_APPS, ROUTE_OPTIONS, buildNavUrl } from '../service/golfService.js'
import {
  ROUTE_PROVIDERS,
  compareRoutes,
  currentPosition,
  fastestProvider,
  formatDistance,
  formatDuration,
} from '../service/routeService.js'

export default function GolfPage() {
  const [keyword, setKeyword] = useState('')
  const [course, setCourse] = useState(null)
  const [appId, setAppId] = useState('tmap')
  const [option, setOption] = useState('fast')
  const [message, setMessage] = useState('')
  const [results, setResults] = useState(null)
  const [comparing, setComparing] = useState(false)

  const navApp = NAV_APPS.find((a) => a.id === appId)
  const optionLabel = ROUTE_OPTIONS.find((o) => o.value === option).label
  const canCompare = Object.values(ROUTE_PROVIDERS).some((p) => p.enabled)

  const filtered = useMemo(() => {
    const k = keyword.trim()
    if (!k) return GOLF_COURSES
    return GOLF_COURSES.filter((c) => `${c.name} ${c.region} ${c.address}`.includes(k))
  }, [keyword])

  const reset = () => {
    setMessage('')
    setResults(null)
  }

  // 현재 위치 → 골프장 경로를 가능한 업체로 조회하고, 가장 빠른 업체를 자동 선택한다
  const handleCompare = async (nextOption = option) => {
    reset()
    setComparing(true)
    try {
      const from = await currentPosition()
      const res = await compareRoutes(from, course, nextOption)
      setResults(res)
      const best = fastestProvider(res)
      if (best) setAppId(best)
      else setMessage('경로를 조회하지 못했습니다. 아래 오류를 확인해주세요.')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setComparing(false)
    }
  }

  const handleStart = () => {
    setMessage('')
    const url = buildNavUrl(navApp, course)
    if (!url) {
      setMessage(`${navApp.name}은(는) 모바일 앱에서만 길안내를 시작할 수 있습니다.`)
      return
    }
    window.location.href = url
  }

  const best = results ? fastestProvider(results) : null

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section>
        <h2 className="mb-3 text-xl font-bold">골프장 목록 ({filtered.length})</h2>
        <input
          className="mb-2 w-full rounded border p-2 text-sm"
          placeholder="골프장명 · 지역 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <ul className="max-h-[32rem] overflow-y-auto rounded border bg-white">
          {filtered.map((c) => (
            <li key={c.id} className="border-b last:border-b-0">
              <button
                className={`w-full p-3 text-left hover:bg-gray-50 ${course?.id === c.id ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setCourse(c)
                  reset()
                }}
              >
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500">{c.region} · {c.address}</div>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="p-6 text-center text-sm text-gray-500">검색 결과가 없습니다.</li>}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">길안내</h2>
        <div className={`rounded border bg-white p-4 ${course ? '' : 'opacity-50'}`}>
          {!course ? (
            <p className="text-sm text-gray-500">골프장을 선택하면 네비게이션이 활성화됩니다.</p>
          ) : (
            <p className="mb-4 text-sm">
              목적지: <span className="font-semibold">{course.name}</span>
            </p>
          )}

          <fieldset disabled={!course} className="mb-4">
            <legend className="mb-1 text-sm font-semibold">경로 옵션</legend>
            <div className="flex gap-2">
              {ROUTE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  className={`rounded border px-3 py-1 text-sm disabled:cursor-not-allowed ${o.value === option ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => {
                    setOption(o.value)
                    if (results) handleCompare(o.value)
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mb-4">
            <button
              className="w-full rounded border border-blue-600 p-2 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!course || comparing || !canCompare}
              onClick={() => handleCompare()}
            >
              {comparing ? '경로 비교 중...' : `가장 빠른 길 찾기 (${optionLabel} 기준)`}
            </button>
            {!canCompare && (
              <p className="mt-1 text-xs text-orange-600">
                카카오·티맵 API 키가 설정되지 않아 경로 비교를 할 수 없습니다. (.env.local 참고)
              </p>
            )}
            {results && (
              <table className="mt-2 w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1">업체</th>
                    <th className="p-1">소요시간</th>
                    <th className="p-1">거리</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(results).map(([id, r]) => (
                    <tr key={id} className={`border-t text-center ${id === best ? 'bg-green-50 font-semibold' : ''}`}>
                      <td className="p-1">{NAV_APPS.find((a) => a.id === id).name}{id === best && ' ★'}</td>
                      {r.error ? (
                        <td colSpan={2} className="p-1 text-xs text-red-600">{r.error}</td>
                      ) : (
                        <>
                          <td className="p-1">{formatDuration(r.duration)}</td>
                          <td className="p-1">{formatDistance(r.distance)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <fieldset disabled={!course} className="mb-4">
            <legend className="mb-1 text-sm font-semibold">내비게이션 앱 (직접 변경 가능)</legend>
            <div className="flex gap-2">
              {NAV_APPS.map((a) => (
                <button
                  key={a.id}
                  className={`rounded border px-3 py-1 text-sm disabled:cursor-not-allowed ${a.id === appId ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setAppId(a.id)}
                >
                  {a.name}
                </button>
              ))}
            </div>
            {course && !navApp.routeOptions && (
              <p className="mt-2 text-xs text-orange-600">
                {navApp.name} 앱은 외부 연동으로 경로 옵션을 지정할 수 없어 '{optionLabel}' 선택이 앱 실행에는 반영되지 않습니다.
                앱에서 길안내 시작 후 경로를 직접 선택해주세요.
              </p>
            )}
          </fieldset>

          {message && <p className="mb-3 text-sm text-red-600">{message}</p>}
          <button
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!course}
            onClick={handleStart}
          >
            {navApp.name}으로 길안내 시작
          </button>
        </div>
      </section>
    </div>
  )
}
