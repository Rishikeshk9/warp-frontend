import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";

import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Context } from "../../../App";

function ChatsPanel({ person, setSwitchToChat }) {
  const state = useContext(Context);
  const [messages, setMessages] = useState();

  const [messageTo, setMessageTo] = useState();
  const [newMessage, setnewMessage] = useState();
  async function fetchConvo() {
    setMessageTo(person);

    const conversation =
      await state.database.xmtp.conversations.newConversation(person);

    const opts = {
      // Only show messages from last 24 hours
      startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
      endTime: new Date(),
    };
    const messagesInConversation = await conversation.messages(opts);
    setMessages(messagesInConversation);
    //   for await (const message of messagesInConversation) {
    //     console.log(message.content);
    //   }
    console.log(messagesInConversation);

    for await (const message of await conversation.streamMessages()) {
      if (message.senderAddress === state.database.xmtp.address) {
        // This message was sent from me
        continue;
      }

      console.log(
        `New message from ${message.senderAddress}: ${message.content}`,
      );
      fetchConvo();
    }
  }
  useEffect(() => {
    fetchConvo();
    console.log(person);
  }, [person]);

  useEffect(() => {}, []);

  async function sendMessage() {
    console.log("sending : ", newMessage, "To : ", messageTo);
    // Start a conversation with Vitalik

    const conversation =
      await state.database.xmtp.conversations.newConversation(messageTo);
    // Send a message
    await conversation.send(newMessage);
    setnewMessage("");
    fetchConvo();
  }

  return (
    <div className='  w-full h-full  '>
      <div className='w-full bg-primary p-4 flex items-center gap-4'>
        <button
          onClick={() => setSwitchToChat(false)}
          className='btn btn-circle btn-sm btn-ghost '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>{" "}
        <p className='text-lg text-white'>{person}</p>
      </div>

      <div className='p-4 '>
        {messages &&
          messages.map((message, index) => {
            return message.senderAddress === state.database.wallet ? (
              <div
                key={index}
                className='bg-base-300  px-4 py-2 w-fit rounded-lg ml-auto mr-0 my-1'>
                <p className=' '>{message.content}</p>
              </div>
            ) : (
              <div key={index} className='w-full'>
                <div className='bg-slate-600 text-white px-4 py-2 w-fit rounded-lg my-1'>
                  {message.content}
                </div>
              </div>
            );
          })}
      </div>
      <div className='bg-base-300 w-full p-4 flex gap-4 sticky-bottom bottom-0 relative'>
        <input
          type='text'
          placeholder='Type here'
          onChange={(e) => setnewMessage(e.target.value)}
          value={newMessage}
          className='input w-full max-w-screen'
        />
        <button
          disabled={!newMessage}
          onClick={() => sendMessage()}
          className='btn btn-circle'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 transform rotate-90'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatsPanel;
