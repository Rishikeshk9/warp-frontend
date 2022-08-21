import { useState, useContext } from "react";

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
    // Send a message
    await conversation.send(message);
    // Listen for new messages in the conversation
    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.text}`);
    }
  }
  return (
    <>
      <input type='checkbox' id='new-chat-modal' class='modal-toggle' />
      <div class='modal'>
        <div class='modal-box relative'>
          <label
            htmlFor='new-chat-modal'
            class='btn btn-sm btn-circle absolute right-2 top-2'>
            ✕
          </label>

          <div class='form-control w-full max-w-xs'>
            <label class='label'>
              <span class='label-text'>Message To</span>
            </label>
            <input
              type='text'
              placeholder='Wallet Address'
              onChange={(e) => setMessageTo(e.target.value)}
              value={messageTo}
              class='input input-bordered w-full max-w-xs'
            />
          </div>
          <div class='form-control w-full max-w-xs mt-2'>
            <label class='label'>
              <span class='label-text'>Message</span>
            </label>
            <input
              type='text'
              placeholder='Wallet Address'
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              class='input input-bordered w-full max-w-xs'
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={message && messageTo ? false : true}
            class='btn btn-primary mt-2'>
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Modal;
