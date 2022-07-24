import IPFSStorage from "../IPFS/IpfsUpload.jsx";
import { useState } from "react";

import IpfsUpload from "./IPFS/IpfsUpload";
function Modal({ setRefresh, refresh }) {
  const [pct, setPct] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <input type='checkbox' id='my-modal-3' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='my-modal-3'
            className='btn btn-sm btn-circle absolute right-2 top-2'>
            ✕
          </label>
          <div className='tabs mb-2'>
            <a
              className={`tab tab-lifted tab-active  `}
              onClick={() => setActiveTab(0)}>
              IPFS
            </a>
          </div>
          <div className={activeTab === 0 ? "block" : "hidden"}>
            <IpfsUpload
              setPct={setPct}
              setUploading={setUploading}
              pct={pct}
              uploading={uploading}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
