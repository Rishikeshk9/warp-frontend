import { useState, createContext, useContext, useEffect } from "react";
import { useParams, useRouteMatch } from "react-router";
import { connect } from "@tableland/sdk";

import { Context } from "../../App";
import { fail } from "assert";

function Download() {
  const state = useContext(Context);
  const [authWallet, setAuthWallet] = useState();
  let params = useParams();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function readTablelandData() {
      // Establish a connection
      const tableland = connect({ network: "testnet",  chain: 'polygon-mumbai' });

      const readRes = await tableland.read(`SELECT * FROM warp_5_214;`);

      const data = await readRes.rows;

      data.forEach((row) => {
        //console.log("Finding row: ", row);
        if (row[0].toString() === params.id) {
          console.log("Found", row);
          state.setDatabase({ ...state.database, fileUrl: row[2] });
          setAuthWallet(row[1]);
          setLoaded(true);
          return;
        }
        return;
      });
    }
    readTablelandData();
  }, [state.database.signer]);

  return (
    <div className=' items-center'>
      <div className=' '>
        <div className='card w-max bg-neutral text-neutral-content mx-auto items-center mt-12'>
          <div className='card-body items-center text-center'>
            <h2 className='card-title'>Hola!</h2>
            <p>
              Connect the wallet which was sent to you in mail to get Download
              Access.
            </p>
            <div className='hidden'>Read Table</div>
            <div className='card-actions justify-end'>
              <a
                target={"_blank"}
                rel={"noopener noreferrer"}
                href={`https://${state.database.fileUrl}.ipfs.dweb.link`}
                className={
                  state.database.wallet == authWallet
                    ? "  btn btn-primary"
                    : " hidden"
                }>
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Download;
