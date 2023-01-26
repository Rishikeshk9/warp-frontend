import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';
import { useEffect } from 'react';
import { useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers, providers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ChatBubble from './ChatBubble';
// Import `connect` from the Tableland library
import { connect } from '@tableland/sdk';

const Chat = () => {
	const [message, setMessage] = useState('');
	const [wallet, setWallet] = useState(null);
	const [web3Modal, setWeb3Modal] = useState(null);
	const [xmtp, setXmtp] = useState(null);
	const [chatHistory, setChatHistory] = useState([]);
	const [receipient, setReceipient] = useState('');
	let conversation = null;

	useEffect(() => {
		async function init() {
			const providerOptions = {
				/* See Provider Options Section */
				walletconnect: {
					package: WalletConnectProvider, // required
					options: {
						infuraId: '27e484dcd9e3efcfd25a83a78777cdf1', // required
					},
				},
			};

			const web3Modal = new Web3Modal({
				network: 'mainnet', // optional
				cacheProvider: false, // optional
				providerOptions, // required
				disableInjectedProvider: false,
			});

			setWeb3Modal(web3Modal);
		}

		init();
	}, []);

	useEffect(() => {
		//fetchConversations();
	}, [xmtp]);

	async function fetchConversations() {
		if (xmtp)
			for (const conversation of await xmtp.conversations.list()) {
				// All parameters are optional and can be omitted
				const opts = {
					// Only show messages from last 24 hours
					startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
					endTime: new Date(),
				};
				console.log(conversation);
				//setChatHistory(await conversation.messages(opts));
			}
	}

	async function connectWallet() {
		web3Modal.clearCachedProvider();
		const provider = await web3Modal.connect();
		const ethersProvider = new providers.Web3Provider(provider);
		const xmtpSigner = ethersProvider.getSigner();
		const userAddress = await ethersProvider.getSigner().getAddress();
		setWallet(userAddress);
		// Create the client with your wallet. This will connect to the XMTP development network by default
		setXmtp(await Client.create(xmtpSigner, { env: 'dev' }));

		// console.log(ethersProvider.getSigner());
		// Subscribe to accounts change
		provider.on('accountsChanged', (accounts) => {
			console.log(accounts);
		});

		// Subscribe to chainId change
		provider.on('chainChanged', (chainId) => {
			console.log(chainId);
		});

		// Subscribe to provider connection
		provider.on('connect', (info) => {
			console.log(info);
		});

		// Subscribe to provider disconnection
		provider.on('disconnect', (error) => {
			console.log(error);
		});
	}

	async function createGroup() {
		const randomWallet = Wallet.createRandom();

		console.log(randomWallet.address);
		const xmtp = await Client.create(randomWallet, { env: 'dev' });

		// // Start a conversation with Vitalik
		conversation = await xmtp.conversations.newConversation(wallet);
		await conversation.send('Welcome to the group');

		const messages = await conversation.messages();
		console.log(await messages);
	}

	async function fetchMsgs() {
		if (xmtp)
			for (const conversation of await xmtp.conversations.list()) {
				// All parameters are optional and can be omitted
				const opts = {
					// Only show messages from last 24 hours
					startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
					endTime: new Date(),
				};
				console.log(conversation);
				//setChatHistory(await conversation.messages(opts));
			}
	}

	async function sendMessage() {
		// Start a conversation with Vitalik
		conversation = await xmtp.conversations.newConversation(receipient);

		// Load all messages in the conversation
		const messages = await conversation.messages();
		// Send a message

		await conversation.send(message);
		setMessage(''); // Clear the message input

		// Listen for new messages in the conversation
		for await (const txt of await conversation.streamMessages()) {
			console.log(txt);
			console.log(txt.content);
		}
	}
	return (
		<div className="flex flex-col">
			<div className="flex bg-xmtp-blue p-2 w-full fixed top-0 items-center">
				<div className="   ">
					{wallet ? (
						wallet
					) : (
						<div
							className="bg-white p-3 rounded-full cursor-pointer hover:shadow-md"
							onClick={connectWallet}
						>
							{' '}
							connect
						</div>
					)}
				</div>
				<div
					className="bg-slate-100 px-3 rounded-full cursor-pointer"
					onClick={createGroup}
				>
					Create New Group
				</div>
				<div className="mx-4 flex bg-slate-300 w-full h-12 rounded-full  align-middle content-center items-center">
					<input
						placeholder="Receipient Address"
						value={receipient}
						onChange={(e) => setReceipient(e.target.value)}
						className="w-full rounded-full h-full p-6 focus:border-xtmtp-blue focus:outline-none"
					></input>
				</div>
				<div
					className="bg-slate-100 px-2 py-2 w-full flex cursor-pointer"
					onClick={fetchMsgs}
				>
					Fetch New Chats{' '}
				</div>
			</div>

			<div className="flex flex-col mb-24">
				{chatHistory.map((message, index) => {
					return (
						<ChatBubble
							key={index}
							message={message.content}
							sender={
								message.senderAddress.slice(0, 5) +
								'...' +
								message.senderAddress.slice(
									message.senderAddress.length - 3,
									message.senderAddress.length
								)
							}
							time={new Date(message.sent.toString()).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
							})}
						/>
					);
				})}
			</div>
			<div className="bg-base-300 fixed bottom-0 w-full p-4">
				<div className="   h-12 rounded-full flex align-middle content-center items-center">
					<input
						className="w-full rounded-full h-full p-6 focus:border-xtmtp-blue focus:outline-xmtp-blue"
						type={'text'}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message"
					></input>
					<div
						onClick={() => sendMessage()}
						className={`    mx-3 rounded-full px-3 py-2  ${
							message
								? 'bg-green-600 text-white cursor-pointer block'
								: 'bg-slate-100 hidden'
						}`}
					>
						send
					</div>
				</div>
			</div>
		</div>
	);
};
export default Chat;
