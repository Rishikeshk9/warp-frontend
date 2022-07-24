import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Context } from "../../App";

function Wallet() {
  const [address, setAddress] = useState(null);
  const state = useContext(Context);

  //  Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
  });

  useEffect(() => {
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      provider, // required
    });

    const getWeb3 = async () => {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log(address);
      setAddress(address);
      state.setDatabase({
        ...state.database,
        wallet: address,
      });
      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        console.log(accounts);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        console.log(chainId);
      });

      // Subscribe to session connection
      provider.on("connect", () => {
        console.log("connect");
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
      });
    };
    getWeb3();
  }, [provider]);

  return address;
}

export default Wallet;
