import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import GraveMap from "../../components/GraveMap";
import {
  addSlot,
  deleteSlot,
  updateCoor,
  updateSlot,
} from "../../api/Services";
import { LatLngBounds } from "leaflet";
import { show } from "../../states/alerts";
import { useDispatch } from "react-redux";

import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Backdrop } from "@mui/material";
import PopupDialog from "../../components/PopupDialog";

function Utility({ slots }) {
  const [map, setMap] = useState(null);
  const [details, setDetails] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [tempSlots, setTemp] = useState(slots["slots"]);
  const [selected, setSelected] = useState();
  const [mode, setMode] = useState(0);
  const [coors, setCoors] = useState([]);
  const [isDelete, setDelete] = useState();

  const dispatch = useDispatch();

  var center = [];
  var sIndex = 0;

  const [polygons, setPolygons] = useState([]);

  const bounds = new LatLngBounds([14.11226, 121.5461], [14.10961, 121.55445]);

  const initialMap = useMemo(
    () => (
      <MapContainer
        ref={setMap}
        className="h-full z-0"
        center={[14.110906767590265, 121.55069557584935]}
        zoom={18}
        maxBounds={[
          [14.112046428091196, 121.54880443853448],
          [14.109809973697436, 121.54879907320274],
          [14.112046428091196, 121.55173927499862],
          [14.109851582351608, 121.55173659233277],
        ]}
        maxBoundsViscosity={1}
      >
        <ImageOverlay url="/filled_map.svg" bounds={bounds} zIndex={10} />
        <TileLayer
          maxZoom={19.8}
          minZoom={18.4}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    []
  );

  const statusColor = (status) => {
    if (status == "Available") {
      return "#00FF0A";
    } else if (status == "Reserved") {
      return "#ffe600ef";
    } else if (status == "Draft") {
      return "#4F73DF";
    }

    return "#FF0505";
  };

  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      block_name: "",
      lot_no: "",
      "Lot Size": "",
      "Price Per SQM": "",
      "Whole Price": "",
      capacity: "",
      Installment: "",
    }
  );

  const updateTemp = () => {
    setTemp(slots["slots"]);
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

    console.log(coors);
    if (mode == 0 || (mode == 2 && selected)) {
      newPoly.push(
        L.polygon(coors, {
          color: mode == 0 ? "#4F73DF" : statusColor(selected["Status"]),
          weight: 1,
        }).addTo(map)
      );
    }

    const tSlots =
      mode != 2 ? slots["slots"] : selected ? tempSlots : slots["slots"];

    tSlots.map((item, index) => {
      var temp = L.polygon(
        [
          item["lat_long1"]
            .toString()
            .split(",")
            .map((val) => parseFloat(val)),
          item["lat_long2"]
            .toString()
            .split(",")
            .map((val) => parseFloat(val)),
          item["lat_long3"]
            .toString()
            .split(",")
            .map((val) => parseFloat(val)),
          item["lat_long4"]
            .toString()
            .split(",")
            .map((val) => parseFloat(val)),
        ],
        { color: statusColor(item["Status"]), weight: 1 }
      ).addEventListener("click", async () => {
        if (mode == 1) {
          setDetails(item);
        }

        if (mode == 2) {
          setSelected(item);
          setCoors([]);
          var s = [...tSlots];
          s.splice(index, 1);
          setTemp(s);
        }

        if (mode == 3) {
          setDelete(item);
        }
      });

      newPoly.push(temp);
      temp.addTo(map);
    });

    // var imageUrl = '/map2.svg',
    //   imageBounds = [
    //     [14.113166870421994, 121.54612357334524],
    //     [14.10877463053821, 121.55438662251981]
    //   ];

    // L.imageOverlay(imageUrl, imageBounds).addTo(map);

    setPolygons(newPoly);

    map.on("click", function (e) {
      //   if (!selected) return;

      var coord = e.latlng;
      var lat = coord.lat;
      var lng = coord.lng;

      if (mode == 0 || mode == 2) {
        if (mode == 2) {
          if (!selected) {
            setCoors([]);
            return;
          }
        }

        if (coors.length > 3) return;
        var temp = [...coors];
        temp.push([lat, lng]);
        setCoors(temp);
      }
    });
  }, [tempSlots, coors, slots["slots"], map]);

  const add_Slot = async () => {
    var sum0 = 0;
    var sum1 = 0;

    for (var a = 0; a < coors.length; a++) {
      sum0 += coors[a][0];
      sum1 += coors[a][1];
    }

    center = [sum0 / 4, sum1 / 4];

    addSlot(coors, center)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Slot was added successfully.",
            duration: 3000,
            show: true,
          })
        );
        setCoors([]);
        sIndex = 0;
        updateTemp();
      })
      .catch((err) => {
        dispatch(
          show({
            type: "error",
            message: "Something went wrong.",
            duration: 3000,
            show: true,
          })
        );
      });
  };

  const updateSCoor = () => {
    var sum0 = 0;
    var sum1 = 0;

    for (var a = 0; a < coors.length; a++) {
      sum0 += coors[a][0];
      sum1 += coors[a][1];
    }

    center = [sum0 / 4, sum1 / 4];
    updateCoor(selected.id, coors, center)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Slot was move successfully.",
            duration: 3000,
            show: true,
          })
        );
        setCoors([]);
        sIndex = 0;
        updateTemp();
        setSelected();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTSlot = (item) => {
    deleteSlot(item.id)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Slot was deleted successfully.",
            duration: 3000,
            show: true,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    var newForm = details;

    var valid = true;
    Object.keys(form).forEach((inputKey) => {
      if (!(form[inputKey] == "" || form[inputKey] == null)) {
        newForm[inputKey] = form[inputKey];
      } else {
        if (!details[inputKey]) {
          valid = false;
        }
      }
    });

    if (newForm["Status"] == "Draft") {
      if (valid) {
        newForm["Status"] = "Available";
      }
    }
    console.log(newForm);

    updateSlot(newForm["id"], newForm)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Grave information was updated successfully.",
            duration: 3000,
            show: true,
          })
        );
        handleReset();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReset = () => {
    Object.keys(form).forEach((inputKey) => {
      updateForm({
        [inputKey]: "",
      });
    });

    setDetails(null);
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-3 left-14 z-10">
        <div className="flex flex-row w-[300px] h-10 rounded-lg text-xs font-lato-bold bg-white">
          <button
            onClick={() => {
              setMode(0);
            }}
            className={`${
              mode == 0 && "bg-[#4F73DF] text-white"
            } flex-1 border-[#b4b4b4] rounded-l-lg`}
          >
            Add Slot
          </button>
          <button
            onClick={() => {
              setMode(1);
              setCoors([]);
            }}
            className={`${
              mode == 1 && "bg-[#4F73DF] text-white"
            } flex-1 border-l  border-r border-[#b4b4b4]`}
          >
            Slot Info
          </button>
          <button
            onClick={() => {
              setMode(2);
              setCoors([]);
            }}
            className={`${
              mode == 2 && "bg-[#4F73DF] text-white"
            } flex-1  border-r border-[#b4b4b4]`}
          >
            Move Slot
          </button>
          <button
            onClick={() => {
              setMode(3);
              setCoors([]);
            }}
            className={` ${
              mode == 3 && "bg-[#4F73DF] text-white"
            } flex-1 rounded-r-lg border-[#b4b4b4]`}
          >
            Delete Slot
          </button>
        </div>
      </div>
      {(mode == 0 || mode == 2) && coors.length > 0 && (
        <div className="absolute bottom-10 left-5 flex flex-row gap-2 z-10 text-sm">
          <button
            disabled={coors.length < 4}
            onClick={() => {
              if (mode == 0) {
                add_Slot();
              } else {
                updateSCoor();
              }
              setCoors([]);
            }}
            className="bg-[#4F73DF] text-white rounded-lg w-[60px] h-9 disabled:bg-[#4F73DF]/80"
          >
            {mode == 0 ? "Add" : "Move"}
          </button>
          <button
            onClick={() => {
              sIndex = 0;
              setCoors([]);
              updateTemp();
              setSelected();
            }}
            className="border border-[#b4b4b4] rounded-lg w-[80px] h-9 bg-white"
          >
            Cancel
          </button>
        </div>
      )}
      {initialMap}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={details}
      >
        {details && (
          <form
            style={{
              width: "400px",
              height: "550px",
            }}
            onSubmit={handleSubmit}
            onReset={handleReset}
            className=" bg-white/80 rounded-lg flex flex-col p-4 text-[#555C68]"
          >
            <div className="flex flex-row justify-between items-center">
              <h1 className="font-lato-bold text-lg">GRAVE INFORMATION</h1>
              <XMarkIcon
                onClick={() => {
                  setDetails(null);
                }}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div className="w-full h-full flex flex-col gap-1 py-2 px-1">
              <div className="w-full flex flex-col">
                <p className="font-lato-bold text-sm">Block Name</p>
                <input
                  type="text"
                  placeholder={details["block_name"]}
                  value={form.block_name}
                  className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                  onChange={(e) => {
                    updateForm({ block_name: e.target.value });
                  }}
                />
              </div>
              <div className="w-full flex flex-col">
                <p className="font-lato-bold text-sm">Lot No</p>
                <input
                  type="text"
                  placeholder={details["lot_no"]}
                  value={form.lot_no}
                  className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                  onChange={(e) => {
                    updateForm({ lot_no: e.target.value });
                  }}
                />
              </div>
              <div className="w-full flex flex-col">
                <p className="font-lato-bold text-sm">Lot Size</p>
                <input
                  type="text"
                  placeholder={details["Lot Size"]}
                  value={form["Lot Size"]}
                  className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                  onChange={(e) => {
                    updateForm({ "Lot Size": e.target.value });
                  }}
                />
              </div>
              <div className="w-full flex flex-col">
                <p className="font-lato-bold text-sm">Price Per SQM</p>
                {/* <p>&#8369;{details["Price Per SQM"]}</p> */}
                <input
                  type="text"
                  placeholder={details["Price Per SQM"]}
                  value={form["Price Per SQM"]}
                  className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                  onChange={(e) => {
                    updateForm({ "Price Per SQM": e.target.value });
                  }}
                />
              </div>
              <div className="w-full flex flex-col">
                <p className="font-lato-bold text-sm">Whole Price</p>
                {/* <p>&#8369;{details["Whole Price"]}</p> */}
                <input
                  type="text"
                  placeholder={details["Whole Price"]}
                  value={form["Whole Price"]}
                  className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                  onChange={(e) => {
                    updateForm({ "Whole Price": e.target.value });
                  }}
                />
              </div>
              <div className="w-full flex flex-col">
                <p className="font-lato-bold text-sm">Installment</p>
                {/* <p>&#8369;{details["Installment"]}</p> */}
                <input
                  type="text"
                  placeholder={details["Installment"]}
                  value={form["Installment"]}
                  className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                  onChange={(e) => {
                    updateForm({ Installment: e.target.value });
                  }}
                />
              </div>
              <div className="w-full flex flex-col">
                <p className="font-lato-bold text-sm">Capacity</p>
                {/* <p>&#8369;{details["Installment"]}</p> */}
                <input
                  type="text"
                  placeholder={details["capacity"]}
                  value={form.capacity}
                  className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                  onChange={(e) => {
                    updateForm({ capacity: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="flex flex-row gap-2 pb-2">
              <button
                type="submit"
                className="h-10 border border-transparent flex-1 rounded-lg font-lato-bold bg-[#4F73DF] text-white"
              >
                Save
              </button>
              <button
                type="reset"
                className="h-10 border border-[#4F73DF] flex-1 rounded-lg font-lato-bold text-[#4F73DF] hover:text-white hover:bg-[#4F73DF]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Backdrop>
      <PopupDialog
        show={isDelete}
        close={() => {
          setDelete(null);
        }}
        title="Delete Slot"
        content="Are you sure you want to delete this slot?"
        action1={() => {
          deleteTSlot(isDelete);
          setDelete(null);
        }}
        action2={() => {
          setDelete(null);
        }}
      />
    </div>
  );
}

export default Utility;
