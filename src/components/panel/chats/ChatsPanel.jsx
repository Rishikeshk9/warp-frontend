import {
  IconArrowBack,
  IconArrowBarLeft,
  IconChevronLeft,
  IconWallet,
} from "@tabler/icons";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Context } from "../../../App";

function ChatsPanel() {
  const state = useContext(Context);

  // useEffect(() => {

  //   return () => {
  //     second
  //   }
  // }, [third])

  return (
    <div className='  h-full '>
      {/*   */}
      {state.database.contacts.map((contact, index) => {
        return (
          <div
            className='border-b-2 border-opacity-5 border-white p-3 cursor-pointer'
            key={index}>
            <div className='flex items-center gap-4'>
              <button className='btn btn-circle'></button>
              <p className='font-bold'>{contact}</p>
            </div>
            <div className='flex items-center gap-4 ml-2'>
              <p>Hey How are you {contact} ?</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatsPanel;
