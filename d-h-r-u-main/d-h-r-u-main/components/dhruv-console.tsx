'use client'

import { useEffect, useRef, useState } from 'react'
import { ICEBERGS } from '@/lib/data/icebergs'
import { VESSELS } from '@/lib/data/vessels'
import { NOTIFICATIONS } from '@/lib/data/sources'
import { Sidebar, Topbar, NAV } from './dhruv/shell'
import { MapWorkspace } from './dhruv/workspaces/map-workspace'
import { RoutePlannerWorkspace } from './dhruv/workspaces/route-planner'
import { IcebergTrackerWorkspace } from './dhruv/workspaces/iceberg-tracker'
import { VesselMonitorWorkspace } from './dhruv/workspaces/vessel-monitor'
import { WeatherOceanWorkspace } from './dhruv/workspaces/weather-ocean'
import { RiskAnalysisWorkspace } from './dhruv/workspaces/risk-analysis'
import { HistoricalReplayWorkspace } from './dhruv/workspaces/historical-replay'
import { DataSourcesWorkspace } from './dhruv/workspaces/data-sources'
import { ReportsWorkspace } from './dhruv/workspaces/reports'
import type { MapLayers, SelectedEntity, WorkspaceId } from './dhruv/types'

const WORKSPACE_TITLES: Record<WorkspaceId, { eyebrow: string; heading: string }> = {
  map: { eyebrow: 'Operations Map (Default)', heading: 'Antarctic Operational Picture' },
  'route-planner': { eyebrow: 'Route Planner', heading: 'Plan & Compare Voyage Routes' },
  'iceberg-tracker': { eyebrow: 'Iceberg Tracker', heading: 'Iceberg Intelligence' },
  'vessel-monitor': { eyebrow: 'Vessel Monitor', heading: 'Fleet Status & Exposure' },
  'weather-ocean': { eyebrow: 'Weather & Ocean', heading: 'Environmental Conditions' },
  'risk-analysis': { eyebrow: 'Risk Analysis', heading: 'Hazard & Resilience Review' },
  'historical-replay': { eyebrow: 'Historical Replay', heading: 'Historical Replay Lab' },
  'data-sources': { eyebrow: 'Data Sources', heading: 'Data & Model Health' },
  reports: { eyebrow: 'Reports', heading: 'Voyage & Ops Reporting' },
}

export default function DhruvConsole() {
  const [active, setActive] = useState<WorkspaceId>('map')
  const [selected, setSelected] = useState<SelectedEntity>({ kind: 'vessel', ...VESSELS[0] })
  const [layers, setLayers] = useState<MapLayers>({ seaIce: true, icebergs: true, vessels: true, routes: true })
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [hoursFromNow, setHoursFromNow] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [unread, setUnread] = useState(NOTIFICATIONS.length)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setHoursFromNow((h) => (h >= 72 ? -24 : h + 1))
      }, 400)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing])

  const toggleLayer = (key: keyof MapLayers) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))

  const selectEntity = (id: string, target: WorkspaceId) => {
    const iceberg = ICEBERGS.find((b) => b.id === id)
    const vessel = VESSELS.find((v) => v.id === id)
    if (iceberg) setSelected({ kind: 'iceberg', ...iceberg })
    else if (vessel) setSelected({ kind: 'vessel', ...vessel })
    setActive(target)
  }

  const title = WORKSPACE_TITLES[active]

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <Sidebar active={active} setActive={setActive} mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
      <section className="flex min-w-0 flex-1 flex-col">
        <Topbar
          active={active}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          notificationCount={unread}
          onSelectEntity={selectEntity}
          onDismissNotifications={() => setUnread(0)}
        />
        <div className="ops-scroll flex-1 overflow-auto p-3 md:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-[.2em] text-primary">{title.eyebrow}</div>
              <h1 className="mt-1 text-lg font-semibold">{title.heading}</h1>
            </div>
          </div>

          {active === 'map' && (
            <MapWorkspace
              selected={selected}
              onSelect={setSelected}
              layers={layers}
              onToggleLayer={toggleLayer}
              hoursFromNow={hoursFromNow}
              onScrub={(h) => {
                setPlaying(false)
                setHoursFromNow(h)
              }}
              playing={playing}
              onTogglePlay={() => setPlaying((p) => !p)}
            />
          )}
          {active === 'route-planner' && <RoutePlannerWorkspace selected={selected} onSelect={setSelected} layers={layers} />}
          {active === 'iceberg-tracker' && <IcebergTrackerWorkspace selected={selected} onSelect={setSelected} layers={layers} />}
          {active === 'vessel-monitor' && <VesselMonitorWorkspace selected={selected} onSelect={setSelected} layers={layers} />}
          {active === 'weather-ocean' && <WeatherOceanWorkspace selected={selected} onSelect={setSelected} layers={layers} />}
          {active === 'risk-analysis' && <RiskAnalysisWorkspace />}
          {active === 'historical-replay' && <HistoricalReplayWorkspace />}
          {active === 'data-sources' && <DataSourcesWorkspace />}
          {active === 'reports' && <ReportsWorkspace />}
        </div>
      </section>
    </main>
  )
}

export { NAV }
