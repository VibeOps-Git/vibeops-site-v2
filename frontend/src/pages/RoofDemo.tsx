import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import L, {
  Map as LeafletMap,
  FeatureGroup,
  LatLngExpression,
} from "leaflet";
import "leaflet/dist/leaflet.css";

// IMPORTANT: use the actual dist paths so the plugin loads correctly
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw/dist/leaflet.draw.js";
import "leaflet-geometryutil";

import * as turf from "@turf/turf";

const API_URL =
  import.meta.env.VITE_FLASK_API_URL || "http://localhost:5008";

type BomMaterial = {
  item: string;
  quantity: number | string;
  rate?: number | string;
  cost?: number | string;
};

type BomLabor = {
  description: string;
  quantity: number | string;
  rate: number | string;
  cost: number | string;
};

type BomOverhead = {
  description: string;
  percentage: number | string;
  cost: number | string;
};

type BomSummary = {
  materials_total?: number | string;
  labor_total?: number | string;
  overhead_total?: number | string;
  total_cost?: number | string;
};

type BillOfMaterials = {
  materials?: BomMaterial[];
  labor?: BomLabor;
  overhead?: BomOverhead;
  summary?: BomSummary;
};

type RoofEstimateResponse = {
  address: string;
  roof_size: number | string;
  total_cost: number | string;
  bill_of_materials?: BillOfMaterials;
};

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function RoofDemo() {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const drawnItemsRef = useRef<FeatureGroup | null>(null);

  const [address, setAddress] = useState("");
  const [roofArea, setRoofArea] = useState<number | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<RoofEstimateResponse | null>(null);

  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ───────────────── Map initialization ─────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (typeof window === "undefined") return; // hard guard for SSR

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
    }).setView([49.2827, -123.1207], 12); // default Vancouver-ish

    mapRef.current = map;

    const streetLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    const satelliteLayer = L.tileLayer(
      "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=sfuVh1bXJaWZbxblHBkD",
      {
        attribution:
          '© <a href="https://www.maptiler.com/copyright/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(map);

    const baseLayers = {
      "Street Map": streetLayer,
      Satellite: satelliteLayer,
    };

    L.control.layers(baseLayers, null, { position: "bottomright" }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    drawnItemsRef.current = drawnItems;
    map.addLayer(drawnItems);

    // Leaflet.draw control – guard in case plugin didn’t attach
    const DrawControlCtor = (L as any).Control?.Draw;
    if (DrawControlCtor) {
      const drawControl = new DrawControlCtor({
        position: "bottomright",
        draw: {
          polygon: {
            shapeOptions: { color: "#00ffcc" },
            allowIntersection: false,
            showArea: true,
            metric: true,
            imperial: true,
            precision: 2,
            drawError: {
              color: "#b1b4b6",
              timeout: 2500,
            },
            repeatMode: false,
          },
          marker: false,
          polyline: false,
          rectangle: false,
          circle: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: false,   // keep this if you don’t want the trash button
          // no `edit: true` here
        },
      });

      map.addControl(drawControl);
    } else {
      console.warn("Leaflet.draw not loaded – no draw controls available.");
    }

    // Use raw event strings instead of L.Draw.Event.*
    map.on("draw:drawstart", () => {
      drawnItems.clearLayers();
      setRoofArea(null);
    });

    map.on("draw:created", (e: any) => {
      handlePolygonChanged(e.layer);
    });

    map.on("draw:edited", (e: any) => {
      e.layers.eachLayer((layer: any) => handlePolygonChanged(layer));
    });

    // Custom delete button
    const DeleteButton = (L.Control as any).extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );
        const button = L.DomUtil.create("a", "leaflet-control-delete", container);
        button.innerHTML = "🗑️";
        button.title = "Delete Polygon";
        button.style.width = "32px";
        button.style.height = "32px";
        button.style.minHeight = "32px";
        button.style.textAlign = "center";
        button.style.fontSize = "12px";
        button.style.backgroundColor = "#ffebee";
        button.style.color = "#d32f2f";
        button.style.border = "2px solid #ef9a9a";
        button.style.borderRadius = "4px";
        button.style.marginBottom = "5px";
        button.style.cursor = "pointer";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.lineHeight = "1";
        button.style.padding = "0";

        L.DomEvent.on(button, "click", (e: any) => {
          L.DomEvent.stopPropagation(e);
          clearPolygon();
        });

        return container;
      },
    });

    new DeleteButton({ position: "bottomright" }).addTo(map);

    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ───────────────── Polygon area helpers ─────────────────
  const computeAreaFromLayer = (layer: any) => {
    const latlngs = layer.getLatLngs();
    const firstRing =
      Array.isArray(latlngs) && Array.isArray(latlngs[0])
        ? latlngs[0]
        : latlngs;

    const GeometryUtil = (L as any).GeometryUtil;
    if (!GeometryUtil) {
      console.warn("L.GeometryUtil not available");
      return;
    }

    const areaMeters = GeometryUtil.geodesicArea(firstRing);
    const areaFeet = areaMeters * 10.7639;

    setRoofArea(areaFeet);

    if (areaFeet < 100) {
      setErrorMsg(
        `Roof Area: ${areaFeet.toFixed(
          2
        )} sq ft (Too small! Zoom in and draw a bigger roof shape.)`
      );
    } else {
      setErrorMsg(null);
    }
  };

  // ───────────────── Polygon area handling ─────────────────
  const handlePolygonChanged = (layer: any) => {
    if (!drawnItemsRef.current) return;

    // Keep only this polygon in the FeatureGroup
    drawnItemsRef.current.clearLayers();
    drawnItemsRef.current.addLayer(layer);

    // Just compute area – let Leaflet.draw handle edit mode internally
    computeAreaFromLayer(layer);
  };


  const clearPolygon = () => {
    drawnItemsRef.current?.clearLayers();
    setRoofArea(null);
    setErrorMsg(null);
  };

  // ───────────────── Address suggestions ─────────────────
  useEffect(() => {
    if (!address || address.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            address
          )}&addressdetails=1&countrycodes=ca,us`,
          {
            signal: controller.signal,
          }
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch {
        // ignore
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [address]);

  const handleSuggestionClick = (s: NominatimResult) => {
    setAddress(s.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ───────────────── Geocode + building outlines ─────────────────
  const handleShowMap = async () => {
    if (!isMapReady || !mapRef.current) return;
    if (!address.trim()) {
      toast.error("Please enter an address first.");
      return;
    }

    setIsGeocoding(true);
    setErrorMsg(null);
    setResults(null);
    clearPolygon();

    const map = mapRef.current;

    // Remove existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          address
        )}&addressdetails=1&countrycodes=ca,us`
      );
      const data: NominatimResult[] = await res.json();

      if (!data || data.length === 0) {
        setErrorMsg(
          `Could not find "${address}". Try including city and province/state.`
        );
        setIsGeocoding(false);
        return;
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      const center: LatLngExpression = [lat, lon];
      map.setView(center, 18);
      L.marker(center).addTo(map);

      // Fetch building outlines around point (Overpass)
      let overpassData: any = null;
      for (const radius of [200, 500, 1000]) {
        const query = `
          [out:json][timeout:30];
          (
            way["building"](around:${radius},${lat},${lon});
            way["building:part"](around:${radius},${lat},${lon});
            way["man_made"](around:${radius},${lat},${lon});
            way["landuse"](around:${radius},${lat},${lon});
            relation["building"](around:${radius},${lat},${lon});
            relation["man_made"](around:${radius},${lat},${lon});
          );
          out geom;
        `;

        try {
          const overpassRes = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
              method: "POST",
              body: query,
            }
          );
          const json = await overpassRes.json();
          if (json.elements && json.elements.length > 0) {
            overpassData = json;
            break;
          }
        } catch {
          // try next radius
        }
      }

      if (!overpassData || !overpassData.elements?.length) {
        setErrorMsg(
          `No building outlines found near "${result.display_name}". Draw the roof manually.`
        );
        map.setView(center, 20);
        setIsGeocoding(false);
        return;
      }

      const pinPoint = turf.point([lon, lat]);
      const candidates: {
        feature: any;
        layer: L.Polygon;
        distance: number;
      }[] = [];

      overpassData.elements.forEach((element: any) => {
        if (element.type === "way" && element.geometry?.length > 2) {
          const coords = element.geometry.map((p: any) => [p.lat, p.lon]);
          if (
            coords[0][0] !== coords[coords.length - 1][0] ||
            coords[0][1] !== coords[coords.length - 1][1]
          ) {
            coords.push(coords[0]);
          }

          const feature = {
            type: "Feature",
            geometry: { type: "Polygon", coordinates: [coords] },
            properties: { id: element.id, tags: element.tags },
          };

          try {
            const layer = L.polygon(coords as any, {
              color: "#00ffcc",
              weight: 2,
            });
            const centroid = turf.centroid(feature as any);
            const distance = turf.distance(pinPoint, centroid, {
              units: "meters",
            });
            candidates.push({ feature, layer, distance });
          } catch {
            // ignore this element
          }
        } else if (element.type === "relation" && element.members) {
          const coords: any[] = [];
          element.members.forEach((member: any) => {
            if (member.type === "way" && member.geometry?.length > 2) {
              const wayCoords = member.geometry.map((p: any) => [p.lat, p.lon]);
              if (
                wayCoords[0][0] !== wayCoords[wayCoords.length - 1][0] ||
                wayCoords[0][1] !== wayCoords[wayCoords.length - 1][1]
              ) {
                wayCoords.push(wayCoords[0]);
              }
              coords.push(wayCoords);
            }
          });

          if (coords.length > 0) {
            const feature = {
              type: "Feature",
              geometry: { type: "MultiPolygon", coordinates: coords },
              properties: { id: element.id, tags: element.tags },
            };

            try {
              const layer = L.polygon(coords as any, {
                color: "#00ffcc",
                weight: 2,
              });
              const centroid = turf.centroid(feature as any);
              const distance = turf.distance(pinPoint, centroid, {
                units: "meters",
              });
              candidates.push({ feature, layer, distance });
            } catch {
              // ignore
            }
          }
        }
      });

      if (!candidates.length) {
        setErrorMsg(
          `No building outlines found near "${result.display_name}". Draw the roof manually.`
        );
        map.setView(center, 20);
        setIsGeocoding(false);
        return;
      }

      // Filter valid "building-like" candidates
      const validCandidates = candidates.filter((c) => {
        const tags = c.feature.properties?.tags || {};
        return (
          tags.building ||
          tags["building:part"] ||
          tags.man_made === "rooftop" ||
          tags.landuse === "residential"
        );
      });

      if (!validCandidates.length) {
        setErrorMsg(
          `No valid building outlines found near "${result.display_name}". Draw the roof manually.`
        );
        map.setView(center, 20);
        setIsGeocoding(false);
        return;
      }

      // Prefer polygons containing the point
      const containing = validCandidates.filter((c) => {
        try {
          return turf.booleanPointInPolygon(pinPoint, c.feature as any);
        } catch {
          return false;
        }
      });

      let selected = containing.length ? containing : validCandidates;

      // If containing, sort by area (smallest first), else by distance
      selected.sort((a, b) => {
        if (containing.length) {
          const GeometryUtil = (L as any).GeometryUtil;
          const areaA = GeometryUtil.geodesicArea(
            (a.layer.getLatLngs()[0] as any) || []
          );
          const areaB = GeometryUtil.geodesicArea(
            (b.layer.getLatLngs()[0] as any) || []
          );
          return areaA - areaB;
        }
        return a.distance - b.distance;
      });

      const closest = selected[0];
      if (closest.distance > 150 && !containing.length) {
        setErrorMsg(
          `No building outlines found directly under "${result.display_name}". Draw the roof manually.`
        );
        map.setView(center, 20);
        setIsGeocoding(false);
        return;
      }

      drawnItemsRef.current?.clearLayers();
      drawnItemsRef.current?.addLayer(closest.layer);
      handlePolygonChanged(closest.layer);
      map.fitBounds(closest.layer.getBounds());

      setIsGeocoding(false);
    } catch (err: any) {
      setErrorMsg(
        `Error while locating "${address}": ${
          err?.message || "please try again."
        }`
      );
      setIsGeocoding(false);
    }
  };

  // ───────────────── Price calculation ─────────────────
  const handleCalculateCost = async () => {
    if (!roofArea || roofArea < 100) {
      setErrorMsg(
        "Roof area too small (< 100 sq ft). Zoom in and draw a larger shape."
      );
      return;
    }

    setIsCalculating(true);
    setErrorMsg(null);

    try {
      const body = new URLSearchParams({
        address: address || "Unknown",
        roof_size: String(roofArea),
      });

      const res = await fetch(`${API_URL}/price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        credentials: "include",
      });

      const data: any = await res.json();

      if (!res.ok) {
        setErrorMsg(
          `Error: ${data?.error || "Failed to calculate estimate"} (Address: ${
            data?.address || address
          })`
        );
        setResults(null);
      } else {
        setResults(data as RoofEstimateResponse);
        toast.success("Estimate calculated successfully!");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An error occurred. Please try again.");
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // ───────────────── Helpers ─────────────────
  const formatCurrency = (value: number | string | undefined) => {
    const num =
      typeof value === "number" ? value : Number(value !== undefined ? value : 0);
    if (!Number.isFinite(num)) return String(value ?? "");
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const getRoofSizeDisplay = () => {
    if (!roofArea) return "";
    return `${roofArea.toFixed(2)} sq ft`;
  };

  // ───────────────── Render ─────────────────
  return (
    <div className="container mx-auto px-4 py-20">
      <section className="max-w-6xl mx-auto">
        {/* Header / Pitch */}
        <div className="text-center mb-12">
          <h1 className="section-title">VibeOps Roofing Estimator</h1>
          <div className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-lg font-bold mb-4 tracking-[0.2em]">
            DEMO
          </div>
          <p className="section-text">
            Map-based roofing estimator that detects the roof from aerial
            imagery, lets you trace the outline, and generates a full cost and
            bill of materials — powered by VibeOps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-8">
          {/* Left side: Map + controls */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Draw the Roof</CardTitle>
              <CardDescription>
                Type an address, zoom to the property, auto-detect the building
                outline, then adjust it with the draw tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address + Show Map */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Property Address
                </label>
                <div className="flex gap-2">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="1234 West Broadway, Vancouver, BC"
                    onFocus={() => {
                      if (suggestions.length) setShowSuggestions(true);
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleShowMap}
                    disabled={!isMapReady || isGeocoding}
                  >
                    {isGeocoding ? "Locating..." : "Show Map"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Start typing and pick from suggestions, then click{" "}
                  <strong>Show Map</strong>.
                </p>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-background text-sm shadow-lg">
                    {suggestions.map((s) => (
                      <button
                        key={`${s.lat}-${s.lon}-${s.display_name}`}
                        type="button"
                        className="block w-full px-3 py-2 text-left hover:bg-accent"
                        onClick={() => handleSuggestionClick(s)}
                      >
                        {s.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="mt-4">
                <div
                  ref={mapContainerRef}
                  className="w-full h-[420px] rounded-lg border border-border overflow-hidden"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Use the polygon tool in the bottom-right to trace the roof.
                  Use the trash icon to clear and redraw.
                </p>
              </div>

              {/* Area display + buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
                <div className="text-sm">
                  <span className="font-semibold">Roof Area: </span>
                  {roofArea ? (
                    <span>{getRoofSizeDisplay()}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      Draw a polygon on the map to see area in sq ft.
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="default"
                  disabled={!roofArea || roofArea < 100 || isCalculating}
                  onClick={handleCalculateCost}
                >
                  {isCalculating ? "Calculating..." : "Calculate Cost"}
                </Button>
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMsg}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right side: How it works + Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How This Demo Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  <li>
                    <span className="font-semibold text-primary">1.</span>{" "}
                    Type a full address and hit <strong>Show Map</strong>.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">2.</span> The
                    system auto-detects nearby building outlines — pick the
                    best fit and tweak it with the polygon tools.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">3.</span> Once
                    the roof area is large enough, click{" "}
                    <strong>Calculate Cost</strong> to see the estimate and
                    bill of materials.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">4.</span> Use
                    the trash icon to clear and redraw if needed.
                  </li>
                </ol>

                <div className="mt-4 rounded-lg border border-accent bg-accent/10 p-3 text-xs">
                  <p className="font-semibold text-accent mb-1">DEMO ONLY</p>
                  <p className="text-muted-foreground">
                    In production, VibeOps wires this directly into your real
                    unit costs, labor rates, and CRM — so your sales team just
                    traces the roof and sends a branded proposal in minutes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Estimate Results</CardTitle>
                  <CardDescription>{results.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {/* Summary */}
                  <div>
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between pb-1 border-b">
                        <span className="text-muted-foreground">
                          Roof Area:
                        </span>
                        <span className="font-semibold">
                          {results.roof_size} sq ft
                        </span>
                      </div>
                      <div className="flex justify-between pb-1 border-b text-base">
                        <span className="font-semibold">Total Cost:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(results.total_cost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOM */}
                  {results.bill_of_materials && (
                    <div className="space-y-4">
                      {results.bill_of_materials.materials && (
                        <div>
                          <h3 className="font-semibold mb-2">Materials</h3>
                          <div className="border rounded-md overflow-hidden">
                            <div className="grid grid-cols-4 bg-muted px-2 py-1 text-xs font-semibold">
                              <span>Item</span>
                              <span>Quantity</span>
                              <span>Rate</span>
                              <span>Cost</span>
                            </div>
                            <div className="divide-y">
                              {results.bill_of_materials.materials.map(
                                (m, idx) => (
                                  <div
                                    key={`${m.item}-${idx}`}
                                    className="grid grid-cols-4 px-2 py-1 text-xs"
                                  >
                                    <span className="truncate">{m.item}</span>
                                    <span>{m.quantity}</span>
                                    <span>{m.rate}</span>
                                    <span>{m.cost}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {(results.bill_of_materials.labor ||
                        results.bill_of_materials.overhead ||
                        results.bill_of_materials.summary) && (
                        <div>
                          <h3 className="font-semibold mb-2">Cost Breakdown</h3>
                          <div className="space-y-1 text-xs">
                            {results.bill_of_materials.labor && (
                              <div className="flex justify-between border-b pb-1">
                                <span className="text-muted-foreground">
                                  Labor (
                                  {
                                    results.bill_of_materials.labor
                                      .description
                                  }
                                  ):
                                </span>
                                <span className="font-semibold">
                                  {results.bill_of_materials.labor.cost}
                                </span>
                              </div>
                            )}
                            {results.bill_of_materials.overhead && (
                              <div className="flex justify-between border-b pb-1">
                                <span className="text-muted-foreground">
                                  Overhead (
                                  {
                                    results.bill_of_materials.overhead
                                      .percentage
                                  }
                                  %):
                                </span>
                                <span className="font-semibold">
                                  {results.bill_of_materials.overhead.cost}
                                </span>
                              </div>
                            )}
                            {results.bill_of_materials.summary && (
                              <div className="mt-2 border-t pt-2 space-y-1">
                                {results.bill_of_materials.summary
                                  .materials_total && (
                                  <div className="flex justify-between">
                                    <span>Materials Total</span>
                                    <span>
                                      {
                                        results.bill_of_materials.summary
                                          .materials_total
                                      }
                                    </span>
                                  </div>
                                )}
                                {results.bill_of_materials.summary
                                  .labor_total && (
                                  <div className="flex justify-between">
                                    <span>Labor Total</span>
                                    <span>
                                      {
                                        results.bill_of_materials.summary
                                          .labor_total
                                      }
                                    </span>
                                  </div>
                                )}
                                {results.bill_of_materials.summary
                                  .overhead_total && (
                                  <div className="flex justify-between">
                                    <span>Overhead Total</span>
                                    <span>
                                      {
                                        results.bill_of_materials.summary
                                          .overhead_total
                                      }
                                    </span>
                                  </div>
                                )}
                                {results.bill_of_materials.summary
                                  .total_cost && (
                                  <div className="flex justify-between text-sm font-semibold">
                                    <span>Grand Total</span>
                                    <span className="text-primary">
                                      {formatCurrency(
                                        results.bill_of_materials.summary
                                          .total_cost
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
