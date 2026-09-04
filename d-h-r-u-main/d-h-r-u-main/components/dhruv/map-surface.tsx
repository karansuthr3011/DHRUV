'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Pause, Play, X, ZoomIn, ZoomOut } from 'lucide-react'
import { ICEBERGS } from '@/lib/data/icebergs'
import { VESSELS } from '@/lib/data/vessels'
import { ROUTES } from '@/lib/data/routes'
import { RISK_HEX } from '@/lib/geo'
import { cx, riskTone } from './shared'
import type { MapLayers, SelectedEntity } from './types'

// Simple equirectangular-style projection tuned to this fixture's bounding box
// (lon -180..180, lat -50..-90) so points, tracks, and the "Antarctica" disc
// stay in visual agreement without a real map engine.
function project(lon: number, lat: number) {
  const x = ((lon + 180) / 360) * 100
  const y = ((lat + 50) / -40) * 100
  return { x: Math.min(98, Math.max(2, x)), y: Math.min(96, Math.max(4, y)) }
}

const ROUTE_COLOR: Record<string, string> = {
  primary: 'var(--risk-low)',
  alternative: 'var(--risk-moderate)',
  fallback: 'var(--risk-critical)',
}

export function MapSurface({
  selected,
  onSelect,
  layers,
  onZoomChange,
  routeIds,
  className,
}: {
  selected: SelectedEntity
  onSelect: (item: SelectedEntity) => void
  layers: MapLayers
  onZoomChange?: (delta: number) => void
  routeIds?: string[]
  className?: string
}) {
  const [zoom, setZoom] = useState(1)

  const visibleIcebergs = useMemo(() => ICEBERGS, [])
  const visibleVessels = useMemo(() => VESSELS, [])
  const visibleRoutes = useMemo(() => (routeIds ? ROUTES.filter((r) => routeIds.includes(r.id)) : ROUTES), [routeIds])

  const bump = (delta: number) => {
    const next = Math.min(2.4, Math.max(0.7, zoom + delta))
    setZoom(next)
    onZoomChange?.(delta)
  }

  return (
    <div className={cx('relative min-h-[450px] flex-1 overflow-hidden rounded border border-border bg-[#071522]', className)}>
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        className="absolute inset-0 transition-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#dceaf4_0%,#6bb4df_21%,#12659c_35%,transparent_54%),radial-gradient(ellipse_at_center,transparent_0_48%,#0a2032_70%),linear-gradient(135deg,#06111e,#0a2b40_55%,#04101c)] opacity-90" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(117,197,241,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(117,197,241,.25)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute left-[18%] top-[17%] h-[67%] w-[64%] rounded-[50%] border border-primary/30 bg-slate-100/70 shadow-[0_0_90px_rgba(163,220,247,.35)]" />
        <div className="absolute left-[30%] top-[42%] text-[10px] font-semibold tracking-[.42em] text-slate-700/75">ANTARCTICA</div>

        {layers.routes && (
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {visibleRoutes.map((route) => {
              const pts = route.coordinates.map(([lon, lat]) => project(lon, lat))
              const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')
              return (
                <path
                  key={route.id}
                  d={d}
                  fill="none"
                  stroke={ROUTE_COLOR[route.kind]}
                  strokeWidth={route.kind === 'primary' ? 0.65 : 0.42}
                  strokeDasharray={route.kind === 'primary' ? undefined : '2 2'}
                />
              )
            })}
          </svg>
        )}

        {layers.icebergs &&
          visibleIcebergs.map((berg) => {
            const p = project(berg.lon, berg.lat)
            const isSelected = selected?.kind === 'iceberg' && selected.id === berg.id
            return (
              <button
                key={berg.id}
                aria-label={`Inspect iceberg ${berg.name}`}
                onClick={() => onSelect({ kind: 'iceberg', ...berg })}
                style={{ left: `${p.x}%`, top: `${p.y}%`, color: RISK_HEX[berg.risk] }}
                className={cx(
                  'absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background/70 transition-transform hover:scale-125',
                  isSelected ? 'scale-125 ring-2 ring-primary' : '',
                )}
              >
                <span
                  className="block rounded-full"
                  style={{
                    width: 6 + Math.min(14, berg.lengthKm / 6),
                    height: 6 + Math.min(14, berg.lengthKm / 6),
                    background: RISK_HEX[berg.risk],
                  }}
                />
              </button>
            )
          })}

        {layers.vessels &&
          visibleVessels.map((vessel) => {
            const p = project(vessel.lon, vessel.lat)
            const isSelected = selected?.kind === 'vessel' && selected.id === vessel.id
            return (
              <button
                key={vessel.id}
                aria-label={`Inspect vessel ${vessel.name}`}
                onClick={() => onSelect({ kind: 'vessel', ...vessel })}
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -50%) rotate(${vessel.headingDeg}deg)` }}
                className={cx(
                  'absolute z-10 flex size-3.5 items-center justify-center transition-transform hover:scale-125',
                  isSelected && 'scale-125',
                )}
              >
                <span className="block size-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-primary drop-shadow" />
              </button>
            )
          })}
      </div>

      <div className="absolute bottom-3 right-3 z-20 flex flex-col rounded border border-border bg-panel/90">
        <button aria-label="Zoom in" onClick={() => bump(0.25)} className="border-b border-border p-1.5 hover:bg-elevated">
          <ZoomIn className="size-3.5" />
        </button>
        <button aria-label="Zoom out" onClick={() => bump(-0.25)} className="p-1.5 hover:bg-elevated">
          <ZoomOut className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

export function Inspector({ item, onClose }: { item: SelectedEntity; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'track' | 'forecast' | 'risk'>('overview')
  if (!item) return null
  const isVessel = item.kind === 'vessel'

  return (
    <aside className="w-full overflow-hidden rounded border border-primary/40 bg-panel/95 shadow-xl lg:absolute lg:right-3 lg:top-3 lg:z-20 lg:w-[300px]">
      <div className="flex items-start justify-between border-b border-border p-3">
        <div>
          <div className="text-sm font-semibold">{item.name}</div>
          <div className="text-[10px] text-muted-foreground">
            {isVessel ? item.type : `${item.sizeClass.replace('-', ' ')} iceberg`}
          </div>
        </div>
        <button aria-label="Close inspector" onClick={onClose}>
          <X className="size-4" />
        </button>
      </div>

      {isVessel && (
        <div className="flex h-16 items-start bg-gradient-to-r from-[#193c52] via-[#8eb3c4] to-[#405767] p-2 text-[10px] text-background">
          <span className="rounded bg-background/80 px-2 py-1">LIVE</span>
        </div>
      )}

      <div className="flex gap-5 border-b border-border px-3 pt-3 text-[10px]">
        {(['overview', 'track', 'forecast', 'risk'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cx('pb-2 capitalize', tab === t ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground')}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-3 gap-2 p-3 text-[10px]">
          <div>
            <span className="text-muted-foreground">{isVessel ? 'Speed' : 'Size (est.)'}</span>
            <strong className="mt-1 block">{isVessel ? `${item.speedKn} kn` : `${item.lengthKm} km`}</strong>
          </div>
          <div>
            <span className="text-muted-foreground">{isVessel ? 'Heading' : 'Drift Speed'}</span>
            <strong className="mt-1 block">{isVessel ? `${item.headingDeg}° S` : `${item.driftSpeedKn} kn`}</strong>
          </div>
          <div>
            <span className="text-muted-foreground">Risk</span>
            <strong className={cx('mt-1 block capitalize', riskTone(isVessel ? item.exposure : item.risk).split(' ')[0])}>
              {isVessel ? item.exposure : item.risk}
            </strong>
          </div>
        </div>
      )}

      {tab === 'track' && (
        <div className="max-h-40 overflow-auto p-3 text-[10px]">
          {(isVessel ? item.track : item.observations).map((pt, i) => (
            <div key={i} className="flex justify-between border-b border-border py-1 last:border-0">
              <span className="text-muted-foreground">{new Date(pt.time).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <span>
                {pt.lat.toFixed(1)}, {pt.lon.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'forecast' && (
        <div className="p-3 text-[10px] text-muted-foreground">
          {isVessel ? (
            <p>Destination: <span className="text-foreground">{item.destination}</span></p>
          ) : item.forecast.length > 0 ? (
            item.forecast.map((f, i) => (
              <div key={i} className="flex justify-between border-b border-border py-1 last:border-0">
                <span>{new Date(f.time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                <span>±{f.uncertaintyKm} km envelope</span>
              </div>
            ))
          ) : (
            <p>No forecast track available for this object.</p>
          )}
        </div>
      )}

      {tab === 'risk' && (
        <div className="max-h-40 overflow-auto p-3 text-[10px]">
          {isVessel ? (
            item.nearbyHazards.length > 0 ? (
              item.nearbyHazards.map((h) => (
                <div key={h.id} className="mb-2 rounded border border-border p-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{h.label}</span>
                    <span className={cx('capitalize', riskTone(h.severity).split(' ')[0])}>{h.severity}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{h.detail}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No nearby hazards flagged.</p>
            )
          ) : (
            <p className="text-muted-foreground">
              {item.routeIntersectHours
                ? `Projected route intersection in ~${item.routeIntersectHours}h.`
                : 'No active route intersection projected.'}
            </p>
          )}
        </div>
      )}

      <div className="m-3 rounded border border-primary/40 bg-elevated p-3 text-[10px]">
        <div className="mb-2 font-semibold text-primary">Why this matters?</div>
        <p className="leading-relaxed text-muted-foreground">
          {isVessel
            ? `Currently operating at ${item.exposure} exposure. ${item.nearbyHazards[0]?.detail ?? 'No immediate hazards nearby.'}`
            : `${item.routeIntersectHours ? `Projected path intersects the active corridor in ${item.routeIntersectHours}h.` : 'Not currently intersecting an active route.'} Confidence: ${item.confidence}.`}
        </p>
        <button className="mt-3 w-full rounded border border-primary bg-primary/10 px-2 py-2 text-primary hover:bg-primary/20">
          Compare Route Impact →
        </button>
      </div>
    </aside>
  )
}

export function Timeline({
  hoursFromNow,
  onChange,
  playing,
  onTogglePlay,
}: {
  hoursFromNow: number
  onChange: (hours: number) => void
  playing: boolean
  onTogglePlay: () => void
}) {
  const pct = Math.round(((hoursFromNow + 24) / 96) * 100)
  return (
    <div className="rounded border border-border bg-panel px-3 py-2">
      <div className="flex items-center gap-3 text-[10px]">
        <button
          aria-label={playing ? 'Pause timeline' : 'Play timeline'}
          onClick={onTogglePlay}
          className="flex size-7 items-center justify-center rounded-full border border-border bg-elevated hover:bg-elevated/70"
        >
          {playing ? <Pause className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
        </button>
        <strong>12 Aug 2026</strong>
        <span className="text-muted-foreground">{String(14 + Math.floor(hoursFromNow)).padStart(2, '0')}:00 UTC</span>
        <input
          type="range"
          min={-24}
          max={72}
          value={hoursFromNow}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Timeline scrubber"
          className="h-1 flex-1 accent-primary"
        />
        <span className="hidden text-muted-foreground sm:block">Aug 12　 Aug 13　 Aug 14　 Aug 15</span>
        <span className="text-risk-low">{hoursFromNow === 0 ? '● Live' : `${hoursFromNow > 0 ? '+' : ''}${hoursFromNow}h`}</span>
        <span className="rounded border border-border px-2 py-1">
          72h <ChevronDown className="inline size-3" />
        </span>
      </div>
    </div>
  )
}
