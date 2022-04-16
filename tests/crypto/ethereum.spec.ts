import assert from 'assert';
import {config} from 'dotenv';
import {describe, it} from 'mocha';
import * as ethereum from '../../src/crypto/ethereum';

config();

const mnemonic =
  'wine agree vacuum crowd describe damp chapter' +
  ' behind sweet tomato transfer earn';

describe('--ethereum--', () => {
  describe('Generate HD extended keys', () => {
    it('can generate xpub key', async () => {
      const xpub = await ethereum.generateXPubKeyFromMnemonic({mnemonic});
      assert.equal(
          xpub,
          'xpub661MyMwAqRbcFqzMQsKoZo7Du8JrGrdNSTpMcLPjWzXLoqzMeiDos3dMundq' +
          '4xjwKakHmbaTr5mG4QrDCg9vjDqWxMUVBzRbmU7RcGkzNcL',
      );
    });

    it('can generate xprv key', async () => {
      const xprv = await ethereum.generateXPrvKeyFromMnemonic({mnemonic});
      assert.equal(
          xprv,
          'xprv9s21ZrQH143K3MutJqnoCfAVM6UMsPuX5Etkowz7xezMw3fD7AuZKFJt4' +
          'WGDyaxH9Y8htfaNtpRoo4zv373yTGkWoUaJQeybzRp4UGLcgn8',
      );
    });
  });

  describe('Generate wallets', () => {
    it('can generate random address', async () => {
      const {address} = ethereum.createEthAddress();
      assert.ok(address);
    });

    it('can generate address from mnemonic', async () => {
      const {address} = ethereum.createEthAddressFromMnemonic({
        mnemonic,
        index: 0,
      });

      assert.equal(address, '0x6EB14A9a24eB2233731851810192A5c79B37F5C3');
    });

    it('can generate address from xprv', async () => {
      const xprv =
        'xprv9s21ZrQH143K3MutJqnoCfAVM6UMsPuX5Etkowz7xezMw3fD7AuZKFJt4WGD' +
        'yaxH9Y8htfaNtpRoo4zv373yTGkWoUaJQeybzRp4UGLcgn8';

      const {address} = ethereum.createEthAddressFromXPrv({
        xprv,
        index: 1,
      });
      assert.equal(address, '0x54A31cBDB169B9C7054A926bf0bEAa5853C69A2F');
    });
  });

  describe('Import wallet', () => {
    it('can import address with private key', async () => {
      const {address} = ethereum.importEthAddress({
        privateKey:
          '0xea4fbcf6d15e27d4341549f8707a87cb40440c28d59580db82fa7013c4cd363c',
      });
      assert.equal(address, '0x287B7Df28D116839be46304dbcED3f3980319b40');
    });
  });

  describe('Get Balances', () => {
    const {address} = ethereum.createEthAddressFromMnemonic({
      mnemonic,
      index: 0,
    });

    it('can get ETH balance', async () => {
      const balance = await ethereum.getEthBalance({
        address,
        network: 'ropsten',
      });

      assert.ok('ethers' in balance);
      assert.ok('wei' in balance);
    });

    it('can get ERC20 token balance (cUSDT)', async () => {
      const balance = await ethereum.getERC20Balance({
        address,
        network: 'ropsten',
        contractAddress: '0xF6958Cf3127e62d3EB26c79F4f45d3F3b2CcdeD4',
        decimals: 18,
      });

      assert.ok('ethers' in balance);
      assert.ok('wei' in balance);
    });
  });

  describe('Send funds', () => {
    // sender
    const {privateKey} = ethereum.createEthAddressFromMnemonic({
      mnemonic,
      index: 0,
    });

    // reciever
    const {address} = ethereum.createEthAddress();

    it('can send ETH', async () => {
      const {hash} = await ethereum.sendEth({
        address,
        amount: 0.000001,
        privateKey,
        network: 'ropsten',
      });

      assert.ok(hash);
    });

    it('can send ERC20 token (cUSDT)', async () => {
      const {hash} = await ethereum.sendERC20Token({
        address,
        amount: 1,
        privateKey,
        network: 'ropsten',
        contractAddress: '0xF6958Cf3127e62d3EB26c79F4f45d3F3b2CcdeD4',
        decimals: 8,
      });

      assert.ok(hash);
    });
  });
});
