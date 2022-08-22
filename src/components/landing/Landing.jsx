import { useEffect } from "react";
import Logo from "../../logos/logo-primary.svg";
import blueprint from "../../background/tutorial.png";
import { IconChevronLeft, IconWallet } from "@tabler/icons";
import Wallet from "../wallet/Wallet";

function Landing() {
  // useEffect(() => {

  //   return () => {
  //     second
  //   }
  // }, [third])
  const connectWallet = Wallet();

  return (
    <div className='  h-full grid grid-cols-8'>
      <div className='h-screen flex flex-col col-span-8 sm:col-span-3 px-12 bg-white items-left sm:px-36 md:px-24 lg:py-36   py-24 sm:border-r-4 border-dashed border-primary  '>
        <img src={Logo} className='h-52   w-fit'></img>
        <div className='text-[#39d4ff]  font-extrabold  my-4 lg:text-5xl md:text-4xl text-5xl mt-12'>
          <h1 className='uppercase '>The Super app</h1>
          <h1 className='  text-primary'>for sharing</h1>
          <h1>on Web3</h1>
        </div>
        <button
          onClick={() => connectWallet()}
          className='btn  btn-primary w-fit text-white font-bold text-xl uppercase'>
          Connect Wallet &nbsp;
          <IconWallet />
        </button>
      </div>

      <div className='col-span-5 sm:block hidden'>
        <img src={blueprint} className='h-screen w-full'></img>
      </div>
    </div>
  );
}

export default Landing;
