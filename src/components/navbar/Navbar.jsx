import { IconChevronLeft, IconWallet } from "@tabler/icons";
import React, { useContext, useState } from "react";
import { Context } from "../../App";
import Wallet from "../wallet/Wallet";
import IpfsUpload from "../modal/IPFS/IpfsUpload";
import { connect } from "@tableland/sdk";
import axios from "axios";
import logo from "../../logos/Warp.svg";

function Navbar() {
  const state = useContext(Context);
  const [pct, setPct] = useState(0);
  const connectWallet = Wallet();
  const [uploading, setUploading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState();
  const start = Date.now();
  async function uploadToTableland() {
    setWriting(true);
    // Establish a connection
    const tableland = connect({ network: "testnet",  chain: 'polygon-mumbai'  });

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

    //sendMail();
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
    const tableland = connect({ network: "testnet",  chain: 'polygon-mumbai'  });
    const receiptRes = await tableland.receipt(
      "0x867b803a36feeb7ff35f5331f74fcee8bd837ed0d06c866423c7884a0dc83320",
    );
    console.log(receiptRes);
    const readRes = await tableland.read(`SELECT * FROM ${tableName};`);
    console.log(await readRes);
  }

  return (
    <div className='navbar bg-primary shadow   top-0 z-50 sticky '>
      <div className='flex-1 mx-4 '>
        <img className='h-full w-36  ' src={logo}></img>
      </div>
      <div className='flex-none'>
        <div className='dropdown dropdown-end'>
          <label tabIndex='0' className='btn btn-ghost btn-circle'>
            <div className='indicator'>
              <IconWallet onClick={() => connectWallet()} />
              <span
                className={`badge badge-sm indicator-item ${
                  state.database.wallet ? "badge-success" : "badge-error"
                }`}></span>
            </div>
          </label>
          <div
            tabIndex='0'
            className='mt-3 card card-compact dropdown-content  bg-base-100 shadow'>
            <div className='card-body bg-slate-400 text-base-300 px-4 w-max'>
              <span className='font-bold '>
                Wallet ID : {state.database.wallet}
              </span>
            </div>
          </div>
        </div>

        {state.database.wallet.length > 1 ? (
          <>
            <label
              htmlFor='my-modal-3'
              className='btn modal-button bg-white text-warp-primary hidden'>
              Upload Files
            </label>
          </>
        ) : null}

        <input type='checkbox' id='my-modal-3' className='modal-toggle' />
        <div className='modal'>
          <div className='modal-box relative w-full'>
            <ul className='steps w-full'>
              <li
                className={
                  state.database.activeTab >= 0
                    ? " step step-primary"
                    : " step "
                }>
                Upload File
              </li>
              <li
                className={
                  state.database.activeTab >= 1
                    ? " step step-primary"
                    : " step "
                }>
                Wallet
              </li>
              {/* <li
                className={
                  state.database.activeTab >= 2
                    ? " step step-primary"
                    : " step "
                }>
                Mail
              </li> */}
              <li
                className={
                  state.database.activeTab >= 2
                    ? " step step-primary"
                    : " step "
                }>
                Done
              </li>
            </ul>

            {state.database.activeTab > 0 ? (
              <label
                onClick={() =>
                  state.setDatabase({
                    ...state.database,
                    activeTab: (state.database.activeTab -= 1),
                  })
                }
                className='btn btn-sm btn-circle absolute left-2 top-2'>
                <IconChevronLeft />
              </label>
            ) : null}

            <label
              htmlFor='my-modal-3'
              className='btn btn-sm btn-circle absolute right-2 top-2'>
              ✕
            </label>

            <div
              className={state.database.activeTab === 0 ? "block" : "hidden"}>
              <IpfsUpload
                setPct={setPct}
                setUploading={setUploading}
                pct={pct}
                uploading={uploading}
              />

              <button onClick={() => readTablelandData("warp_5_214")}>
                Read Tableland Data
              </button>
            </div>

            <div
              className={state.database.activeTab === 1 ? "block" : "hidden"}>
              <h3 className='text-lg font-bold '>
                Enter receiver's wallet Address🪐
              </h3>

              <input
                type='text'
                onChange={(e) => {
                  state.setDatabase({
                    ...state.database,
                    receiverWallet: e.target.value,
                  });
                }}
                multiple
                value={state.database.receiverWallet}
                placeholder='Wallet Address'
                className='input input-bordered w-full max-w-xs my-4'
              />

              <button
                className='btn btn-success mx-2'
                onClick={() => {
                  state.setDatabase({
                    ...state.database,
                    activeTab: (state.database.activeTab += 1),
                  });
                  uploadToTableland();
                }}>
                Next
              </button>
            </div>

            {/* <div
              className={state.database.activeTab === 2 ? "block " : "hidden"}>
              <h3 className='text-lg font-bold '>Enter receiver's Mail ID🪐</h3>

              <div className='flex    '>
                <input
                  type='text'
                  onChange={(e) => {
                    state.setDatabase({
                      ...state.database,
                      receiverMail: e.target.value,
                    });
                  }}
                  multiple
                  placeholder='abc@xyz.com'
                  className='input input-bordered w-full max-w-xs my-4 align-middle  '
                />
                <button
                  className='btn btn-success mx-2 align-middle my-4 '
                  onClick={() => {
                    state.setDatabase({
                      ...state.database,
                      activeTab: (state.database.activeTab += 1),
                    });
                    uploadToTableland();
                  }}>
                  Next
                </button>

                <button
                  className=' btn  mx-2 my-4 flex'
                  onClick={() =>
                    state.setDatabase({
                      ...state.database,
                      activeTab: (state.database.activeTab -= 1),
                    })
                  }>
                  Go Back
                </button>
              </div>
            </div> */}

            <div
              className={state.database.activeTab === 2 ? "block" : "hidden"}>
              <h3 className='text-lg font-bold '>Confirming 🪐</h3>
              <div>
                Uploading Files to IPFS ✔️
                <a
                  className='text-primary underline'
                  rel={"noreferrer noopener"}
                  target={"_blank"}
                  href={`https://${state.database.fileUrl}.ipfs.dweb.link`}>
                  Test Link
                </a>
              </div>
              <div className='flex items-center'>
                Creating Tabeland entry{" "}
                {writing ? (
                  <div className='btn btn-ghost loading '></div>
                ) : (
                  <span>✔️</span>
                )}
              </div>
              <p>
                Sending Mail{" "}
                {sending ? (
                  <div className='btn btn-ghost loading '></div>
                ) : emailSent ? (
                  <span>✔️</span>
                ) : emailSent === false ? (
                  <span>❌ failed</span>
                ) : null}
              </p>
              {emailSent ? <p>Done </p> : null}
            </div>
          </div>
        </div>
        <div className='dropdown dropdown-end hidden'>
          <label tabIndex='0' className='btn btn-ghost btn-circle avatar'>
            <div className='w-10 rounded-full'>
              <img src='https://placeimg.com/80/80/people' />
            </div>
          </label>
          <ul
            tabIndex='0'
            className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'>
            <li>
              <a className='justify-between'>
                Profile
                <span className='badge'>New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
