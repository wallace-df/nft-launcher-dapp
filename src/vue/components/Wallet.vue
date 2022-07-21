<template>
  <div class="wallet-container">
    <span class="text-warning">{{connectedWallet ? connectedWallet.network : ''}}</span>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" :disabled="loading">
        {{connectedWallet ? formattedAddress : 'Connect wallet'}}
      </button>
      <ul class="dropdown-menu">
        <!-- Not connected wallet -->
        <li v-if="!connectedWallet">
          <a class="dropdown-item" href="javascript:void(0)" @click="connectWallet('StarkNet-testnet')">StarkNet (testnet)</a>
        </li>
        <li v-if="!connectedWallet">
          <a class="dropdown-item" href="javascript:void(0)" @click="connectWallet('zkSync-testnet')">zkSync (testnet)</a>
        </li>
        <!-- Connected wallet -->
        <li v-if="connectedWallet">
          <a class="dropdown-item" href="javascript:void(0)" @click="disconnectWallet()">Disconnect</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Wallet from "../../js/wallet.js";

export default {
    name: "Wallet",


    created() {
      this.$eventBus.on('loading', (loadingFlag) => this.loading = loadingFlag);
    },

    data() {
        return {
          connectedWallet: null,
          loading: false
        }
    },

    computed: {
      formattedAddress() {
        if (this.connectedWallet) {
          let address = this.connectedWallet.address;
          return address.substring(0, 7) + "..." + address.slice(-5);
        }
        return "";
      }
    },

    methods: {

        async connectWallet(network) {
          if (this.connectedWallet === null) {
            let ctx = this;
            try {
              await Wallet.initInstance(network);
              let walletInstance = await Wallet.getInstance()
              this.connectedWallet = {network: network, address: walletInstance.address};
              ctx.$emit("connected", this.connectedWallet.address);
              Wallet.setEventListener({
                onAddressChanged(newAddress) {
                  ctx.connectedWallet.address = newAddress;
                  ctx.$emit("connected", newAddress);
                },
                onDisconnect() {
                  ctx.disconnectWallet();
                }
              }); 
            } catch(err) {
              this.handleError(err);
            }
          }
        },


        async disconnectWallet() {
          Wallet.clearInstance();
          this.connectedWallet = null;
          this.$emit("disconnected");
        },


        handleError(err) {
          console.log(err);
          this.loading = false;
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
  .wallet-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wallet-container span {
    margin-right: 1rem;
    font-weight: bold;
  }
</style>
