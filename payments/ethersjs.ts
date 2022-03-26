import { JsonRpcProvider, TransactionReceipt } from "@ethersproject/providers";
import ethers, { BigNumber, Wallet } from "ethers";
import { parseEther } from "ethers/lib/utils";
import Web3 from "web3";
import {
  Amount,
  EthWallet,
  GetBalance,
  ImportAddress,
  ImportAddressFromMnemonic,
  Network,
  SendEth,
} from "../types/ethersjs";
import { createBtcAddressFromMnemonic } from "./bitcoinjs";

// const { INFURA_API_KEY } = process.env;

const INFURA_API_KEY = "a5ef69f8160b42be9586ac7fda90abec";

const getEthRpcLink = ({ testnet = false }: Network): string => {
  if (!INFURA_API_KEY) throw new Error("Please provide INFURA_API_KEY");
  return testnet
    ? `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`
    : `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
};

const getProvider = ({ testnet = false }: Network): JsonRpcProvider => {
  const link: string = getEthRpcLink({ testnet });
  return new JsonRpcProvider(link);
};

export const createEthAddress = ({ testnet = false }: Network): EthWallet => {
  const provider = getProvider({ testnet });
  const { address, privateKey } = Wallet.createRandom({
    JsonRpcProvider: provider,
  });
  return { address, privateKey };
};

export const importEthAddress = ({
  privateKey,
  testnet = false,
}: ImportAddress): EthWallet => {
  const provider = getProvider({ testnet });
  const { address } = new Wallet(privateKey, provider);

  return { address, privateKey };
};

export const estimateEthGasFee = async ({
  address,
  amount,
  testnet = false,
  privateKey,
}: SendEth): Promise<Amount> => {
  const to = Web3.utils.toChecksumAddress(address);
  let ether: any = parseEther(amount.toString());
  const provider: JsonRpcProvider = getProvider({ testnet });
  const { address: sender }: EthWallet = importEthAddress({
    testnet,
    privateKey,
  });

  let balance: BigNumber = await provider.getBalance(sender);

  if (balance.lt(ether)) throw new Error("Insufficient balance");

  const value = ether.toHexString();
  const tx = { to, value };
  let fee: any = await provider.estimateGas(tx);
  const wei = fee.toNumber();
  const ethers = wei / Math.pow(10, 18);

  return { wei, ethers };
};

export const sendEth = async ({
  address,
  amount,
  testnet = false,
  privateKey,
}: SendEth): Promise<TransactionReceipt> => {
  const to = Web3.utils.toChecksumAddress(address);
  const ethers: BigNumber = parseEther(amount.toString());

  const provider: JsonRpcProvider = getProvider({ testnet });
  const { address: sender }: EthWallet = importEthAddress({
    testnet,
    privateKey,
  });

  const balance: BigNumber = await provider.getBalance(sender);

  if (balance.lt(ethers)) {
    console.log("Insufficient balance");
    return;
  }
  const value = ethers.toHexString();
  const tx = { to, value };

  const wallet = new Wallet(privateKey).connect(provider);

  let trx = await wallet.sendTransaction(tx);
  return await trx.wait();
};

export const getEthBalance = async ({
  address,
  testnet = false,
}: GetBalance): Promise<Amount> => {
  const provider: JsonRpcProvider = getProvider({ testnet });
  const balance = await provider.getBalance(address);

  const wei = balance.toNumber();
  const ethers = wei / Math.pow(10, 18);

  return { wei, ethers };
};

export const createEthAddressFromMnemonic = ({
  mnemonic,
  index,
}: ImportAddressFromMnemonic): EthWallet => {
  const { address, privateKey } = Wallet.fromMnemonic(
    mnemonic,
    `m/44'/60'/0'/0/${index}`
  );
  return { address, privateKey };
};
