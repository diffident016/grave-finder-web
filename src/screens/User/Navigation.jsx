import { XMarkIcon } from "@heroicons/react/24/outline";
import { Search } from "@mui/icons-material";
import { Backdrop } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import "leaflet/dist/images/marker-shadow.png";

import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
  Polyline,
} from "react-leaflet";

function Navigation({ slots, navigate, setNavigate }) {
  const [query, setQuery] = useState("");
  const [searchItem, setSearchItems] = useState(null);
  const [map, setMap] = useState(null);

  const [route, setRoute] = useState(null);
  const [polygons, setPolygons] = useState([]);

  const initialMap = useMemo(
    () => (
      <MapContainer
        ref={setMap}
        className="h-full z-0"
        center={[14.110906767590265, 121.55069557584935]}
        zoom={18}
        // maxBounds={[
        //   [14.111812009494454, 121.54861954598962],
        //   [14.109991116967368, 121.54863027482598],
        //   [14.111884844893801, 121.55188647669641],
        //   [14.110032737531318, 121.55190793436911],
        // ]}
        // maxBoundsViscosity={1}
      >
        <TileLayer
          maxZoom={19.8}
          minZoom={18}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    []
  );

  const handleNavigate = (navigate) => {
    if (!map) return;

    const currentLoc = navigator.geolocation.getCurrentPosition((position) => [
      position.coords.latitude,
      position.coords.longitude,
    ]);

    if (route) {
      map.removeControl(route);
      setRoute(null);
    }

    const temp = L.Routing.control({
      waypoints: [
        [14.110811, 121.552335],
        [navigate.Latitude, navigate.Longitude],
      ],
      lineOptions: { styles: [{ color: "#242c81", weight: 3 }] },
      altLineOptions: { styles: [{ color: "#ed6852", weight: 3 }] },
      show: false,
      addWaypoints: true,
      routeWhileDragging: true,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: true,
    });

    temp.addTo(map);

    setRoute(temp);
  };

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

  const statusColor = (status) => {
    if (status == "Available") {
      return "#00FF0A";
    } else if (status == "Reserved") {
      return "#ffe600ef";
    }

    return "#FF0505";
  };

  useEffect(() => {
    if (!map) return;

    if (polygons.length > 0) {
      polygons.map((item) => {
        map.removeLayer(item);
      });

      setPolygons([]);
    }

    var newPoly = [];

    slots["slots"].map((item) => {
      var temp = L.polygon(
        [
          item["lat_long1"].split(",").map((val) => parseFloat(val)),
          item["lat_long2"].split(",").map((val) => parseFloat(val)),
          item["lat_long3"].split(",").map((val) => parseFloat(val)),
          item["lat_long4"].split(",").map((val) => parseFloat(val)),
        ],
        { color: statusColor(item["Status"]) }
      ).addEventListener("click", async () => {
        setNavigate(item);
      });

      newPoly.push(temp);
      temp.addTo(map);
    });

    setPolygons(newPoly);
  }, [slots["slots"], map]);

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute z-10 w-[280px] flex flex-col left-14 top-3">
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
                          setQuery("");
                          setSearchItems(null);
                          setNavigate(item);
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
        {initialMap}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={navigate}
        >
          {navigate && (
            <div className="w-[400px] h-[230px] bg-white rounded-lg flex flex-col p-4 text-[#555C68]">
              <div className="flex flex-row justify-between items-center">
                <h1 className="font-lato-bold text-lg">
                  Are you sure you want to go to this grave?
                </h1>
                <XMarkIcon
                  onClick={() => {
                    setNavigate(null);
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
              <div className="w-full flex flex-col gap-1 py-2 px-1">
                <div className="w-full flex flex-row gap-2">
                  <p className="font-lato-bold text-base">Name:</p>
                  <p>{navigate["Name"]}</p>
                </div>
                <div className="w-full flex flex-row gap-2">
                  <p className="font-lato-bold text-base">Block Name:</p>
                  <p>{navigate["block_name"]}</p>
                </div>
                <div className="w-full flex flex-row gap-2">
                  <p className="font-lato-bold text-base">Lot No:</p>
                  <p>{navigate["lot_no"]}</p>
                </div>
              </div>
              <div className="flex flex-row gap-2 pt-4">
                <button
                  onClick={() => {
                    setNavigate(null);
                  }}
                  className="h-10 border border-[#4F73DF] flex-1 rounded-lg font-lato-bold text-[#4F73DF] hover:text-white hover:bg-[#4F73DF]"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    handleNavigate(navigate);
                    setNavigate(null);
                  }}
                  className="h-10 border border-transparent flex-1 rounded-lg font-lato-bold bg-[#4F73DF] text-white flex flex-row items-center justify-center"
                >
                  Yes
                </button>
              </div>
            </div>
          )}
        </Backdrop>
      </div>
    </div>
  );
}

export default Navigation;
