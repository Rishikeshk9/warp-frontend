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
import Rocket from "../../logos/icons/Rocket.svg";
function Navbar() {
  const state = useContext(Context);
  const [pct, setPct] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [emailSent, setEmailSent] = useState();
  const start = Date.now();

  const [activeTab, setActiveTab] = useState(0);

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    accept: [".json", ".pdf"],
    multiple: false,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

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
    <div className='grid grid-cols-8  h-screen'>
      <div className='flex flex-col sm:col-span-3 gap-3   m-8'>
        <div className=' grid  gap-3 '>
          <div className='flex gap-4 items-center'>
            <p className='  opacity-70 '>Have trouble figuring it out?</p>
            <button className=' border border-1.5 font-semibold border-gray-600   rounded-lg w-fit  px-4 py-1 hover:bg-primary hover:border-primary hover:text-white'>
              Take a Tour
            </button>
          </div>

          <div className='divider w-2/3'></div>

          <div className='flex w-full '>
            <div className='flex items-center'>
              <button
                className='btn btn-sm   '
                onClick={() => openFileSelector()}>
                Select files{" "}
              </button>
              {filesContent.map((file, index) => (
                <div className='mx-2'>
                  <h2>{file.name}</h2>
                  <div key={index}>{file.content}</div>
                </div>
              ))}
            </div>
          </div>

          <input
            type='text'
            placeholder='Receiver Wallet'
            className='input input-bordered input-primary w-full max-w-xs    '
          />
          <p className='underline underline-offset-4'>
            Enter email ID of the receiver
          </p>

          <button className='btn w-32  btn-primary  btn-lg '>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 transform rotate-45 pb-1 mr-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
              />
            </svg>
            Send
          </button>
          {uploading ? (
            <>
              <input
                type='range'
                min='0'
                max='100'
                value='40'
                className='range range-xs'
              />
              <div className='flex w-full justify-between'>
                <p className=''>{}% Done</p>
                <p className=''>Est Time : {}</p>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className='bg-base-200 flex  h-full p-5 hidden'>
        <ul className='steps steps-vertical flex flex-col '>
          <li className='step step-primary'>
            <p className='flex gap-4'>
              Connect Wallet{" "}
              <IconWallet
                onClick={() =>
                  state.setDatabase({ ...state.database, wallet: <Wallet /> })
                }
              />
            </p>
          </li>
          <li className={`step ${state.database.wallet ? "step-primary" : ""}`}>
            Choose Files to upload
          </li>
          <li
            className={`step ${state.database.fileUrl ? "step-primary" : ""}`}>
            Enter receiver's Wallet Address
          </li>
          <li
            className={`step ${
              state.database.receiverWallet ? "step-primary" : ""
            }`}>
            Celebrate✨
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
