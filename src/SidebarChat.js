import React, { useEffect, useState } from 'react'
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core'
import './SidebarChat.css'
import db from './firebase'
import { Link,  useNavigate } from 'react-router-dom'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function SidebarChat ({ id, name, addNewChat }) {
  const [seed, setSeed] = useState('')
  const [messages, setMessages] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    if (id) {
      db.collection('rooms')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          setMessages(snapshot.docs.map(doc => doc.data()))
        })
    }
  }, [id])

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000))
  }, [])

  const createChat = () => {
    const roomName = prompt('Please Enter Name for Chat')

    if (roomName) {
      db.collection('rooms').add({
        name: roomName
      })
    }
  }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClose = event => {
    setAnchorEl(null)
  }
  const handleClickMore = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteContact = id => {
    db.collection('rooms')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!')
      })
      .catch(error => {
        console.error('Error removing document: ', error)
      })
    db.collection('messages')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!')
        navigate('/', { replace: true })
      })
      .catch(error => {
        console.error('Error removing document: ', error)
      })
  }

  return !addNewChat ? (
    <Link to={`/rooms/${id}`} key={id}>
      <div className='sidebarChat'>
        <div className='sidebarChat__infoDiv'>
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
          <div className='sidebarChat__info'>
            <h2>{name}</h2>
            <p>{messages[0]?.message}</p>
          </div>
        </div>
        <div>
          <IconButton onClick={handleClickMore}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            onClose={handleClose}
            open={open}
          >
            <MenuItem onClick={() => deleteContact(id)}>
              <DeleteIcon />
              Delete
            </MenuItem>
          </Menu>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className='sidebarChat'>
      <h3 className='add-new-chat-title'>Add New Room chat</h3>
    </div>
  )
}

export default SidebarChat
