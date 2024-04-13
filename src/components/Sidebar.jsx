import React from "react";
import logo from "../assets/images/logo.png";

function Sidebar({ screens, screen, setScreen }) {
  return (
    <div className="w-[24%] h-full bg-[#4F73DF] text-white select-none">
      <div className="flex flex-col h-full w-full">
        <div className="flex h-20 items-center px-2 gap-2 select-none">
          <img src={logo} className="w-16 h-16 cursor-pointer" />
          <h1 className="cursor-pointer font-lato-bold text-xl">
            GRAVE FINDER
          </h1>
        </div>
        <div className="flex flex-col w-full flex-1 mt-2 p-4 font-lato gap-2">
          {screens.map((item, index) => {
            return (
              <div
                id={item.label}
                onClick={() => {
                  setScreen(index);
                }}
                className={`flex flex-row h-12 ${
                  screen == index ? "text-white" : "text-white/60"
                } items-center gap-4 cursor-pointer hover:text-white`}
              >
                <div className={`w-[32px] h-[32px] p-1 rounded-full $`}>
                  {item.icon}
                </div>

                <p className={`font-lato-bold text-base`}>{item.label}</p>
              </div>
            );
          })}
        </div>
        <p className="text-center py-4 font-lato">&copy; GraveFinder 2023</p>
      </div>
    </div>
  );
}

export default Sidebar;
