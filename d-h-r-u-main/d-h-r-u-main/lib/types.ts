// D.H.R.U.V. domain types — mirror the API/frontend contract in spec section 34
// so fixtures read as real data, not screenshots.

export type QualityState = 'fresh' | 'degraded' | 'conflict' | 'unavailable'
export type Confidence = 'high' | 'medium' | 'low'
export type RiskTier = 'low' | 'moderate' | 'high' | 'critical'
export type DecisionMode = 'conservative' | 'balanced' | 'efficient'

export interface ResultMeta {
  resultTime: string
  sourceRefs: string[]
  methodVersion?: string
  qualityState: QualityState
  warnings: string[]
}

export interface LngLat {
  lon: number
  lat: number
}

// ---------------------------------------------------------------------------
// Icebergs
// ---------------------------------------------------------------------------
export type IcebergSizeClass = 'growler' | 'bergy-bit' | 'small' | 'medium' | 'large' | 'very-large'

export interface IcebergObservation {
  time: string
  lon: number
  lat: number
}

export interface IcebergForecastPoint {
  time: string
  lon: number
  lat: number
  // radius (km) of the uncertainty envelope at this valid time
  uncertaintyKm: number
}

export interface Iceberg {
  id: string
  name: string
  sizeClass: IcebergSizeClass
  lengthKm: number
  status: 'tracked' | 'unmatched' | 'grounded'
  risk: RiskTier
  lon: number
  lat: number
  driftSpeedKn: number
  headingDeg: number
  lastObserved: string
  observations: IcebergObservation[]
  forecast: IcebergForecastPoint[]
  confidence: Confidence
  // if this berg intersects the active route, hours until intersection
  routeIntersectHours?: number
  meta: ResultMeta
}

// ---------------------------------------------------------------------------
// Vessels
// ---------------------------------------------------------------------------
export interface VesselTrackPoint {
  time: string
  lon: number
  lat: number
  speedKn: number
}

export interface NearbyHazard {
  id: string
  kind: 'iceberg' | 'sea-ice' | 'vessel' | 'weather'
  label: string
  detail: string
  distanceKm: number
  severity: RiskTier
}

export interface Vessel {
  id: string
  name: string
  flag: string
  type: string
  iceClass: string
  lon: number
  lat: number
  speedKn: number
  headingDeg: number
  destination: string
  lastAisUpdate: string
  exposure: RiskTier
  track: VesselTrackPoint[]
  nearbyHazards: NearbyHazard[]
  meta: ResultMeta
}

// ---------------------------------------------------------------------------
// Sea ice
// ---------------------------------------------------------------------------
export interface SeaIceCell {
  lon: number
  lat: number
  // 0..1 concentration
  concentration: number
}

export interface SeaIceGrid {
  observedAt: string
  validAt: string
  state: 'observed' | 'forecast'
  cells: SeaIceCell[]
  meta: ResultMeta
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
export interface RouteContributor {
  label: string
  direction: 'positive' | 'negative'
  // 0..1 magnitude of contribution
  magnitude: number
}

export interface RouteSegment {
  id: string
  index: number
  from: LngLat
  to: LngLat
  risk: RiskTier
  distanceKm: number
  note: string
}

export interface RouteCandidate {
  id: string
  label: string
  kind: 'primary' | 'alternative' | 'fallback'
  coordinates: [number, number][]
  segments: RouteSegment[]
  distanceKm: number
  durationDays: number
  expectedRisk: number
  worstCaseRisk: number
  fuelIndex: number // 100 = baseline
  timeIndex: number // 100 = baseline
  resilienceScore: number // 0..100
  fallbackAccessibility: number // 0..100
  confidence: Confidence
  riskTier: RiskTier
  contributors: RouteContributor[]
  resilienceProfile: {
    expectedPerformance: RiskTier
    worstCase: RiskTier
    uncertaintyExposure: RiskTier
    fallbackAccessibility: RiskTier
    dataFreshness: RiskTier
  }
}

// ---------------------------------------------------------------------------
// Data sources & model health
// ---------------------------------------------------------------------------
export type SourceStatus = 'healthy' | 'partial' | 'degraded' | 'unavailable'

export interface DataSource {
  id: string
  name: string
  provider: string
  dataset: string
  category: 'sea-ice' | 'iceberg' | 'weather' | 'ocean' | 'ais'
  freshness: string
  coveragePct: number
  latency: string
  status: SourceStatus
  lastUpdate: string
  note: string
}

export interface ModelHealth {
  id: string
  name: string
  version: string
  lastValidation: string
  skillMetricLabel: string
  skillMetricValue: string
  confidence: Confidence
  inputAvailabilityPct: number
  lastRun: string
  limitations: string[]
}

// ---------------------------------------------------------------------------
// Stress test scenarios
// ---------------------------------------------------------------------------
export interface StressScenario {
  id: string
  label: string
  description: string
  // multiplier applied to iceberg uncertainty / drift for visualization
  uncertaintyMultiplier: number
  driftMultiplier: number
  // deltas applied to route resilience for each candidate kind
  resilienceDelta: {
    primary: number
    alternative: number
    fallback: number
  }
  outcome: {
    primary: 'robust' | 'viable' | 'fragile'
    alternative: 'robust' | 'viable' | 'fragile'
    fallback: 'robust' | 'viable' | 'fragile'
  }
}

// ---------------------------------------------------------------------------
// Replay scenarios
// ---------------------------------------------------------------------------
export interface ReplayScenario {
  id: string
  title: string
  region: string
  dateRange: string
  vesselProfile: string
  summary: string
  t0: string
  forecastTrack: IcebergForecastPoint[]
  actualTrack: IcebergObservation[]
  recommendedRoute: [number, number][]
  actualRoute: [number, number][]
  outcome: {
    verdict: 'avoided' | 'encountered' | 'mixed'
    headline: string
    detail: string
    forecastErrorKm: number
  }
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export interface OpsNotification {
  id: string
  kind: 'hazard' | 'replan' | 'source' | 'forecast'
  severity: RiskTier
  title: string
  impact: string
  area: string
  time: string
  actions: { label: string; action: string }[]
  read?: boolean
}

// ---------------------------------------------------------------------------
// Environmental conditions
// ---------------------------------------------------------------------------
export interface EnvConditions {
  windKn: number
  windDir: string
  airTempC: number
  waveM: number
  seaTempC: number
  visibility: string
  source: string
  age: string
}
