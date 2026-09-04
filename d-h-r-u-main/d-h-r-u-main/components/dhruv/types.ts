import type { Iceberg, Vessel } from '@/lib/types'

export type WorkspaceId =
  | 'map'
  | 'route-planner'
  | 'iceberg-tracker'
  | 'vessel-monitor'
  | 'weather-ocean'
  | 'risk-analysis'
  | 'historical-replay'
  | 'data-sources'
  | 'reports'

export type SelectedEntity = ({ kind: 'iceberg' } & Iceberg) | ({ kind: 'vessel' } & Vessel) | null

export type MapLayers = {
  seaIce: boolean
  icebergs: boolean
  vessels: boolean
  routes: boolean
}
