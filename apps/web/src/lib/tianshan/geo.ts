// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Placing the database's coordinates on the basemap (basemap.ts).
import { FRAME } from './basemap';

/** SVG coordinates of a point given in degrees. */
export function project(lat: number, lon: number): [number, number] {
  return [(lon - FRAME.west) * FRAME.kx * FRAME.scale, (FRAME.north - lat) * FRAME.scale];
}

/** A distance on the ground, in SVG units (one degree of latitude is about 111.3 km). */
export const kmToSvg = (km: number) => (km / 111.32) * FRAME.scale;
