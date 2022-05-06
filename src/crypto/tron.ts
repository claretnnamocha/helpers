import tron from "@cobo/tron";
import fetch from "node-fetch";
import fs from "fs";
import { config } from "dotenv";
import BigNumber from "bignumber.js";

const getPath = (index: number) => `m/49'/194'/0'/0/${index}`;

const getTronGridLink = ({ network = "mainnet" }): string => {
  const { TRONGRID_API_KEY } = process.env;
  const subdomain =
    network === "shasta"
      ? "api.shasta"
      : network === "mainnet"
      ? "api"
      : network;

  if (!TRONGRID_API_KEY) throw new Error("Please provide TRONGRID_API_KEY");
  return `https://${subdomain}.trongrid.io`;
};

const requestTronGrid = async ({
  network,
  url,
  method = "get",
  body = null,
}) => {
  const { TRONGRID_API_KEY } = process.env;
  const baseUrl = getTronGridLink({ network });
  const link = `${baseUrl}/${url}`;
  body = body ? JSON.stringify(body) : null;
  const response = await fetch(link, {
    method,
    body,
    headers: {
      "content-type": "application/json",
      "TRON-PRO-API-KEY": TRONGRID_API_KEY,
    },
  });

  return response.json();
};

const getLatestBlock = async ({ network = "mainnet" }) => {
  const {
    blockID: hash,
    block_header: {
      raw_data: { timestamp, number },
    },
  } = await requestTronGrid({
    url: "wallet/getnowblock",
    network,
  });

  return { hash, timestamp, number };
};

const broadcastTransaction = async ({ network = "mainnet", transaction }) => {
  const { hex } = transaction;
  return requestTronGrid({
    url: "wallet/broadcasthex",
    method: "post",
    network,
    body: { transaction: hex },
  });
};

export const parseTrx = (trx: number) => {
  return (trx * Math.pow(10, 6)) | 0;
};

export const sunToTrx = (sun: number) => {
  return sun / Math.pow(10, 6);
};

export const createTrxAddress = () => {
  const mnemonic = tron.generateMnemonic();
  const wallet = tron.fromMnemonic(mnemonic).derivePath(getPath(0));
  return {
    address: wallet.getAddress(),
    privateKey: wallet.getTronPrivateKey().toString(),
  };
};

export const importTrxAddress = ({ privateKey }) => {
  const wallet = tron.fromTronPrivateKey(privateKey);
  return {
    address: wallet.getAddress(),
    privateKey: wallet.getTronPrivateKey().toString(),
  };
};

export const createTrxAddressFromMnemonic = ({ mnemonic, index }) => {
  const wallet = tron.fromMnemonic(mnemonic).derivePath(getPath(index));
  return {
    address: wallet.getAddress(),
    privateKey: wallet.getTronPrivateKey().toString(),
  };
};

export const createTrxAddressFromHDKey = ({ hdkey, index }) => {
  const wallet = tron.fromExtendedKey(hdkey).derivePath(getPath(index));
  return {
    address: wallet.getAddress(),
    privateKey: wallet.getTronPrivateKey().toString(),
  };
};

export const getTrxBalance = async ({ address, network = "mainnet" }) => {
  const { data }: any = await requestTronGrid({
    network,
    url: `v1/accounts/${address}`,
  });

  if (!data.length) return { sun: 0, trx: 0 };

  const [{ balance: sun }] = data;

  const trx = sunToTrx(sun);

  return { sun, trx };
};

export const getTRC20Balance = async ({
  address,
  contractAddress,
  decimals,
  network = "mainnet",
}) => {
  const { data }: any = await requestTronGrid({
    network,
    url: `v1/accounts/${address}`,
  });

  if (!data.length) return { sun: 0, trx: 0 };

  const [{ trc20 }] = data;

  if (!trc20.length) return { sun: 0, trx: 0 };

  for (let index = 0; index < trc20.length; index++) {
    const token = trc20[index];
    const tokenContractAddress = Object.keys(token)[0];

    if (tokenContractAddress === contractAddress) {
      const sun: number = parseInt(token[tokenContractAddress]);
      const trx = sun / Math.pow(10, decimals);
      return { sun, trx };
    }
  }
  return { sun: 0, trx: 0 };
};

export const sendTrx = async ({
  privateKey,
  address: to,
  amount: trx,
  network = "mainnet",
}) => {
  const wallet = tron.fromTronPrivateKey(privateKey);
  const address = wallet.getAddress();
  const amount = parseTrx(trx);
  const latestBlock = await getLatestBlock({ network });

  const { sun: balance } = await getTrxBalance({
    address,
    network,
  });

  if (new BigNumber(amount).gte(new BigNumber(balance)))
    throw new Error("Insufficient balance");

  const transaction = wallet.generateTransaction(
    to,
    amount,
    "TRX",
    latestBlock
  );

  return broadcastTransaction({ network, transaction });
};

export const sendTRC20Token = async ({
  address: to,
  contractAddress,
  amount: trx,
  privateKey,
  decimals,
  network = "mainnet",
}) => {
  const wallet = tron.fromTronPrivateKey(privateKey);
  const address = wallet.getAddress();
  const amount = trx * Math.pow(10, decimals);
  const latestBlock = await getLatestBlock({ network });

  const { sun: balance } = await getTRC20Balance({
    address,
    network,
    contractAddress,
    decimals,
  });

  if (new BigNumber(amount).gte(new BigNumber(balance)))
    throw new Error("Insufficient balance");

  const transaction = wallet.transferTRC20Token(
    contractAddress,
    to,
    amount,
    latestBlock
  );

  return broadcastTransaction({ network, transaction });
};

export const getTrxTransactions = async ({ address, network = "mainnet" }) => {
  const url = `v1/accounts/${address}/transactions`;

  const { data, success, error } = await requestTronGrid({
    url,
    network,
  });

  if (!success) throw new Error(error);

  return data;
};

export const getTrc20Transactions = async ({
  address,
  network = "mainnet",
}) => {
  const url = `/v1/accounts/${address}/transactions/trc20`;

  const { data, success, error } = await requestTronGrid({
    url,
    network,
  });

  if (!success) throw new Error(error);

  return data;
};
