import {
	IconArrowBack,
	IconArrowBarLeft,
	IconChevronLeft,
	IconWallet,
} from '@tabler/icons';
import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../../App';
import ContactsPanel from '../panel/contacts/ContactsPanel';
import ChatsPanel from './chats/ChatsPanel';
import HistoryPanel from './history/HistoryPanel';
import { Client } from '@xmtp/xmtp-js';
import { connect } from '@tableland/sdk';

function Panel() {
	const [activeTab, setActiveTab] = useState(0);
	const state = useContext(Context);
	useEffect(() => {
		var readRes, allConversations, tableland, xmtp;
		async function readTablelandData(tableName) {
			// Establish a connection
			tableland = connect({ network: 'testnet', chain: 'polygon-mumbai' });

			readRes = await tableland.read(`SELECT * FROM ${tableName};`);
			//console.log(await readRes);
		}
		//warp_5_214
		async function createXMTPClient() {
			const client = await Client.create(state.database.signer, { env: 'dev' });

			readTablelandData(process.env.REACT_APP_TABLELAND_NAME).then(() => {
				fetchConversations(client).then(() => {
					updateState();
				});
			});

			// Create the client with an `ethers.Signer` from your application
		}

		async function fetchConversations(_xmtp) {
			xmtp = _xmtp;
			allConversations = await _xmtp.conversations.list();
			// Say gm to everyone you've been chatting with
			for (const conversation of allConversations) {
				console.log(`We have talked to ${conversation.peerAddress}`);
			}
		}
		async function updateState() {
			var revRows = readRes.rows.reverse();
			//console.log(readRes, allConversations, xmtp);
			state.setDatabase({
				...state.database,
				conversations: allConversations,
				xmtp: xmtp,
				history: revRows,
				tableland: tableland,
			});
		}
		state.database.xmtp && state.database.xmtp.length > 0
			? fetchConversations(state.database.xmtp)
			: createXMTPClient();
	}, [state.database.signer]);

	useEffect(() => {}, []);

	return (
		<div className="border-l-2 border-opacity-5 border-white   h-screen  ">
			<div className="tabs tabs-boxed w-fit m-4 ">
				<a
					onClick={() => setActiveTab(0)}
					className={`tab   text-lg ${
						activeTab == 0 ? 'tab-active font-semibold text-white ' : ''
					}`}
				>
					Chats
				</a>
				<a
					onClick={() => setActiveTab(1)}
					className={`tab   text-lg  ${
						activeTab == 1 ? 'tab-active font-semibold text-white' : ''
					}`}
				>
					History
				</a>
				<a
					onClick={() => setActiveTab(2)}
					className={`tab   text-lg ${
						activeTab == 2 ? 'tab-active font-semibold text-white' : ''
					}`}
				>
					Contacts
				</a>
			</div>
			<div className="   overflow-y-auto  ">
				<div>
					{activeTab == 0 && <ChatsPanel />}

					{activeTab == 1 && <HistoryPanel />}
					{activeTab == 2 && <ContactsPanel />}
				</div>
			</div>
		</div>
	);
}

export default Panel;
