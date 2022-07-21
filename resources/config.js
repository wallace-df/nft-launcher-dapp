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
                nftCollectionLauncher: "0x03f1c297B94de072c39c1974A2AB9d20750DFa3a"
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