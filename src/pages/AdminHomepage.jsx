import React, { useState, useReducer, useEffect } from "react";
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
import { getSlots, onSnapshot } from "../api/Services";

function AdminHomepage({ user }) {
  const [screen, setScreen] = useState(0);

  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert.value);

  const [slots, setSlots] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      slots: [],
      groupSlots: [],
      count: 0,
    }
  );

  useEffect(() => {
    const query = getSlots();

    try {
      const unsub = onSnapshot(query, (snapshot) => {
        if (!snapshot) {
          setSlots({ fetchState: -1 });
          return;
        }

        if (snapshot.empty) {
          setSlots({ fetchState: 2 });
          return;
        }

        var data = snapshot.docs.map((doc, index) => {
          var temp = doc.data();
          temp["no"] = index + 1;
          temp["id"] = doc.id;
          return temp;
        });

        const group = data.reduce((group, slot) => {
          const { Status } = slot;
          group[Status] = group[Status] ?? [];
          group[Status].push(slot);
          return group;
        }, {});

        setSlots({
          fetchState: 1,
          slots: data,
          count: data.length,
          groupSlots: group,
        });
      });

      return () => {
        unsub();
      };
    } catch {
      setSlots({ fetchState: -1 });
    }
  }, []);

  const screens = [
    {
      label: "Dashboard",
      component: <Dashboard />,
      icon: <Squares2X2Icon />,
      header: "",
    },
    {
      label: "Deceased Records",
      component: <Records slots={slots} />,
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
      component: <Reservation slots={slots} />,
      icon: <TagIcon />,
      header: "",
    },
  ];
  return (
    <div className="w-full h-screen flex flex-row font-lato text-[#555C68]">
      <Sidebar screens={screens} screen={screen} setScreen={setScreen} />
      <div className="w-full h-full flex flex-col overflow-hidden">
        <Navbar user={user} />
        {screens[screen].component}
      </div>
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
  );
}

export default AdminHomepage;
