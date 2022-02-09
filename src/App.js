import './App.css'
import React from 'react'
import Sidebar from './Sidebar'
import Chat from './Chat'
import Login from './Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useStateValue } from './StateProvider'
import ChatHomePage from './ChatHomePage'

function App () {
  const [{ user }] = useStateValue()
 
  return (
    <div className='app'>
      {!user ? (
        <Login />
      ) : (
        <div className='app__body'>
          <Router>
            <Sidebar />
            <Routes>
              <Route exact path='/' element={<ChatHomePage />}></Route>
   
              <Route path='/rooms/:roomId' element={<Chat />}></Route>

            </Routes>
          </Router>
        </div>
      )}
    </div>
  )
}

export default App
