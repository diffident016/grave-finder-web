import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Squares2X2Icon,
  ClipboardDocumentIcon,
  MapIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Records from "../screens/User/Records";
import Map from "../screens/User/Map";
import Navigation from "../screens/User/Navigation";
import Dashboard from "../screens/User/Dashboard";

function Homepage() {
  const [screen, setScreen] = useState(0);

  const screens = [
    {
      label: "Dashboard",
      component: <Dashboard />,
      icon: <Squares2X2Icon />,
      header: "",
    },
    {
      label: "Deceased Records",
      component: <Records />,
      icon: <ClipboardDocumentIcon />,
      header: "",
    },
    {
      label: "Map",
      component: <Map />,
      icon: <MapIcon />,
      header: "",
    },
    {
      label: "Navigation",
      component: <Navigation />,
      icon: <MapPinIcon />,
      header: "",
    },
  ];
  return (
    <div className="w-full h-screen flex flex-row font-lato text-[#555C68]">
      <div className="w-[24%] h-full">
        <Sidebar screens={screens} screen={screen} setScreen={setScreen} />
      </div>
      <div className="w-full h-full flex flex-col">
        <Navbar />
        {screens[screen].component}
      </div>
    </div>
  );
}

export default Homepage;
