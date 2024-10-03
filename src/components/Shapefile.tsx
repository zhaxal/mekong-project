import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { Map } from "leaflet";

interface ShapefileProps {
  data: GeoJSON.GeoJsonObject | null;
}

export default function Shapefile({ data }: ShapefileProps): null {
  const map = useMap() as Map;

  useEffect(() => {
    if (!data || !map) return;

    const geo = L.geoJson(data, {
      onEachFeature: function popUp(f: GeoJSON.Feature, l: L.Layer) {
        const out: string[] = [];
        if (f.properties) {
          for (const key in f.properties) {
            if (Object.prototype.hasOwnProperty.call(f.properties, key)) {
              out.push(`${key}: ${f.properties[key]}`);
            }
          }
          l.bindPopup(out.join("<br />"));
        }
      },
    }).addTo(map);

    geo.addData(data);
  }, [map, data]);

  return null;
}
