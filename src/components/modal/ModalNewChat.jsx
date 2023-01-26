import { useState, useContext } from "react";
import { Client } from "@xmtp/xmtp-js";

import { Context } from "../../App";

function Modal() {
  const state = useContext(Context);

  const [messageTo, setMessageTo] = useState();
  const [message, setMessage] = useState();

  async function sendMessage() {
    console.log("sending : ", message, "To : ", messageTo);
    // Start a conversation with Vitalik
    console.log(state.database.xmtp);
    const conversation =
      await state.database.xmtp.conversations.newConversation(messageTo);
    console.log("conversation : ", conversation);
    // Send a message
    await conversation.send(message);

    async function fetchConversations() {
      const client = await Client.create(state.database.signer, { env: 'dev' });
      const allConversations = await client.conversations.list();
      // Say gm to everyone you've been chatting with
      for (const conversation of allConversations) {
        console.log(`We have talked to ${conversation.peerAddress}`);
      }
      updateState(allConversations);
    }
    async function updateState(allConversations) {
      //console.log(readRes, allConversations, xmtp);
      state.setDatabase({
        ...state.database,
        conversations: allConversations,
      });
    }
    fetchConversations();
  }
  return (
    <>
      <input type='checkbox' id='new-chat-modal' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='new-chat-modal'
            className='btn btn-sm btn-circle absolute right-2 top-2'>
            ✕
          </label>

          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Message To</span>
            </label>
            <input
              type='text'
              placeholder='Wallet Address'
              onChange={(e) => setMessageTo(e.target.value)}
              value={messageTo}
              className='input input-bordered w-full max-w-xs'
            />
          </div>
          <div className='form-control w-full max-w-xs mt-2'>
            <label className='label'>
              <span className='label-text'>Message</span>
            </label>
            <input
              type='text'
              placeholder='Greetings!'
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className='input input-bordered w-full max-w-xs'
            />
          </div>
          <label
            htmlFor='new-chat-modal'
            onClick={sendMessage}
            disabled={message && messageTo ? false : true}
            className='btn btn-primary mt-2'>
            Send
          </label>
        </div>
      </div>
    </>
  );
}

export default Modal;
