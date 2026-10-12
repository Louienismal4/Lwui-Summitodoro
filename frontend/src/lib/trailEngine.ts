import type { Coordinate, PreparedTrail, TrailFeature } from '../types/trail'

// Haversine distance in kilometers between two [lng, lat] coordinates
function haversineDistanceKm(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371 // Earth radius in km
  const [lng1, lat1] = coord1
  const [lng2, lat2] = coord2

  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function prepareTrail(feature: TrailFeature, sampleCount = 300): PreparedTrail {
  const coords = feature.geometry.coordinates
  if (!coords || coords.length < 2) {
    throw new Error('Trail geometry must contain at least 2 points.')
  }

  // Calculate segment cumulative distances
  const distances: number[] = [0]
  let totalDistanceKm = 0

  for (let i = 0; i < coords.length - 1; i++) {
    const dist = haversineDistanceKm(coords[i], coords[i + 1])
    totalDistanceKm += dist
    distances.push(totalDistanceKm)
  }

  if (totalDistanceKm <= 0) {
    totalDistanceKm = 0.001
  }

  // Sample evenly along the trail
  const samples: Coordinate[] = []
  const safeCount = Math.max(2, sampleCount)

  for (let s = 0; s < safeCount; s++) {
    const targetDist = totalDistanceKm * (s / (safeCount - 1))

    // Find segment containing targetDist
    let segIdx = 0
    while (segIdx < distances.length - 1 && distances[segIdx + 1] < targetDist) {
      segIdx++
    }

    const segStartDist = distances[segIdx]
    const segEndDist = distances[segIdx + 1] ?? segStartDist
    const segLength = segEndDist - segStartDist

    if (segLength <= 0) {
      samples.push(coords[segIdx])
    } else {
      const fraction = (targetDist - segStartDist) / segLength
      const p1 = coords[segIdx]
      const p2 = coords[Math.min(segIdx + 1, coords.length - 1)]
      const lng = p1[0] + (p2[0] - p1[0]) * fraction
      const lat = p1[1] + (p2[1] - p1[1]) * fraction
      samples.push([lng, lat])
    }
  }

  return { feature, totalDistanceKm, samples }
}

export function getCoordinateAtProgress(trail: PreparedTrail, progress: number): Coordinate {
  const clamped = Math.min(Math.max(progress, 0), 1)
  const samplePos = clamped * (trail.samples.length - 1)
  const lowerIdx = Math.floor(samplePos)
  const upperIdx = Math.min(lowerIdx + 1, trail.samples.length - 1)
  const fraction = samplePos - lowerIdx

  const lower = trail.samples[lowerIdx]
  const upper = trail.samples[upperIdx]

  return [
    lower[0] + (upper[0] - lower[0]) * fraction,
    lower[1] + (upper[1] - lower[1]) * fraction,
  ]
}
