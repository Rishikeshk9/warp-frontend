import logo from "./logo.svg";
import "./App.css";
import { useState, createContext } from "react";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Download from "./components/download/Download";
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
            <Route path='/download/:id'>
              <Download />
            </Route>
          </Switch>
        </Router>
      </div>
    </Context.Provider>
  );
}

export default App;
