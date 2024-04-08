import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ListItemIcon, Menu, MenuItem, MenuList } from "@mui/material";

function Navbar({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { logout } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="w-full h-20 bg-white shadow-sm text-[#555C68]">
      <div className="flex flex-row h-full w-full items-center justify-end px-4 gap-2">
        <h1
          onClick={handleClick}
          className="font-lato-bold text-lg hover:underline cursor-pointer"
        >
          Welcome, {`${user["fname"]} ${user["lname"]}`}
        </h1>
        <Cog6ToothIcon
          onClick={handleClick}
          className="w-5 text-[#555C68] cursor-pointer"
        />

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          dense={true}
          onClose={() => {
            setAnchorEl(null);
          }}
        >
          <MenuList className="focus:outline-none">
            <MenuItem
              onClick={() => {
                logout();
              }}
            >
              <ListItemIcon>
                <ArrowRightOnRectangleIcon className="w-5" />
              </ListItemIcon>
              <p className="text-sm">Logout</p>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
}

export default Navbar;
