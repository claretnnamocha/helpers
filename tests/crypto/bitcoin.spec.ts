import assert from 'assert';
import {describe, it} from 'mocha';
import * as bitcoin from '../../src/crypto/bitcoin';
import * as bip39 from 'bip39';

const mnemonic = bip39.entropyToMnemonic('00000000000000000000000000000000');

describe('--bitcoin--', () => {
  describe('Generate mnemonic', () => {
    it('can generate mnemonic', async () => {
      const mnemonic = bitcoin.generateMnemonic();
      assert.ok(mnemonic);
    });
  });

  describe('Generate HD extended keys', () => {
    it('can generate xpub key', async () => {
      const xpub = await bitcoin.generateXPubKeyFromMnemonic({mnemonic});
      assert.equal(
          xpub,
          'xpub661MyMwAqRbcFkPHucMnrGNzDwb6teAX1RbKQmqtEF8kK3Z7LZ59qafCjB' +
          '9eCRLiTVG3uxBxgKvRgbubRhqSKXnGGb1aoaqLrpMBDrVxga8',
      );
    });

    it('can generate xprv key', async () => {
      const xprv = await bitcoin.generateXPrvKeyFromMnemonic({mnemonic});
      assert.equal(
          xprv,
          'xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDv' +
          'SnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu',
      );
    });
  });

  describe('Generate wallets', () => {
    it('can genarate random address', async () => {
      const {address} = bitcoin.createBtcAddress({});

      assert.ok(address);
    });

    it('can genarate address from mnemonic', async () => {
      const {address} = bitcoin.createBtcAddressFromMnemonic({
        mnemonic,
        index: 0,
      });
      assert.equal(address, '16ADswgGdUXTe1GYnrwB7BR3KbfPJcMCWD');
    });

    it('can genarate address from xpub key', async () => {
      const xpub = await bitcoin.generateXPubKeyFromMnemonic({mnemonic});

      const {address} = bitcoin.createBtcAddressFromXPubKey({
        xpub,
        index: 0,
      });
      assert.equal(address, '13iX7DteNj1gV7zhe4t6o9FX9CArR5wZxz');
    });
  });

  describe('Import wallet', () => {
    it('can import address with WIF', async () => {
      const {address} = bitcoin.importBtcAddress({
        wif: 'L4ASqnxELDiAMf9aXSk6dexV199fZdnnriwAFkt2FKisaCBcVFCH',
      });

      assert.equal(address, '17ncisdNHXF4ApAojAESYz6vUayUwzZ3qL');
    });
  });

  describe('Transactions', () => {
    // sender
    const {address: sender, wif} = bitcoin.createBtcAddressFromMnemonic({
      mnemonic,
      index: 0,
      testnet: true,
    });

    // reciever
    const {address} = bitcoin.createBtcAddress({testnet: true});

    it('can get balance', async () => {
      const balance = await bitcoin.getBtcBalance({
        address: sender,
        testnet: true,
      });

      assert.ok('btc' in balance);
      assert.ok('satoshi' in balance);
    });

    it('can send BTC', async () => {
      const {transactionId} = await bitcoin.send({
        addresses: [address],
        testnet: true,
        wif,
        amounts: [0.0000001],
      });

      assert.ok(transactionId);
    });
  });
});
