import {BigNumber} from 'bignumber.js';
import {
  Block,
  JsonRpcProvider,
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import * as ethers from 'ethers';
import fetch from 'node-fetch';
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
  DrainEth,
  DrainErc20,
  DrainResponse,
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
  'function decimals() public view returns (uint8)',
];

const getEthRpcLink = ({network = 'homestead'}: Network): string => {
  if (['bsc', 'bsc-testnet'].includes(network)) {
    return network === 'bsc' ?
      'https://bsc-dataseed.binance.org' :
      'https://data-seed-prebsc-1-s1.binance.org:8545';
  } else {
    const {INFURA_API_KEY} = process.env;
    const subdomain =
      network === 'polygon' ?
        'polygon-mainnet' :
        network === 'homestead' ?
        'mainnet' :
        network;

    if (!INFURA_API_KEY) throw new Error('Please provide INFURA_API_KEY');
    return `https://${subdomain}.infura.io/v3/${INFURA_API_KEY}`;
  }
};

const getProvider = ({network = 'homestead'}: Network): JsonRpcProvider => {
  const link: string = getEthRpcLink({network});
  return new JsonRpcProvider(link);
};

const getERC20Contract = ({contractAddress, signer}) => {
  contractAddress = Web3.utils.toChecksumAddress(contractAddress);
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
}: SendEth): Promise<Amount> => {
  const to = Web3.utils.toChecksumAddress(address);
  const ether: any = ethers.utils.parseEther(amount.toString());
  const provider: JsonRpcProvider = getProvider({network});

  let gasPrice: ethers.BigNumber | number = await provider.getGasPrice();
  gasPrice = gasPrice.toNumber();
  gasPrice = Math.ceil(gasPrice);

  const value = ether.toHexString();
  const txObject = {to, value, gasPrice: ethers.utils.hexlify(gasPrice)};
  const fee = await provider.estimateGas(txObject);
  const wei = fee.toNumber() * gasPrice;
  const eths = wei / Math.pow(10, 18);

  return {wei, ethers: eths};
};

export const estimateERC20GasFee = async ({
  address,
  contractAddress,
  amount,
  privateKey,
  network = 'homestead',
}: SendErc20): Promise<Amount> => {
  const provider: JsonRpcProvider = getProvider({network});
  const signer = new ethers.Wallet(privateKey, provider);
  const from = signer.address;
  const tokenContract = getERC20Contract({contractAddress, signer});
  const decimals: number = await tokenContract.decimals();

  const to = Web3.utils.toChecksumAddress(address);
  const value: ethers.BigNumber = ethers.utils.parseUnits(
      amount.toString(),
      decimals,
  );

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
  network = 'homestead',
}: SendErc20): Promise<TransactionResponse> => {
  const to = Web3.utils.toChecksumAddress(address);

  const provider: JsonRpcProvider = getProvider({network});
  const signer = new ethers.Wallet(privateKey, provider);
  const from = signer.address;
  const tokenContract = getERC20Contract({contractAddress, signer});

  const decimals: number = await tokenContract.decimals();

  const value: ethers.BigNumber = ethers.BigNumber.from(
      new BigNumber(amount)
          .multipliedBy(new BigNumber(Math.pow(10, decimals)))
          .toString(),
  );

  const balance: ethers.BigNumber = await tokenContract.balanceOf(from);

  if (balance.lt(value)) throw new Error('Insufficient ERC20 balance');

  const data = tokenContract.interface.encodeFunctionData('transfer', [
    to,
    value,
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
  network = 'homestead',
}: GetERC20Balance): Promise<Amount> => {
  const signer: JsonRpcProvider = getProvider({network});

  const tokenContract = getERC20Contract({contractAddress, signer});

  const balance: ethers.BigNumber = await tokenContract.balanceOf(address);
  const decimals: number = await tokenContract.decimals();

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

export const getEthTransactions = async ({
  address,
  network = 'homestead',
}: GetBalance): Promise<any> => {
  const {COVALENT_API_KEY} = process.env;
  if (!COVALENT_API_KEY) throw new Error('Please provide COVALENT_API_KEY');

  const provider = getProvider({network});
  const {chainId} = await provider.getNetwork();

  const link =
    `https://api.covalenthq.com/v1/${chainId}/` +
    `address/${address}/transactions_v2/`;
  const response = await fetch(link, {
    headers: {
      'content-type': 'application/json',
      'authorization': `Basic ${Buffer.from(COVALENT_API_KEY + ':').toString(
          'base64',
      )}`,
    },
  });
  return response.json();
};

export const drainEth = async ({
  address,
  network = 'homestead',
  privateKey,
  minimumBalance = 500000000000000,
}: DrainEth): Promise<DrainResponse> => {
  const to = Web3.utils.toChecksumAddress(address);

  const provider: JsonRpcProvider = getProvider({network});
  const {address: sender}: Wallet = importEthAddress({
    network,
    privateKey,
  });
  const amount: ethers.BigNumber = await provider.getBalance(sender);

  if (new BigNumber(amount.toString()).lt(new BigNumber(minimumBalance))) {
    throw new Error('Insufficient balance');
  }

  const value = amount.toHexString();

  let gasPrice: ethers.BigNumber | number = await provider.getGasPrice();
  gasPrice = gasPrice.toNumber();
  gasPrice = Math.ceil(gasPrice);
  const txObject: any = {to, value};
  let gasLimit: ethers.BigNumber | number = await provider.estimateGas(
      txObject,
  );

  gasLimit = Math.ceil(gasLimit.toNumber());
  txObject.value = ethers.BigNumber.from(
      new BigNumber(txObject.value)
          .minus(new BigNumber(gasLimit * gasPrice))
          .toString(),
  ).toHexString();

  txObject.gasLimit = ethers.utils.hexlify(gasLimit);
  txObject.gasPrice = ethers.utils.hexlify(gasPrice);

  const wallet = new ethers.Wallet(privateKey).connect(provider);

  const transaction = await wallet.sendTransaction(txObject);

  return {
    transaction,
    fee: parseFloat(ethers.utils.formatEther((gasLimit * gasPrice).toString())),
    amount: amount.toString(),
  };
};

export const drainERC20Token = async ({
  address,
  contractAddress,
  privateKey,
  gasSupplierPrivateKey,
  network = 'homestead',
  minimumBalance = 10,
}: DrainErc20): Promise<DrainResponse> => {
  const to = Web3.utils.toChecksumAddress(address);

  const provider: JsonRpcProvider = getProvider({network});
  const signer = new ethers.Wallet(privateKey, provider);
  const from = signer.address;
  const tokenContract = getERC20Contract({contractAddress, signer});

  const amount: ethers.BigNumber = await tokenContract.balanceOf(from);
  const decimals: number = await tokenContract.decimals();

  if (
    new BigNumber(amount.toString()).lt(
        new BigNumber(minimumBalance * Math.pow(10, decimals)),
    )
  ) {
    throw new Error('Insufficient balance');
  }

  const data = tokenContract.interface.encodeFunctionData('transfer', [
    to,
    amount.toString(),
  ]);

  let gasPrice: ethers.BigNumber | number = await provider.getGasPrice();
  gasPrice = gasPrice.toNumber();
  gasPrice = Math.ceil(gasPrice);

  const nonce = await provider.getTransactionCount(from);

  const txObject: any = {
    from,
    to: tokenContract.address,
    data,
    nonce,
  };
  let gasLimit: ethers.BigNumber | number;
  gasLimit = await provider.estimateGas(txObject);
  gasLimit = Math.ceil(gasLimit.toNumber());

  txObject.gasLimit = ethers.utils.hexlify(gasLimit);
  txObject.gasPrice = ethers.utils.hexlify(gasPrice);

  const fee = parseFloat(
      ethers.utils.formatEther((gasLimit * gasPrice).toString()),
  );

  if (gasSupplierPrivateKey) {
    const supplierSigner = new ethers.Wallet(gasSupplierPrivateKey, provider);
    const ttx = await sendEth({
      address: signer.address,
      amount: fee,
      network,
      privateKey: supplierSigner.privateKey,
    });
    await ttx.wait();
  }

  const wallet = new ethers.Wallet(privateKey, provider);

  const transaction = await wallet.sendTransaction(txObject);
  return {transaction, fee, amount: amount.toString()};
};
