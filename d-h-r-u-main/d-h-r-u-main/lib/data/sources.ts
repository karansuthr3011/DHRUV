import type { DataSource, ModelHealth, EnvConditions, OpsNotification } from '../types'

export const DATA_SOURCES: DataSource[] = [
  { id: 'seaice-copernicus', name: 'Sea-Ice Concentration', provider: 'Copernicus', dataset: 'OSI-SAF', category: 'sea-ice', freshness: 'Global', coveragePct: 98, latency: '18 min', status: 'healthy', lastUpdate: '3h ago', note: 'Passive microwave, daily composite' },
  { id: 'iceberg-nic', name: 'Iceberg Detection', provider: 'NIC / Sentinel-1', dataset: 'SAR wide-swath', category: 'iceberg', freshness: 'Antarctic', coveragePct: 91, latency: '42 min', status: 'healthy', lastUpdate: '3h ago', note: 'SAR-derived positions, 6h revisit near corridors' },
  { id: 'weather-ecmwf', name: 'Weather Forecast', provider: 'ECMWF', dataset: 'IFS HRES', category: 'weather', freshness: 'Global', coveragePct: 100, latency: '1.2 h', status: 'healthy', lastUpdate: '6h ago', note: '10-day global forecast, 0.1° grid' },
  { id: 'ocean-cmems', name: 'Ocean Currents', provider: 'CMEMS', dataset: 'GLORYS12', category: 'ocean', freshness: 'Southern Ocean', coveragePct: 87, latency: '6 h', status: 'degraded', lastUpdate: '15 min ago', note: 'Reanalysis + nowcast blend running with stale altimetry input' },
  { id: 'ais-terrestrial', name: 'AIS Vessel Positions', provider: 'Multi-source', dataset: 'Terrestrial + satellite', category: 'ais', freshness: 'Global', coveragePct: 96, latency: '2 min', status: 'healthy', lastUpdate: '2 min ago', note: 'Blended terrestrial and satellite AIS feeds' },
]

export const MODEL_HEALTH: ModelHealth[] = [
  { id: 'seaice-forecast', name: 'Sea-Ice Forecast', version: 'v1.4.2', lastValidation: '03 Aug 2026', skillMetricLabel: 'Brier Score', skillMetricValue: '0.11', confidence: 'high', inputAvailabilityPct: 98, lastRun: '18 min ago', limitations: ['Reduced skill in fast-ice zones under 5 km resolution.'] },
  { id: 'iceberg-drift', name: 'Iceberg Drift', version: 'v2.1.0', lastValidation: '20 Aug 2026', skillMetricLabel: 'Track Error (72h)', skillMetricValue: '24.7 km', confidence: 'high', inputAvailabilityPct: 91, lastRun: '42 min ago', limitations: ['Assumes constant wind forcing between satellite passes.'] },
  { id: 'route-risk', name: 'Route Risk', version: 'v1.8.1', lastValidation: '01 Aug 2025', skillMetricLabel: 'Calibration', skillMetricValue: '0.82', confidence: 'medium', inputAvailabilityPct: 87, lastRun: '1.2 h ago', limitations: ['Running with reduced confidence due to stale ocean current data (6h old).'] },
  { id: 'resilience-engine', name: 'Resilience Engine', version: 'v1.3.0', lastValidation: '02 Aug 2026', skillMetricLabel: 'Backtest Accuracy', skillMetricValue: '89%', confidence: 'high', inputAvailabilityPct: 96, lastRun: '2 min ago', limitations: ['Stress-test multipliers are illustrative, not probabilistic.'] },
]

export const ENV_CONDITIONS: EnvConditions = {
  windKn: 22,
  windDir: 'NE',
  airTempC: -18,
  waveM: 2.1,
  seaTempC: -1.8,
  visibility: 'Good',
  source: 'ECMWF',
  age: '3h ago',
}

export const NOTIFICATIONS: OpsNotification[] = [
  {
    id: 'n1',
    kind: 'hazard',
    severity: 'high',
    title: 'Iceberg A-68A projected corridor intersection',
    impact: 'Primary route exposure increasing over the next 36-48h.',
    area: 'Weddell Sea',
    time: '18 min ago',
    actions: [{ label: 'Compare route impact', action: 'route' }],
  },
  {
    id: 'n2',
    kind: 'source',
    severity: 'moderate',
    title: 'Ocean current data running stale',
    impact: 'Route Risk model confidence reduced.',
    area: 'Data Sources',
    time: '15 min ago',
    actions: [{ label: 'View data sources', action: 'data' }],
  },
  {
    id: 'n3',
    kind: 'replan',
    severity: 'low',
    title: 'RSV Nuyina route confirmed',
    impact: 'Vessel accepted the balanced-mode primary route.',
    area: 'East Antarctica',
    time: '1h ago',
    actions: [],
  },
]

export const AUDIT_LOG = [
  { time: '12 Aug 2026, 14:32 UTC', event: 'Route confirmed', detail: 'MV Polar Explorer accepted Primary Route (balanced mode)', actor: 'Ops console' },
  { time: '12 Aug 2026, 14:18 UTC', event: 'Model run completed', detail: 'Iceberg Drift v2.1.0 refreshed A-68A / A-214 forecasts', actor: 'Scheduler' },
  { time: '12 Aug 2026, 08:52 UTC', event: 'Data source degraded', detail: 'CMEMS ocean current feed flagged stale (6h)', actor: 'Data Sources' },
  { time: '11 Aug 2026, 22:10 UTC', event: 'Stress test run', detail: '+50% iceberg drift uncertainty scenario evaluated against 3 candidates', actor: 'Risk Analysis' },
  { time: '11 Aug 2026, 09:04 UTC', event: 'Historical case validated', detail: 'A-68A Drift (2020-2021) replay scored within expected range', actor: 'Historical Replay' },
]
