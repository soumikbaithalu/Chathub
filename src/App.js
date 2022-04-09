import "./App.css";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

function App() {
  const [{ user }] = useStateValue();
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <div className="app">
      {loading ? (
        <div className="centeredOnScreen">loading...</div>
      ) : (
        <>
          {!currentUser ? (
            <Login />
          ) : (
            <div className="app__body">
              <Router>
                <Sidebar />
                <Switch>
                  <Route path="/rooms/:roomId">
                    <Chat />
                  </Route>
                  <Route path="/">
                    <Chat />
                  </Route>
                </Switch>
              </Router>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
