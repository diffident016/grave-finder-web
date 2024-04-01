import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

function SampleMap({ img }) {
  return (
    <div className="relative overflow-hidden h-full">
      <TransformWrapper
        initialScale={1.8}
        initialPositionX={0}
        initialPositionY={-150}
        centerZoomedOut
        onZoom={(val) => {
          console.log(val["state"]);
        }}
      >
        {({ zoomIn, zoomOut, ...rest }) => (
          <>
            <div className="absolute z-10 w-10 h-20 rounded-lg top-4 left-4 bg-white shadow-sm select-none">
              <div className="grid grid-rows-2 h-full w-full">
                <div
                  onClick={() => {
                    zoomIn();
                  }}
                  className="border h-full w-full rounded-t-lg flex items-center justify-center cursor-pointer"
                >
                  <div className="w-6">
                    <PlusIcon />
                  </div>
                </div>
                <div
                  onClick={() => {
                    zoomOut();
                  }}
                  className="border h-full w-full rounded-b-lg flex items-center justify-center cursor-pointer"
                >
                  <div className="w-6">
                    <MinusIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute z-10 w-[180px] h-[150px] bg-white/50 shadow-sm rounded-lg bottom-10 right-10">
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
            <TransformComponent>
              <img
                id="mapImage"
                src={img || "/map.png"}
                style={{
                  width: "50%",
                  height: "80%",
                }}
                className="object-cover"
                useMap="#workmap"
                // onClick={() => {
                //   window.alert("hello");
                // }}
              />

              <map name="workmap">
                <area shape="rect" coords="34, 44, 270, 350" />
              </map>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default SampleMap;
