import React, { useEffect, useRef, useState } from "react";
import SampleMap from "../../components/SampleMap";
import GraveMap from "../../components/GraveMap";
import { Backdrop, CircularProgress } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ReservationForm from "./ReservationForm";
import { deleteReservation, reservedLot } from "../../api/Services";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
  Polyline,
} from "react-leaflet";
import { polygon } from "leaflet";

function Map({ slots, user, setScreen, setNavigation }) {
  const [map, setMap] = useState(null);
  const [details, setDetails] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isReserve, showReserve] = useState(false);
  const [isSubmit, showSubmit] = useState(null);
  const [reserving, setReserving] = useState(false);
  const [isSuccessful, setSuccessful] = useState(false);
  const [polygons, setPolygons] = useState([]);

  const handleReserve = () => {
    setReserving(true);

    const { firstname, lastname, Born, Died } = isSubmit;

    const form = {
      Name: firstname + " " + lastname,
      Born: Born,
      Died: Died,
    };

    reservedLot(details.id, form)
      .then((val) => {
        setReserving(false);
        showSubmit(null);
        setSuccessful(true);
      })
      .catch((err) => {
        console.log(err);
        setReserving(false);
      });
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
        if (item["Status"] == "Reserved") {
          await deleteReservation(item["id"]);
          return;
        }
        if (item["Status"] != "Available") {
          return window.alert("This lot is not available.");
        }
        setDetails(item);
        setShowInfo(true);
      });

      newPoly.push(temp);
      temp.addTo(map);
    });

    setPolygons(newPoly);
  }, [slots["slots"], map]);

  return (
    <div className="w-full h-full">
      {isReserve ? (
        <ReservationForm
          user={user}
          showReserve={showReserve}
          showSubmit={showSubmit}
        />
      ) : (
        <GraveMap
          map={map}
          setMap={setMap}
          slots={slots}
          showDetails={(details) => {
            setDetails(details);
            setShowInfo(true);
          }}
        />
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSuccessful}
      >
        {isSuccessful && (
          <div className="w-[350px] h-[280px] bg-white/80 rounded-lg flex flex-col p-4 text-[#555C68]">
            <div className="flex flex-row justify-between items-center">
              <h1 className="font-lato-bold text-lg">
                Reservation Successful!
              </h1>
            </div>
            <p className="py-2">
              Please proceed to the San Luis Memorial Park office (Lucban
              Academy, San Luis St., Barangay 8, Lucban, Quezon) Within 5-7 days
              for confirmation and approval of the reservation. If it expires,
              your reservation wil be removed from the list of pre-reserves.
            </p>

            <button
              onClick={() => {
                setSuccessful(false);
              }}
              className="mt-3 h-10 border border-transparent rounded-lg font-lato-bold bg-[#4F73DF] text-white"
            >
              Okay
            </button>
          </div>
        )}
      </Backdrop>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showInfo || !!isSubmit}
      >
        {(showInfo || !!isSubmit) && (
          <div
            style={{ width: !isSubmit ? "350px" : "450px" }}
            className="w-[350px] h-[280px] bg-white/80 rounded-lg flex flex-col p-4 text-[#555C68]"
          >
            <div className="flex flex-row justify-between items-center">
              <h1 className="font-lato-bold text-lg">
                {!isSubmit
                  ? "GRAVE INFORMATION"
                  : "Are you sure you want to reserve this lot?"}
              </h1>
              <XMarkIcon
                onClick={() => {
                  console.log(details["Latitude"], details["Longitude"]);
                  setShowInfo(false);
                  showSubmit(null);
                  setReserving(false);
                }}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div className="w-full h-full flex flex-col gap-1 py-2 px-1">
              <div className="w-full flex flex-row gap-2">
                <p className="font-lato-bold text-base">Block Name:</p>
                <p>{details["block_name"]}</p>
              </div>
              <div className="w-full flex flex-row gap-2">
                <p className="font-lato-bold text-base">Lot No:</p>
                <p>{details["lot_no"]}</p>
              </div>
              <div className="w-full flex flex-row gap-2">
                <p className="font-lato-bold text-base">Lot Size:</p>
                <p>{details["Lot Size"]}</p>
              </div>
              <div className="w-full flex flex-row gap-2">
                <p className="font-lato-bold text-base">Price Per SQM:</p>
                <p>&#8369;{details["Price Per SQM"]}</p>
              </div>
              <div className="w-full flex flex-row gap-2">
                <p className="font-lato-bold text-base">Whole Price:</p>
                <p>&#8369;{details["Whole Price"]}</p>
              </div>
            </div>
            {!isSubmit ? (
              <div className="flex flex-row gap-2 pb-2">
                <button
                  onClick={() => {
                    setNavigation(details);
                    setShowInfo(false);
                    setScreen(3);
                  }}
                  className="h-10 border border-transparent flex-1 rounded-lg font-lato-bold bg-[#4F73DF] text-white"
                >
                  Navigation
                </button>
                <button
                  onClick={() => {
                    setShowInfo(false);
                    showReserve(true);
                  }}
                  className="h-10 border border-[#4F73DF] flex-1 rounded-lg font-lato-bold text-[#4F73DF] hover:text-white hover:bg-[#4F73DF]"
                >
                  Reserve This
                </button>
              </div>
            ) : (
              <div className="flex flex-row gap-2 pb-2">
                <button
                  onClick={() => {
                    showSubmit(null);
                  }}
                  className="h-10 border border-[#4F73DF] flex-1 rounded-lg font-lato-bold text-[#4F73DF] hover:text-white hover:bg-[#4F73DF]"
                >
                  No
                </button>
                <button
                  disabled={reserving}
                  onClick={() => {
                    handleReserve();
                  }}
                  className="h-10 border border-transparent flex-1 rounded-lg font-lato-bold bg-[#4F73DF] text-white flex flex-row items-center justify-center"
                >
                  {reserving ? (
                    <div className="flex flex-row items-center gap-4">
                      <CircularProgress size="18px" color="inherit" />
                      <p className="text-white text-sm">Submitting...</p>
                    </div>
                  ) : (
                    "Yes"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </Backdrop>
    </div>
  );
}

export default Map;
