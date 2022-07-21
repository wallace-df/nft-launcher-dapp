<template>
  <div>

    <!-- Navbar Section -->
    <nav class="navbar">
      <div class="navbar__container">
        <a href="/" id="navbar__logo">NFT Collection Launcher </a>
        <div class="navbar__toggle" id="mobile-menu">
          <span class="bar"> </span>
          <span class="bar"> </span>
          <span class="bar"> </span>
        </div>
        <ul class="navbar__menu">
          <li style="margin-left: 0.75rem">
            <Wallet @connected="walletConnected" @disconnected="walletDisconnected" />
          </li>
        </ul>
      </div>
    </nav>

    <!-- Launch Section -->
    <div class="images m-0 pt-4">
      <h1>{{launchResult? 'Collection Launched!' : 'Launch your NFT Collection'}}</h1>
      <div v-if="loading">
        <div style="display:flex; align-items:center; justify-content: center; height:50vh">
            <div class="text-center">
              <div class="fs-3 text-info mb-2">{{status}}</div>
              <div class="spinner-border text-primary" role="status"><span class="sr-only"></span></div>
            </div>
        </div>
      </div>
      <div v-else-if="launchResult" style="width: 500px; text-align: center">
        <h4 style="color: #ffffcc; height: 45vh">
          Collection address: <input readonly :value="launchResult.collectionAddress" class="form-control"/><br/>
          Contract metadata URI: <input readonly :value="launchResult.contractMetadataURI" class="form-control"/><br/>
          Base tokenURI: <input readonly :value="launchResult.baseTokenURI" class="form-control"/><br/>
        </h4>
      </div>
      <form v-else>
        <div class="form-container">
          <div class="form-group" style="padding-top: 0; margin-top:0">
            <label>Collection name </label>
            <input
              type="text"
              class="form-control"
              v-model="collectionName"
              :disabled="loading"
              maxlength="30"
            />
          </div>
          <div class="form-group">
            <label>Collection description </label>
            <textarea
              class="form-control"
              v-model="collectionDescription"
              :disabled="loading"
            >
            </textarea>
          </div>
          <div class="form-group">
            <label>Collection front-image (.png, .gif) </label>
            <input
              class="form-control"
              type="file"
              directory
              ref="collectionImage"
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label>Images folder (.png) </label>
            <input
              class="form-control"
              type="file"
              webkitdirectory="true"
              directory
              ref="imageItens"
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label>Metadata folder (.json) </label>
            <input
              class="form-control"
              type="file"
              webkitdirectory="true"
              directory
              ref="metadataItems"
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label>Mint price </label>
            <input
              type="text"
              class="form-control"
              :disabled="loading"
              v-model="mintPrice"
            />
          </div>
        </div>
        <div class="text-center">
          <button
            class="btn btn-primary mt-4"
            @click="launch"
            onclick="return false"
            :disabled="loading || !connected"
          >
            {{loading ? status : 'Launch Collection'}}
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script>
import Wallet from "./Wallet.vue";

import NFTLauncher from "../../js/launcher.js";
import Utils from "../../js/utils.js";

export default {
    name: "NFTCollectionLauncher",

    components: { Wallet },

    data() {
        return {
          connected: false,
          loading: false,
          status: "",
          launchResult: null,
          
          collectionName: null,
          collectionDescription: null,
          mintPrice: null,
        }
    },

    methods: {

        walletConnected() {
          this.connected = true;
        },

        walletDisconnected() {
          this.connected = false;
        },

        async launch() {

          if (Utils.isEmpty(this.collectionName)) {
            this.handleError("Please enter the collection name.");
            return;
          }
          if (Utils.isEmpty(this.collectionDescription)) {
            this.handleError("Please enter the collection description.");
            return;
          }

          if (this.$refs.collectionImage.files.length === 0) {
            this.handleError("Please select the collection front-image.");
            return;
          }

          let collectionImage = this.$refs.collectionImage.files[0];
          let imageItems = this.$refs.imageItens.files;
          let metadataItems = this.$refs.metadataItems.files;

          if (imageItems.length === 0) {
            this.handleError("Please select the images folder.");
            return;
          }

          if (metadataItems.length === 0) {
            this.handleError("Please select the metadata folder.");
            return;
          }

          if (imageItems.length !== metadataItems.length) {
            this.handleError("The number of images and metadata items do not match!");
            return;
          }

          if (!Utils.isValidAmount(this.mintPrice)) {
              this.handleError("Invalid mint price.");
              return;
          }

          let ctx = this;
          this.loading = true;
          this.$eventBus.emit("loading", true);
          this.status = "Processing resources...";

          let resources = {
            collectionImage: collectionImage,
            imageItems: [],
            metadataItems: []
          };

          let images = {};
          let jsons = {};
          for (let i = 0; i < imageItems.length; i++) {
            images[imageItems[i].name.toLowerCase()] = imageItems[i];
            jsons[metadataItems[i].name.toLowerCase()] = metadataItems[i];
          }

          function processResources(itemCount, callback) {
              if (itemCount > imageItems.length) {
                  callback(null, null);
                  return;
              }
    
              let image = images[itemCount + ".png"];
              let json = jsons[itemCount + ".json"];

              if (image === undefined) {
                callback("Missing image: " + itemCount + ".png", null);
                return;
              }

              if (json === undefined) {
                callback("Missing json: " + itemCount + ".json", null);
                return;
              }

              Utils.readFileAsJson(json, function(err, metadata) {
                  if (err) {
                    callback(err, null);
                    return;
                  }

                  if (Utils.isEmpty(metadata.name)) {
                      callback("Missing name for item: " + json.name, null);
                      return;
                  }

                  if (Utils.isEmpty(metadata.description)) {
                      callback("Missing description for item: " + json.name, null);
                      return;
                  }

                  metadata.name = metadata.name.replace("{{ID}}", itemCount);
                  metadata.description = metadata.description.replace("{{ID}}", itemCount);
                  
                  resources.imageItems.push(image);
                  resources.metadataItems.push(metadata);

                  processResources(itemCount+1, callback);
              });
          }

          processResources(1, async function(err){
            if (err){
              ctx.handleError(err);
              return;
            }

            try {
              let progressCallback = function(statusMsg) {
                ctx.status = statusMsg;
              };
              ctx.launchResult = await NFTLauncher.launchNFTCollection(ctx.collectionName, ctx.collectionDescription, resources, Utils.toBaseUnit(ctx.mintPrice, 18).toString(), progressCallback);
              console.log(ctx.launchResult);
              ctx.loading = false;
              ctx.$eventBus.emit("loading", false);
            } catch(err) {
              ctx.handleError(err);
            }
          });

        },

        handleError(err) {
          console.log(err);
          this.loading = false;
          this.$eventBus.emit("loading", false);
          let error;
          if (err.data && err.data.data && err.data.data.message) {
              error = err.data.data.message;
          } else if (err.message) {
              error = err.message;
          } else {
              error = err;
          }

          window["$"]("#errorMsg").text(error);
          window["$"]("#errorModal").modal("show");
        },

        showSuccess(msg) {
          window["$"]("#successMsg").text(msg);
          window["$"]("#successModal").modal("show");
        }

    }
}
</script>

<style>
</style>
