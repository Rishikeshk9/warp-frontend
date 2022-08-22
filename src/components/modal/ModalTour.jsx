import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import logo from "../../logos/Warp.svg";

function Modal() {
  const state = useContext(Context);

  return (
    <>
      <label
        htmlFor='modal-tour'
        className='cursor-pointer border border-1.5 font-semibold border-gray-600   rounded-lg w-fit  px-4 py-1 hover:bg-primary hover:border-primary hover:text-white'>
        Take a Tour
      </label>
      {/* <label htmlFor='modal-tour' className='btn modal-button'>
        open modal
      </label> */}

      <input type='checkbox' id='modal-tour' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='modal-tour'
            className='btn btn-sm btn-circle absolute right-2 top-2'>
            ✕
          </label>
          <img className='w-36' src={logo}></img>
          <h3 className='text-lg font-bold'>
            Super fast decentralized file sharing
          </h3>
          <ul className='steps steps-vertical'>
            <li
              className={`step ${
                state.database.wallet ? "step-primary" : null
              }`}>
              Connect wallet
            </li>
            <li
              className={`step ${
                state.database.fileUrl ? "step-primary" : null
              }`}>
              Choose a file to share
            </li>
            <li
              className={`step ${
                state.database.receiverWallet ? "step-primary" : null
              }`}>
              Enter Receiver's Wallet ID
            </li>
            <li className='step'>Hit Send</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Modal;
