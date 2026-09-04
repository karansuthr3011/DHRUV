'use client'

import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { ROUTES, DECISION_MODE_NOTES } from '@/lib/data/routes'
import type { DecisionMode } from '@/lib/types'
import { Card, TablePanel, cx, riskTone } from '../shared'
import { MapSurface } from '../map-surface'
import type { MapLayers, SelectedEntity } from '../types'

const MODE_ORDER: DecisionMode[] = ['conservative', 'balanced', 'efficient']

// Which candidate each mode currently recommends, and the multiplier applied
// to distance/duration to reflect a wider or tighter berth.
const MODE_PREFERENCE: Record<DecisionMode, { recommendedId: string; distanceMult: number; durationMult: number }> = {
  conservative: { recommendedId: 'route-fallback', distanceMult: 1, durationMult: 1 },
  balanced: { recommendedId: 'route-primary', distanceMult: 1, durationMult: 1 },
  efficient: { recommendedId: 'route-primary', distanceMult: 0.94, durationMult: 0.92 },
}

export function RoutePlannerWorkspace({
  selected,
  onSelect,
  layers,
}: {
  selected: SelectedEntity
  onSelect: (item: SelectedEntity) => void
  layers: MapLayers
}) {
  const [mode, setMode] = useState<DecisionMode>('balanced')
  const [confirmed, setConfirmed] = useState(false)

  const preference = MODE_PREFERENCE[mode]
  const recommended = useMemo(() => ROUTES.find((r) => r.id === preference.recommendedId)!, [preference])

  const rows = ROUTES.map((route) => ({
    id: route.id,
    cells: [
      route.label,
      `${Math.round(route.distanceKm * (route.id === recommended.id ? preference.distanceMult : 1)).toLocaleString()} km`,
      `${(route.durationDays * (route.id === recommended.id ? preference.durationMult : 1)).toFixed(1)} d`,
      route.riskTier === 'moderate' ? 'Moderate' : route.riskTier === 'high' ? 'High' : route.riskTier === 'critical' ? 'Critical' : 'Low',
    ],
    tone: riskTone(route.riskTier),
  }))

  return (
    <div className="grid gap-3 xl:grid-cols-[1.25fr_.9fr]">
      <MapSurface selected={selected} onSelect={onSelect} layers={layers} routeIds={ROUTES.map((r) => r.id)} />

      <div className="flex flex-col gap-3">
        <Card title="Vessel & Planning Settings">
          <div className="grid grid-cols-2 gap-3 p-3 text-[10px]">
            <span>
              Vessel
              <br />
              <b>MV Polar Explorer</b>
            </span>
            <span>
              Ice Class
              <br />
              <b>PC3</b>
            </span>
            <span>
              Cruise Speed
              <br />
              <b>12 kn</b>
            </span>
            <span>
              Planning Horizon
              <br />
              <b>7 days</b>
            </span>
          </div>
          <div className="border-t border-border p-3">
            <div className="mb-2 text-primary">Decision Mode</div>
            <div className="grid grid-cols-3 gap-1">
              {MODE_ORDER.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m)
                    setConfirmed(false)
                  }}
                  aria-pressed={mode === m}
                  className={cx(
                    'rounded border p-2 capitalize',
                    mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-elevated',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <TablePanel
          title="Route Options"
          columns={['Route', 'Distance', 'Time', 'Risk']}
          rows={rows}
          activeId={recommended.id}
          onRowClick={(id) => {
            const route = ROUTES.find((r) => r.id === id)
            if (!route) return
            onSelect(null)
          }}
        />

        <Card title="Why this route?">
          <div className="p-3 text-[10px] text-muted-foreground">
            <p>{DECISION_MODE_NOTES[mode]}</p>
            <button
              onClick={() => setConfirmed(true)}
              className={cx(
                'mt-3 flex w-full items-center justify-center gap-2 rounded border px-3 py-2',
                confirmed ? 'border-risk-low bg-risk-low/10 text-risk-low' : 'border-primary bg-primary/10 text-primary hover:bg-primary/20',
              )}
            >
              {confirmed ? (
                <>
                  <Check className="size-3.5" /> Route Confirmed
                </>
              ) : (
                'Confirm and Save Route →'
              )}
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
