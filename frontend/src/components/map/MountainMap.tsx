import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  LngLatBounds,
  setWorkerUrl,
  type GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import type { Coordinate, TrailFeature } from "@/types/trail";
import { applyTrailCameraLimits, fitTrailOverview, getTrailFitPadding } from "@/lib/trailCameraLimits";
import {
  getCameraOffsetPadding,
  type CameraOffsetPadding,
} from "@/lib/cameraOffset";

setWorkerUrl(mapWorkerUrl);

export type MountainMapHandle = {
  fitTrail: () => void;
  followHiker: (options?: { padding?: CameraOffsetPadding }) => void;
  resetCamera: () => void;
};

type CheckpointItem = {
  id: string;
  name: string;
  coordinate: Coordinate;
};

type Props = {
  ref?: Ref<MountainMapHandle>;
  feature?: TrailFeature | null;
  coordinate?: Coordinate | null;
  progress: number;
  mountainName: string;
  checkpoints?: CheckpointItem[];
  reachedCheckpointIds?: string[];
  hikerAvatarUrl?: string | null;
  cameraPadding?: CameraOffsetPadding;
  onFollowChange?: (following: boolean) => void;
  onUnavailable: (reason: string) => void;
};

const DEFAULT_STYLE = "https://tiles.openfreemap.org/styles/bright";

export function MountainMap({
  ref,
  feature,
  coordinate,
  progress,
  mountainName,
  checkpoints = [],
  reachedCheckpointIds = [],
  hikerAvatarUrl,
  cameraPadding,
  onFollowChange,
  onUnavailable,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const boundsRef = useRef<LngLatBounds | null>(null);
  const fitPaddingRef = useRef(getTrailFitPadding(cameraPadding));
  const hikerMarkerRef = useRef<Marker | null>(null);
  const staticMarkersRef = useRef<Marker[]>([]);
  const isFollowingRef = useRef(true);
  const initialCoordRef = useRef(coordinate);

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    fitPaddingRef.current = getTrailFitPadding(cameraPadding);
    const map = mapRef.current;
    const bounds = boundsRef.current;
    if (!map || !bounds) return;
    const atOverview = !isFollowingRef.current && map.getZoom() <= map.getMinZoom(true) + 0.01;
    applyTrailCameraLimits(map, bounds, fitPaddingRef.current);
    if (atOverview) fitTrailOverview(map, bounds, 0, fitPaddingRef.current);
  }, [cameraPadding]);

  const setFollowing = useCallback(
    (following: boolean) => {
      isFollowingRef.current = following;
      onFollowChange?.(following);
    },
    [onFollowChange],
  );

  const centerOnHiker = useCallback(
    (duration = 500, customPadding?: CameraOffsetPadding) => {
      const map = mapRef.current;
      if (!map || !coordinate) return;
      const effectivePadding =
        customPadding ?? cameraPadding ?? getCameraOffsetPadding();
      map.easeTo({
        center: coordinate as [number, number],
        padding: effectivePadding,
        duration,
        essential: true,
      });
    },
    [cameraPadding, coordinate],
  );

  useImperativeHandle(
    ref,
    () => ({
      fitTrail: () => {
        setFollowing(false);
        if (mapRef.current && boundsRef.current) {
          fitTrailOverview(mapRef.current, boundsRef.current, 650, fitPaddingRef.current);
        }
      },
      followHiker: (options?: { padding?: CameraOffsetPadding }) => {
        setFollowing(true);
        centerOnHiker(500, options?.padding);
      },
      resetCamera: () => {
        setFollowing(false);
        if (mapRef.current && boundsRef.current) {
          fitTrailOverview(mapRef.current, boundsRef.current, 650, fitPaddingRef.current);
        }
      },
    }),
    [centerOnHiker, setFollowing],
  );

  // Dynamically re-center camera on window resize if following is active
  useEffect(() => {
    const handleResize = () => {
      if (isFollowingRef.current && coordinate) {
        centerOnHiker(200);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [centerOnHiker, coordinate]);

  // Initialize MapLibre
  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    try {
      const initialCenter: [number, number] = initialCoordRef.current
        ? [initialCoordRef.current[0], initialCoordRef.current[1]]
        : [120.35, 15.134];

      const map = new MapLibreMap({
        container: containerRef.current,
        style: DEFAULT_STYLE,
        center: initialCenter,
        zoom: 14,
        maxZoom: 16,
        pitch: 35,
        maxPitch: 35,
        attributionControl: { compact: true },
      });

      map.addControl(
        new NavigationControl({ showCompass: true }),
        "bottom-right",
      );

      map.on("dragstart", () => setFollowing(false));
      map.on("zoomstart", (event) => {
        if (event.originalEvent) setFollowing(false);
      });
      map.on("resize", () => {
        if (boundsRef.current) {
          const atOverview = !isFollowingRef.current && map.getZoom() <= map.getMinZoom(true) + 0.01;
          applyTrailCameraLimits(map, boundsRef.current, fitPaddingRef.current);
          if (atOverview) fitTrailOverview(map, boundsRef.current, 0, fitPaddingRef.current);
        }
      });

      map.on("load", () => {
        if (cancelled) return;
        setMapLoaded(true);
      });

      map.on("error", (e: unknown) => {
        const errorObj = e as { error?: { message?: string } };
        const msg = errorObj.error?.message ?? "";
        if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
          onUnavailable(
            "External map tiles could not be reached from this network.",
          );
        }
      });

      mapRef.current = map;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Map failed to initialize.";
      onUnavailable(msg);
    }

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onUnavailable, setFollowing]);

  // Fit trail bounds and add trail layer once map is loaded and feature changes
  const applyTrail = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !feature) return;

    const coords = feature.geometry.coordinates;
    if (!coords || coords.length === 0) return;

    // Update or add trail source
    const source = map.getSource("summitodoro-trail") as
      | GeoJSONSource
      | undefined;
    if (source) {
      source.setData(
        feature as unknown as Parameters<GeoJSONSource["setData"]>[0],
      );
    } else {
      map.addSource("summitodoro-trail", {
        type: "geojson",
        data: feature as unknown as Parameters<GeoJSONSource["setData"]>[0],
      });

      map.addLayer({
        id: "trail-casing",
        type: "line",
        source: "summitodoro-trail",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#fffdf7",
          "line-width": 10,
          "line-opacity": 0.95,
        },
      });

      map.addLayer({
        id: "trail-incomplete",
        type: "line",
        source: "summitodoro-trail",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#929b94",
          "line-width": 6,
          "line-opacity": 0.85,
        },
      });
    }

    // Compute bounding box
    const bounds = coords.reduce(
      (b, coord) => b.extend(coord as [number, number]),
      new LngLatBounds(
        coords[0] as [number, number],
        coords[0] as [number, number],
      ),
    );
    boundsRef.current = bounds;
    applyTrailCameraLimits(map, bounds, fitPaddingRef.current);

    setFollowing(false);
    fitTrailOverview(map, bounds, 1000, fitPaddingRef.current);
  }, [feature, mapLoaded, setFollowing]);

  useEffect(() => {
    applyTrail();
  }, [applyTrail]);

  // Static markers: Trailhead, Checkpoints, Summit
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !feature) return;

    // Clear existing static markers
    staticMarkersRef.current.forEach((m) => m.remove());
    staticMarkersRef.current = [];

    const coords = feature.geometry.coordinates;
    if (coords.length < 2) return;

    // Trailhead Marker
    const startCoord = coords[0];
    const trailheadEl = document.createElement("div");
    trailheadEl.className = "trail-map-marker trailhead";
    trailheadEl.innerHTML = "<span>✓</span><small>Trailhead</small>";
    const trailheadMarker = new Marker({ element: trailheadEl })
      .setLngLat(startCoord as [number, number])
      .addTo(map);
    staticMarkersRef.current.push(trailheadMarker);

    // Intermediate Checkpoints
    checkpoints.forEach((cp) => {
      const isReached = reachedCheckpointIds.includes(cp.id);
      const cpEl = document.createElement("div");
      cpEl.className = isReached
        ? "trail-map-marker checkpoint reached"
        : "trail-map-marker checkpoint";
      cpEl.innerHTML = `<span>${isReached ? "✓" : "+25"}</span><small>${cp.name}</small>`;
      const cpMarker = new Marker({ element: cpEl })
        .setLngLat(cp.coordinate as [number, number])
        .addTo(map);
      staticMarkersRef.current.push(cpMarker);
    });

    // Summit Marker
    const endCoord = coords[coords.length - 1];
    const summitEl = document.createElement("div");
    summitEl.className =
      progress >= 1
        ? "trail-map-marker summit reached"
        : "trail-map-marker summit";
    summitEl.innerHTML = "<span>⚑</span><small>Summit</small>";
    const summitMarker = new Marker({ element: summitEl })
      .setLngLat(endCoord as [number, number])
      .addTo(map);
    staticMarkersRef.current.push(summitMarker);
  }, [checkpoints, feature, mapLoaded, progress, reachedCheckpointIds]);

  // Update or create hiker marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !coordinate) return;

    if (!hikerMarkerRef.current) {
      const el = document.createElement("div");
      el.className = "map-hiker-marker";
      if (hikerAvatarUrl) {
        el.style.backgroundImage = `url("${hikerAvatarUrl}")`;
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
      } else {
        el.innerHTML = "🥾";
      }
      el.title = `${mountainName} Hiker (${Math.round(progress * 100)}%)`;

      hikerMarkerRef.current = new Marker({ element: el })
        .setLngLat(coordinate as [number, number])
        .addTo(map);
    } else {
      hikerMarkerRef.current.setLngLat(coordinate as [number, number]);
    }

    if (isFollowingRef.current) {
      centerOnHiker(300);
    }
  }, [
    centerOnHiker,
    coordinate,
    hikerAvatarUrl,
    mapLoaded,
    mountainName,
    progress,
  ]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={containerRef} className="w-full h-full min-h-[450px]" />
    </div>
  );
}
