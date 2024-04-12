import React from "react";
import data from "../../assets/data/sample.json";

function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex flex-col px-8 py-4">
        <h1 className="text-2xl font-lato-bold">Available Lots</h1>
        <div className="flex flex-row gap-8 py-4">
          {data["locations"].map((item) => {
            return (
              <div
                key={item}
                className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]"
              >
                <div className="flex flex-col h-full justify-center px-4 gap-2">
                  <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                    {item["lots"]["available"]}
                  </h1>
                  <h1 className="font-lato-bold text-xl">{item["name"]}</h1>
                </div>
              </div>
            );
          })}
        </div>
        <h1 className="text-2xl font-lato-bold pt-4">Reserved Lots</h1>
        <div className="flex flex-row gap-8 py-4">
          {data["locations"].map((item) => {
            return (
              <div className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]">
                <div className="flex flex-col h-full justify-center px-4 gap-2">
                  <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                    {item["lots"]["reserved"]}
                  </h1>
                  <h1 className="font-lato-bold text-xl">{item["name"]}</h1>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
