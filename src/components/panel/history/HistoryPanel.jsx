import {
  IconArrowBack,
  IconArrowBarLeft,
  IconChevronLeft,
  IconWallet,
} from "@tabler/icons";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Context } from "../../../App";
import To from "../../../logos/icons/to.svg";
import From from "../../../logos/icons/from.svg";
import { connect } from "@tableland/sdk";

function HistoryPanel() {
  const state = useContext(Context);

  async function readTablelandData(tableName) {
    // Establish a connection
    const tableland = await connect({ network: "testnet" });
    // const receiptRes = await tableland.receipt(
    //   "0x867b803a36feeb7ff35f5331f74fcee8bd837ed0d06c866423c7884a0dc83320",
    // );
    // console.log(receiptRes);
    const readRes = await tableland.read(`SELECT * FROM ${tableName};`);
    console.log(await readRes);
  }

  return (
    <div className='  h-full '>
      <button
        onClick={() => readTablelandData("warp_5_214")}
        className=' border border-1.5 font-semibold border-gray-600   rounded-lg w-fit  px-4 py-1 hover:bg-primary hover:border-primary hover:text-white'>
        Refresh
      </button>
      {state.database.history.map((history, index) => {
        return history[3] === state.database.wallet ? (
          <div
            className='border-b-2 border-opacity-5 border-white p-3'
            key={index}>
            <div className='flex items-center gap-4'>
              <p className='font-bold text-slate-200'>Filename.exe</p>
              <a
                target={"_blank"}
                href={`https://${history[2]}.ipfs.dweb.link`}
                className=' text-sm cursor-pointer underline text-yellow-400'>
                view
              </a>
            </div>
            <div className='flex items-center gap-4  '>
              <div className='mr-2 flex '>
                <img src={To} className='h-6 w-6'></img>
                <span className='text-slate-200'>To:</span>{" "}
                {history[1].slice(0, 6)}...
                {history[1].slice(history[1].length - 2, history[1].length)}
              </div>
              <p className=' '>04:20 pm </p>
              &middot;
              <p className=' '>25/12/2022</p>
            </div>
          </div>
        ) : history[1] === state.database.wallet ? (
          <div
            className='border-b-2 border-opacity-5 border-white p-3'
            key={index}>
            <div className='flex items-center gap-4'>
              <p className='font-bold text-slate-200'>Filename.exe</p>
              <a
                target={"_blank"}
                href={`https://${history[2]}.ipfs.dweb.link`}
                className=' text-sm cursor-pointer underline text-yellow-400'>
                view
              </a>
            </div>
            <div className='flex items-center gap-4  '>
              <div className='mr-2 flex '>
                <img src={From} className='h-6 w-6'></img>
                <span className='text-slate-200'>From:</span>{" "}
                {history[3].slice(0, 6)}...
                {history[3].slice(history[1].length - 2, history[1].length)}
              </div>
              <p className=' '>04:20 pm </p>
              &middot;
              <p className=' '>25/12/2022</p>
            </div>
          </div>
        ) : (
          <></>
        );
      })}
    </div>
  );
}

export default HistoryPanel;
