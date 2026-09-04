'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { ICEBERGS } from '@/lib/data/icebergs'
import { ROUTES, STRESS_SCENARIOS } from '@/lib/data/routes'
import { Card, TablePanel, cx, riskTone } from '../shared'

const OUTCOME_TONE: Record<string, string> = {
  robust: 'text-risk-low',
  viable: 'text-risk-moderate',
  fragile: 'text-risk-critical',
}

export function RiskAnalysisWorkspace() {
  const [scenarioId, setScenarioId] = useState(STRESS_SCENARIOS[0].id)
  const scenario = useMemo(() => STRESS_SCENARIOS.find((s) => s.id === scenarioId)!, [scenarioId])

  const hazardRows = ICEBERGS.filter((b) => b.routeIntersectHours !== undefined || b.risk === 'high' || b.risk === 'critical')
    .sort((a, b) => (a.routeIntersectHours ?? 999) - (b.routeIntersectHours ?? 999))
    .map((b) => ({
      id: b.id,
      cells: [
        b.id,
        b.routeIntersectHours ? `${b.routeIntersectHours}h` : '—',
        b.confidence[0].toUpperCase() + b.confidence.slice(1),
        b.risk[0].toUpperCase() + b.risk.slice(1),
      ],
      tone: riskTone(b.risk),
    }))

  return (
    <div className="grid gap-3 xl:grid-cols-[.8fr_1.2fr]">
      <div className="flex flex-col gap-3">
        <TablePanel
          title="Active Hazards Intersecting Routes"
          columns={['ID', 'ETA', 'Confidence', 'Risk']}
          rows={hazardRows}
        />
        <Card title="Route Resilience Profile">
          <div className="flex flex-col gap-2 p-3 text-[10px]">
            {ROUTES.map((route) => (
              <div key={route.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span>{route.label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground">Resilience</span>
                  <strong>{route.resilienceScore}</strong>
                  <span className={cx('rounded border px-1.5 py-0.5', riskTone(route.riskTier))}>{route.riskTier}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Stress Test Console"
        action={<AlertTriangle className="size-3.5 text-risk-moderate" />}
      >
        <div className="flex flex-col gap-1 border-b border-border p-3 text-[10px]">
          {STRESS_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              aria-pressed={scenarioId === s.id}
              className={cx(
                'rounded border px-3 py-2 text-left',
                scenarioId === s.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-elevated',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="p-3 text-[10px]">
          <p className="mb-3 text-muted-foreground">{scenario.description}</p>
          <div className="grid grid-cols-3 gap-2">
            {ROUTES.map((route) => {
              const delta = scenario.resilienceDelta[route.kind]
              const outcome = scenario.outcome[route.kind]
              return (
                <div key={route.id} className="rounded border border-border p-2 text-center">
                  <div className="text-muted-foreground">{route.label}</div>
                  <div className="mt-1 text-base font-semibold">{Math.max(0, route.resilienceScore + delta)}</div>
                  <div className={cx('mt-1 capitalize', OUTCOME_TONE[outcome])}>{outcome}</div>
                  <div className="mt-1 text-[9px] text-muted-foreground">{delta} vs baseline</div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
