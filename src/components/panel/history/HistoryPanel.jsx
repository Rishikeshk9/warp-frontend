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

function HistoryPanel() {
  const state = useContext(Context);

  // useEffect(() => {

  //   return () => {
  //     second
  //   }
  // }, [third])

  return (
    <div className='  h-full '>
      {state.database.contacts.map((contact, index) => {
        return (
          <div
            className='border-b-2 border-opacity-5 border-white p-3'
            key={index}>
            <div className='flex items-center gap-4'>
              <p className='font-bold text-slate-200'>Filename.exe</p>
              <p className=' text-sm cursor-pointer underline text-yellow-400'>
                view
              </p>
            </div>
            <div className='flex items-center gap-4  '>
              <div className='mr-2 flex '>
                <img src={To} classname='h-6 w-6'></img>
                <span className='text-slate-200'>To:</span> 0x42012...0000
              </div>
              <p className=' '>04:20 pm </p>
              &middot;
              <p className=' '>25/12/2022</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HistoryPanel;
