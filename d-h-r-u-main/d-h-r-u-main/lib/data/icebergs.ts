import type { Iceberg, IcebergSizeClass, RiskTier, Confidence } from '../types'

const SNAPSHOT = new Date('2026-08-12T14:00:00Z')

const KM_PER_DEG_LAT = 111

function iso(offsetHours: number): string {
  return new Date(SNAPSHOT.getTime() + offsetHours * 3600_000).toISOString()
}

// Deterministic pseudo-random for repeatable fixtures.
function mulberry(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Spec {
  id: string
  name: string
  sizeClass: IcebergSizeClass
  lengthKm: number
  lon: number
  lat: number
  driftSpeedKn: number
  headingDeg: number
  risk: RiskTier
  confidence: Confidence
  status: Iceberg['status']
  routeIntersectHours?: number
  seed: number
}

const SPECS: Spec[] = [
  { id: 'A-68A', name: 'A-68A', sizeClass: 'very-large', lengthKm: 62, lon: -34, lat: -63.5, driftSpeedKn: 2.1, headingDeg: 128, risk: 'high', confidence: 'medium', status: 'tracked', seed: 11 },
  { id: 'A-214', name: 'A-214', sizeClass: 'large', lengthKm: 18.4, lon: 74, lat: -66.5, driftSpeedKn: 1.4, headingDeg: 200, risk: 'critical', confidence: 'medium', status: 'tracked', routeIntersectHours: 34, seed: 23 },
  { id: 'A-23A', name: 'A-23A', sizeClass: 'very-large', lengthKm: 76, lon: -40, lat: -61, driftSpeedKn: 1.1, headingDeg: 45, risk: 'moderate', confidence: 'high', status: 'tracked', seed: 31 },
  { id: 'B-15Z', name: 'B-15Z', sizeClass: 'large', lengthKm: 22, lon: 168, lat: -72, driftSpeedKn: 0.9, headingDeg: 300, risk: 'moderate', confidence: 'high', status: 'tracked', seed: 43 },
  { id: 'C-38', name: 'C-38', sizeClass: 'medium', lengthKm: 9.2, lon: 82, lat: -65, driftSpeedKn: 1.8, headingDeg: 190, risk: 'high', confidence: 'medium', status: 'tracked', routeIntersectHours: 58, seed: 57 },
  { id: 'D-30A', name: 'D-30A', sizeClass: 'large', lengthKm: 27, lon: 12, lat: -69, driftSpeedKn: 1.2, headingDeg: 260, risk: 'moderate', confidence: 'medium', status: 'tracked', seed: 61 },
  { id: 'A-76B', name: 'A-76B', sizeClass: 'large', lengthKm: 34, lon: -58, lat: -73, driftSpeedKn: 0.8, headingDeg: 20, risk: 'low', confidence: 'high', status: 'grounded', seed: 79 },
  { id: 'BERG-2291', name: 'Unmatched 2291', sizeClass: 'small', lengthKm: 2.1, lon: 66, lat: -64, driftSpeedKn: 2.6, headingDeg: 210, risk: 'high', confidence: 'low', status: 'unmatched', routeIntersectHours: 21, seed: 83 },
  { id: 'C-19C', name: 'C-19C', sizeClass: 'medium', lengthKm: 7.4, lon: 150, lat: -66, driftSpeedKn: 1.5, headingDeg: 275, risk: 'moderate', confidence: 'medium', status: 'tracked', seed: 97 },
  { id: 'D-28', name: 'D-28', sizeClass: 'large', lengthKm: 30, lon: 88, lat: -67, driftSpeedKn: 1.0, headingDeg: 240, risk: 'moderate', confidence: 'high', status: 'tracked', seed: 101 },
  { id: 'A-81', name: 'A-81', sizeClass: 'large', lengthKm: 40, lon: -52, lat: -75, driftSpeedKn: 0.7, headingDeg: 15, risk: 'low', confidence: 'high', status: 'tracked', seed: 113 },
  { id: 'BERG-3382', name: 'Unmatched 3382', sizeClass: 'bergy-bit', lengthKm: 0.4, lon: 70, lat: -65.5, driftSpeedKn: 3.1, headingDeg: 205, risk: 'moderate', confidence: 'low', status: 'unmatched', seed: 127 },
  { id: 'C-33', name: 'C-33', sizeClass: 'medium', lengthKm: 6.1, lon: 120, lat: -65, driftSpeedKn: 1.3, headingDeg: 250, risk: 'low', confidence: 'medium', status: 'tracked', seed: 131 },
  { id: 'A-64', name: 'A-64', sizeClass: 'medium', lengthKm: 11, lon: -20, lat: -66, driftSpeedKn: 1.6, headingDeg: 140, risk: 'moderate', confidence: 'medium', status: 'tracked', seed: 149 },
  { id: 'B-22A', name: 'B-22A', sizeClass: 'large', lengthKm: 48, lon: -108, lat: -74, driftSpeedKn: 0.6, headingDeg: 30, risk: 'low', confidence: 'high', status: 'grounded', seed: 151 },
  { id: 'BERG-4417', name: 'Unmatched 4417', sizeClass: 'small', lengthKm: 1.7, lon: 78, lat: -67.5, driftSpeedKn: 2.2, headingDeg: 195, risk: 'high', confidence: 'low', status: 'unmatched', routeIntersectHours: 44, seed: 163 },
  { id: 'C-28B', name: 'C-28B', sizeClass: 'medium', lengthKm: 8.8, lon: 140, lat: -64, driftSpeedKn: 1.7, headingDeg: 285, risk: 'moderate', confidence: 'medium', status: 'tracked', seed: 179 },
  { id: 'D-21', name: 'D-21', sizeClass: 'small', lengthKm: 3.3, lon: 30, lat: -68, driftSpeedKn: 1.9, headingDeg: 220, risk: 'low', confidence: 'medium', status: 'tracked', seed: 181 },
]

function buildTrack(spec: Spec): Iceberg {
  const rand = mulberry(spec.seed)
  const speedDegPerHr = (spec.driftSpeedKn * 1.852) / KM_PER_DEG_LAT
  const hdg = (spec.headingDeg * Math.PI) / 180

  // Historical observations: 12 points over the past ~9 days back from now.
  const observations = []
  const totalHistHrs = 9 * 24
  const nObs = 12
  for (let i = 0; i < nObs; i++) {
    const hoursAgo = totalHistHrs * (1 - i / (nObs - 1))
    const jitter = (rand() - 0.5) * 0.25
    const dist = speedDegPerHr * hoursAgo
    const lon = spec.lon - Math.sin(hdg) * dist + jitter
    const lat = spec.lat - Math.cos(hdg) * dist + jitter * 0.5
    observations.push({ time: iso(-hoursAgo), lon, lat })
  }

  // Forecast: next 72h, uncertainty grows with lead time.
  const forecast = []
  for (let h = 0; h <= 72; h += 12) {
    const wobble = (rand() - 0.5) * 0.4 * (h / 72)
    const dist = speedDegPerHr * h
    const lon = spec.lon + Math.sin(hdg) * dist + wobble
    const lat = spec.lat + Math.cos(hdg) * dist + wobble * 0.5
    const uncertaintyKm = 1.2 + (h / 24) * (spec.confidence === 'low' ? 4.6 : spec.confidence === 'medium' ? 3.0 : 1.8)
    forecast.push({ time: iso(h), lon, lat, uncertaintyKm: Number(uncertaintyKm.toFixed(1)) })
  }

  return {
    id: spec.id,
    name: spec.name,
    sizeClass: spec.sizeClass,
    lengthKm: spec.lengthKm,
    status: spec.status,
    risk: spec.risk,
    lon: spec.lon,
    lat: spec.lat,
    driftSpeedKn: spec.driftSpeedKn,
    headingDeg: spec.headingDeg,
    lastObserved: iso(-2.2),
    observations,
    forecast,
    confidence: spec.confidence,
    routeIntersectHours: spec.routeIntersectHours,
    meta: {
      resultTime: iso(-2.2),
      sourceRefs: ['NSIDC iceberg feed', 'Sentinel-1 SAR'],
      methodVersion: 'drift-v2.3',
      qualityState: spec.confidence === 'low' ? 'degraded' : 'fresh',
      warnings:
        spec.status === 'unmatched'
          ? ['Identity unmatched — track history may be incomplete.']
          : [],
    },
  }
}

export const ICEBERGS: Iceberg[] = SPECS.map(buildTrack)

export const SIZE_CLASS_LABEL: Record<IcebergSizeClass, string> = {
  growler: 'Growler',
  'bergy-bit': 'Bergy bit',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  'very-large': 'Very large',
}

export function getIceberg(id: string): Iceberg | undefined {
  return ICEBERGS.find((b) => b.id === id)
}
