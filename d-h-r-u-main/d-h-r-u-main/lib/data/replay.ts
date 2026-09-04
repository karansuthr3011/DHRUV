import type { ReplayScenario } from '../types'

export const REPLAY_SCENARIOS: ReplayScenario[] = [
  {
    id: 'a68a-drift-2020',
    title: 'A-68A Drift (2020-2021)',
    region: 'Weddell Sea',
    dateRange: 'Oct 2020 - Jan 2021',
    vesselProfile: 'Moderate error',
    summary:
      'A-68A calved from Larsen C in 2017 and drifted north through the Weddell Sea, threatening a close pass of South Georgia in December 2020 before breaking apart.',
    t0: '2020-12-01T00:00:00Z',
    forecastTrack: [
      { time: '2020-12-01T00:00:00Z', lon: -40, lat: -60, uncertaintyKm: 8 },
      { time: '2020-12-08T00:00:00Z', lon: -38, lat: -58, uncertaintyKm: 14 },
      { time: '2020-12-15T00:00:00Z', lon: -36.5, lat: -56.4, uncertaintyKm: 22 },
      { time: '2020-12-22T00:00:00Z', lon: -35, lat: -55, uncertaintyKm: 30 },
    ],
    actualTrack: [
      { time: '2020-12-01T00:00:00Z', lon: -40, lat: -60 },
      { time: '2020-12-08T00:00:00Z', lon: -37.6, lat: -58.3 },
      { time: '2020-12-15T00:00:00Z', lon: -35.2, lat: -56.9 },
      { time: '2020-12-22T00:00:00Z', lon: -33.1, lat: -55.7 },
    ],
    recommendedRoute: [[-44, -61], [-40, -59], [-34, -57], [-28, -54]],
    actualRoute: [[-44, -61], [-40, -59], [-34, -57], [-28, -54]],
    outcome: {
      verdict: 'avoided',
      headline: 'Model performed within expected range for this case',
      detail: 'Recommended corridor kept a 24.7 km margin from the actual track at closest approach.',
      forecastErrorKm: 24.7,
    },
  },
  {
    id: 'b15j-breakup-2016',
    title: 'B-15J Breakup (2016)',
    region: 'Ross Sea',
    dateRange: 'Feb 2016 - Apr 2016',
    vesselProfile: 'Moderate error',
    summary:
      'B-15J fragmented into several large pieces near the Ross Ice Shelf front, complicating resupply transits to McMurdo Station.',
    t0: '2016-02-10T00:00:00Z',
    forecastTrack: [
      { time: '2016-02-10T00:00:00Z', lon: 168, lat: -74, uncertaintyKm: 6 },
      { time: '2016-02-20T00:00:00Z', lon: 170, lat: -73.4, uncertaintyKm: 16 },
      { time: '2016-03-01T00:00:00Z', lon: 172.5, lat: -72.6, uncertaintyKm: 28 },
    ],
    actualTrack: [
      { time: '2016-02-10T00:00:00Z', lon: 168, lat: -74 },
      { time: '2016-02-20T00:00:00Z', lon: 171.2, lat: -73.1 },
      { time: '2016-03-01T00:00:00Z', lon: 175.4, lat: -71.9 },
    ],
    recommendedRoute: [[164, -75], [170, -73.6], [176, -71.8]],
    actualRoute: [[164, -75], [171, -73.4], [177, -71.5]],
    outcome: {
      verdict: 'mixed',
      headline: 'Fragmentation exceeded modeled drift bounds',
      detail: 'Breakup event pushed the largest fragment 4.2 km outside the 72h uncertainty envelope.',
      forecastErrorKm: 41.2,
    },
  },
  {
    id: 'c18a-grounding-2014',
    title: 'C-18A Grounding (2014)',
    region: 'Amery Ice Shelf',
    dateRange: 'May 2014 - Jul 2014',
    vesselProfile: 'Good forecast skill',
    summary:
      'C-18A grounded on the continental shelf near Amery, holding a stable position that the model correctly anticipated.',
    t0: '2014-05-15T00:00:00Z',
    forecastTrack: [
      { time: '2014-05-15T00:00:00Z', lon: 72, lat: -67, uncertaintyKm: 4 },
      { time: '2014-05-25T00:00:00Z', lon: 72.4, lat: -67.1, uncertaintyKm: 6 },
      { time: '2014-06-05T00:00:00Z', lon: 72.5, lat: -67.1, uncertaintyKm: 7 },
    ],
    actualTrack: [
      { time: '2014-05-15T00:00:00Z', lon: 72, lat: -67 },
      { time: '2014-05-25T00:00:00Z', lon: 72.3, lat: -67.05 },
      { time: '2014-06-05T00:00:00Z', lon: 72.4, lat: -67.08 },
    ],
    recommendedRoute: [[68, -68], [72, -67.3], [76, -66.6]],
    actualRoute: [[68, -68], [72, -67.3], [76, -66.6]],
    outcome: {
      verdict: 'avoided',
      headline: 'Grounding predicted 9 days ahead of observation',
      detail: 'Bathymetry-informed grounding model matched observed position within 1.1 km.',
      forecastErrorKm: 1.1,
    },
  },
  {
    id: 'd28-calving-2010',
    title: 'D-28 Calving (2010)',
    region: 'Weddell Sea',
    dateRange: 'Sep 2010 - Nov 2010',
    vesselProfile: 'Good forecast skill',
    summary:
      'D-28 calved from the Amery Ice Shelf and drifted west into the Weddell Sea gyre, tracked closely by early SAR passes.',
    t0: '2010-09-28T00:00:00Z',
    forecastTrack: [
      { time: '2010-09-28T00:00:00Z', lon: 78, lat: -68, uncertaintyKm: 5 },
      { time: '2010-10-10T00:00:00Z', lon: 74, lat: -67.6, uncertaintyKm: 12 },
      { time: '2010-10-22T00:00:00Z', lon: 69, lat: -67, uncertaintyKm: 19 },
    ],
    actualTrack: [
      { time: '2010-09-28T00:00:00Z', lon: 78, lat: -68 },
      { time: '2010-10-10T00:00:00Z', lon: 74.6, lat: -67.5 },
      { time: '2010-10-22T00:00:00Z', lon: 70.1, lat: -66.9 },
    ],
    recommendedRoute: [[80, -69], [74, -68], [68, -67]],
    actualRoute: [[80, -69], [74, -68], [68, -67]],
    outcome: {
      verdict: 'avoided',
      headline: 'Drift direction and speed matched within tolerance',
      detail: 'Track error stayed under 8 km through the full 24-day replay window.',
      forecastErrorKm: 7.6,
    },
  },
  {
    id: 'route-deviation-2018',
    title: 'Route Deviation Event (2018)',
    region: 'East Antarctica',
    dateRange: 'Jan 2018',
    vesselProfile: 'Encountered hazard',
    summary:
      'A resupply vessel deviated from the recommended corridor to save time and encountered a dense sea-ice field that the model had flagged as high-risk.',
    t0: '2018-01-12T00:00:00Z',
    forecastTrack: [
      { time: '2018-01-12T00:00:00Z', lon: 100, lat: -65, uncertaintyKm: 5 },
      { time: '2018-01-16T00:00:00Z', lon: 102, lat: -65.4, uncertaintyKm: 8 },
    ],
    actualTrack: [
      { time: '2018-01-12T00:00:00Z', lon: 100, lat: -65 },
      { time: '2018-01-16T00:00:00Z', lon: 102.3, lat: -65.5 },
    ],
    recommendedRoute: [[96, -64], [102, -64.6], [108, -65.2]],
    actualRoute: [[96, -64], [103, -66.1], [108, -65.2]],
    outcome: {
      verdict: 'encountered',
      headline: 'Vessel deviated from the recommended corridor',
      detail: 'Manual deviation entered a flagged high-density sea-ice zone; model had correctly forecast the risk.',
      forecastErrorKm: 3.4,
    },
  },
]
