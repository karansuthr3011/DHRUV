import type { Confidence, RiskTier, SourceStatus } from './types'

const R = 6371 // km

const toRad = (d: number) => (d * Math.PI) / 180
const toDeg = (r: number) => (r * 180) / Math.PI

/** Great-circle distance in km between two lon/lat points. */
export function haversineKm(a: [number, number], b: [number, number]): number {
  const dLat = toRad(b[1] - a[1])
  const dLon = toRad(b[0] - a[0])
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Initial bearing (deg) from a to b. */
export function bearingDeg(a: [number, number], b: [number, number]): number {
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const dLon = toRad(b[0] - a[0])
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/** Linear interpolation between two lon/lat points (fine for demo scale). */
export function lerpPoint(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

/** Densify a polyline of waypoints into a smooth-ish path with N points per leg. */
export function densify(points: [number, number][], perLeg = 12): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = 0; j < perLeg; j++) {
      out.push(lerpPoint(points[i], points[i + 1], j / perLeg))
    }
  }
  out.push(points[points.length - 1])
  return out
}

/** Total length in km of a polyline. */
export function pathLengthKm(points: [number, number][]): number {
  let total = 0
  for (let i = 0; i < points.length - 1; i++) total += haversineKm(points[i], points[i + 1])
  return total
}

/**
 * A rough uncertainty polygon (envelope) around a forecast track: offset the
 * track perpendicular by the per-point uncertainty radius, out and back.
 */
export function envelopePolygon(
  track: { lon: number; lat: number; uncertaintyKm: number }[],
): [number, number][] {
  if (track.length < 2) return []
  const kmPerDegLat = 111
  const left: [number, number][] = []
  const right: [number, number][] = []
  for (let i = 0; i < track.length; i++) {
    const prev = track[Math.max(0, i - 1)]
    const next = track[Math.min(track.length - 1, i + 1)]
    const brg = toRad(bearingDeg([prev.lon, prev.lat], [next.lon, next.lat]))
    // perpendicular offset
    const perp = brg + Math.PI / 2
    const kmPerDegLon = 111 * Math.cos(toRad(track[i].lat)) || 1
    const dLat = (track[i].uncertaintyKm / kmPerDegLat) * Math.cos(perp)
    const dLon = (track[i].uncertaintyKm / kmPerDegLon) * Math.sin(perp)
    left.push([track[i].lon + dLon, track[i].lat + dLat])
    right.push([track[i].lon - dLon, track[i].lat - dLat])
  }
  return [...left, ...right.reverse(), left[0]]
}

/** Corridor polygon around a route with a widening half-width per point (km). */
export function corridorPolygon(
  path: [number, number][],
  halfWidthKm: (t: number) => number,
): [number, number][] {
  if (path.length < 2) return []
  const kmPerDegLat = 111
  const left: [number, number][] = []
  const right: [number, number][] = []
  for (let i = 0; i < path.length; i++) {
    const prev = path[Math.max(0, i - 1)]
    const next = path[Math.min(path.length - 1, i + 1)]
    const brg = toRad(bearingDeg(prev, next))
    const perp = brg + Math.PI / 2
    const w = halfWidthKm(i / (path.length - 1))
    const kmPerDegLon = 111 * Math.cos(toRad(path[i][1])) || 1
    const dLat = (w / kmPerDegLat) * Math.cos(perp)
    const dLon = (w / kmPerDegLon) * Math.sin(perp)
    left.push([path[i][0] + dLon, path[i][1] + dLat])
    right.push([path[i][0] - dLon, path[i][1] - dLat])
  }
  return [...left, ...right.reverse(), left[0]]
}

// ---------------------------------------------------------------------------
// Risk / status semantic mapping. These return CSS variable references so the
// same tier maps to the same color everywhere (map + panels + charts).
// ---------------------------------------------------------------------------
export const RISK_COLORS: Record<RiskTier, string> = {
  low: 'var(--risk-low)',
  moderate: 'var(--risk-moderate)',
  high: 'var(--risk-high)',
  critical: 'var(--risk-critical)',
}

// Concrete hex-ish values for MapLibre paint (cannot read CSS vars at paint time).
export const RISK_HEX: Record<RiskTier, string> = {
  low: '#3fd39b',
  moderate: '#ecc53f',
  high: '#f08a3c',
  critical: '#ef5a52',
}

export const RISK_LABEL: Record<RiskTier, string> = {
  low: 'Lower',
  moderate: 'Moderate',
  high: 'Higher',
  critical: 'Critical',
}

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: 'High',
  medium: 'Moderate',
  low: 'Low',
}

export function riskTextClass(tier: RiskTier): string {
  return {
    low: 'text-risk-low',
    moderate: 'text-risk-moderate',
    high: 'text-risk-high',
    critical: 'text-risk-critical',
  }[tier]
}

export const SOURCE_STATUS_LABEL: Record<SourceStatus, string> = {
  healthy: 'Healthy',
  partial: 'Partial',
  degraded: 'Degraded',
  unavailable: 'Unavailable',
}
