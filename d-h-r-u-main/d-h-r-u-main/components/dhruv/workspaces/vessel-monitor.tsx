'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { VESSELS } from '@/lib/data/vessels'
import { Card, TablePanel, riskTone } from '../shared'
import { MapSurface, Inspector } from '../map-surface'
import type { MapLayers, SelectedEntity } from '../types'

export function VesselMonitorWorkspace({
  selected,
  onSelect,
  layers,
}: {
  selected: SelectedEntity
  onSelect: (item: SelectedEntity) => void
  layers: MapLayers
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => VESSELS.filter((v) => query.trim() === '' || v.name.toLowerCase().includes(query.toLowerCase()) || v.flag.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const rows = filtered.map((v) => ({
    id: v.id,
    cells: [v.name, v.flag, `${v.speedKn} kn`, v.exposure[0].toUpperCase() + v.exposure.slice(1)],
    tone: riskTone(v.exposure),
  }))

  return (
    <div className="grid gap-3 xl:grid-cols-[.85fr_1.3fr_.85fr]">
      <div className="flex flex-col gap-3">
        <Card
          title="Fleet"
          action={
            <span className="text-[9px] text-muted-foreground">
              {filtered.length} / {VESSELS.length}
            </span>
          }
        >
          <div className="p-3">
            <div className="flex items-center gap-2 rounded border border-border bg-elevated px-2 py-1.5 text-[10px]">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or flag"
                aria-label="Search vessels"
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </Card>
        <TablePanel
          title="Vessel Status"
          columns={['Name', 'Flag', 'Speed', 'Exposure']}
          rows={rows}
          activeId={selected?.kind === 'vessel' ? selected.id : undefined}
          onRowClick={(id) => {
            const vessel = VESSELS.find((v) => v.id === id)
            if (vessel) onSelect({ kind: 'vessel', ...vessel })
          }}
        />
      </div>

      <div className="relative min-h-[420px]">
        <MapSurface selected={selected} onSelect={onSelect} layers={{ ...layers, icebergs: layers.icebergs }} />
      </div>

      <div className="flex flex-col gap-3">
        {selected?.kind === 'vessel' ? (
          <Inspector item={selected} onClose={() => onSelect(null)} />
        ) : (
          <Card title="Vessel Detail">
            <p className="p-3 text-[10px] text-muted-foreground">
              Select a vessel from the fleet list or the map to review speed, heading, destination, and nearby hazards.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
