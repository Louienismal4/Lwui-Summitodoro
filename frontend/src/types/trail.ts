export type Coordinate = [longitude: number, latitude: number]

export type TrailCheckpoint = {
  id: string
  name: string
  description?: string
  progress: number
}

export type MapCheckpoint = {
  id: string
  name: string
  coordinate: Coordinate
}

export type TrailFeature = {
  type: 'Feature'
  properties: {
    id: string
    name: string
    schemaVersion?: number
  }
  geometry: {
    type: 'LineString'
    coordinates: Coordinate[]
  }
}

export type PreparedTrail = {
  feature: TrailFeature
  totalDistanceKm: number
  samples: Coordinate[]
}
