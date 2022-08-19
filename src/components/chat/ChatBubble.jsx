import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const ChatBubble = (props) => {
  return (
    <div className=' flex  mx-4 my-2 '>
      <div className='rounded-full bg-black h-12 w-12 min-w-max'> </div>

      <div className=' border-bg-slate-200 border bg-slate-100 p-2 mx-1 rounded-md max-w-sm'>
        <div className='flex items-center'>
          <div className='bg-slate-200   px-3 rounded-full  border '>
            {props.sender}
          </div>
          <div className='mx-1 text-sm'>{props.time}</div>
        </div>
        <div className='flex mx-2 text-black'>{props.message}</div>
      </div>
    </div>
  );
};
export default ChatBubble;
