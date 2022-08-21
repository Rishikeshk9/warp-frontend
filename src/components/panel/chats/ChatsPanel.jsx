import {
  IconArrowBack,
  IconArrowBarLeft,
  IconChevronLeft,
  IconWallet,
} from "@tabler/icons";
import React, { useContext, useState } from "react";
import { Context } from "../../../App";
import ModalNewChat from "../../modal/ModalNewChat";

function ChatsPanel() {
  const state = useContext(Context);

  return (
    <div className='  h-full '>
      {/*   */}

      <label
        htmlFor='new-chat-modal'
        className='cursor-pointer border border-1.5 font-semibold border-gray-600   rounded-lg w-fit  px-4 py-1 hover:bg-primary hover:border-primary hover:text-white'>
        New Chat
      </label>

      {state.database.conversations &&
        state.database.conversations.map((contact, index) => {
          return (
            <div
              className='border-b-2 border-opacity-5 border-white p-3 cursor-pointer'
              key={index}>
              <div className='flex items-center gap-4'>
                <div class='avatar'>
                  <div class='w-10 rounded-full'>
                    <img src='https://placeimg.com/192/192/people' />
                  </div>
                </div>
                <p className='font-bold'>{contact.peerAddress}</p>
              </div>
              <div className='flex items-center gap-4 ml-2 hidden'>
                <p>Hey How are you ?</p>
              </div>
            </div>
          );
        })}

      <ModalNewChat />
    </div>
  );
}

export default ChatsPanel;
