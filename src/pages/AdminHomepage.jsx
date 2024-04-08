import React, { useState } from "react";
import Dashboard from "../screens/Admin/Dashboard";
import Records from "../screens/Admin/Records";
import Reports from "../screens/Admin/Reports";
import ManageUsers from "../screens/Admin/ManageUsers";
import Reservation from "../screens/Admin/Reservation";

import {
  Squares2X2Icon,
  ClipboardDocumentIcon,
  ChartPieIcon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hide } from "../states/alerts";

function AdminHomepage({ user }) {
  const [screen, setScreen] = useState(0);

  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert.value);

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
      label: "Reports",
      component: <Reports />,
      icon: <ChartPieIcon />,
      header: "",
    },
    {
      label: "Manage Users",
      component: <ManageUsers />,
      icon: <UsersIcon />,
      header: "",
    },
    {
      label: "Reservations",
      component: <Reservation />,
      icon: <TagIcon />,
      header: "",
    },
  ];
  return (
    <div className="w-full h-screen flex flex-row font-lato text-[#555C68]">
      <div className="w-[24%] h-full">
        <Sidebar screens={screens} screen={screen} setScreen={setScreen} />
      </div>
      <div className="w-full h-full flex flex-col">
        <Navbar user={user} />
        {screens[screen].component}
        {alert.show && (
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={alert.show}
            autoHideDuration={alert.duration}
            onClose={() => {
              dispatch(hide());
            }}
          >
            <Alert severity={alert.type}>{alert.message}</Alert>
          </Snackbar>
        )}
      </div>
    </div>
  );
}

export default AdminHomepage;
