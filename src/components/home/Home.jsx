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

function Navbar() {
  const state = useContext(Context);
  const [pct, setPct] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [emailSent, setEmailSent] = useState();
  const start = Date.now();
  async function uploadToTableland() {
    setWriting(true);
    // Establish a connection
    const tableland = await connect({ network: "testnet" });

    // Create a table
    // let { name } = await tableland.create(
    //   `id text, receiver text,  fileCid text, creator text,  primary key (id)`,
    //   `warp`,
    // );

    // console.log(await name);

    const name = "warp_5_214";

    // // Wait for the table to be created, then query
    const writeRes = await tableland.write(
      `INSERT INTO ${name} VALUES (${start},'${state.database.receiverWallet}', '${state.database.fileUrl}', '${state.database.wallet}');`,
    );

    // Wait for the write to complete
    console.log(await writeRes.hash);

    setWriting(false);

    sendMail();
    // Query the table
    const readRes = await tableland.read(`SELECT * FROM ${name};`);
    console.log(await readRes);
  }

  async function sendMail() {
    setSending(true);
    const templateParams = {
      from_name: state.database.wallet,
      to_name: state.database.receiverMail,
      message: start,
      wallet: state.database.receiverWallet,
      reply_to: "rushikeshkardile9@gmail.com",
    };

    //let data = { email: myData.email };
    axios({
      method: "POST",
      url: `https://warp-backend.herokuapp.com/send`,
      data: templateParams,
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("authtoken"),
      },
    })
      .then((res) => {
        if (res.status === 201) {
          setSending(false);
          setEmailSent(true);
          console.log("Email sent", res);
        }
        //setIsMailVerified(true);
      })
      .catch(function (error) {
        //console.log(error);
        setSending(false);

        setEmailSent(false);
      });
  }

  async function readTablelandData(tableName) {
    // Establish a connection
    const tableland = await connect({ network: "testnet" });
    const receiptRes = await tableland.receipt(
      "0x867b803a36feeb7ff35f5331f74fcee8bd837ed0d06c866423c7884a0dc83320",
    );
    console.log(receiptRes);
    const readRes = await tableland.read(`SELECT * FROM ${tableName};`);
    console.log(await readRes);
  }

  return (
    <div className='bg-base-200 flex  h-full p-5'>
      <ul class='steps steps-vertical flex flex-col '>
        <li class='step step-primary'>
          <p className='flex gap-4'>
            Connect Wallet{" "}
            <IconWallet
              onClick={() =>
                state.setDatabase({ ...state.database, wallet: <Wallet /> })
              }
            />
          </p>
        </li>
        <li class='step step-primary'>Choose Files to upload</li>
        <li class='step step-primary'>Enter receiver's Wallet Address</li>
        <li class='step step-primary'>Enter receiver's Mail Address</li>
        <li class='step step-primary'>Celebrate✨</li>
      </ul>
    </div>
  );
}

export default Navbar;
