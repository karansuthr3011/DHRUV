'use client'

import { useMemo, useState } from 'react'
import {
  Bell,
  Cloud,
  Database,
  Download,
  History,
  Map as MapIcon,
  Menu,
  Navigation,
  Search,
  Settings2,
  Ship,
  Snowflake,
  Target,
  X,
} from 'lucide-react'
import { ICEBERGS } from '@/lib/data/icebergs'
import { VESSELS } from '@/lib/data/vessels'
import { cx } from './shared'
import type { WorkspaceId } from './types'

export const NAV: { id: WorkspaceId; label: string; icon: typeof MapIcon }[] = [
  { id: 'map', label: 'Map', icon: MapIcon },
  { id: 'route-planner', label: 'Route Planner', icon: Navigation },
  { id: 'iceberg-tracker', label: 'Iceberg Tracker', icon: Snowflake },
  { id: 'vessel-monitor', label: 'Vessel Monitor', icon: Ship },
  { id: 'weather-ocean', label: 'Weather & Ocean', icon: Cloud },
  { id: 'risk-analysis', label: 'Risk Analysis', icon: Target },
  { id: 'historical-replay', label: 'Historical Replay', icon: History },
  { id: 'data-sources', label: 'Data Sources', icon: Database },
  { id: 'reports', label: 'Reports', icon: Download },
]

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 items-center justify-center text-2xl text-primary">▲</div>
      <div>
        <div className="font-mono text-lg font-bold tracking-[.17em]">D.H.R.U.V.</div>
        <div className="text-[9px] text-muted-foreground">Navigate Uncertainty</div>
      </div>
    </div>
  )
}

type SearchHit = { id: string; label: string; kind: 'iceberg' | 'vessel'; target: WorkspaceId }

export function Topbar({
  active,
  mobileNavOpen,
  setMobileNavOpen,
  notificationCount,
  onSelectEntity,
  onDismissNotifications,
}: {
  active: WorkspaceId
  mobileNavOpen: boolean
  setMobileNavOpen: (v: boolean) => void
  notificationCount: number
  onSelectEntity: (id: string, target: WorkspaceId) => void
  onDismissNotifications: () => void
}) {
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  const hits: SearchHit[] = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    const icebergHits = ICEBERGS.filter((b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q))
      .slice(0, 5)
      .map((b) => ({ id: b.id, label: b.name, kind: 'iceberg' as const, target: 'iceberg-tracker' as const }))
    const vesselHits = VESSELS.filter((v) => v.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((v) => ({ id: v.id, label: v.name, kind: 'vessel' as const, target: 'vessel-monitor' as const }))
    return [...icebergHits, ...vesselHits]
  }, [query])

  const title = active === 'map' ? 'AI-Enabled Antarctic Navigation' : NAV.find((n) => n.id === active)?.label ?? 'D.H.R.U.V.'

  return (
    <header className="flex min-h-[54px] items-center gap-4 border-b border-border bg-background/95 px-4">
      <button
        className="lg:hidden"
        aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <div className="hidden xl:block">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[10px] text-muted-foreground">Safer routes. Smarter decisions. A more resilient tomorrow.</div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="relative hidden max-w-[330px] flex-1 md:block">
          <div className="flex items-center gap-2 rounded border border-border bg-panel px-3 py-2 text-[11px] text-muted-foreground">
            <Search className="size-3.5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location, iceberg, vessel..."
              className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search location, iceberg, or vessel"
            />
            <kbd className="rounded border border-border px-1.5">Ctrl K</kbd>
          </div>
          {hits.length > 0 && (
            <ul className="absolute left-0 top-full z-30 mt-1 w-full overflow-hidden rounded border border-border bg-panel shadow-xl">
              {hits.map((hit) => (
                <li key={hit.id}>
                  <button
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-[11px] hover:bg-elevated"
                    onClick={() => {
                      onSelectEntity(hit.id, hit.target)
                      setQuery('')
                    }}
                  >
                    <span>{hit.label}</span>
                    <span className="text-[9px] uppercase text-muted-foreground">{hit.kind}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="hidden rounded border border-border bg-panel px-3 py-1.5 text-[10px] sm:block">
          <span className="mr-1.5 text-risk-low">●</span>Live Data
          <div className="text-[9px] text-muted-foreground">12 Aug 2026, 14:32 UTC</div>
        </div>
        <div className="relative">
          <button
            aria-label={notificationCount > 0 ? `${notificationCount} unread notifications` : 'Notifications'}
            onClick={() => setNotifOpen((v) => !v)}
            className="relative"
          >
            <Bell className="size-4 text-muted-foreground" />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-risk-critical text-[8px] font-bold text-background">
                {notificationCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded border border-border bg-panel p-2 text-[10px] shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">Notifications</span>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    onDismissNotifications()
                    setNotifOpen(false)
                  }}
                >
                  Mark all read
                </button>
              </div>
              <p className="text-muted-foreground">
                {notificationCount > 0 ? `${notificationCount} unread operational alerts.` : 'You are all caught up.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export function Sidebar({
  active,
  setActive,
  mobileNavOpen,
  setMobileNavOpen,
}: {
  active: WorkspaceId
  setActive: (id: WorkspaceId) => void
  mobileNavOpen: boolean
  setMobileNavOpen: (v: boolean) => void
}) {
  return (
    <>
      {mobileNavOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-background/70 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <nav
        className={cx(
          'z-40 w-[220px] shrink-0 flex-col border-r border-border bg-sidebar p-3',
          'fixed inset-y-0 left-0 flex transition-transform lg:static lg:w-[148px] lg:translate-x-0',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="border-b border-border px-1 pb-5 pt-1">
          <Brand />
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto py-4">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActive(id)
                setMobileNavOpen(false)
              }}
              aria-current={active === id ? 'page' : undefined}
              className={cx(
                'flex items-center gap-3 rounded px-3 py-2 text-left text-xs transition-colors',
                active === id ? 'bg-sidebar-accent text-foreground ring-1 ring-primary/60' : 'text-muted-foreground hover:bg-sidebar-accent',
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
        <div className="mt-auto border-t border-border pt-4 text-[10px] text-muted-foreground">
          <div className="mb-3 flex items-center gap-2 text-foreground">
            <Settings2 className="size-3.5" />
            System Status
          </div>
          <div className="flex justify-between">
            <span>Data feeds</span>
            <span className="text-risk-low">Operational</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span>Models</span>
            <span className="text-risk-low">v2.3.0</span>
          </div>
          <div className="mt-5 flex gap-2">
            <span className="text-primary">✦</span>
            <span>
              Explore Today.
              <br />
              Safer Tomorrows.
            </span>
          </div>
        </div>
      </nav>
    </>
  )
}
