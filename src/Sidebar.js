import React, {useEffect,useState} from 'react';
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import db from "./firebase";

import './Sidebar.css';

function Sidebar() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    db.collection('rooms').onSnapshot(snapshot => (
      setRooms(snapshot.docs.map((doc) => 
        ({
          id: doc.id,
          data: doc.data(),
        })

        ))
    ))
  }, []);

    return (
        <div className = "sidebar">
            <div className = "sidebar__header">
              <Avatar />
              <div className = "Sidebar__headerRight">
                <IconButton>
                    <DonutLargeIcon />
                </IconButton>
                <IconButton>
                <ChatIcon />
                </IconButton>
                
                <IconButton>
                <MoreVertIcon />
                </IconButton>
              </div>
            </div>
           
           <div className = "sidebar__search">
               <div className= "sidebar__searchContainer">
                <SearchOutlined /> 
                <input placeholder="Search or start new chat" type = "text" />
              </div>
           </div>
           
           <div className = "sidebar__chats">
               <SidebarChat addNewChat />
               {rooms.map(room => (
                 <SidebarChat key ={room.id} id ={room.id}
                 name={room.data.name} />
               )) }
           </div>
            
        </div>
    );
}

export default Sidebar

