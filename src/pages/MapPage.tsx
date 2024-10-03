/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import Shapefile from "../components/Shapefile";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../firebaseConfig";
import L from "leaflet";
import { ViewportList } from "react-viewport-list";

interface Field {
  title: string;
  shape: string;
  table: string;
}

function MapPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [view, setView] = useState<"table" | "map">("table");
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fieldsSnapshot = await getDocs(collection(db, "fields"));
      const fieldsData = fieldsSnapshot.docs.map((doc) => doc.data() as Field);
      setFields(fieldsData);
    };
    fetchData();

    return () => {
      setFields([]);
    };
  }, []);

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    if (isMobile) setView("map");
  };

  const handleReset = () => {
    setSelectedField(null);
    if (isMobile) setView("table");
  };

  const MapUpdater = ({ field }: { field: Field | null }) => {
    const map = useMap();

    useEffect(() => {
      if (field) {
        const shapeData = JSON.parse(field.shape);
        const coordinates = shapeData[0].geometry.coordinates[0];
        const latLngs = coordinates.map((coord: number[]) => [
          coord[1],
          coord[0],
        ]);
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds);
      } else {
        map.setView([14.7696, 104.8141], 5);
      }
    }, [field, map]);

    return null;
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full">
      <div
        className={`flex w-full min-h-full ${
          isMobile ? "flex-col" : "flex-row"
        }`}
      >
        {isMobile && (
          <div className="w-full p-4">
            <button
              onClick={() => setView(view === "table" ? "map" : "table")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {view === "table" ? "Switch to Map View" : "Switch to Table View"}
            </button>
          </div>
        )}

        {(!isMobile || view === "table") && (
          <div
            className={`${isMobile ? "w-full" : "w-2/4"} p-4 overflow-y-auto`}
          >
            {!selectedField && (
              <>
                <h2 className="text-lg font-bold mb-4">Fields</h2>
                <ul className="mb-4 space-y-2">
                  {fields.map((field) => (
                    <li
                      key={field.title}
                      className="p-2 border rounded cursor-pointer bg-blue-200"
                      onClick={() => handleFieldSelect(field)}
                    >
                      {field.title}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {selectedField && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 w-full"
              >
                Back
              </button>
            )}

            {selectedField && selectedField.table && (
              <div className="mt-4">
                <h2 className="text-lg font-bold mb-4">Table Data</h2>
                <div
                  className="overflow-y-auto"
                  ref={parentRef}
                  style={{ height: "350px" }}
                >
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        {Object.keys(JSON.parse(selectedField.table)[0]).map(
                          (key) => (
                            <th
                              key={key}
                              className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700"
                            >
                              {key}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <ViewportList
                        viewportRef={parentRef}
                        items={JSON.parse(selectedField.table)}
                      >
                        {(row: DocumentData, index: number) => (
                          <tr key={index} className="hover:bg-gray-100">
                            {Object.values(row).map((value, i) => (
                              <td
                                key={i}
                                className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700"
                              >
                                {value as React.ReactNode}
                              </td>
                            ))}
                          </tr>
                        )}
                      </ViewportList>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {(!isMobile || view === "map") && (
          <div
            className={`${isMobile ? "w-full" : "w-2/4"} h-full flex flex-col`}
          >
            <div className="flex-grow">
              <MapContainer
                center={[14.7696, 104.8141]}
                zoom={5}
                scrollWheelZoom={true}
                touchZoom={true}
                doubleClickZoom={true}
                dragging={true}
                className="h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selectedField && (
                  <>
                    <MapUpdater field={selectedField} />
                    <Shapefile
                      key={selectedField.title}
                      data={JSON.parse(selectedField.shape)}
                    />
                  </>
                )}
                {!selectedField && <MapUpdater field={null} />}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;
