# NFT Collection Launcher
Frontend implementation for the NFT Collection Launcher using Vue.js.

---

NFT Launcher is a dApp that provides an interface for:

- Processing, bundling and uploading NFT assets (.json, .png) to IPFS via NFTStorage API (https://nft.storage/).
- Automatically deploying the NFT minter contracts to the following networks:
  - StarkNet (testnet) - https://starknet.io/
  - zkSync (testnet) -  https://zksync.io/

--- 

![NFT Collection Launcher](/nft-collection-launcher.png?raw=true "NFT Collection Launcher")

---

### Install dependencies

```shell
yarn install
```

### Create the *resources/keys.json* file and set your NFTStorage API Key:

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
