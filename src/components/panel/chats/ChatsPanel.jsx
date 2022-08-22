import {
  IconArrowBack,
  IconArrowBarLeft,
  IconChevronLeft,
  IconPlus,
  IconRefresh,
  IconWallet,
} from "@tabler/icons";
import React, { useContext, useState } from "react";
import { Context } from "../../../App";
import ModalNewChat from "../../modal/ModalNewChat";
import ChatSingle from "./ChatsSingle";
function ChatsPanel() {
  const state = useContext(Context);
  const [person, setPerson] = useState();
  const [switchToChat, setSwitchToChat] = useState(false);

  async function fetchNewChats() {
    const allConversations = await state.database.xmtp.conversations.list();
    // Say gm to everyone you've been chatting with
    for (const conversation of allConversations) {
      console.log(`We have talked to ${conversation.peerAddress}`);
    }
  }
  async function openChat(address) {
    setPerson(address);
    setSwitchToChat(!switchToChat);
  }
  return switchToChat ? (
    <ChatSingle person={person} setSwitchToChat={setSwitchToChat} />
  ) : (
    <div className='  h-full p-4'>
      {/*   */}

      <div className='flex items-center'>
        <label
          htmlFor='new-chat-modal'
          className='flex gap-1 items-center cursor-pointer   font-semibold  btn-ghost p-1 rounded-lg bg-base-200 w-fit  px-2 py-1 hover:bg-primary hover:border-primary hover:text-white'>
          <IconPlus c /> New Chat
        </label>
        <button
          onClick={() => fetchNewChats()}
          className='  mx-4 btn-ghost p-1 rounded-lg bg-base-200'>
          <IconRefresh />
        </button>
      </div>
      <p className='m-2'>Recent Chats</p>
      {state.database.conversations &&
        state.database.conversations.reverse().map((contact, index) => {
          return (
            <div
              onClick={() => openChat(contact.peerAddress)}
              className='border-b-2 border-opacity-5 border-white p-3 cursor-pointer'
              key={index}>
              <div className='flex items-center gap-4'>
                <div className='avatar'>
                  <div className='w-10 rounded-full'>
                    <img src='https://placeimg.com/192/192/people' />
                  </div>
                </div>
                <p className='font-bold'>
                  {contact.peerAddress.slice(0, 6) +
                    "..." +
                    contact.peerAddress.slice(
                      contact.peerAddress.length - 4,
                      contact.peerAddress.length,
                    )}
                </p>
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
