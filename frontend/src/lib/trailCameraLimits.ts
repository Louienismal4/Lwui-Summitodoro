import { LngLat, LngLatBounds, type Map, type PaddingOptions } from "maplibre-gl";
import type { CameraOffsetPadding } from "./cameraOffset.ts";

export function getTrailFitPadding(padding?: CameraOffsetPadding): number | PaddingOptions {
  if (padding?.bottom === undefined) return 80;
  return { top: Math.max(72, padding.top), bottom: padding.bottom + 24, left: 24, right: 24 };
}

type CameraMap = Pick<
  Map,
  | "getPadding"
  | "setPadding"
  | "cameraForBounds"
  | "setMinZoom"
  | "setMaxBounds"
  | "getMaxZoom"
  | "getMinZoom"
  | "setTransformConstrain"
>;

export function fitTrailOverview(
  map: Pick<Map, "setPadding" | "fitBounds" | "getMaxZoom">,
  bounds: LngLatBounds,
  duration = 650,
  padding: number | PaddingOptions = 80,
) {
  map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
  map.fitBounds(bounds, {
    padding,
    maxZoom: map.getMaxZoom(),
    bearing: 0,
    pitch: 0,
    duration,
  });
}

export function applyTrailCameraLimits(map: CameraMap, bounds: LngLatBounds, fitPadding: number | PaddingOptions = 80) {
  const panBounds = LngLatBounds.fromLngLat(
    bounds.getSouthWest(),
    10_000,
  ).extend(LngLatBounds.fromLngLat(bounds.getNorthEast(), 10_000));

  // Fit only within the visible area; discard padding left by following the hiker.
  const padding = map.getPadding();
  map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
  const overview = map.cameraForBounds(bounds, {
    padding: fitPadding,
    maxZoom: map.getMaxZoom(),
    bearing: 0,
  });
  map.setPadding(padding);

  if (overview?.zoom !== undefined) map.setMinZoom(Math.max(0, overview.zoom - 1));
  // Constrain the camera center, so viewport size cannot force a tighter zoom.
  map.setTransformConstrain((center, zoom) => ({
    center: new LngLat(
      Math.max(panBounds.getWest(), Math.min(panBounds.getEast(), center.lng)),
      Math.max(panBounds.getSouth(), Math.min(panBounds.getNorth(), center.lat)),
    ),
    zoom: Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), zoom)),
  }));
  map.setMaxBounds(panBounds);
}
