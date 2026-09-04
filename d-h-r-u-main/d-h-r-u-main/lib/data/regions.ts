export interface Region {
  id: string
  name: string
  kind: 'sea' | 'shelf' | 'station' | 'point'
  lon: number
  lat: number
  zoom: number
}

// Antarctic named places used for map framing, search, and route endpoints.
export const REGIONS: Region[] = [
  { id: 'weddell', name: 'Weddell Sea', kind: 'sea', lon: -45, lat: -72, zoom: 3.4 },
  { id: 'ross', name: 'Ross Sea', kind: 'sea', lon: 175, lat: -74, zoom: 3.4 },
  { id: 'amundsen', name: 'Amundsen Sea', kind: 'sea', lon: -110, lat: -72, zoom: 3.4 },
  { id: 'bellingshausen', name: 'Bellingshausen Sea', kind: 'sea', lon: -85, lat: -70, zoom: 3.4 },
  { id: 'ronne', name: 'Ronne Ice Shelf', kind: 'shelf', lon: -60, lat: -78, zoom: 3.6 },
  { id: 'ross-shelf', name: 'Ross Ice Shelf', kind: 'shelf', lon: -175, lat: -81, zoom: 3.6 },
  { id: 'amery', name: 'Amery Ice Shelf', kind: 'shelf', lon: 71, lat: -70, zoom: 3.6 },
  { id: 'mcmurdo', name: 'McMurdo Station', kind: 'station', lon: 166.67, lat: -77.85, zoom: 4.2 },
  { id: 'rothera', name: 'Rothera Research Station', kind: 'station', lon: -68.13, lat: -67.57, zoom: 4.2 },
  { id: 'halley', name: 'Halley VI Station', kind: 'station', lon: -26.5, lat: -75.6, zoom: 4.2 },
  { id: 'palmer', name: 'Palmer Station', kind: 'station', lon: -64.05, lat: -64.77, zoom: 4.2 },
  { id: 'davis', name: 'Davis Station', kind: 'station', lon: 77.97, lat: -68.58, zoom: 4.2 },
]

// South-polar default camera framing for the Operations Map.
export const ANTARCTIC_VIEW = {
  center: [15, -73] as [number, number],
  zoom: 2.5,
  minZoom: 1.6,
  maxZoom: 8,
}
