import assert from 'assert';
import {describe, it} from 'mocha';
import * as bitcoin from '../../src/crypto/bitcoin';

const mnemonic =
  'wine agree vacuum crowd describe damp chapter' +
  ' behind sweet tomato transfer earn';

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
          'xpub661MyMwAqRbcFqzMQsKoZo7Du8JrGrdNSTpMcLPjWzXLoqzMe' +
          'iDos3dMundq4xjwKakHmbaTr5mG4QrDCg9vjDqWxMUVBzRbmU7RcGkzNcL',
      );
    });

    it('can generate xprv key', async () => {
      const xprv = await bitcoin.generateXPrvKeyFromMnemonic({mnemonic});
      assert.equal(
          xprv,
          'xprv9s21ZrQH143K3MutJqnoCfAVM6UMsPuX5Etkowz7xezMw3fD7AuZ' +
          'KFJt4WGDyaxH9Y8htfaNtpRoo4zv373yTGkWoUaJQeybzRp4UGLcgn8',
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
      assert.equal(address, '1ETvwJrcxpiBhW1UgqkuhvZacdgNtqWmyj');
    });

    it('can genarate address from xpub key', async () => {
      const xpub = await bitcoin.generateXPubKeyFromMnemonic({mnemonic});

      const {address} = bitcoin.createBtcAddressFromHDKey({
        hdkey: xpub,
        index: 0,
      });
      assert.equal(address, '1Mbz1bVJQj7Vwah7QF4fkpQ4wZD7jYKazz');
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

    it('can send BTC using index and HDKey (xprv)', async () => {
      const xprv = await bitcoin.generateXPrvKeyFromMnemonic({
        mnemonic,
        testnet: true,
      });

      const {wif} = bitcoin.createBtcAddressFromHDKey({
        hdkey: xprv,
        index: 0,
        testnet: true,
      });

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
