import './App.css';

import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Chat from './Chat';
import Login from './Login';
import Sidebar from './Sidebar';
import {useStateValue} from './StateProvider';

function App() {
  const [{user}] = useStateValue();
  const [darkMode, setDarkMode] = useState(false);
  return (<div className = {darkMode ? "dark-mode" : "light-mode"}>
          <div className = "switch-checkbox"><label className = "switch">
          <input type = "checkbox" onChange =
           {
             () => setDarkMode(!darkMode)
           } />
                <span className="slider round"> </span>
          </label>
            </div><div className = "app">{
              !user ? (<Login />)
                    : (<div className = "app__body"><Router><Sidebar /><Switch>
                       <Route path = "/rooms/:roomId"><Chat />
                       </Route>
              <Route path="/">
                        < Chat /></Route>
            </Switch>
                       </Router>
        </div>)}

          </div>
    </div>);
}

export default App;
