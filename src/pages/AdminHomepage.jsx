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
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hide } from "../states/alerts";
import {
  addReservation,
  getAvailableLots,
  getReservations,
  getSlots,
  getUsers,
  onSnapshot,
} from "../api/Services";
import Utility from "../screens/Admin/Utility";

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
      blocks: [],
      count: 0,
    }
  );

  const [reservations, setReservations] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      data: [],
      count: 0,
    }
  );

  const [users, setUsers] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      users: [],
      group: [],
      count: 0,
    }
  );

  const [lots, setLots] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      lots: [],
      count: 0,
    }
  );

  useEffect(() => {
    const query = getAvailableLots();

    try {
      const unsub = onSnapshot(query, (snapshot) => {
        if (!snapshot) {
          setLots({ fetchState: -1 });
          return;
        }

        if (snapshot.empty) {
          setLots({ fetchState: 2 });
          return;
        }

        var data = snapshot.data();

        setLots({
          fetchState: 1,
          lots: data,
        });
      });

      return () => {
        unsub();
      };
    } catch {
      setLots({ fetchState: -1 });
    }
  }, []);

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

        const block = data.reduce((group, slot) => {
          const { block_name } = slot;
          group[block_name] = group[block_name] ?? [];
          group[block_name].push(slot);
          return group;
        }, {});

        setSlots({
          fetchState: 1,
          slots: data,
          count: data.length,
          blocks: block,
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

  useEffect(() => {
    const query = getUsers();

    try {
      const unsub = onSnapshot(query, (snapshot) => {
        if (!snapshot) {
          setUsers({ fetchState: -1 });
          return;
        }

        if (snapshot.empty) {
          setUsers({ fetchState: 2 });
          return;
        }

        var data = snapshot.docs.map((doc, index) => {
          var temp = doc.data();
          temp["no"] = index + 1;
          return temp;
        });

        setUsers({
          fetchState: 1,
          users: data,
          count: data.length,
        });
      });

      return () => {
        unsub();
      };
    } catch {
      setUsers({ fetchState: -1 });
    }
  }, []);

  useEffect(() => {
    const query = getReservations();

    try {
      const unsub = onSnapshot(query, (snapshot) => {
        if (!snapshot) {
          setReservations({ fetchState: -1 });
          return;
        }

        if (snapshot.empty) {
          setReservations({ fetchState: 2 });
          return;
        }

        var data = snapshot.docs.map((doc, index) => {
          var temp = doc.data();
          temp["no"] = index + 1;
          return temp;
        });

        setReservations({
          fetchState: 1,
          data: data,
          count: data.length,
        });
      });

      return () => {
        unsub();
      };
    } catch {
      setReservations({ fetchState: -1 });
    }
  }, []);

  const screens = [
    {
      label: "Dashboard",
      component: <Dashboard lots={lots} />,
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
      component: <Reports slots={slots} reservations={reservations} />,
      icon: <ChartPieIcon />,
      header: "",
    },
    {
      label: "Manage Users",
      component: <ManageUsers users={users} />,
      icon: <UsersIcon />,
      header: "",
    },
    {
      label: "Reservations",
      component: <Reservation slots={slots} />,
      icon: <TagIcon />,
      header: "",
    },
    {
      label: "Utility",
      component: <Utility slots={slots} />,
      icon: <WrenchScrewdriverIcon />,
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
