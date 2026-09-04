import type { RouteCandidate, StressScenario, DecisionMode } from '../types'

const SNAPSHOT = new Date('2026-08-12T14:00:00Z')
function iso(offsetHours: number): string {
  return new Date(SNAPSHOT.getTime() + offsetHours * 3600_000).toISOString()
}

export const ROUTES: RouteCandidate[] = [
  {
    id: 'route-primary',
    label: 'Primary Route',
    kind: 'primary',
    coordinates: [
      [-12, -66], [-2, -63], [10, -60], [24, -61], [40, -63], [55, -65], [66, -66.5],
    ],
    segments: [
      { id: 'p1', index: 0, from: { lon: -12, lat: -66 }, to: { lon: 10, lat: -60 }, risk: 'low', distanceKm: 940, note: 'Clear water, low sea-ice concentration' },
      { id: 'p2', index: 1, from: { lon: 10, lat: -60 }, to: { lon: 40, lat: -63 }, risk: 'moderate', distanceKm: 1180, note: 'Approaching A-68A drift corridor' },
      { id: 'p3', index: 2, from: { lon: 40, lat: -63 }, to: { lon: 66, lat: -66.5 }, risk: 'low', distanceKm: 720, note: 'Final approach, McMurdo shelf' },
    ],
    distanceKm: 2840,
    durationDays: 11.8,
    expectedRisk: 0.32,
    worstCaseRisk: 0.58,
    fuelIndex: 100,
    timeIndex: 100,
    resilienceScore: 78,
    fallbackAccessibility: 82,
    confidence: 'high',
    riskTier: 'moderate',
    contributors: [
      { label: 'Iceberg corridor exposure (A-68A)', direction: 'negative', magnitude: 0.42 },
      { label: 'Sea-ice concentration', direction: 'negative', magnitude: 0.24 },
      { label: 'Fuel efficiency', direction: 'positive', magnitude: 0.66 },
      { label: 'Fallback accessibility', direction: 'positive', magnitude: 0.58 },
    ],
    resilienceProfile: {
      expectedPerformance: 'moderate',
      worstCase: 'high',
      uncertaintyExposure: 'moderate',
      fallbackAccessibility: 'low',
      dataFreshness: 'low',
    },
  },
  {
    id: 'route-alternative',
    label: 'Alternative Route',
    kind: 'alternative',
    coordinates: [
      [-12, -66], [-4, -61], [12, -56], [30, -58], [48, -61], [62, -64], [66, -66.5],
    ],
    segments: [
      { id: 'a1', index: 0, from: { lon: -12, lat: -66 }, to: { lon: 12, lat: -56 }, risk: 'low', distanceKm: 1260, note: 'Wider berth around forecast iceberg corridor' },
      { id: 'a2', index: 1, from: { lon: 12, lat: -56 }, to: { lon: 48, lat: -61 }, risk: 'low', distanceKm: 1080, note: 'Open water, better fallback access' },
      { id: 'a3', index: 2, from: { lon: 48, lat: -61 }, to: { lon: 66, lat: -66.5 }, risk: 'moderate', distanceKm: 670, note: 'Amery Ice Shelf approach' },
    ],
    distanceKm: 3010,
    durationDays: 13.1,
    expectedRisk: 0.21,
    worstCaseRisk: 0.34,
    fuelIndex: 106,
    timeIndex: 111,
    resilienceScore: 62,
    fallbackAccessibility: 91,
    confidence: 'high',
    riskTier: 'moderate',
    contributors: [
      { label: 'Iceberg corridor exposure', direction: 'positive', magnitude: 0.7 },
      { label: 'Distance / fuel cost', direction: 'negative', magnitude: 0.38 },
      { label: 'Fallback accessibility', direction: 'positive', magnitude: 0.82 },
    ],
    resilienceProfile: {
      expectedPerformance: 'low',
      worstCase: 'moderate',
      uncertaintyExposure: 'low',
      fallbackAccessibility: 'low',
      dataFreshness: 'low',
    },
  },
  {
    id: 'route-fallback',
    label: 'Fallback Route',
    kind: 'fallback',
    coordinates: [
      [-12, -66], [-6, -58], [8, -52], [26, -54], [46, -58], [64, -62], [66, -66.5],
    ],
    segments: [
      { id: 'f1', index: 0, from: { lon: -12, lat: -66 }, to: { lon: 8, lat: -52 }, risk: 'low', distanceKm: 1560, note: 'Far-north deviation, maximum clearance' },
      { id: 'f2', index: 1, from: { lon: 8, lat: -52 }, to: { lon: 46, lat: -58 }, risk: 'moderate', distanceKm: 1120, note: 'Extended open-water transit' },
      { id: 'f3', index: 2, from: { lon: 46, lat: -58 }, to: { lon: 66, lat: -66.5 }, risk: 'high', distanceKm: 540, note: 'Late approach through dense pack ice' },
    ],
    distanceKm: 3220,
    durationDays: 14.8,
    expectedRisk: 0.29,
    worstCaseRisk: 0.49,
    fuelIndex: 114,
    timeIndex: 125,
    resilienceScore: 49,
    fallbackAccessibility: 64,
    confidence: 'medium',
    riskTier: 'high',
    contributors: [
      { label: 'Distance / fuel cost', direction: 'negative', magnitude: 0.74 },
      { label: 'Pack-ice approach risk', direction: 'negative', magnitude: 0.46 },
      { label: 'Corridor avoidance', direction: 'positive', magnitude: 0.6 },
    ],
    resilienceProfile: {
      expectedPerformance: 'moderate',
      worstCase: 'high',
      uncertaintyExposure: 'high',
      fallbackAccessibility: 'moderate',
      dataFreshness: 'moderate',
    },
  },
]

export const DECISION_MODE_NOTES: Record<DecisionMode, string> = {
  conservative:
    'Conservative mode widens berth around every tracked hazard and favors routes with the highest fallback accessibility, even at a fuel and time cost.',
  balanced:
    'Balanced mode weighs iceberg corridor exposure against fuel and time cost. The primary route currently offers the best trade-off: lower exposure to high-density iceberg zones (−42%), better resilience under forecast variability, and only a ~6% time premium versus the fastest option.',
  efficient:
    'Efficient mode prioritizes distance and fuel index, accepting higher exposure to forecast iceberg corridors when confidence is high.',
}

export const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 'stress-drift',
    label: '+50% iceberg drift uncertainty',
    description: 'Widens A-68A and A-214 forecast envelopes by 50% to test route resilience against forecast error.',
    uncertaintyMultiplier: 1.5,
    driftMultiplier: 1.2,
    resilienceDelta: { primary: -18, alternative: -6, fallback: -4 },
    outcome: { primary: 'fragile', alternative: 'viable', fallback: 'robust' },
  },
  {
    id: 'stress-storm',
    label: 'Severe storm system (72h)',
    description: 'Simulates a low-pressure system reducing visibility and increasing wave height across the primary corridor.',
    uncertaintyMultiplier: 1.2,
    driftMultiplier: 1.4,
    resilienceDelta: { primary: -24, alternative: -10, fallback: -2 },
    outcome: { primary: 'fragile', alternative: 'viable', fallback: 'robust' },
  },
  {
    id: 'stress-stale',
    label: 'Stale satellite pass (12h gap)',
    description: 'Removes the most recent satellite iceberg detection pass, forcing routes to rely on extrapolated positions.',
    uncertaintyMultiplier: 1.3,
    driftMultiplier: 1.0,
    resilienceDelta: { primary: -12, alternative: -8, fallback: -5 },
    outcome: { primary: 'viable', alternative: 'viable', fallback: 'robust' },
  },
]

export const routeRiskLabel = (r: RouteCandidate) => r.riskTier
export { iso as routeIso }
