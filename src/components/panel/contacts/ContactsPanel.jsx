import {
  IconArrowBack,
  IconArrowBarLeft,
  IconChevronLeft,
  IconWallet,
} from "@tabler/icons";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Context } from "../../../App";

function Panel() {
  const state = useContext(Context);

  // return (
  //   <div className='  h-full '>
  //     <div className='border-b-2 border-opacity-5 border-white py-3  '>
  //       <button className=' border border-1.5 font-semibold border-gray-600   rounded-lg w-fit  px-4 py-1 hover:bg-primary hover:border-primary hover:text-white'>
  //         Add Contact
  //       </button>
  //     </div>
  //     {state.database.contacts.map((contact, index) => {
  //       return (
  //         <div
  //           className='border-b-2 border-opacity-5 border-white p-3'
  //           key={index}>
  //           <div className='flex items-center gap-4'>
  //             <div className='avatar'>
  //               <div className='w-10 rounded-full'>
  //                 <img src='https://placeimg.com/192/192/people' />
  //               </div>
  //             </div>
  //             <p className='font-bold'>{contact}</p>
  //           </div>
  //           <div className='flex items-center gap-4 ml-2'>
  //             <p>0x4201234567890000000</p>

  //             <button className=' border border-1.5 font-semibold border-gray-600   rounded-lg w-fit  px-4 py-1 hover:bg-primary hover:border-primary hover:text-white'>
  //               send files
  //             </button>
  //           </div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  return (
    <div className='  h-full p-4'>
      <p className='uppercase text-4xl font-semibold'>Coming Soon!</p>
    </div>
  );
}

export default Panel;
