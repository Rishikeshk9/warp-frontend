import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";

import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Context } from "../../../App";

// You'll want to replace this with a wallet from your application
const wallet = Wallet.createRandom();
// Create the client with your wallet. This will connect to the XMTP development network by default
const xmtp = await Client.create(wallet);
// Start a conversation with Vitalik
const conversation = await xmtp.conversations.newConversation(
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
);
// Load all messages in the conversation
const messages = await conversation.messages();
// Send a message
await conversation.send("gm");
// Listen for new messages in the conversation
for await (const message of await conversation.streamMessages()) {
  console.log(`[${message.senderAddress}]: ${message.text}`);
}

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
              <div class='avatar'>
                <div class='w-10 rounded-full'>
                  <img src='https://placeimg.com/192/192/people' />
                </div>
              </div>
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
