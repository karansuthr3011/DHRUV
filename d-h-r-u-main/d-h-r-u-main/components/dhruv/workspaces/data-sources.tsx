'use client'

import { useState } from 'react'
import { DATA_SOURCES, MODEL_HEALTH, AUDIT_LOG } from '@/lib/data/sources'
import { SOURCE_STATUS_LABEL } from '@/lib/geo'
import { Card, TablePanel, cx } from '../shared'

const TABS = ['Data Sources', 'Model Health', 'Audit Log'] as const

const STATUS_TONE: Record<string, string> = {
  healthy: 'text-risk-low border-risk-low/50 bg-risk-low/10',
  partial: 'text-risk-moderate border-risk-moderate/50 bg-risk-moderate/10',
  degraded: 'text-risk-moderate border-risk-moderate/50 bg-risk-moderate/10',
  unavailable: 'text-risk-critical border-risk-critical/50 bg-risk-critical/10',
}

const CONFIDENCE_TONE: Record<string, string> = {
  high: 'text-risk-low border-risk-low/50 bg-risk-low/10',
  medium: 'text-risk-moderate border-risk-moderate/50 bg-risk-moderate/10',
  low: 'text-risk-critical border-risk-critical/50 bg-risk-critical/10',
}

export function DataSourcesWorkspace() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Data Sources')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 text-[10px]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cx(
              'rounded border px-3 py-1.5',
              tab === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-elevated',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Data Sources' && (
        <TablePanel
          title="Data & Model Health"
          columns={['Source', 'Provider', 'Coverage', 'Latency', 'Status']}
          rows={DATA_SOURCES.map((s) => ({
            id: s.id,
            cells: [s.name, s.provider, `${s.coveragePct}%`, s.latency, SOURCE_STATUS_LABEL[s.status]],
            tone: STATUS_TONE[s.status],
          }))}
        />
      )}

      {tab === 'Model Health' && (
        <div className="grid gap-3 md:grid-cols-2">
          {MODEL_HEALTH.map((m) => (
            <Card key={m.id} title={m.name}>
              <div className="grid grid-cols-2 gap-2 p-3 text-[10px]">
                <div>
                  <span className="text-muted-foreground">Version</span>
                  <strong className="mt-1 block">{m.version}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence</span>
                  <strong className={cx('mt-1 block rounded border px-1.5 py-0.5 capitalize', CONFIDENCE_TONE[m.confidence])}>
                    {m.confidence}
                  </strong>
                </div>
                <div>
                  <span className="text-muted-foreground">{m.skillMetricLabel}</span>
                  <strong className="mt-1 block">{m.skillMetricValue}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Input Availability</span>
                  <strong className="mt-1 block">{m.inputAvailabilityPct}%</strong>
                </div>
              </div>
              <div className="border-t border-border p-3 text-[9px] text-muted-foreground">
                Last run {m.lastRun} · Validated {m.lastValidation}
                {m.limitations.length > 0 && (
                  <p className="mt-2 text-foreground/80">{m.limitations[0]}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Audit Log' && (
        <Card title="Recent Activity">
          <div className="flex flex-col p-3 text-[10px]">
            {AUDIT_LOG.map((entry, i) => (
              <div key={i} className="flex flex-col gap-0.5 border-b border-border py-2.5 last:border-0">
                <div className="flex justify-between">
                  <span className="font-semibold">{entry.event}</span>
                  <span className="text-muted-foreground">{entry.time}</span>
                </div>
                <span className="text-muted-foreground">{entry.detail}</span>
                <span className="text-[9px] text-muted-foreground">by {entry.actor}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
