import { it } from "mocha";

const transactions = [
  {
    txid: "bd944bb06ea041b1797f2002b906172e233ed5de9e109aad24ac8ebb225e17c6",
    version: 2,
    locktime: 2196144,
    vin: [
      {
        txid: "fe6fcc3e6ec2a174af084c453552798d2f6e4bf3e631f5810045a0d61a613933",
        vout: 1,
        prevout: {
          scriptpubkey: "0014d224402538e6ddf6a2afa76104495c258ecc47f2",
          scriptpubkey_asm:
            "OP_0 OP_PUSHBYTES_20 d224402538e6ddf6a2afa76104495c258ecc47f2",
          scriptpubkey_type: "v0_p2wpkh",
          scriptpubkey_address: "tb1q6gjyqffcumwldg405assgj2uyk8vc3ljg7pzd6",
          value: 35903659711,
        },
        scriptsig: "",
        scriptsig_asm: "",
        witness: [
          "30440220130733a1456a68f4f3b12a90b1e5bf003177558d1baf1215f8f15d4581a0dc8b0220662cbc902f24e42bc44171bc7c0c685d34c796a199950c0a424987a4161b1bd901",
          "028a19dc71fabb2a16fafc3e2b7ac106124a3e2a723b42760d66899eae1bf1f9a4",
        ],
        is_coinbase: false,
        sequence: 4294967294,
      },
    ],
    vout: [
      {
        scriptpubkey: "0014ab9b2e8b645323f555e64b1bec94e64fda27c5c0",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_20 ab9b2e8b645323f555e64b1bec94e64fda27c5c0",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "tb1q4wdjazmy2v3l240xfvd7e98xfldz03wqkezu8c",
        value: 35903586567,
      },
      {
        scriptpubkey: "76a9145e2360e18a5273e2c36a8809e08126b18eb1fa0988ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 5e2360e18a5273e2c36a8809e08126b18eb1fa09 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mp6iCDuPq3ZcLvW6bjUsNbErTCkFawKJvZ",
        value: 73000,
      },
    ],
    size: 225,
    weight: 573,
    fee: 144,
    status: {
      confirmed: true,
      block_height: 2196179,
      block_hash:
        "000000000000001dd617596a3e25b9b0c63dfa162b8bc7743d1bde6834d1ee95",
      block_time: 1650291243,
    },
  },
  {
    txid: "9a526ed86c49294b60c6ee2354cdf1da5c9b982e5b63708725eb787bf652b20e",
    version: 2,
    locktime: 2196178,
    vin: [
      {
        txid: "b7c62df61cbc4b340815353d93f12246af356acbd831bd15abc0d6e75ad67924",
        vout: 0,
        prevout: {
          scriptpubkey: "001493e15c3d3404c7aa64f2be46f76a5dcb12f0df85",
          scriptpubkey_asm:
            "OP_0 OP_PUSHBYTES_20 93e15c3d3404c7aa64f2be46f76a5dcb12f0df85",
          scriptpubkey_type: "v0_p2wpkh",
          scriptpubkey_address: "tb1qj0s4c0f5qnr65e8jher0w6jaevf0phu97a9yzm",
          value: 7800652975,
        },
        scriptsig: "",
        scriptsig_asm: "",
        witness: [
          "3044022066d6e9acb256ec5746f016802393dad8c1a6963302cf07e1ec06edb898342b5e02204e5760c8fb0a709bddc744b571633d62dad22fff377d8158df91a037153dc46c01",
          "02af58f20c5d29ef9ea5144858ed5c3f88438bfd179e1fdf50256d79b8f58cc53d",
        ],
        is_coinbase: false,
        sequence: 4294967294,
      },
    ],
    vout: [
      {
        scriptpubkey: "76a91415180c60ceab674e1db80882f11b43da8ab47df788ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 15180c60ceab674e1db80882f11b43da8ab47df7 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mhSVHzSrbDGnHaEH5mvv9HE6zhVKMiCqyX",
        value: 7800302418,
      },
      {
        scriptpubkey: "76a9145e2360e18a5273e2c36a8809e08126b18eb1fa0988ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 5e2360e18a5273e2c36a8809e08126b18eb1fa09 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mp6iCDuPq3ZcLvW6bjUsNbErTCkFawKJvZ",
        value: 335637,
      },
    ],
    size: 228,
    weight: 585,
    fee: 14920,
    status: {
      confirmed: true,
      block_height: 2196179,
      block_hash:
        "000000000000001dd617596a3e25b9b0c63dfa162b8bc7743d1bde6834d1ee95",
      block_time: 1650291243,
    },
  },
  {
    txid: "c956e10753ffdb166444c095c73b76f382b060f0e669d8481798c8535f614b14",
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: "7681bbe305e7db9fe42c635cfee79a6e6c5f38a9d249fcf6d6cdd797a265da3f",
        vout: 0,
        prevout: {
          scriptpubkey: "76a9145e2360e18a5273e2c36a8809e08126b18eb1fa0988ac",
          scriptpubkey_asm:
            "OP_DUP OP_HASH160 OP_PUSHBYTES_20 5e2360e18a5273e2c36a8809e08126b18eb1fa09 OP_EQUALVERIFY OP_CHECKSIG",
          scriptpubkey_type: "p2pkh",
          scriptpubkey_address: "mp6iCDuPq3ZcLvW6bjUsNbErTCkFawKJvZ",
          value: 100,
        },
        scriptsig:
          "483045022100f5e1bf2ed84edf0a9417f94c31ef6bf20bc21cdf0522664ee500eada475e1e3402205666bf36a62245e8f2781cee1103e55bd9c3486e8a65c5112ea2f8db47978d540121031946e5e3646dbfdc0d7c39f3510d010ac480f92bdd6cc3d8e1def404a75e3f2b",
        scriptsig_asm:
          "OP_PUSHBYTES_72 3045022100f5e1bf2ed84edf0a9417f94c31ef6bf20bc21cdf0522664ee500eada475e1e3402205666bf36a62245e8f2781cee1103e55bd9c3486e8a65c5112ea2f8db47978d5401 OP_PUSHBYTES_33 031946e5e3646dbfdc0d7c39f3510d010ac480f92bdd6cc3d8e1def404a75e3f2b",
        is_coinbase: false,
        sequence: 4294967295,
      },
      {
        txid: "9cfc55e021163b40ec22effabf19e200e9e34791055cc94ad6eeda78173deede",
        vout: 0,
        prevout: {
          scriptpubkey: "76a9145e2360e18a5273e2c36a8809e08126b18eb1fa0988ac",
          scriptpubkey_asm:
            "OP_DUP OP_HASH160 OP_PUSHBYTES_20 5e2360e18a5273e2c36a8809e08126b18eb1fa09 OP_EQUALVERIFY OP_CHECKSIG",
          scriptpubkey_type: "p2pkh",
          scriptpubkey_address: "mp6iCDuPq3ZcLvW6bjUsNbErTCkFawKJvZ",
          value: 5000,
        },
        scriptsig:
          "483045022100d350bc81d9784da69f8e7b30bacd8532b2b456d4dbc1acbc2d7bc38e2965c0dc0220693f9529ecacb9d9f9e77002ed1ef1935015b93a36ddf97ab9fce49499575e150121031946e5e3646dbfdc0d7c39f3510d010ac480f92bdd6cc3d8e1def404a75e3f2b",
        scriptsig_asm:
          "OP_PUSHBYTES_72 3045022100d350bc81d9784da69f8e7b30bacd8532b2b456d4dbc1acbc2d7bc38e2965c0dc0220693f9529ecacb9d9f9e77002ed1ef1935015b93a36ddf97ab9fce49499575e1501 OP_PUSHBYTES_33 031946e5e3646dbfdc0d7c39f3510d010ac480f92bdd6cc3d8e1def404a75e3f2b",
        is_coinbase: false,
        sequence: 4294967295,
      },
    ],
    vout: [
      {
        scriptpubkey: "76a91493b17957330251fc9c0645d341e4b4a023f0be4788ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 93b17957330251fc9c0645d341e4b4a023f0be47 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mtytEMwbmr9SUcV6QQjHXqmuUdH5mEAcgM",
        value: 500,
      },
      {
        scriptpubkey: "76a9145e2360e18a5273e2c36a8809e08126b18eb1fa0988ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 5e2360e18a5273e2c36a8809e08126b18eb1fa09 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mp6iCDuPq3ZcLvW6bjUsNbErTCkFawKJvZ",
        value: 4219,
      },
    ],
    size: 374,
    weight: 1496,
    fee: 381,
    status: {
      confirmed: true,
      block_height: 2196159,
      block_hash:
        "0000000000000039acdf8b3cd019aeac70d3fbc81db755b1b24113014bc3ec11",
      block_time: 1650281751,
    },
  },
  {
    txid: "9cfc55e021163b40ec22effabf19e200e9e34791055cc94ad6eeda78173deede",
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: "7681bbe305e7db9fe42c635cfee79a6e6c5f38a9d249fcf6d6cdd797a265da3f",
        vout: 1,
        prevout: {
          scriptpubkey: "76a91493b17957330251fc9c0645d341e4b4a023f0be4788ac",
          scriptpubkey_asm:
            "OP_DUP OP_HASH160 OP_PUSHBYTES_20 93b17957330251fc9c0645d341e4b4a023f0be47 OP_EQUALVERIFY OP_CHECKSIG",
          scriptpubkey_type: "p2pkh",
          scriptpubkey_address: "mtytEMwbmr9SUcV6QQjHXqmuUdH5mEAcgM",
          value: 488578,
        },
        scriptsig:
          "4830450221009e6968fd840ae93fe4f9ae434fa5a6c2a8b62fb1cc6252d2f4b02480feaae35a022064a74f908201b8666bbf2a12329764c5ad9ac55f3d05efa7e03560a884a368c30121033d0677827958887c3243f0f441bbcc9abdacb8fff63507593f689239b43d748c",
        scriptsig_asm:
          "OP_PUSHBYTES_72 30450221009e6968fd840ae93fe4f9ae434fa5a6c2a8b62fb1cc6252d2f4b02480feaae35a022064a74f908201b8666bbf2a12329764c5ad9ac55f3d05efa7e03560a884a368c301 OP_PUSHBYTES_33 033d0677827958887c3243f0f441bbcc9abdacb8fff63507593f689239b43d748c",
        is_coinbase: false,
        sequence: 4294967295,
      },
    ],
    vout: [
      {
        scriptpubkey: "76a9145e2360e18a5273e2c36a8809e08126b18eb1fa0988ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 5e2360e18a5273e2c36a8809e08126b18eb1fa09 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mp6iCDuPq3ZcLvW6bjUsNbErTCkFawKJvZ",
        value: 5000,
      },
      {
        scriptpubkey: "76a91493b17957330251fc9c0645d341e4b4a023f0be4788ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 93b17957330251fc9c0645d341e4b4a023f0be47 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mtytEMwbmr9SUcV6QQjHXqmuUdH5mEAcgM",
        value: 483348,
      },
    ],
    size: 226,
    weight: 904,
    fee: 230,
    status: {
      confirmed: true,
      block_height: 2196159,
      block_hash:
        "0000000000000039acdf8b3cd019aeac70d3fbc81db755b1b24113014bc3ec11",
      block_time: 1650281751,
    },
  },
  {
    txid: "7681bbe305e7db9fe42c635cfee79a6e6c5f38a9d249fcf6d6cdd797a265da3f",
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: "6ff109f202b51bddae6a22220d5ce7905340230d6e35b870c9b9f28cdb2cf7f7",
        vout: 1,
        prevout: {
          scriptpubkey: "76a91493b17957330251fc9c0645d341e4b4a023f0be4788ac",
          scriptpubkey_asm:
            "OP_DUP OP_HASH160 OP_PUSHBYTES_20 93b17957330251fc9c0645d341e4b4a023f0be47 OP_EQUALVERIFY OP_CHECKSIG",
          scriptpubkey_type: "p2pkh",
          scriptpubkey_address: "mtytEMwbmr9SUcV6QQjHXqmuUdH5mEAcgM",
          value: 488910,
        },
        scriptsig:
          "483045022100ac46eaa69f6de72f4f38aee7e2c0dd1cbecf47bb1929afcd8cc6d627abbcc23d0220301b4dddd52e657049b1502f2a2d8e4d7f29b08e5a7f3503b744b04b748168af0121033d0677827958887c3243f0f441bbcc9abdacb8fff63507593f689239b43d748c",
        scriptsig_asm:
          "OP_PUSHBYTES_72 3045022100ac46eaa69f6de72f4f38aee7e2c0dd1cbecf47bb1929afcd8cc6d627abbcc23d0220301b4dddd52e657049b1502f2a2d8e4d7f29b08e5a7f3503b744b04b748168af01 OP_PUSHBYTES_33 033d0677827958887c3243f0f441bbcc9abdacb8fff63507593f689239b43d748c",
        is_coinbase: false,
        sequence: 4294967295,
      },
    ],
    vout: [
      {
        scriptpubkey: "76a9145e2360e18a5273e2c36a8809e08126b18eb1fa0988ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 5e2360e18a5273e2c36a8809e08126b18eb1fa09 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mp6iCDuPq3ZcLvW6bjUsNbErTCkFawKJvZ",
        value: 100,
      },
      {
        scriptpubkey: "76a91493b17957330251fc9c0645d341e4b4a023f0be4788ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 93b17957330251fc9c0645d341e4b4a023f0be47 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "mtytEMwbmr9SUcV6QQjHXqmuUdH5mEAcgM",
        value: 488578,
      },
    ],
    size: 226,
    weight: 904,
    fee: 232,
    status: {
      confirmed: true,
      block_height: 2196158,
      block_hash:
        "0000000000000052a8d10941026a96b91ffc84bf9b3ff4a29cb2842084aa077a",
      block_time: 1650280764,
    },
  },
];

describe("test", () => {
  it("can undarstsand transaction history", async () => {
    const output = [];
    const amount = [];
    const address = "mp6iCDuPq3ZcLvW6bjUsNbErTCkFawKJvZ";

    for (let index = 0; index < transactions.length; index += 1) {
      const transaction = transactions[index];

      if (transaction.vin[0].prevout.scriptpubkey_address === address) {
        output.push("debit");
        let total = 0;
        for (let jndex = 0; jndex < transaction.vout.length; jndex += 1) {
          const vout = transaction.vout[jndex];
          if (vout.scriptpubkey_address !== address) {
            total += vout.value;
          }
        }
        amount.push(total);
      } else {
        output.push("credit");
        let total = 0;
        for (let kndex = 0; kndex < transaction.vout.length; kndex += 1) {
          const vout = transaction.vout[kndex];
          if (vout.scriptpubkey_address === address) {
            total += vout.value;
          }
        }
        amount.push(total);
      }
    }

    console.log(output);
    console.log(amount);
  });
});
