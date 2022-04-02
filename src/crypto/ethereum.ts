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
  SendErc20,
  GetERC20Balance,
} from '../types/crypto/ethereum';

const getEthRpcLink = ({network = 'mainnet'}: Network): string => {
  const {INFURA_API_KEY} = process.env;

  if (!INFURA_API_KEY) throw new Error('Please provide INFURA_API_KEY');
  return `https://${network}.infura.io/v3/${INFURA_API_KEY}`;
};

const getProvider = ({network = 'mainnet'}: Network): JsonRpcProvider => {
  const link: string = getEthRpcLink({network});
  return new JsonRpcProvider(link);
};

const getERC20Contract = ({contractAddress, signer}) => {
  return new ethers.Contract(
      contractAddress,
      [
        'function approve(address _spender, uint256 _value) ' +
        'public returns (bool success)',
        'function transferFrom(address sender, address recipient,' +
        ' uint256 amount) external returns (bool)',
        'function transfer(address recipient, uint256 amount)' +
        ' external returns (bool)',
        'function balanceOf(address account) external view ' +
        'returns (uint256)',
      ],
      signer,
  );
};

export const createEthAddress = (): Wallet => {
  const {address, privateKey} = ethers.Wallet.createRandom();
  return {address, privateKey};
};

export const importEthAddress = ({
  privateKey,
  network = 'mainnet',
}: ImportAddress): Wallet => {
  const provider = getProvider({network});
  const {address} = new ethers.Wallet(privateKey, provider);

  return {address, privateKey};
};

export const estimateEthGasFee = async ({
  address,
  amount,
  network = 'mainnet',
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
  const tx = {to, value};
  const fee: any = await provider.estimateGas(tx);
  const wei = fee.toNumber();
  const eths = wei / Math.pow(10, 18);

  return {wei, ethers: eths};
};

export const sendEth = async ({
  address,
  amount,
  network = 'mainnet',
  privateKey,
}: SendEth): Promise<TransactionReceipt> => {
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

  const tx = await wallet.sendTransaction(txObject);
  return await tx.wait();
};

export const sendERC20Token = async ({
  address,
  contractAddress,
  amount,
  privateKey,
  decimals,
  network = 'mainnet',
}: SendErc20): Promise<TransactionReceipt> => {
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

  const tx = await wallet.sendTransaction(txObject);
  return await tx.wait();
};

export const getEthBalance = async ({
  address,
  network = 'mainnet',
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
  network = 'mainnet',
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
