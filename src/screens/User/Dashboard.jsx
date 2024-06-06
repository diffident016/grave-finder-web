import React, { useMemo } from "react";
import { CircularProgress } from "@mui/material";

function Dashboard({ slots }) {
  const lots = useMemo(() => {
    if (slots["fetchState"] != 1) return;

    const filter = slots["slots"].filter((item) => item["Status"] != "Draft");

    const blk = filter.reduce((group, slot) => {
      const { block_name } = slot;
      group[block_name.toString().replaceAll("  ", "")] =
        group[block_name.toString().replaceAll("  ", "")] ?? [];
      group[block_name.toString().replaceAll("  ", "")].push(slot);
      return group;
    }, {});

    var blocks = Object.keys(blk).map((key) => {
      var lot = blk[key];
      var tA = 0;
      var tR = 0;

      for (var i = 0; i < lot.length; i++) {
        if (lot[i]["Status"] == "Available") {
          tA += 1;
        }

        if (lot[i]["Status"] == "Reserved") {
          tR += 1;
        }
      }

      var temp = {
        name: key,
        available: tA,
        reserved: tR,
      };

      return temp;
    });

    blocks = blocks.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return blocks;
  }, [slots["slots"]]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {slots["fetchState"] != 1 ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <CircularProgress />
          <p className="text-base">Fetching data...</p>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col px-8 py-4 overflow-auto">
          <div className="flex flex-row gap-4 items-center">
            <h1 className="text-xl font-lato-bold">Available Lots</h1>
          </div>
          <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2 pt-4">
            {lots.map((item) => {
              return (
                <div className="w-full h-[80px] bg-white rounded-md shadow-md border-l-4 border-[#4F73DF]">
                  <div className="flex flex-col h-full justify-center px-2 gap-1">
                    <h1 className="font-lato-bold text-lg text-[#4F73DF]">
                      {item["available"]}
                    </h1>
                    <h1 className="font-lato-bold text-xs">{item["name"]}</h1>
                  </div>
                </div>
              );
            })}
          </div>
          <h1 className="text-xl font-lato-bold pt-4">Reserved Lots</h1>
          <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2 pt-4">
            {lots.map((item) => {
              return (
                <div className="w-full h-[80px] bg-white rounded-md shadow-md border-l-4 border-[#4F73DF]">
                  <div className="flex flex-col h-full justify-center px-2 gap-1">
                    <h1 className="font-lato-bold text-lg text-[#4F73DF]">
                      {item["reserved"]}
                    </h1>
                    <h1 className="font-lato-bold text-xs">{item["name"]}</h1>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
