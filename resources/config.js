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
                nftCollectionLauncher: "0x015053cecf6e053e91c1ceb1b4b6a181aea7e04c5997208da2852c084cd4ce94"
            }
        }
    },

    providers: {
        zkSync: {
            testnet: 'https://zksync2-testnet.zksync.dev'
        }
    }
}