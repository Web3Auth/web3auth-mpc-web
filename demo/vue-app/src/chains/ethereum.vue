<template>
  <div id="app">
    <h2>Login with Web3Auth and Ethereum</h2>
    <Loader :isLoading="loading"></Loader>

    <section
      :style="{
        fontSize: '12px',
      }"
    >
      <button class="rpcBtn" v-if="!provider" @click="connect" style="cursor: pointer">Connect</button>
      <button class="rpcBtn" v-if="provider" @click="logout" style="cursor: pointer">Logout</button>
      <button class="rpcBtn" v-if="provider" @click="getUserInfo" style="cursor: pointer">Get User Info</button>
      <button class="rpcBtn" v-if="provider" @click="authenticateUser" style="cursor: pointer">Get Auth Id token</button>
      <EthRpc
        :connectedAdapter="web3auth.connectedAdapterName"
        v-if="provider"
        :provider="provider"
        :uiConsole="uiConsole"
        :web3auth="web3auth"
      ></EthRpc>

      <!-- <button @click="showError" style="cursor: pointer">Show Error</button> -->
    </section>
    <div id="console" style="white-space: pre-line">
      <p style="white-space: pre-line"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { OPENLOGIN_NETWORK_TYPE } from "@toruslabs/openlogin-utils";
import { ADAPTER_STATUS, CHAIN_NAMESPACES, CONNECTED_EVENT_DATA, CustomChainConfig, LoginMethodConfig } from "@web3auth/base";
// import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { getWalletConnectV2Settings, WalletConnectV2Adapter } from "@web3auth/wallet-connect-v2-adapter";
import { WALLET_ADAPTERS } from "@web3auth-mpc/base";
import { defineComponent } from "vue";

import Loader from "@/components/loader.vue";

import config from "../config";
import EthRpc from "../rpc/ethRpc.vue";

const tssServerEndpoint = "https://swaraj-test-coordinator-1.k8.authnetwork.dev/tss";
const tssImportURL = "https://cloudflare-ipfs.com/ipfs/QmWxSMacBkunyAcKkjuDTU9yCady62n3VGW2gcUEcHg6Vh";

const ethChainConfig: Partial<CustomChainConfig> & Pick<CustomChainConfig, "chainNamespace"> = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  ticker: "ETH",
  tickerName: "Ethereum",
};

export default defineComponent({
  name: "EthereumChain",
  props: {
    plugins: {
      type: Object,
      default: () => ({}),
    },
    adapterConfig: {
      type: Object,
    },
    openloginNetwork: {
      type: String,
      default: "testnet",
    },
  },
  watch: {
    adapterConfig: async function (newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      await this.initEthAuth();
    },
    openloginNetwork: async function (newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      await this.initEthAuth();
    },
  },
  data() {
    return {
      modalConfig: {},
      loading: false,
      loginButtonStatus: "",
      connecting: false,
      provider: undefined,
      web3auth: new Web3Auth({
        chainConfig: { chainNamespace: CHAIN_NAMESPACES.EIP155 },
        clientId: config.clientId[this.openloginNetwork],
        enableLogging: true,
        web3AuthNetwork: this.openloginNetwork as OPENLOGIN_NETWORK_TYPE,
      }),
    };
  },
  components: {
    EthRpc,
    Loader,
  },

  async mounted() {
    await this.initEthAuth();
  },
  methods: {
    parseConfig() {
      this.adapterConfig.adapter.forEach((adapterConf) => {
        this.modalConfig[adapterConf.id] = {
          name: adapterConf.name,
          showOnModal: adapterConf.checked,
        };
        if (adapterConf.id === "openlogin") {
          const loginMethodsConfig: LoginMethodConfig = {};
          this.adapterConfig.login.forEach((loginProvider) => {
            loginMethodsConfig[loginProvider.id] = {
              name: loginProvider.name,
              showOnModal: loginProvider.checked,
            };
          });
          this.modalConfig[adapterConf.id] = {
            ...this.modalConfig[adapterConf.id],
            loginMethods: loginMethodsConfig,
          };
        }
      });
    },
    async initEthAuth() {
      try {
        this.parseConfig();
        this.loading = true;
        this.web3auth = new Web3Auth({
          chainConfig: ethChainConfig,
          clientId: config.clientId[this.openloginNetwork],
          authMode: "DAPP",
          enableLogging: true,
          web3AuthNetwork: this.openloginNetwork,
        });

        let getTSSData: () => Promise<{
          tssShare: string;
          signatures: string[];
        }>;
        const tssGetPublic = async () => {
          if (!getTSSData) {
            throw new Error("tssShare / sigs are undefined");
          }
          const { tssShare, signatures } = await getTSSData();
          const pubKey = await getPublicKeyFromTSSShare(tssShare, signatures);
          return Buffer.from(pubKey, "base64");
        };
        const clients: { client: Client; allocated: boolean }[] = [];
        const tssSign = async (msgHash: Buffer) => {
          for (let i = 0; i < clients.length; i++) {
            const client = clients[i];
            if (!client.allocated) {
              client.allocated = true;
              await client.client;
              await tss.default(tssImportURL);
              const { r, s, recoveryParam } = await client.client.sign(tss as any, Buffer.from(msgHash).toString("base64"), true, "", "keccak256");
              return { v: recoveryParam + 27, r: Buffer.from(r.toString("hex"), "hex"), s: Buffer.from(s.toString("hex"), "hex") };
            }
          }
          throw new Error("no available clients, please generate precomputes first");
        };
        const generatePrecompute = async (verifierName: string, verifierId: string) => {
          if (!getTSSData) {
            throw new Error("tssShare and signatures are not defined");
          }
          const { tssShare, signatures } = await getTSSData();
          const pubKey = (await tssGetPublic()).toString("base64");
          const client = await setupTSS(tssShare, pubKey, verifierName, verifierId);
          await tss.default(tssImportURL);
          client.precompute(tss as any);
          await client.ready();
          clients.push({ client, allocated: false });
        };
        (window as any).generatePrecompute = generatePrecompute;
        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "mandatory",
          },
          tssSettings: {
            useTSS: true,
            tssGetPublic,
            tssSign,
            tssDataCallback: async (tssDataReader) => {
              getTSSData = tssDataReader;
            },
          },
          adapterSettings: {
            network: this.openloginNetwork as OPENLOGIN_NETWORK_TYPE,
            clientId: config.clientId[this.openloginNetwork],
          },
        });
        (window as any).openloginAdapter = openloginAdapter;

        // by default, web3auth modal uses wallet connect v1,
        // if you want to use wallet connect v2, configure wallet-connect-v2-adapter
        // as shown below.
        // NOTE: if you will configure both wc1 and wc2, precedence will be given to wc2
        const defaultWcSettings = await getWalletConnectV2Settings(
          ethChainConfig.chainNamespace,
          [parseInt(ethChainConfig.chainId, 16), parseInt("0x89", 16), 5],
          "04309ed1007e77d1f119b85205bb779d"
        );
        console.log("defaultWcSettings", JSON.stringify(defaultWcSettings));
        const wc2Adapter = new WalletConnectV2Adapter({
          adapterSettings: { ...defaultWcSettings.adapterSettings },
          chainConfig: ethChainConfig,
          loginSettings: defaultWcSettings.loginSettings,
        });

        this.web3auth.configureAdapter(wc2Adapter);

        this.web3auth.configureAdapter(openloginAdapter);
        if (this.plugins["torusWallet"]) {
          const torusPlugin = new TorusWalletConnectorPlugin({
            torusWalletOpts: {},
            walletInitOptions: {
              whiteLabel: {
                theme: { isDark: true, colors: { primary: "#00a8ff" } },
                logoDark: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                logoLight: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
              },
              useWalletConnect: true,
              enableLogging: true,
            },
          });
          await this.web3auth.addPlugin(torusPlugin);
        }
        this.subscribeAuthEvents(this.web3auth);

        await this.web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.METAMASK]: {
              showOnDesktop: true,
              showOnModal: true,
              showOnMobile: true,
              label: "Metamask",
            },
            [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
              showOnDesktop: true,
              showOnModal: true,
              showOnMobile: true,
              label: "Wallet Connect",
            },
            [WALLET_ADAPTERS.TORUS_EVM]: {
              showOnDesktop: true,
              showOnModal: true,
              showOnMobile: true,
              label: "Torus",
            },
            [WALLET_ADAPTERS.OPENLOGIN]: {
              showOnDesktop: true,
              showOnModal: true,
              showOnMobile: true,
              label: "OpenLogin",
            },
          },
        });
      } catch (error) {
        console.log("error", error);
        this.uiConsole("error", error);
      } finally {
        this.loading = false;
      }
    },
    subscribeAuthEvents(web3auth: Web3Auth) {
      web3auth.on(ADAPTER_STATUS.CONNECTED, async (data: CONNECTED_EVENT_DATA) => {
        this.uiConsole("connected to wallet", data);
        this.provider = web3auth.provider;
        this.loginButtonStatus = "Logged in";
      });
      web3auth.on(ADAPTER_STATUS.CONNECTING, () => {
        this.uiConsole("connecting");
        this.connecting = true;
        this.loginButtonStatus = "Connecting...";
      });
      web3auth.on(ADAPTER_STATUS.DISCONNECTED, () => {
        this.uiConsole("disconnected");
        this.loginButtonStatus = "";
        this.provider = undefined;
      });
      web3auth.on(ADAPTER_STATUS.ERRORED, (error) => {
        console.log("error", error);
        this.uiConsole("errored", error);
        this.loginButtonStatus = "";
      });
      // web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
      //   this.connecting = isVisible;
      // });
    },
    async connect() {
      try {
        const web3authProvider = await this.web3auth.connect();
        this.provider = web3authProvider;
      } catch (error) {
        console.error(error);
        this.uiConsole("error", error);
      }
    },

    async logout() {
      await this.web3auth.logout();
      this.provider = undefined;
    },
    async getUserInfo() {
      const userInfo = await this.web3auth.getUserInfo();
      this.uiConsole(userInfo);
    },
    async authenticateUser() {
      const idTokenDetails = await this.web3auth.authenticateUser();
      this.uiConsole(idTokenDetails);
    },
    uiConsole(...args: unknown[]): void {
      const el = document.querySelector("#console>p");
      if (el) {
        el.innerHTML = JSON.stringify(args || {}, (key, value) => (typeof value === "bigint" ? value.toString() : value), 2);
      }
    },
  },
});
</script>
