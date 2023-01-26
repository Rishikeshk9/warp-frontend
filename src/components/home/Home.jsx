import {
	IconArrowBack,
	IconArrowBarLeft,
	IconChevronLeft,
	IconWallet,
	IconCopy,
	IconShare,
} from '@tabler/icons';
import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../../App';
import Wallet from '../wallet/Wallet';
import { Web3Storage } from 'web3.storage';
import IpfsUpload from '../modal/IPFS/IpfsUpload';
import { connect } from '@tableland/sdk';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { useFilePicker } from 'use-file-picker';
import Rocket from '../../logos/icons/Rocket.svg';
import Panel from '../panel/Panel';
import Download from '../download/Download';
import ModalTour from '../modal/ModalTour';
function Navbar() {
	const state = useContext(Context);
	const [pct, setPct] = useState(0);

	const [uploading, setUploading] = useState(false);
	const [writing, setWriting] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(false);
	const [txnhash, setTxnhash] = useState('');
	const [emailSent, setEmailSent] = useState();

	const [time, setTime] = useState(Date.now());
	const [processing, setProcessing] = useState(false);

	const [openFileSelector, { filesContent, loading, plainFiles }] =
		useFilePicker({
			accept: ['.json', '.pdf', '.txt', '.csv', '.exe'],
			multiple: false,
		});

	useEffect(() => {
		if (plainFiles && !loading) {
			storeWithProgress(plainFiles[0]);
		}
	}, [plainFiles, loading]);

	useEffect(() => {}, [state.database.signer]);

	if (loading) {
		console.log('Loading...');
	}

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
				console.log('uploading files with cid ->', cid);
				filecid = cid;
			};
			console.log(Object.keys(files).map((f) => files[f]));
			//console.log(Object.keys(files).map((f) => files[f].size));
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
						fileUrl: filecid,
						fileName: files[0].name,
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

	async function uploadToTableland() {
		setTime(Date.now());
		setProcessing(true); // show the processing spinner
		setWriting(true);
		// Establish a connection
		const tableland = connect({ network: 'testnet', chain: 'polygon-mumbai' });
		await tableland.siwe();
    const tables = await tableland.list();
		// Create a table
		// let { name1 } = await tableland.create(
		// 	`id text, filename text, receiver text,  fileCid text, creator text,  primary key (id)`,
		// 	{ prefix: `warp` }
		// );

		console.log(tables);

		const name = process.env.REACT_APP_TABLELAND_NAME;
		console.log(time);
		// // Wait for the table to be created, then query
		const writeRes = await tableland.write(
			`INSERT INTO ${name} VALUES (${time},'${state.database.fileName}','${state.database.receiverWallet}', '${state.database.fileUrl}', '${state.database.wallet}');`
		);

		// Wait for the write to complete
		console.log(await writeRes.hash);
		setTxnhash(await writeRes.hash);
		setWriting(false);

		if (state.database.receiverMail.length > 5) sendMail();

		// Query the table
		const readRes = await tableland.read(`SELECT * FROM ${name};`);
		console.log(await readRes);
	}

	async function sendMail() {
		setSending(true);
		const templateParams = {
			from_name: state.database.wallet,
			to_name: state.database.receiverMail,
			message: time,
			wallet: state.database.receiverWallet,
			reply_to: 'rushikeshkardile9@gmail.com',
		};

		//let data = { email: myData.email };
		axios({
			method: 'POST',
			url: `https://warp-backend.herokuapp.com/send`,
			data: templateParams,
			headers: {
				'content-type': 'application/json',
				'auth-token': localStorage.getItem('authtoken'),
			},
		})
			.then((res) => {
				if (res.status === 201) {
					setSending(false);
					setEmailSent(true);
					console.log('Email sent', res);
				}
				//setIsMailVerified(true);
			})
			.catch(function (error) {
				//console.log(error);
				setSending(false);

				setEmailSent(false);
			});
	}

	return (
		<div className="grid grid-cols-8  ">
			<div className="flex flex-col sm:col-span-3 col-span-8 gap-3   m-8">
				<div className=" grid  gap-3 ">
					<div className="text-slate-300 items-center flex gap-4">
						<span className="indicator-item badge badge-success">
							connected
						</span>

						{state.database.wallet.slice(0, 6) +
							'...' +
							state.database.wallet.slice(
								state.database.wallet.length - 4,
								state.database.wallet.length
							)}
					</div>
					<div className="flex gap-4 items-center">
						<p className="  opacity-70 ">Have trouble figuring it out?</p>
						<ModalTour />
					</div>

					<div className="divider my-1 w-2/3"></div>

					<div className="flex w-full hidden">
						<div className="flex items-center">
							<div
								className=" bg-slate-500 px-4 py-1 rounded-lg text-white cursor-pointer font-semibold   "
								onClick={() => openFileSelector()}
							>
								Select files{' '}
							</div>
							{filesContent.map((file, index) => (
								<div className="mx-2">
									<h2>{file.name}</h2>
									{/* <div key={index}>{file.content}</div> */}
								</div>
							))}
						</div>
					</div>
					<input
						type="file"
						onChange={(e) => {
							storeWithProgress(e.target.files);
						}}
						multiple
						placeholder="Type here"
						className="input w-fit"
					/>
					<div className={`${uploading ? 'block' : 'hidden'}`}>
						<progress
							className="progress progress-success w-56"
							value={pct.toFixed(2) * 100}
							max="100"
						></progress>

						<p>{pct && uploading ? `${pct.toFixed(2) * 100}% complete` : ''}</p>
					</div>
					<input
						type="text"
						onChange={(e) => {
							state.setDatabase({
								...state.database,
								receiverWallet: e.target.value,
							});
						}}
						disabled={pct.toFixed(2) * 100 > 99 ? false : true}
						value={state.database.receiverWallet}
						placeholder="Receiver Wallet Address"
						className="input input-bordered w-full max-w-xs "
					/>

					<input
						type="text"
						onChange={(e) => {
							state.setDatabase({
								...state.database,
								receiverMail: e.target.value,
							});
						}}
						disabled={state.database.receiverWallet.length < 16}
						placeholder="Mail ID of the receiver (optional)"
						className="input input-bordered w-full max-w-xs  align-middle  "
					/>

					<button
						disabled={
							state.database.receiverWallet.length < 16 ||
							state.database.fileUrl.length < 2
						}
						onClick={() => uploadToTableland()}
						className="btn w-32  btn-primary  btn-md "
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 transform rotate-45 pb-1 mr-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
						Send
					</button>
					<div className={processing ? 'block' : 'hidden'}>
						<h3 className="text-lg font-bold ">WAGMI 🚀</h3>
						<div>
							Uploading Files to IPFS ✔️
							<a
								className="opacity-60 underline"
								rel={'noreferrer noopener'}
								target={'_blank'}
								href={`https://${state.database.fileUrl}.ipfs.dweb.link`}
							>
								Test Link
							</a>
						</div>
						<div className="flex items-center">
							Creating Tabeland entry{' '}
							{writing ? (
								<div className="btn btn-ghost loading "></div>
							) : (
								<>
									<span>✔️</span>
									<a
										className="  underline opacity-60"
										rel={'noreferrer noopener'}
										target={'_blank'}
										href={`https://goerli.etherscan.io/tx/${txnhash}`}
									>
										Check TxnHash
									</a>{' '}
								</>
							)}
						</div>
						{state.database.receiverMail.length > 0 ? (
							<p>
								Sending Mail{' '}
								{sending ? (
									<div className="btn btn-ghost loading "></div>
								) : emailSent ? (
									<span>✔️</span>
								) : emailSent === false ? (
									<span>❌ failed</span>
								) : null}
							</p>
						) : null}

						{emailSent || !writing ? (
							<div className="flex gap-2 items-center">
								<a
									className="bg-base-200 border hover:bg-primary hover:border-primary transition-all duration-200 px-4 rounded-lg flex py-1 gap-2 my-1"
									rel={'noreferrer noopener'}
									target={'_blank'}
									href={`https://warp-frontend-xi.vercel.app/download/` + time}
								>
									Share
									<IconShare />
								</a>{' '}
							</div>
						) : null}
					</div>
				</div>
			</div>
			<div className="sm:col-span-5 col-span-8 flex flex-col h-full">
				<Panel />
			</div>
			<div className="bg-base-200 flex  h-full p-5 hidden">
				<ul className="steps steps-vertical flex flex-col ">
					<li className="step step-primary">
						<p className="flex gap-4">
							Connect Wallet{' '}
							<IconWallet
								onClick={() =>
									state.setDatabase({ ...state.database, wallet: <Wallet /> })
								}
							/>
						</p>
					</li>
					<li className={`step ${state.database.wallet ? 'step-primary' : ''}`}>
						Choose Files to upload
					</li>
					<li
						className={`step ${state.database.fileUrl ? 'step-primary' : ''}`}
					>
						Enter receiver's Wallet Address
					</li>
					<li
						className={`step ${
							state.database.receiverWallet ? 'step-primary' : ''
						}`}
					>
						Celebrate✨
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Navbar;
