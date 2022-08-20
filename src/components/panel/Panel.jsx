import {
  IconArrowBack,
  IconArrowBarLeft,
  IconChevronLeft,
  IconWallet,
} from "@tabler/icons";
import React, { useContext, useState } from "react";
import { Context } from "../../App";
import Wallet from "../wallet/Wallet";
import { Web3Storage } from "web3.storage";
import IpfsUpload from "../modal/IPFS/IpfsUpload";
import { connect } from "@tableland/sdk";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { useFilePicker } from "use-file-picker";
import ContactsPanel from "../panel/contacts/ContactsPanel";
import ChatsPanel from "./chats/ChatsPanel";
import HistoryPanel from "./history/HistoryPanel";
function Panel() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className='border-l-2 border-opacity-5 border-white h-screen p-4'>
      <div className='tabs tabs-boxed w-fit  '>
        <a
          onClick={() => setActiveTab(0)}
          className={`tab   text-lg ${activeTab == 0 ? "tab-active" : ""}`}>
          Contacts
        </a>
        <a
          onClick={() => setActiveTab(1)}
          className={`tab   text-lg ${activeTab == 1 ? "tab-active" : ""}`}>
          Chats
        </a>
        <a
          onClick={() => setActiveTab(2)}
          className={`tab   text-lg ${activeTab == 2 ? "tab-active" : ""}`}>
          History
        </a>
      </div>
      <div>
        {activeTab == 0 && <ContactsPanel />}
        {activeTab == 1 && <ChatsPanel />}

        {activeTab == 2 && <HistoryPanel />}
      </div>
    </div>
  );
}

export default Panel;
