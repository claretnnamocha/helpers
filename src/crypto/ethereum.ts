import {
  Block,
  JsonRpcProvider,
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import * as ethers from 'ethers';
import Web3 from 'web3';
import {
  Amount,
  Wallet,
  GetBalance,
  ImportAddress,
  ImportAddressFromMnemonic,
  ImportAddressFromXPrv,
  MnemonicOnly,
  Network,
  SendEth,
  SendErc20,
  GetERC20Balance,
  GetTransaction,
} from '../types/crypto/ethereum';

const IERC20_ABI = [
  'event Transfer(address indexed from,' +
    ' address indexed to, uint256 value)',
  'event Approval(address indexed owner,' +
    ' address indexed spender, uint256 value)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function allowance(address owner, address' +
    ' spender) external view returns (uint256)',
  'function approve(address spender, uint256 ' +
    'amount) external returns (bool)',
  'function transferFrom(address from, address ' +
    'to, uint256 amount) external returns (bool)',
];

const getEthRpcLink = ({network = 'homestead'}: Network): string => {
  const {INFURA_API_KEY} = process.env;
  const subdomain = network === 'homestead' ? 'mainnet' : network;
  if (!INFURA_API_KEY) throw new Error('Please provide INFURA_API_KEY');
  return `https://${subdomain}.infura.io/v3/${INFURA_API_KEY}`;
};

const getProvider = ({network = 'homestead'}: Network): JsonRpcProvider => {
  const link: string = getEthRpcLink({network});
  return new JsonRpcProvider(link);
};

const getERC20Contract = ({contractAddress, signer}) => {
  return new ethers.Contract(contractAddress, IERC20_ABI, signer);
};

export const createEthAddress = (): Wallet => {
  const {address, privateKey} = ethers.Wallet.createRandom();
  return {address, privateKey};
};

export const importEthAddress = ({
  privateKey,
  network = 'homestead',
}: ImportAddress): Wallet => {
  const provider = getProvider({network});
  const {address} = new ethers.Wallet(privateKey, provider);

  return {address, privateKey};
};

export const estimateEthGasFee = async ({
  address,
  amount,
  network = 'homestead',
  privateKey,
}: SendEth): Promise<Amount> => {
  const to = Web3.utils.toChecksumAddress(address);
  const ether: any = ethers.utils.parseEther(amount.toString());
  const provider: JsonRpcProvider = getProvider({network});
  const {address: sender}: Wallet = importEthAddress({
    network,
    privateKey,
  });

  const balance: ethers.BigNumber = await provider.getBalance(sender);

  if (balance.lt(ether)) throw new Error('Insufficient balance');

  const value = ether.toHexString();
  const txObject = {to, value};
  const fee: any = await provider.estimateGas(txObject);
  const wei = fee.toNumber();
  const eths = wei / Math.pow(10, 18);

  return {wei, ethers: eths};
};

export const estimateERC20GasFee = async ({
  address,
  contractAddress,
  amount,
  privateKey,
  decimals,
  network = 'homestead',
}: SendErc20): Promise<Amount> => {
  const to = Web3.utils.toChecksumAddress(address);
  const value: ethers.BigNumber = ethers.utils.parseUnits(
      amount.toString(),
      decimals,
  );

  const provider: JsonRpcProvider = getProvider({network});
  const signer = new ethers.Wallet(privateKey, provider);
  const from = signer.address;
  const tokenContract = getERC20Contract({contractAddress, signer});

  const balance: ethers.BigNumber = await tokenContract.balanceOf(from);

  if (balance.lt(value)) throw new Error('Insufficient ERC20 balance');

  const data = tokenContract.interface.encodeFunctionData('transfer', [
    to,
    amount,
  ]);

  let gasPrice: ethers.BigNumber | number = await provider.getGasPrice();
  gasPrice = gasPrice.toNumber();
  gasPrice = Math.ceil(gasPrice);

  const nonce = await provider.getTransactionCount(from);

  const txObject: any = {
    from,
    to: tokenContract.address,
    data,
    gasPrice: ethers.utils.hexlify(gasPrice),
    nonce,
  };
  let gasLimit: ethers.BigNumber | number;
  gasLimit = await provider.estimateGas(txObject);
  gasLimit = Math.ceil(gasLimit.toNumber());

  txObject.gasLimit = ethers.utils.hexlify(gasLimit);

  const fee: any = await provider.estimateGas(txObject);
  const wei = fee.toNumber();
  const eths = wei / Math.pow(10, 18);

  return {wei, ethers: eths};
};

export const sendEth = async ({
  address,
  amount,
  network = 'homestead',
  privateKey,
}: SendEth): Promise<TransactionResponse> => {
  const to = Web3.utils.toChecksumAddress(address);
  const eths: ethers.BigNumber = ethers.utils.parseEther(amount.toString());

  const provider: JsonRpcProvider = getProvider({network});
  const {address: sender}: Wallet = importEthAddress({
    network,
    privateKey,
  });

  const balance: ethers.BigNumber = await provider.getBalance(sender);

  if (balance.lt(eths)) {
    throw new Error('Insufficient balance');
  }
  const value = eths.toHexString();
  const txObject = {to, value};

  const wallet = new ethers.Wallet(privateKey).connect(provider);

  return wallet.sendTransaction(txObject);
};

export const sendERC20Token = async ({
  address,
  contractAddress,
  amount,
  privateKey,
  decimals,
  network = 'homestead',
}: SendErc20): Promise<TransactionResponse> => {
  const to = Web3.utils.toChecksumAddress(address);
  const value: ethers.BigNumber = ethers.utils.parseUnits(
      amount.toString(),
      decimals,
  );

  const provider: JsonRpcProvider = getProvider({network});
  const signer = new ethers.Wallet(privateKey, provider);
  const from = signer.address;
  const tokenContract = getERC20Contract({contractAddress, signer});

  const balance: ethers.BigNumber = await tokenContract.balanceOf(from);

  if (balance.lt(value)) throw new Error('Insufficient ERC20 balance');

  const data = tokenContract.interface.encodeFunctionData('transfer', [
    to,
    amount,
  ]);

  let gasPrice: ethers.BigNumber | number = await provider.getGasPrice();
  gasPrice = gasPrice.toNumber();
  gasPrice = Math.ceil(gasPrice);

  const nonce = await provider.getTransactionCount(from);

  const txObject: any = {
    from,
    to: tokenContract.address,
    data,
    gasPrice: ethers.utils.hexlify(gasPrice),
    nonce,
  };
  let gasLimit: ethers.BigNumber | number;
  gasLimit = await provider.estimateGas(txObject);
  gasLimit = Math.ceil(gasLimit.toNumber());

  txObject.gasLimit = ethers.utils.hexlify(gasLimit);

  const wallet = new ethers.Wallet(privateKey, provider);

  return wallet.sendTransaction(txObject);
};

export const getEthBalance = async ({
  address,
  network = 'homestead',
}: GetBalance): Promise<Amount> => {
  const provider: JsonRpcProvider = getProvider({network});
  const balance = await provider.getBalance(address);

  const wei = parseInt(balance.toString());
  const eths = wei / Math.pow(10, 18);

  return {wei, ethers: eths};
};

export const getERC20Balance = async ({
  address,
  contractAddress,
  decimals,
  network = 'homestead',
}: GetERC20Balance): Promise<Amount> => {
  const signer: JsonRpcProvider = getProvider({network});

  const tokenContract = getERC20Contract({contractAddress, signer});

  const balance: ethers.BigNumber = await tokenContract.balanceOf(address);

  const wei = parseInt(balance.toString());
  const eths = wei / Math.pow(10, decimals);

  return {wei, ethers: eths};
};

export const createEthAddressFromMnemonic = ({
  mnemonic,
  index,
}: ImportAddressFromMnemonic): Wallet => {
  const {address, privateKey} = ethers.Wallet.fromMnemonic(
      mnemonic,
      `m/44'/60'/0'/0/${index}`,
  );
  return {address, privateKey};
};

export const generateXPubKeyFromMnemonic = async ({
  mnemonic,
}: MnemonicOnly): Promise<string> => {
  return ethers.utils.HDNode.fromMnemonic(mnemonic).neuter().extendedKey;
};

export const generateXPrvKeyFromMnemonic = async ({
  mnemonic,
}: MnemonicOnly): Promise<string> => {
  return ethers.utils.HDNode.fromMnemonic(mnemonic).extendedKey;
};

export const createEthAddressFromXPrv = ({
  xprv,
  index,
}: ImportAddressFromXPrv): Wallet => {
  const {address, privateKey} = ethers.utils.HDNode.fromExtendedKey(
      xprv,
  ).derivePath(`m/44'/60'/0'/0/${index}`);

  return {address, privateKey};
};

export const getTransactionCount = async ({
  network = 'homestead',
  address,
}: GetBalance): Promise<number> => {
  const provider: JsonRpcProvider = getProvider({network});

  return provider.getTransactionCount(address);
};

export const getTransactionReceipt = async ({
  network = 'homestead',
  hash,
}: GetTransaction): Promise<TransactionReceipt> => {
  const provider: JsonRpcProvider = getProvider({network});

  return provider.getTransactionReceipt(hash);
};

export const sendTransaction = async ({
  network = 'homestead',
  hash,
}: GetTransaction): Promise<TransactionResponse> => {
  const provider: JsonRpcProvider = getProvider({network});

  return provider.sendTransaction(hash);
};

export const getBlock = async ({
  network = 'homestead',
  hash,
}: GetTransaction): Promise<Block> => {
  const provider: JsonRpcProvider = getProvider({network});

  return provider.getBlock(hash);
};

export const getBtcTransactions = async ({
  address,
  network = 'homestead',
}: GetBalance): Promise<any> => {
  const supportedNetworks = ['homestead', 'polygon', 'kovan', 'polygon-mumbai'];

  const chains = {
    'homestead': 1,
    'polygon': 137,
    'kovan': 69,
    'polygon-mumbai': 80001,
  };

  if (!supportedNetworks.includes(network)) {
    throw new Error(
        `'network' must be ${supportedNetworks.join(',')}; got '${network}'`,
    );
  }

  const link =
    `https://api.covalenthq.com/v1/${chains[network]}/` +
    `address/${address}/transactions_v2/`;
  const response = await fetch(link);
  return response.json();
};
