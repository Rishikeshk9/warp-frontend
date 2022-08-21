import logo from "./logos/Warp logo-05.svg";
// import "./App.css";
import { useState, createContext, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Download from "./components/download/Download";
import Home from "./components/home/Home";
import Chat from "./components/chat/Chat";
import { connect } from "@tableland/sdk";
import Landing from "./components/landing/Landing";
export const Context = createContext();

function App() {
  const [store, setStore] = useState({
    wallet: "",
    activeTab: 0,
    fileUrl: "",
    receiverMail: "",
    receiverWallet: "",
    contacts: [],
    history: [],
    signer: "",
  });

  return (
    <Context.Provider value={{ database: store, setDatabase: setStore }}>
      <div className=' h-screen   '>
        <Router>
          <Switch>
            <Route path='/download/:id'>
              <Navbar />
              <Download />
            </Route>

            {store.wallet ? (
              <Route path='/'>
                <Navbar />
                <Home />
                {/* <Chat /> */}
              </Route>
            ) : (
              <Landing />
            )}
          </Switch>
        </Router>
      </div>
    </Context.Provider>
  );
}

export default App;
