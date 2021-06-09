import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from "./Chat"
import Login from './Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useStateValue } from './StateProvider';

function App() {
  const [{ user }, dispatch] = useStateValue();
  return (
    // BEM naming convention 
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Switch>
              <Route path="/rooms/:roomId">
                <Sidebar />
                <Chat />
              </Route>
              <Route path="/">
                <h1>Home Screen</h1>
              </Route>

            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
