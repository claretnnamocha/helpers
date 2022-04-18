import { it } from "mocha";
import * as bitcoin from "../src/crypto/bitcoin";

const mnemonic =
  "wine agree vacuum crowd describe damp chapter" +
  " behind sweet tomato transfer earn";

describe("test", () => {
  it("can test send", async () => {
    // reciever
    const { wif: recieverWIF, address: reciever } =
      bitcoin.createBtcAddressFromMnemonic({
        mnemonic,
        index: 0,
        testnet: true,
      });

    // sender
    const { address: sender, wif: senderWIF } =
      bitcoin.createBtcAddressFromMnemonic({
        mnemonic,
        index: 10,
        testnet: true,
      });

    const { transactionId } = await bitcoin.send({
      addresses: [reciever],
      testnet: true,
      wif: senderWIF,
      amounts: [0.000005],
    });

    console.log({ transactionId, reciever, sender });
  });
});
