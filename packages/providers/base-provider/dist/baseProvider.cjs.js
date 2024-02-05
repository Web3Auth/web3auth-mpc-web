/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BaseProvider: () => (/* reexport */ BaseProvider),
  CommonJRPCProvider: () => (/* reexport */ CommonJRPCProvider),
  CommonPrivateKeyProvider: () => (/* reexport */ CommonPrivateKeyProvider),
  createRandomId: () => (/* reexport */ createRandomId)
});

;// CONCATENATED MODULE: external "@babel/runtime/helpers/objectSpread2"
const objectSpread2_namespaceObject = require("@babel/runtime/helpers/objectSpread2");
var objectSpread2_default = /*#__PURE__*/__webpack_require__.n(objectSpread2_namespaceObject);
;// CONCATENATED MODULE: external "@babel/runtime/helpers/defineProperty"
const defineProperty_namespaceObject = require("@babel/runtime/helpers/defineProperty");
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty_namespaceObject);
;// CONCATENATED MODULE: external "@metamask/rpc-errors"
const rpc_errors_namespaceObject = require("@metamask/rpc-errors");
;// CONCATENATED MODULE: external "@toruslabs/base-controllers"
const base_controllers_namespaceObject = require("@toruslabs/base-controllers");
;// CONCATENATED MODULE: external "@web3auth-mpc/base"
const base_namespaceObject = require("@web3auth-mpc/base");
;// CONCATENATED MODULE: ./src/baseProvider.ts





class BaseProvider extends base_controllers_namespaceObject.BaseController {
  constructor(_ref) {
    let {
      config,
      state
    } = _ref;
    super({
      config,
      state
    });
    // should be Assigned in setupProvider
    defineProperty_default()(this, "_providerEngineProxy", null);
    if (!config.chainConfig) throw base_namespaceObject.WalletInitializationError.invalidProviderConfigError("Please provide chainConfig");
    if (!config.chainConfig.chainId) throw base_namespaceObject.WalletInitializationError.invalidProviderConfigError("Please provide chainId inside chainConfig");
    if (!config.chainConfig.rpcTarget) throw base_namespaceObject.WalletInitializationError.invalidProviderConfigError("Please provide rpcTarget inside chainConfig");
    this.defaultState = {
      chainId: "loading"
    };
    this.defaultConfig = {
      chainConfig: config.chainConfig,
      networks: {
        [config.chainConfig.chainId]: config.chainConfig
      }
    };
    super.initialize();
  }
  get currentChainConfig() {
    return this.config.chainConfig;
  }
  get provider() {
    return this._providerEngineProxy;
  }
  get chainId() {
    return this.state.chainId;
  }
  set provider(_) {
    throw new Error("Method not implemented.");
  }
  async request(args) {
    var _this$provider;
    if (!args || typeof args !== "object" || Array.isArray(args)) {
      throw rpc_errors_namespaceObject.rpcErrors.invalidRequest({
        message: base_namespaceObject.WalletProviderError.invalidRequestArgs().message,
        data: objectSpread2_default()(objectSpread2_default()({}, args || {}), {}, {
          cause: base_namespaceObject.WalletProviderError.invalidRequestArgs().message
        })
      });
    }
    const {
      method,
      params
    } = args;
    if (typeof method !== "string" || method.length === 0) {
      throw rpc_errors_namespaceObject.rpcErrors.invalidRequest({
        message: base_namespaceObject.WalletProviderError.invalidRequestMethod().message,
        data: objectSpread2_default()(objectSpread2_default()({}, args || {}), {}, {
          cause: base_namespaceObject.WalletProviderError.invalidRequestMethod().message
        })
      });
    }
    if (params !== undefined && !Array.isArray(params) && (typeof params !== "object" || params === null)) {
      throw rpc_errors_namespaceObject.rpcErrors.invalidRequest({
        message: base_namespaceObject.WalletProviderError.invalidRequestParams().message,
        data: objectSpread2_default()(objectSpread2_default()({}, args || {}), {}, {
          cause: base_namespaceObject.WalletProviderError.invalidRequestParams().message
        })
      });
    }
    return (_this$provider = this.provider) === null || _this$provider === void 0 ? void 0 : _this$provider.request(args);
  }
  sendAsync(req, callback) {
    if (callback) return this.send(req, callback);
    return this.request(req);
  }
  send(req, callback) {
    this.request(req).then(res => callback(null, {
      result: res
    })).catch(err => callback(err, null));
  }
  addChain(chainConfig) {
    if (!chainConfig.chainId) throw rpc_errors_namespaceObject.rpcErrors.invalidParams("chainId is required");
    if (!chainConfig.rpcTarget) throw rpc_errors_namespaceObject.rpcErrors.invalidParams("chainId is required");
    this.configure({
      networks: objectSpread2_default()(objectSpread2_default()({}, this.config.networks), {}, {
        [chainConfig.chainId]: chainConfig
      })
    });
  }
  getChainConfig(chainId) {
    var _this$config$networks;
    const chainConfig = (_this$config$networks = this.config.networks) === null || _this$config$networks === void 0 ? void 0 : _this$config$networks[chainId];
    if (!chainConfig) throw rpc_errors_namespaceObject.rpcErrors.invalidRequest(`Chain ${chainId} is not supported, please add chainConfig for it`);
    return chainConfig;
  }
  updateProviderEngineProxy(provider) {
    if (this._providerEngineProxy) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._providerEngineProxy.setTarget(provider);
    } else {
      this._providerEngineProxy = (0,base_controllers_namespaceObject.createEventEmitterProxy)(provider);
    }
  }
  getProviderEngineProxy() {
    return this._providerEngineProxy;
  }
}
;// CONCATENATED MODULE: external "@toruslabs/openlogin-jrpc"
const openlogin_jrpc_namespaceObject = require("@toruslabs/openlogin-jrpc");
;// CONCATENATED MODULE: ./src/jrpcClient.ts


function createChainIdMiddleware(chainId) {
  return (req, res, next, end) => {
    if (req.method === "chainId") {
      res.result = chainId;
      return end();
    }
    return next();
  };
}
function createProviderConfigMiddleware(providerConfig) {
  return (req, res, next, end) => {
    if (req.method === "provider_config") {
      res.result = providerConfig;
      return end();
    }
    return next();
  };
}
function createJsonRpcClient(providerConfig) {
  const {
    chainId,
    rpcTarget
  } = providerConfig;
  const fetchMiddleware = (0,base_controllers_namespaceObject.createFetchMiddleware)({
    rpcTarget
  });
  const networkMiddleware = (0,openlogin_jrpc_namespaceObject.mergeMiddleware)([createChainIdMiddleware(chainId), createProviderConfigMiddleware(providerConfig), fetchMiddleware]);
  return {
    networkMiddleware,
    fetchMiddleware
  };
}
;// CONCATENATED MODULE: ./src/CommonJRPCProvider.ts

var _class;





class CommonJRPCProvider extends BaseProvider {
  constructor(_ref) {
    let {
      config,
      state
    } = _ref;
    super({
      config,
      state
    });
  }
  async setupProvider() {
    const {
      networkMiddleware
    } = createJsonRpcClient(this.config.chainConfig);
    const engine = new openlogin_jrpc_namespaceObject.JRPCEngine();
    engine.push(networkMiddleware);
    const provider = (0,openlogin_jrpc_namespaceObject.providerFromEngine)(engine);
    this.updateProviderEngineProxy(provider);
    const newChainId = this.config.chainConfig.chainId;
    if (this.state.chainId !== newChainId) {
      this.emit("chainChanged", newChainId);
      this.emit("connect", {
        chainId: newChainId
      });
    }
    this.update({
      chainId: this.config.chainConfig.chainId
    });
  }
  async switchChain(params) {
    if (!this._providerEngineProxy) throw rpc_errors_namespaceObject.providerErrors.custom({
      message: "Provider is not initialized",
      code: 4902
    });
    const chainConfig = this.getChainConfig(params.chainId);
    this.update({
      chainId: "loading"
    });
    this.configure({
      chainConfig
    });
    await this.setupProvider();
  }
  updateProviderEngineProxy(provider) {
    if (this._providerEngineProxy) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._providerEngineProxy.setTarget(provider);
    } else {
      this._providerEngineProxy = (0,base_controllers_namespaceObject.createEventEmitterProxy)(provider);
    }
  }
  getProviderEngineProxy() {
    return this._providerEngineProxy;
  }
  lookupNetwork() {
    throw new Error("Method not implemented.");
  }
}
_class = CommonJRPCProvider;
defineProperty_default()(CommonJRPCProvider, "getProviderInstance", async params => {
  const providerFactory = new _class({
    config: {
      chainConfig: params.chainConfig
    }
  });
  await providerFactory.setupProvider();
  return providerFactory;
});
;// CONCATENATED MODULE: ./src/commonPrivateKeyProvider.ts


var commonPrivateKeyProvider_class;




class CommonPrivateKeyProvider extends BaseProvider {
  constructor(_ref) {
    let {
      config,
      state
    } = _ref;
    super({
      config: {
        chainConfig: objectSpread2_default()(objectSpread2_default()({}, config.chainConfig), {}, {
          chainNamespace: base_namespaceObject.CHAIN_NAMESPACES.OTHER
        })
      },
      state
    });
    // should be Assigned in setupProvider
    defineProperty_default()(this, "_providerEngineProxy", null);
  }
  get provider() {
    return this._providerEngineProxy;
  }
  set provider(_) {
    throw new Error("Method not implemented.");
  }
  addChain(_) {
    throw new Error("Method not implemented.");
  }
  async setupProvider(privKey) {
    const privKeyMiddleware = this.getPrivKeyMiddleware(privKey);
    const engine = new openlogin_jrpc_namespaceObject.JRPCEngine();
    engine.push(privKeyMiddleware);
    const provider = (0,openlogin_jrpc_namespaceObject.providerFromEngine)(engine);
    this.updateProviderEngineProxy(provider);
  }
  updateProviderEngineProxy(provider) {
    if (this._providerEngineProxy) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._providerEngineProxy.setTarget(provider);
    } else {
      this._providerEngineProxy = (0,base_controllers_namespaceObject.createEventEmitterProxy)(provider);
    }
  }
  async switchChain(_) {
    return Promise.resolve();
  }
  getProviderEngineProxy() {
    return this._providerEngineProxy;
  }
  async lookupNetwork() {
    return Promise.resolve("");
  }
  getPrivKeyMiddleware(privKey) {
    const middleware = {
      getPrivatekey: async () => {
        return privKey;
      }
    };
    return this.createPrivKeyMiddleware(middleware);
  }
  createPrivKeyMiddleware(_ref2) {
    let {
      getPrivatekey
    } = _ref2;
    async function getPrivatekeyHandler(_, res) {
      res.result = await getPrivatekey();
    }
    return (0,openlogin_jrpc_namespaceObject.createScaffoldMiddleware)({
      private_key: (0,openlogin_jrpc_namespaceObject.createAsyncMiddleware)(getPrivatekeyHandler)
    });
  }
}
commonPrivateKeyProvider_class = CommonPrivateKeyProvider;
defineProperty_default()(CommonPrivateKeyProvider, "getProviderInstance", async params => {
  const providerFactory = new commonPrivateKeyProvider_class({
    config: {
      chainConfig: params.chainConfig
    }
  });
  await providerFactory.setupProvider(params.privKey);
  return providerFactory;
});
;// CONCATENATED MODULE: external "json-rpc-random-id"
const external_json_rpc_random_id_namespaceObject = require("json-rpc-random-id");
var external_json_rpc_random_id_default = /*#__PURE__*/__webpack_require__.n(external_json_rpc_random_id_namespaceObject);
;// CONCATENATED MODULE: ./src/utils.ts

const createRandomId = external_json_rpc_random_id_default()();
;// CONCATENATED MODULE: ./src/index.ts




module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=baseProvider.cjs.js.map