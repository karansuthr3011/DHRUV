'use client'

import { useState } from 'react'
import { Compass, Eye, Gauge, Snowflake, Waves, Wind } from 'lucide-react'
import { ENV_CONDITIONS } from '@/lib/data/sources'
import { Card, cx } from '../shared'
import { MapSurface } from '../map-surface'
import type { MapLayers, SelectedEntity } from '../types'

const OVERLAYS = ['Wind', 'Waves', 'Sea Ice', 'Currents'] as const

export function WeatherOceanWorkspace({
  selected,
  onSelect,
  layers,
}: {
  selected: SelectedEntity
  onSelect: (item: SelectedEntity) => void
  layers: MapLayers
}) {
  const [overlay, setOverlay] = useState<(typeof OVERLAYS)[number]>('Wind')

  return (
    <div className="grid gap-3 xl:grid-cols-[1.3fr_.85fr]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1 text-[10px]">
          {OVERLAYS.map((o) => (
            <button
              key={o}
              onClick={() => setOverlay(o)}
              aria-pressed={overlay === o}
              className={cx(
                'rounded border px-2.5 py-1',
                overlay === o ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-elevated',
              )}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="relative min-h-[420px]">
          <MapSurface selected={selected} onSelect={onSelect} layers={{ ...layers, routes: false, vessels: false }} />
          <div className="absolute left-3 top-3 z-20 rounded border border-border bg-panel/90 px-2.5 py-1.5 text-[10px]">
            Showing <span className="text-primary">{overlay}</span> overlay
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Card title="Current Conditions">
          <div className="grid grid-cols-2 gap-3 p-3 text-[10px]">
            <div className="flex items-center gap-2">
              <Wind className="size-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Wind</div>
                <strong>
                  {ENV_CONDITIONS.windKn} kn {ENV_CONDITIONS.windDir}
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="size-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Air Temp</div>
                <strong>{ENV_CONDITIONS.airTempC}°C</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="size-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Wave Height</div>
                <strong>{ENV_CONDITIONS.waveM} m</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Snowflake className="size-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Sea Temp</div>
                <strong>{ENV_CONDITIONS.seaTempC}°C</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Visibility</div>
                <strong>{ENV_CONDITIONS.visibility}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Source</div>
                <strong>{ENV_CONDITIONS.source}</strong>
              </div>
            </div>
          </div>
          <div className="border-t border-border px-3 py-2 text-[9px] text-muted-foreground">Updated {ENV_CONDITIONS.age}</div>
        </Card>

        <Card title="7-Day Outlook">
          <div className="flex justify-between gap-1 p-3 text-center text-[9px]">
            {['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map((day, i) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-muted-foreground">{day}</span>
                <Wind className={cx('size-3.5', i === 2 || i === 3 ? 'text-risk-moderate' : 'text-muted-foreground')} />
                <span>{18 + ((i * 3) % 9)} kn</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-3 py-2 text-[9px] text-muted-foreground">
            Wind speeds peak midweek near the primary route corridor.
          </div>
        </Card>
      </div>
    </div>
  )
}
