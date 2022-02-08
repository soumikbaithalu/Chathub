import './App.css'
import React from 'react'
import Sidebar from './Sidebar'
import Chat from './Chat'
import Login from './Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useStateValue } from './StateProvider'
import ChatHomePage from './ChatHomePage'
import { useParams } from 'react-router-dom'

function App () {
  const [{ user }] = useStateValue()
  // const [{ roomId }] = useParams()
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
              {/* {{ roomId } ? ( */}
              <Route path='/rooms/:roomId' element={<Chat />}></Route>
              {/* ) : (
                <Route exact path='/'>
                  <ChatHomePage />
                </Route>
              )} */}
            </Routes>
          </Router>
        </div>
      )}
    </div>
  )
}

export default App
