import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";
import { Contract as zkSyncContract } from "zksync-web3";
import { Contract as StarknetContract } from "starknet";

import Config from "../../resources/config.js";
import Wallet from "./wallet.js";
import Utils from "./utils.js";

export default {

    async launchNFTCollection(collectionName, collectionDescription, resources, mintPrice, progressCallback) {
        let walletInstance = await Wallet.getInstance();

        if (!walletInstance) {
            throw Error("Please connect your wallet.");
        }

        if (progressCallback) {
            progressCallback("Deploying assets to IPFS...");
        }

        let nftStorageService = new NFTStorage({ token: Config.apiKeys.nftStorage });
        let collectionImageCID = await nftStorageService.storeBlob(resources.collectionImage);
        let collectionInfo = {
            name: collectionName,
            description: collectionDescription,
            image: "ipfs://" + collectionImageCID
        };
        let metadataFiles = [];
        metadataFiles.push(new File([JSON.stringify(collectionInfo, null, 2)], "collection.json"));

        let imagesCID = await nftStorageService.storeDirectory(resources.imageItems);

        for (let itemCount = 1; itemCount <= resources.metadataItems.length; itemCount++) {
            let metadata = resources.metadataItems[itemCount - 1];
            metadata.image = "ipfs://" + imagesCID + "/" + itemCount + ".png";
            metadataFiles.push(new File([JSON.stringify(metadata, null, 2)], "items/" + itemCount));
        }

        let metadataCID = await nftStorageService.storeDirectory(metadataFiles);

        let contractMetadataURI = `ipfs://${metadataCID}/collection.json`;
        let baseTokenURI = `ipfs://${metadataCID}/items/`;

        if (walletInstance.network === Wallet.networks.starkNet.testnet) {
            let nameFelt = Utils.strToFelt(collectionName).toString();
            let symbolFelt = Utils.strToFelt("NFT").toString();
            let contractMetadataURIFelts = Utils.strToFeltArr(contractMetadataURI).map(f => f.toString());
            let baseTokenURIFelts = Utils.strToFeltArr(baseTokenURI).map(f => f.toString());
            let maxTokenSupply = Utils.bnToUint256(Utils.toBN(resources.metadataItems.length));
            let mintPriceFelts = Utils.bnToUint256(mintPrice);

            if (progressCallback) {
                progressCallback("Deploying NFT Collection to StarkNet...");
            }

            let nftContract = new StarknetContract(Config.abis.starkNet.nftCollectionLauncher, Config.contractAddresses.starkNet.testnet.nftCollectionLauncher, walletInstance.account);
            let response = await nftContract.launchCollection(nameFelt, symbolFelt, contractMetadataURIFelts, baseTokenURIFelts, maxTokenSupply, mintPriceFelts);    
            await walletInstance.provider.waitForTransaction(response.transaction_hash);

            let txReceipt = await walletInstance.provider.getTransactionReceipt(response.transaction_hash);
            let nftLaunchedEvent = txReceipt.events.filter(event => BigInt(event.from_address) == BigInt(Config.contractAddresses.starkNet.testnet.nftCollectionLauncher));

            if (nftLaunchedEvent.length === 0) {
                throw Error("Failure getting NFT Collection address...");
            }
            return {
                collectionAddress: nftLaunchedEvent[0].data[0],
                contractMetadataURI: contractMetadataURI,
                baseTokenURI: baseTokenURI
            }
        } else if (walletInstance.network === Wallet.networks.zkSync.testnet) {
            let walletInstance = await Wallet.getInstance();
            let nftCollectionLauncher = new zkSyncContract(Config.contractAddresses.zkSync.testnet.nftCollectionLauncher, Config.abis.zkSync.nftCollectionLauncher, walletInstance.signer);

            if (progressCallback) {
                progressCallback("Deploying NFT Collection to zkSync...");
            }
            let txHandle = await nftCollectionLauncher.launchCollection(collectionName, "NFT", contractMetadataURI, baseTokenURI, resources.metadataItems.length, mintPrice);
            let result = await txHandle.wait();
            let nftLaunchedEvent = result.events.filter(ev => ev.event === "NFTCollectionLaunched");

            if (nftLaunchedEvent.length === 0) {
                throw Error("Failure getting NFT Collection address...");
            }
            return {
                collectionAddress: nftLaunchedEvent[0].args[0],
                contractMetadataURI: contractMetadataURI,
                baseTokenURI: baseTokenURI
            }
        } else {
            throw Error("Unsupported network: " + walletInstance.network);
        }
    }
}