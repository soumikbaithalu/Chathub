import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import db, { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";

function Sidebar(props) {
  const [rooms, setRooms] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [{ user }] = useStateValue();
  const dispatch = useStateValue()[1];
  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
  };

  const handleLogout = (event) => {
    auth
      .signOut()
      .then(() => {
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
      })
      })
      .catch((error) => alert(error.message));
  };

  const open = Boolean(anchorEl);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={handleClickMore}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            onClose={handleClose}
            open={open}
          >
            <MenuItem key={"logout"} onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input className="inputText" type="text" placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} /> 
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
