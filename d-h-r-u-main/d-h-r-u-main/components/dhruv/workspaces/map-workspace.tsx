'use client'

import { ChevronDown, Gauge, Snowflake, Waves, Wind } from 'lucide-react'
import { Card, cx } from '../shared'
import { MapSurface, Inspector, Timeline } from '../map-surface'
import type { MapLayers, SelectedEntity } from '../types'

function OverviewCards() {
  return (
    <div className="grid gap-3 xl:grid-cols-4">
      <Card title="Sea Ice Concentration">
        <div className="flex gap-3 p-3">
          <div className="h-20 flex-1 rounded bg-[radial-gradient(circle_at_center,#dceaf4,#55a9dc_38%,#07304d_75%)]" />
          <div className="text-[9px] leading-[1.9] text-muted-foreground">
            100%
            <br />
            75%
            <br />
            50%
            <br />
            25%
          </div>
        </div>
        <div className="px-3 pb-2 text-[9px] text-muted-foreground">Source: Copernicus · 3h ago</div>
      </Card>
      <Card title="Iceberg Forecast">
        <div className="m-3 h-20 rounded bg-[linear-gradient(135deg,#081a2a,#2d7199,#0b2338)]" />
        <div className="px-3 pb-2 text-[9px] text-muted-foreground">A-68A · Observed + predicted track</div>
      </Card>
      <Card title="Route Comparison">
        <div className="flex flex-col gap-2 p-3 text-[10px]">
          <div className="flex justify-between">
            <span className="text-risk-low">● Primary Route</span>
            <span>2,840 km · 11.8 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-risk-moderate">● Alternative Route</span>
            <span>3,010 km · 13.1 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-risk-critical">● Fallback Route</span>
            <span>3,220 km · 14.8 days</span>
          </div>
        </div>
      </Card>
      <Card title="Environmental Conditions">
        <div className="grid grid-cols-4 gap-2 p-3 text-center text-[10px]">
          <div>
            <Wind className="mx-auto mb-2 size-4 text-muted-foreground" />
            22 kn
            <br />
            <span className="text-muted-foreground">Wind</span>
          </div>
          <div>
            <Gauge className="mx-auto mb-2 size-4 text-muted-foreground" />
            -18°C
            <br />
            <span className="text-muted-foreground">Air Temp</span>
          </div>
          <div>
            <Waves className="mx-auto mb-2 size-4 text-muted-foreground" />
            2.1 m
            <br />
            <span className="text-muted-foreground">Waves</span>
          </div>
          <div>
            <Snowflake className="mx-auto mb-2 size-4 text-muted-foreground" />
            -1.8°C
            <br />
            <span className="text-muted-foreground">Sea Temp</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function MapWorkspace({
  selected,
  onSelect,
  layers,
  onToggleLayer,
  hoursFromNow,
  onScrub,
  playing,
  onTogglePlay,
}: {
  selected: SelectedEntity
  onSelect: (item: SelectedEntity) => void
  layers: MapLayers
  onToggleLayer: (key: keyof MapLayers) => void
  hoursFromNow: number
  onScrub: (h: number) => void
  playing: boolean
  onTogglePlay: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-[10px]">
        {(
          [
            ['seaIce', 'Sea Ice'],
            ['icebergs', 'Icebergs'],
            ['vessels', 'Vessels'],
            ['routes', 'Routes'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onToggleLayer(key)}
            aria-pressed={layers[key]}
            className={cx(
              'rounded border px-2.5 py-1',
              layers[key] ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-elevated',
            )}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto rounded border border-border px-2 py-1 text-muted-foreground">
          Current View
        </span>
        <span className="rounded border border-border px-2 py-1 text-muted-foreground">
          Antarctica <ChevronDown className="inline size-3" />
        </span>
      </div>
      <div className="relative min-h-[480px] flex-1">
        <MapSurface selected={selected} onSelect={onSelect} layers={layers} />
        <Inspector item={selected} onClose={() => onSelect(null)} />
      </div>
      <Timeline hoursFromNow={hoursFromNow} onChange={onScrub} playing={playing} onTogglePlay={onTogglePlay} />
      <OverviewCards />
    </div>
  )
}
