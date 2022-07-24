import logo from "./logo.svg";
import "./App.css";
import { useState, createContext } from "react";
import Navbar from "./components/navbar/Navbar";

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
        <Navbar />
      </div>
    </Context.Provider>
  );
}

export default App;
