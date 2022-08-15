export default {

    apiKeys: {
        nftStorage: require("./keys.json").nftStorage
    },

    abis: { 
        starkNet: {
            nftCollectionLauncher: require("./abis/cairo/NFTCollectionLauncher.json")
        },

        zkSync: {
            nftCollectionLauncher: require("./abis/solidity/NFTCollectionLauncher.json")
        }
    },

    contractAddresses: {
        zkSync: {
            testnet: {
                nftCollectionLauncher: "0x8C0242a261f1BdD8A12a65e307f9F0Cc26C101B9"
            }
        },
        starkNet: {
            testnet: {
                nftCollectionLauncher: "0x02359ff9ca3c91df0c85afbc6ca8a48a8c9da54742f2775dee4816bea24ed1a1"
            }
        }
    },

    providers: {
        zkSync: {
            testnet: 'https://zksync2-testnet.zksync.dev'
        }
    }
}