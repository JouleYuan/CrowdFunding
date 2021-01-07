import web3 from '../utils/InitWeb3';

const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "projectCreator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "projectTitle",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "projectDescription",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectTarget",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectStartTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectDeadline",
				"type": "uint256"
			}
		],
		"name": "ProjectCreated",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "target",
				"type": "uint256"
			}
		],
		"name": "createProject",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getProjects",
		"outputs": [
			{
				"internalType": "contract Project[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
const address = '0x36a8D3CbF1dB36847371947374F508DFA62001f4';
const instance = new web3.eth.Contract(abi, address);

export default instance;