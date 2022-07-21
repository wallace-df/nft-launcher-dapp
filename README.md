# NFT Collection Launcher
Vue.js powered webapp for the NFT Collection Launcher. It provides an interface for:

1. Processing, bundling and uploading NFT assets (.json, .png) to IPFS via NFTStorage API (https://nft.storage/). 
2. Automatically deploying the NFT minter contracts to the following networks:
   - StarkNet (testnet)
   - zkSync (testnet)


![NFT Collection Launcher](/nft-collection-launcher.png?raw=true "NFT Collection Launcher")

### Install dependencies

```shell
yarn install
```

### Set your NFTStorage API Key in the *resources/keys.json* file:

```json
{
    "nftStorage": "<YOUR NFT STORAGE API KEY>"
}
```

### Start development server with hot-reload

```shell
yarn serve
```


### Build

```shell
yarn build
```
