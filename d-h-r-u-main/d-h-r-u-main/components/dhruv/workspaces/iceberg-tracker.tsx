'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ICEBERGS } from '@/lib/data/icebergs'
import type { RiskTier } from '@/lib/types'
import { Card, TablePanel, cx, riskTone } from '../shared'
import { MapSurface, Inspector } from '../map-surface'
import type { MapLayers, SelectedEntity } from '../types'

const RISK_FILTERS: (RiskTier | 'all')[] = ['all', 'low', 'moderate', 'high', 'critical']
const STATUS_LABEL: Record<string, string> = { tracked: 'Tracked', unmatched: 'Unmatched', grounded: 'Grounded' }

export function IcebergTrackerWorkspace({
  selected,
  onSelect,
  layers,
}: {
  selected: SelectedEntity
  onSelect: (item: SelectedEntity) => void
  layers: MapLayers
}) {
  const [query, setQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskTier | 'all'>('all')

  const filtered = useMemo(() => {
    return ICEBERGS.filter((b) => {
      const matchesQuery = query.trim() === '' || b.name.toLowerCase().includes(query.toLowerCase()) || b.id.toLowerCase().includes(query.toLowerCase())
      const matchesRisk = riskFilter === 'all' || b.risk === riskFilter
      return matchesQuery && matchesRisk
    })
  }, [query, riskFilter])

  const rows = filtered.map((b) => ({
    id: b.id,
    cells: [b.id, STATUS_LABEL[b.status], `${b.lengthKm} km`, b.risk[0].toUpperCase() + b.risk.slice(1)],
    tone: riskTone(b.risk),
  }))

  return (
    <div className="grid gap-3 xl:grid-cols-[.75fr_1.3fr_.85fr]">
      <div className="flex flex-col gap-3">
        <Card
          title="Iceberg Intelligence"
          action={
            <span className="text-[9px] text-muted-foreground">
              {filtered.length} / {ICEBERGS.length}
            </span>
          }
        >
          <div className="flex flex-col gap-2 p-3">
            <div className="flex items-center gap-2 rounded border border-border bg-elevated px-2 py-1.5 text-[10px]">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID or name"
                aria-label="Search icebergs"
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-wrap gap-1 text-[9px]">
              {RISK_FILTERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setRiskFilter(tier)}
                  className={cx(
                    'rounded border px-2 py-1 capitalize',
                    riskFilter === tier ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-elevated',
                  )}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </Card>
        <TablePanel
          title="Results"
          columns={['ID', 'Status', 'Size', 'Risk']}
          rows={rows}
          activeId={selected?.kind === 'iceberg' ? selected.id : undefined}
          onRowClick={(id) => {
            const berg = ICEBERGS.find((b) => b.id === id)
            if (berg) onSelect({ kind: 'iceberg', ...berg })
          }}
        />
      </div>

      <div className="relative min-h-[420px]">
        <MapSurface selected={selected} onSelect={onSelect} layers={{ ...layers, routes: false }} />
      </div>

      <div className="flex flex-col gap-3">
        {selected?.kind === 'iceberg' ? (
          <Inspector item={selected} onClose={() => onSelect(null)} />
        ) : (
          <Card title="Iceberg Detail">
            <p className="p-3 text-[10px] text-muted-foreground">
              Select an iceberg from the list or the map to inspect its size, drift, and forecast confidence.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
