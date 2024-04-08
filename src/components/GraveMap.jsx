import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import records from "../assets/data/records.json";

function GraveMap() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute z-10 w-[180px] h-[150px] bg-white/60 shadow-lg rounded-lg bottom-10 right-10">
        <div className="flex flex-col p-4">
          <h1 className="font-lato-bold text-lg pb-2">LEGEND</h1>
          <div className="grid grid-rows-3 w-full gap-2">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-10 h-5 bg-[#00FF0A]" />
              <p className="font-lato-bold text-xs">AVAILABLE</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="w-10 h-5 bg-[#ffe600ef]" />
              <p className="font-lato-bold text-xs">PRE-RESERVED</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="w-10 h-5 bg-[#FF0505]" />
              <p className="font-lato-bold text-xs">OCCUPIED</p>
            </div>
          </div>
        </div>
      </div>
      <MapContainer
        className="h-full z-0"
        center={[14.110906767590265, 121.55069557584935]}
        zoom={18}
        maxBounds={[
          [14.111812009494454, 121.54861954598962],
          [14.109991116967368, 121.54863027482598],
          [14.111884844893801, 121.55188647669641],
          [14.110032737531318, 121.55190793436911],
        ]}
        maxBoundsViscosity={1}
      >
        <TileLayer
          maxZoom={19.8}
          minZoom={18}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {records.map((item) => {
          return (
            <Polygon
              eventHandlers={{
                click: () => {
                  window.alert(`${item["block_name"]} - ${item["lot_no"]}`);
                },
              }}
              color={item["Name"] == "Available" ? "#00FF0A" : "#FF0505"}
              positions={[
                item["lat_long1"].split(",").map((val) => parseFloat(val)),
                item["lat_long2"].split(",").map((val) => parseFloat(val)),
                item["lat_long3"].split(",").map((val) => parseFloat(val)),
                item["lat_long4"].split(",").map((val) => parseFloat(val)),
              ]}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

export default GraveMap;
