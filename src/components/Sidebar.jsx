import React from "react";
import logo from "../assets/images/logo.png";

function Sidebar({ screens, screen, setScreen }) {
  return (
    <div className="lg:w-[24%] w-20 h-full bg-[#4F73DF] text-white select-none">
      <div className="flex flex-col h-full w-full">
        <div className="flex h-20 items-center px-2 gap-2 select-none">
          <img src={logo} className="w-16 h-16 cursor-pointer" />
          <h1 className="lg:flex hidden cursor-pointer font-lato-bold text-xl">
            GRAVE FINDER
          </h1>
        </div>
        <div className="flex flex-col w-full flex-1 mt-2 p-4 font-lato gap-2 lg:items-start items-center">
          {screens.map((item, index) => {
            return (
              <div
                key={item.label}
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

                <p className={`font-lato-bold text-base lg:flex hidden`}>{item.label}</p>
              </div>
            );
          })}
        </div>
        <p className="text-center lg:flex hidden py-4 font-lato">&copy; GraveFinder 2023</p>
      </div>
    </div>
  );
}

export default Sidebar;
