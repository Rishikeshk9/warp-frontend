import logo from "./logos/Warp logo-05.svg";
import "./App.css";
import { useState, createContext } from "react";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Download from "./components/download/Download";
import Home from "./components/home/Home";
import Chat from "./components/chat/Chat";
export const Context = createContext();

function App() {
  const [store, setStore] = useState({
    wallet: "",
    activeTab: 0,
    fileUrl: "",
    receiverMail: "",
    receiverWallet: "",
  });

  return (
    <Context.Provider value={{ database: store, setDatabase: setStore }}>
      <div>
        <Router>
          <Navbar />
          <Switch>
            <Route path='/chat'>
              <Chat />
            </Route>
            <Route path='/download/:id'>
              <Download />
            </Route>
            <Route path='/'>
              <Home />
              {/* <Chat /> */}
            </Route>
          </Switch>
        </Router>
      </div>
    </Context.Provider>
  );
}

export default App;
