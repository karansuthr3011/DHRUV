'use client'

import { useMemo, useState } from 'react'
import { REPLAY_SCENARIOS } from '@/lib/data/replay'
import { Card, cx } from '../shared'

const VERDICT_TONE: Record<string, string> = {
  avoided: 'text-risk-low border-risk-low/50 bg-risk-low/10',
  mixed: 'text-risk-moderate border-risk-moderate/50 bg-risk-moderate/10',
  encountered: 'text-risk-critical border-risk-critical/50 bg-risk-critical/10',
}

function project(lon: number, lat: number, bbox: { minLon: number; maxLon: number; minLat: number; maxLat: number }) {
  const x = ((lon - bbox.minLon) / (bbox.maxLon - bbox.minLon)) * 100
  const y = 100 - ((lat - bbox.minLat) / (bbox.maxLat - bbox.minLat)) * 100
  return { x: Math.min(96, Math.max(4, x)), y: Math.min(94, Math.max(6, y)) }
}

export function HistoricalReplayWorkspace() {
  const [caseId, setCaseId] = useState(REPLAY_SCENARIOS[0].id)
  const [revealActual, setRevealActual] = useState(false)
  const scenario = useMemo(() => REPLAY_SCENARIOS.find((c) => c.id === caseId)!, [caseId])

  const bbox = useMemo(() => {
    const lons = [...scenario.forecastTrack.map((p) => p.lon), ...scenario.actualTrack.map((p) => p.lon)]
    const lats = [...scenario.forecastTrack.map((p) => p.lat), ...scenario.actualTrack.map((p) => p.lat)]
    const pad = 2
    return {
      minLon: Math.min(...lons) - pad,
      maxLon: Math.max(...lons) + pad,
      minLat: Math.min(...lats) - pad,
      maxLat: Math.max(...lats) + pad,
    }
  }, [scenario])

  const forecastPts = scenario.forecastTrack.map((p) => project(p.lon, p.lat, bbox))
  const actualPts = scenario.actualTrack.map((p) => project(p.lon, p.lat, bbox))

  return (
    <div className="grid gap-3 xl:grid-cols-[.75fr_1.3fr]">
      <Card title="Historical Cases">
        <div className="flex max-h-[560px] flex-col gap-1 overflow-y-auto p-3 text-[10px]">
          {REPLAY_SCENARIOS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCaseId(c.id)
                setRevealActual(false)
              }}
              aria-pressed={caseId === c.id}
              className={cx(
                'rounded border px-3 py-2 text-left',
                caseId === c.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-elevated',
              )}
            >
              <div className="font-semibold">{c.title}</div>
              <div className="text-[9px] text-muted-foreground">
                {c.region} · {c.dateRange}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <Card title={scenario.title}>
          <div className="p-3 text-[10px] text-muted-foreground">{scenario.summary}</div>
          <div className="relative m-3 h-[280px] overflow-hidden rounded border border-border bg-[#071522]">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(117,197,241,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(117,197,241,.25)_1px,transparent_1px)] [background-size:36px_36px]" />
            <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d={forecastPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')}
                fill="none"
                stroke="var(--risk-moderate)"
                strokeDasharray="2 2"
                strokeWidth="0.6"
              />
              {revealActual && (
                <path
                  d={actualPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')}
                  fill="none"
                  stroke="var(--risk-low)"
                  strokeWidth="0.6"
                />
              )}
            </svg>
            {forecastPts.map((p, i) => (
              <span
                key={`f${i}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-risk-moderate"
              />
            ))}
            {revealActual &&
              actualPts.map((p, i) => (
                <span
                  key={`a${i}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-risk-low"
                />
              ))}
            <div className="absolute left-3 top-3 flex gap-3 text-[9px]">
              <span className="flex items-center gap-1 text-risk-moderate">
                <span className="size-2 rounded-full bg-risk-moderate" /> Forecast
              </span>
              {revealActual && (
                <span className="flex items-center gap-1 text-risk-low">
                  <span className="size-2 rounded-full bg-risk-low" /> Actual
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border px-3 py-2">
            <button
              onClick={() => setRevealActual((v) => !v)}
              className="rounded border border-primary bg-primary/10 px-3 py-1.5 text-[10px] text-primary hover:bg-primary/20"
            >
              {revealActual ? 'Hide actual track' : 'Reveal actual track'}
            </button>
            <span className="text-[9px] text-muted-foreground">Vessel profile: {scenario.vesselProfile}</span>
          </div>
        </Card>

        {revealActual && (
          <Card title="Verdict">
            <div className="p-3 text-[10px]">
              <div className={cx('mb-2 inline-block rounded border px-2 py-1 capitalize', VERDICT_TONE[scenario.outcome.verdict])}>
                {scenario.outcome.verdict}
              </div>
              <p className="font-semibold">{scenario.outcome.headline}</p>
              <p className="mt-1 text-muted-foreground">{scenario.outcome.detail}</p>
              <p className="mt-2 text-muted-foreground">
                Forecast error: <strong className="text-foreground">{scenario.outcome.forecastErrorKm} km</strong>
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
