import { Web3Storage } from "web3.storage";
import React, { useContext, useState } from "react";
import { Context } from "../../../App";

function IpfsUpload({ uploading, setUploading, pct, setPct }) {
  const state = useContext(Context);

  function getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.REACT_APP_WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }
  async function storeWithProgress(files) {
    if (files) {
      setUploading(true);
      let filecid = null;
      // show the root cid as soon as it's ready
      const onRootCidReady = (cid) => {
        console.log("uploading files with cid ->", cid);
        filecid = cid;
      };
      console.log(Object.keys(files).map((f) => files[f].size));
      // when each chunk is stored, update the percentage complete and display
      const totalSize = Object.keys(files)
        .map((f) => files[f].size)
        .reduce((a, b) => a + b, 0);
      let uploaded = 0;

      const onStoredChunk = (size) => {
        uploaded += size;
        const pct = totalSize / uploaded;
        console.log(pct, size, totalSize, uploaded);
        setPct(pct);
        console.log(`Uploading... ${pct.toFixed(2) * 100}% complete`);
        if (pct.toFixed(2) >= 1) {
          state.setDatabase({
            ...state.database,
            activeTab: 1,
            fileUrl: filecid,
          });
        }
      };

      // makeStorageClient returns an authorized Web3.Storage client instance
      const client = makeStorageClient();

      // client.put will invoke our callbacks during the upload
      // and return the root cid when the upload completes
      return client.put(files, { onRootCidReady, onStoredChunk });
    }
  }
  return (
    <>
      <h3 className='text-lg font-bold '>Upload Files to IPFS🪐</h3>

      <input
        type='file'
        onChange={(e) => {
          storeWithProgress(e.target.files);
        }}
        multiple
        placeholder='Type here'
        className='input    my-4'
      />
      <div className={`${uploading ? "block" : "hidden"}`}>
        <progress
          className='progress progress-primary w-56'
          value={pct}
          max='1'></progress>
        <p>{pct && uploading ? `${pct.toFixed(2) * 100}% complete` : ""}</p>
      </div>
    </>
  );
}

export default IpfsUpload;
