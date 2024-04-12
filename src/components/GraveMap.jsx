import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import RoutingMachine from "./RoutingMachine";
import { deleteReservation } from "../api/Services";
import { Search } from "@mui/icons-material";

function GraveMap({ map, setMap, slots, showDetails }) {
  const [query, setQuery] = useState("");
  const [searchItem, setSearchItems] = useState(null);
  const [myMarker, setMarker] = useState(null);
  const [slot, setSlot] = useState(null);

  const statusColor = (status) => {
    if (status == "Available") {
      return "#00FF0A";
    } else if (status == "Reserved") {
      return "#ffe600ef";
    }

    return "#FF0505";
  };

  const initialMap = useMemo(
    () => (
      <MapContainer
        ref={setMap}
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

        {/* <RoutingMachine className="absolute left-0" /> */}
      </MapContainer>
    ),
    []
  );

  const search = (query) => {
    var newSlots = slots["slots"];

    newSlots = newSlots.filter((slot) => {
      var block_name = slot["block_name"]
        .toLowerCase()
        .indexOf(query.toLowerCase());
      var lot_no = slot["lot_no"]
        .toString()
        .toLowerCase()
        .indexOf(query.toLowerCase());
      var street = `${slot["block_name"]} ${slot["lot_no"]}`
        .toLowerCase()
        .indexOf(query.toLowerCase());

      return block_name !== -1 || lot_no !== -1 || street !== -1;
    });

    return newSlots;
  };

  const handleClick = () => {
    if (myMarker) {
      map.removeLayer(myMarker);
      setMarker(null);
    }

    setMarker(L.marker(slot).addTo(map));
    map.setView(slot, map.getZoom());
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute z-10 w-[280px] flex flex-col right-10 top-3">
        <div className="w-full h-12 flex flex-row bg-white/80 rounded-lg shadow-sm items-center px-2">
          <Search fontSize="small" color="disabled" />
          <input
            placeholder="Search..."
            className="w-full px-2 text-base focus:outline-none bg-transparent"
            value={query}
            onChange={(e) => {
              const query = e.target.value;
              setQuery(query);

              if (query == "") return setSearchItems(null);

              setSearchItems(search(query));
            }}
          />
        </div>

        {searchItem && (
          <div className="w-full h-min max-h-[350px] bg-white overflow-hidden  rounded-lg mt-2">
            <div className="w-full h-full flex flex-col overflow-auto p-4">
              {searchItem.length < 1 ? (
                <p>No results</p>
              ) : (
                searchItem.map((item) => {
                  return (
                    <div
                      onClick={() => {
                        setSlot([item["Latitude"], item["Longitude"]]);
                        setQuery("");
                        setSearchItems(null);
                        handleClick();
                      }}
                      className="border-b flex flex-col p-2 cursor-pointer hover:bg-slate-200"
                    >
                      <p className="font-lato-bold text-sm">{`${item["block_name"]} - ${item["lot_no"]}`}</p>
                      <p className="font-lato text-sm">
                        Status: {`${item["Status"]}`}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      <div className="absolute select-none z-10 w-[180px] h-[150px] bg-white/60 shadow-lg rounded-lg bottom-10 left-10">
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
      {initialMap}
    </div>
  );
}

export default GraveMap;
