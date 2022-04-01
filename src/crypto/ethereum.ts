import {JsonRpcProvider, TransactionReceipt} from '@ethersproject/providers';
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
} from '../types/crypto/ethereum';

const getEthRpcLink = ({testnet = false}: Network): string => {
  const {INFURA_API_KEY} = process.env;

  if (!INFURA_API_KEY) throw new Error('Please provide INFURA_API_KEY');
  return testnet ?
    `https://rinkeby.infura.io/v3/${INFURA_API_KEY}` :
    `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
};

const getProvider = ({testnet = false}: Network): JsonRpcProvider => {
  const link: string = getEthRpcLink({testnet});
  return new JsonRpcProvider(link);
};

export const createEthAddress = ({testnet = false}: Network): Wallet => {
  const provider = getProvider({testnet});
  const {address, privateKey} = ethers.Wallet.createRandom({
    JsonRpcProvider: provider,
  });
  return {address, privateKey};
};

export const importEthAddress = ({
  privateKey,
  testnet = false,
}: ImportAddress): Wallet => {
  const provider = getProvider({testnet});
  const {address} = new ethers.Wallet(privateKey, provider);

  return {address, privateKey};
};

export const estimateEthGasFee = async ({
  address,
  amount,
  testnet = false,
  privateKey,
}: SendEth): Promise<Amount> => {
  const to = Web3.utils.toChecksumAddress(address);
  const ether: any = ethers.utils.parseEther(amount.toString());
  const provider: JsonRpcProvider = getProvider({testnet});
  const {address: sender}: Wallet = importEthAddress({
    testnet,
    privateKey,
  });

  const balance: ethers.BigNumber = await provider.getBalance(sender);

  if (balance.lt(ether)) throw new Error('Insufficient balance');

  const value = ether.toHexString();
  const tx = {to, value};
  const fee: any = await provider.estimateGas(tx);
  const wei = fee.toNumber();
  const eths = wei / Math.pow(10, 18);

  return {wei, ethers: eths};
};

export const sendEth = async ({
  address,
  amount,
  testnet = false,
  privateKey,
}: SendEth): Promise<TransactionReceipt> => {
  const to = Web3.utils.toChecksumAddress(address);
  const eths: ethers.BigNumber = ethers.utils.parseEther(amount.toString());

  const provider: JsonRpcProvider = getProvider({testnet});
  const {address: sender}: Wallet = importEthAddress({
    testnet,
    privateKey,
  });

  const balance: ethers.BigNumber = await provider.getBalance(sender);

  if (balance.lt(eths)) {
    throw new Error('Insufficient balance');
  }
  const value = eths.toHexString();
  const tx = {to, value};

  const wallet = new ethers.Wallet(privateKey).connect(provider);

  const trx = await wallet.sendTransaction(tx);
  return await trx.wait();
};

export const getEthBalance = async ({
  address,
  testnet = false,
}: GetBalance): Promise<Amount> => {
  const provider: JsonRpcProvider = getProvider({testnet});
  const balance = await provider.getBalance(address);

  const wei = balance.toNumber();
  const eths = wei / Math.pow(10, 18);

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
