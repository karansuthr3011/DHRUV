import type { Vessel } from '../types'
import { bearingDeg } from '../geo'

const SNAPSHOT = new Date('2026-08-12T14:00:00Z')

function iso(offsetHours: number): string {
  return new Date(SNAPSHOT.getTime() + offsetHours * 3600_000).toISOString()
}

// Build an AIS track backward from the current position along a heading.
function buildTrack(
  lon: number,
  lat: number,
  headingDeg: number,
  speedKn: number,
  points: number,
) {
  const track = []
  const hdg = (headingDeg * Math.PI) / 180
  const stepDeg = (speedKn * 1.852 * 3) / 111 // ~3h steps
  for (let i = points - 1; i >= 0; i--) {
    const d = stepDeg * i
    track.push({
      time: iso(-i * 3),
      lon: lon - Math.sin(hdg) * d,
      lat: lat - Math.cos(hdg) * d,
      speedKn: Number((speedKn + (Math.sin(i) * 0.6)).toFixed(1)),
    })
  }
  return track
}

export const VESSELS: Vessel[] = [
  {
    id: 'polar-explorer',
    name: 'MV Polar Explorer',
    flag: 'Norway',
    type: 'Research / Ice-Capable',
    iceClass: 'PC3',
    lon: -12,
    lat: -66,
    speedKn: 12.4,
    headingDeg: 184,
    destination: 'McMurdo Station',
    lastAisUpdate: iso(-0.03),
    exposure: 'moderate',
    track: buildTrack(-12, -66, 184, 12.4, 10),
    nearbyHazards: [
      { id: 'A-214', kind: 'iceberg', label: 'Iceberg A-214', detail: 'Projected path intersects in ~34h', distanceKm: 18.4, severity: 'high' },
      { id: 'seaice-1', kind: 'sea-ice', label: 'Sea Ice Concentration', detail: '42% along leg 3', distanceKm: 0, severity: 'moderate' },
      { id: 'nuyina', kind: 'vessel', label: 'Other Vessels', detail: '1 vessel within 50 km', distanceKm: 47, severity: 'low' },
    ],
    meta: {
      resultTime: iso(-0.03),
      sourceRefs: ['AIS terrestrial + satellite'],
      qualityState: 'fresh',
      warnings: [],
    },
  },
  {
    id: 'nuyina',
    name: 'RSV Nuyina',
    flag: 'Australia',
    type: 'Icebreaker / Supply',
    iceClass: 'PC3',
    lon: 62,
    lat: -66,
    speedKn: 10.2,
    headingDeg: 235,
    destination: 'Davis Station',
    lastAisUpdate: iso(-0.12),
    exposure: 'high',
    track: buildTrack(62, -66, 235, 10.2, 10),
    nearbyHazards: [
      { id: 'A-214', kind: 'iceberg', label: 'Iceberg A-214', detail: 'High-density iceberg field ahead', distanceKm: 9.6, severity: 'critical' },
      { id: 'seaice-2', kind: 'sea-ice', label: 'Sea Ice Concentration', detail: '68% near Amery front', distanceKm: 0, severity: 'high' },
    ],
    meta: {
      resultTime: iso(-0.12),
      sourceRefs: ['AIS satellite'],
      qualityState: 'fresh',
      warnings: [],
    },
  },
  {
    id: 'aurora',
    name: 'MV Aurora Australis',
    flag: 'Australia',
    type: 'Supply / Ice-Capable',
    iceClass: 'PC4',
    lon: 168,
    lat: -70,
    speedKn: 9.1,
    headingDeg: 155,
    destination: 'McMurdo Station',
    lastAisUpdate: iso(-0.4),
    exposure: 'moderate',
    track: buildTrack(168, -70, 155, 9.1, 10),
    nearbyHazards: [
      { id: 'B-15Z', kind: 'iceberg', label: 'Iceberg B-15Z', detail: 'Slow drift, monitored', distanceKm: 31, severity: 'moderate' },
    ],
    meta: {
      resultTime: iso(-0.4),
      sourceRefs: ['AIS terrestrial'],
      qualityState: 'degraded',
      warnings: ['AIS position older than 20 min in this region.'],
    },
  },
  {
    id: 'sa-agulhas',
    name: 'SA Agulhas II',
    flag: 'South Africa',
    type: 'Research / Supply',
    iceClass: 'PC5',
    lon: -30,
    lat: -68,
    speedKn: 11.0,
    headingDeg: 95,
    destination: 'Halley VI Station',
    lastAisUpdate: iso(-0.25),
    exposure: 'low',
    track: buildTrack(-30, -68, 95, 11.0, 10),
    nearbyHazards: [
      { id: 'A-64', kind: 'iceberg', label: 'Iceberg A-64', detail: 'Outside influence corridor', distanceKm: 62, severity: 'low' },
    ],
    meta: {
      resultTime: iso(-0.25),
      sourceRefs: ['AIS satellite'],
      qualityState: 'fresh',
      warnings: [],
    },
  },
]

export function getVessel(id: string): Vessel | undefined {
  return VESSELS.find((v) => v.id === id)
}

// Convenience: recompute heading from the last two track points if needed.
export function vesselHeading(v: Vessel): number {
  if (v.track.length < 2) return v.headingDeg
  const a = v.track[v.track.length - 2]
  const b = v.track[v.track.length - 1]
  return bearingDeg([a.lon, a.lat], [b.lon, b.lat])
}
