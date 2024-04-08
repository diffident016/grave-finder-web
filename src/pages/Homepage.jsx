import React, { useEffect, useReducer, useState } from "react";
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
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hide } from "../states/alerts";
import { getSlots } from "../api/Services";
import { onSnapshot } from "firebase/firestore";

function Homepage({ user }) {
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
          return temp;
        });

        setSlots({
          fetchState: 1,
          slots: data,
          count: data.length,
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
    <div className="w-full h-screen flex flex-row font-lato text-[#555C68] overflow-hidden">
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

export default Homepage;
