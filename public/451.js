"use strict";
(self["webpackChunk_uniswap_widgets"] = self["webpackChunk_uniswap_widgets"] || []).push([[451],{

/***/ 41451:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getClientSideQuoteResult: () => (/* binding */ getClientSideQuoteResult)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(4942);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(15861);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64687);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _uniswap_sdk_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98260);
/* harmony import */ var _uniswap_smart_order_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14982);
/* harmony import */ var _index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71971);
/* harmony import */ var jsbi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(39499);
/* harmony import */ var jsbi__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jsbi__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _uniswap_router_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10443);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(48764);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(67294);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(34862);
/* harmony import */ var rebass__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1237);
/* harmony import */ var _web3_react_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(77985);
/* harmony import */ var _web3_react_core__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_web3_react_core__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _uniswap_universal_router_sdk__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(9897);
/* harmony import */ var _uniswap_v2_sdk__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(34178);
/* harmony import */ var _uniswap_v3_sdk__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(37976);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(80129);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _uniswap_redux_multicall__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(99675);
/* harmony import */ var _uniswap_permit2_sdk__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(10254);
/* harmony import */ var _uniswap_conedison_provider_signing__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(35061);
/* harmony import */ var _uniswap_conedison_format__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(18097);
/* harmony import */ var popper_max_size_modifier__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(12541);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(73935);
/* harmony import */ var cids__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(98878);
/* harmony import */ var cids__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(cids__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var multicodec__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(76883);
/* harmony import */ var multicodec__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(multicodec__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var multihashes__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(18370);
/* harmony import */ var multihashes__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(multihashes__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var wicg_inert__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(41102);
/* harmony import */ var wicg_inert__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/__webpack_require__.n(wicg_inert__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */ var node_vibrant_lib_bundle_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(20930);
/* harmony import */ var node_vibrant_lib_bundle_js__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(node_vibrant_lib_bundle_js__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var setimmediate__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(24889);
/* harmony import */ var setimmediate__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(setimmediate__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var react_virtualized_auto_sizer__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(11728);
/* harmony import */ var _web3_react_walletconnect_v2__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(83442);
/* harmony import */ var _web3_react_walletconnect_v2__WEBPACK_IMPORTED_MODULE_28___default = /*#__PURE__*/__webpack_require__.n(_web3_react_walletconnect_v2__WEBPACK_IMPORTED_MODULE_28__);
/* harmony import */ var qrcode__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(92592);
/* harmony import */ var _uniswap_conedison_provider_index__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(48004);
/* harmony import */ var _web3_react_eip1193__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(98480);
/* harmony import */ var _web3_react_eip1193__WEBPACK_IMPORTED_MODULE_31___default = /*#__PURE__*/__webpack_require__.n(_web3_react_eip1193__WEBPACK_IMPORTED_MODULE_31__);
/* harmony import */ var _web3_react_metamask__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(94299);
/* harmony import */ var _web3_react_metamask__WEBPACK_IMPORTED_MODULE_32___default = /*#__PURE__*/__webpack_require__.n(_web3_react_metamask__WEBPACK_IMPORTED_MODULE_32__);
/* harmony import */ var _web3_react_network__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(28043);
/* harmony import */ var _web3_react_network__WEBPACK_IMPORTED_MODULE_33___default = /*#__PURE__*/__webpack_require__.n(_web3_react_network__WEBPACK_IMPORTED_MODULE_33__);
/* harmony import */ var _web3_react_types__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(52538);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(70743);
/* harmony import */ var resize_observer_polyfill__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(91033);














































































function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function F() {};

      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function transformSwapRouteToGetQuoteResult(_ref) {
  var quote = _ref.quote,
      quoteGasAdjusted = _ref.quoteGasAdjusted,
      route = _ref.route,
      routeString = _ref.routeString,
      estimatedGasUsed = _ref.estimatedGasUsed,
      estimatedGasUsedQuoteToken = _ref.estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD = _ref.estimatedGasUsedUSD,
      gasPriceWei = _ref.gasPriceWei,
      methodParameters = _ref.methodParameters,
      blockNumber = _ref.blockNumber,
      _ref$trade = _ref.trade,
      tradeType = _ref$trade.tradeType,
      inputAmount = _ref$trade.inputAmount,
      outputAmount = _ref$trade.outputAmount;
  var routeResponse = [];

  var _iterator = _createForOfIteratorHelper(route),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var subRoute = _step.value;
      var _amount = subRoute.amount,
          _quote = subRoute.quote,
          tokenPath = subRoute.tokenPath;

      if (subRoute.protocol === _uniswap_router_sdk__WEBPACK_IMPORTED_MODULE_5__.Protocol.V3) {
        var pools = subRoute.route.pools;
        var curRoute = [];

        for (var i = 0; i < pools.length; i++) {
          var nextPool = pools[i];
          var tokenIn = tokenPath[i];
          var tokenOut = tokenPath[i + 1];
          var edgeAmountIn = undefined;

          if (i === 0) {
            edgeAmountIn = (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.i)(tradeType) ? _amount.quotient.toString() : _quote.quotient.toString();
          }

          var edgeAmountOut = undefined;

          if (i === pools.length - 1) {
            edgeAmountOut = (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.i)(tradeType) ? _quote.quotient.toString() : _amount.quotient.toString();
          }

          curRoute.push({
            type: 'v3-pool',
            tokenIn: {
              chainId: tokenIn.chainId,
              decimals: tokenIn.decimals,
              address: tokenIn.address,
              symbol: tokenIn.symbol
            },
            tokenOut: {
              chainId: tokenOut.chainId,
              decimals: tokenOut.decimals,
              address: tokenOut.address,
              symbol: tokenOut.symbol
            },
            fee: nextPool.fee.toString(),
            liquidity: nextPool.liquidity.toString(),
            sqrtRatioX96: nextPool.sqrtRatioX96.toString(),
            tickCurrent: nextPool.tickCurrent.toString(),
            amountIn: edgeAmountIn,
            amountOut: edgeAmountOut
          });
        }

        routeResponse.push(curRoute);
      } else if (subRoute.protocol === _uniswap_router_sdk__WEBPACK_IMPORTED_MODULE_5__.Protocol.V2) {
        var _pools = subRoute.route.pairs;
        var _curRoute = [];

        for (var _i = 0; _i < _pools.length; _i++) {
          var _nextPool = _pools[_i];
          var _tokenIn = tokenPath[_i];
          var _tokenOut = tokenPath[_i + 1];
          var _edgeAmountIn = undefined;

          if (_i === 0) {
            _edgeAmountIn = (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.i)(tradeType) ? _amount.quotient.toString() : _quote.quotient.toString();
          }

          var _edgeAmountOut = undefined;

          if (_i === _pools.length - 1) {
            _edgeAmountOut = (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.i)(tradeType) ? _quote.quotient.toString() : _amount.quotient.toString();
          }

          var reserve0 = _nextPool.reserve0;
          var reserve1 = _nextPool.reserve1;

          _curRoute.push({
            type: 'v2-pool',
            tokenIn: {
              chainId: _tokenIn.chainId,
              decimals: _tokenIn.decimals,
              address: _tokenIn.address,
              symbol: _tokenIn.symbol
            },
            tokenOut: {
              chainId: _tokenOut.chainId,
              decimals: _tokenOut.decimals,
              address: _tokenOut.address,
              symbol: _tokenOut.symbol
            },
            reserve0: {
              token: {
                chainId: reserve0.currency.wrapped.chainId,
                decimals: reserve0.currency.wrapped.decimals,
                address: reserve0.currency.wrapped.address,
                symbol: reserve0.currency.wrapped.symbol
              },
              quotient: reserve0.quotient.toString()
            },
            reserve1: {
              token: {
                chainId: reserve1.currency.wrapped.chainId,
                decimals: reserve1.currency.wrapped.decimals,
                address: reserve1.currency.wrapped.address,
                symbol: reserve1.currency.wrapped.symbol
              },
              quotient: reserve1.quotient.toString()
            },
            amountIn: _edgeAmountIn,
            amountOut: _edgeAmountOut
          });
        }

        routeResponse.push(_curRoute);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var amount = (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.i)(tradeType) ? inputAmount : outputAmount;
  return {
    state: _index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.Q.SUCCESS,
    data: {
      methodParameters: methodParameters,
      blockNumber: blockNumber.toString(),
      amount: amount.quotient.toString(),
      amountDecimals: amount.toExact(),
      quote: quote.quotient.toString(),
      quoteDecimals: quote.toExact(),
      quoteGasAdjusted: quoteGasAdjusted.quotient.toString(),
      quoteGasAdjustedDecimals: quoteGasAdjusted.toExact(),
      gasUseEstimateQuote: estimatedGasUsedQuoteToken.quotient.toString(),
      gasUseEstimateQuoteDecimals: estimatedGasUsedQuoteToken.toExact(),
      gasUseEstimate: estimatedGasUsed.toString(),
      gasUseEstimateUSD: estimatedGasUsedUSD.toExact(),
      gasPriceWei: gasPriceWei.toString(),
      route: routeResponse,
      routeString: routeString
    }
  };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_37__/* ["default"] */ .Z)(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

var AUTO_ROUTER_SUPPORTED_CHAINS = Object.values(_uniswap_sdk_core__WEBPACK_IMPORTED_MODULE_1__.ChainId).filter(function (chainId) {
  return Number.isInteger(chainId);
});

function isAutoRouterSupportedChain(chainId) {
  return Boolean(chainId && AUTO_ROUTER_SUPPORTED_CHAINS.includes(chainId));
}
/** A cache of AlphaRouters, which must be initialized to a specific chain/provider. */


var routersCache = new WeakMap();

function getRouter(chainId, provider) {
  var routers = routersCache.get(provider) || {};
  var cached = routers[chainId];
  if (cached) return cached; // V2 is unsupported for chains other than mainnet.
  // TODO(zzmp): Upstream to @uniswap/smart-order-router, exporting an enum of supported v2 chains for clarity.

  var v2SubgraphProvider;

  if (chainId !== _uniswap_sdk_core__WEBPACK_IMPORTED_MODULE_1__.ChainId.MAINNET) {
    v2SubgraphProvider = new _uniswap_smart_order_router__WEBPACK_IMPORTED_MODULE_2__/* .StaticV2SubgraphProvider */ .xmw(chainId);
  } // V3 computes on-chain, so the quoter must have gas limits appropriate to the provider.
  // Most defaults are fine, but polygon needs a lower gas limit.
  // TODO(zzmp): Upstream to @uniswap/smart-order-router, possibly making this easier to modify
  // (eg allowing configuration without an instance to avoid duplicating multicall2Provider).


  var onChainQuoteProvider;
  var multicall2Provider;

  if ([_uniswap_sdk_core__WEBPACK_IMPORTED_MODULE_1__.ChainId.POLYGON, _uniswap_sdk_core__WEBPACK_IMPORTED_MODULE_1__.ChainId.POLYGON_MUMBAI].includes(chainId)) {
    multicall2Provider = new _uniswap_smart_order_router__WEBPACK_IMPORTED_MODULE_2__/* .UniswapMulticallProvider */ .vih(chainId, provider, 375000); // See https://github.com/Uniswap/smart-order-router/blob/98c58bdee9981fd9ffac9e7d7a97b18302d5f77a/src/routers/alpha-router/alpha-router.ts#L464-L487

    onChainQuoteProvider = new _uniswap_smart_order_router__WEBPACK_IMPORTED_MODULE_2__/* .OnChainQuoteProvider */ .$vc(chainId, provider, multicall2Provider, {
      retries: 2,
      minTimeout: 100,
      maxTimeout: 1000
    }, {
      multicallChunk: 10,
      gasLimitPerCall: 5000000,
      quoteMinSuccessRate: 0.1
    }, {
      gasLimitOverride: 5000000,
      multicallChunk: 5
    }, {
      gasLimitOverride: 6250000,
      multicallChunk: 4
    });
  }

  var router = new _uniswap_smart_order_router__WEBPACK_IMPORTED_MODULE_2__/* .AlphaRouter */ .hfy({
    chainId: chainId,
    provider: provider,
    v2SubgraphProvider: v2SubgraphProvider,
    multicall2Provider: multicall2Provider,
    onChainQuoteProvider: onChainQuoteProvider
  });
  routers[chainId] = router;
  routersCache.set(provider, routers);
  return router;
}

function getQuoteResult(_x, _x2, _x3) {
  return _getQuoteResult.apply(this, arguments);
}

function _getQuoteResult() {
  _getQuoteResult = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_38__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee(_ref, router, routerConfig) {
    var tradeType, tokenIn, tokenOut, amountRaw, tokenInIsNative, tokenOutIsNative, currencyIn, currencyOut, baseCurrency, quoteCurrency, amount, route;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tradeType = _ref.tradeType, tokenIn = _ref.tokenIn, tokenOut = _ref.tokenOut, amountRaw = _ref.amount;
            tokenInIsNative = Object.values(_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.S).includes(tokenIn.address);
            tokenOutIsNative = Object.values(_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.S).includes(tokenOut.address);
            currencyIn = tokenInIsNative ? (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.n)(tokenIn.chainId) : new _uniswap_sdk_core__WEBPACK_IMPORTED_MODULE_1__.Token(tokenIn.chainId, tokenIn.address, tokenIn.decimals, tokenIn.symbol);
            currencyOut = tokenOutIsNative ? (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.n)(tokenOut.chainId) : new _uniswap_sdk_core__WEBPACK_IMPORTED_MODULE_1__.Token(tokenOut.chainId, tokenOut.address, tokenOut.decimals, tokenOut.symbol);
            baseCurrency = (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.i)(tradeType) ? currencyIn : currencyOut;
            quoteCurrency = (0,_index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.i)(tradeType) ? currencyOut : currencyIn;
            amount = _uniswap_sdk_core__WEBPACK_IMPORTED_MODULE_1__.CurrencyAmount.fromRawAmount(baseCurrency, jsbi__WEBPACK_IMPORTED_MODULE_4___default().BigInt(amountRaw !== null && amountRaw !== void 0 ? amountRaw : '1')); // a null amountRaw should initialize the route

            _context.next = 10;
            return router.route(amount, quoteCurrency, tradeType,
            /*swapConfig=*/
            undefined, routerConfig);

          case 10:
            route = _context.sent;

            if (amountRaw) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", {
              state: _index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.Q.INITIALIZED
            });

          case 13:
            if (route) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return", {
              state: _index_e9cc5e7d_js__WEBPACK_IMPORTED_MODULE_3__.Q.NOT_FOUND
            });

          case 15:
            return _context.abrupt("return", transformSwapRouteToGetQuoteResult(_objectSpread(_objectSpread({}, route), {}, {
              routeString: (0,_uniswap_smart_order_router__WEBPACK_IMPORTED_MODULE_2__/* .routeAmountsToString */ .zDd)(route.route)
            })));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getQuoteResult.apply(this, arguments);
}

function getClientSideQuoteResult(_x4, _x5) {
  return _getClientSideQuoteResult.apply(this, arguments);
}

function _getClientSideQuoteResult() {
  _getClientSideQuoteResult = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_38__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2(_ref2, routerConfig) {
    var tokenInAddress, tokenInChainId, tokenInDecimals, tokenInSymbol, tokenOutAddress, tokenOutChainId, tokenOutDecimals, tokenOutSymbol, amount, tradeType, provider, router;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            tokenInAddress = _ref2.tokenInAddress, tokenInChainId = _ref2.tokenInChainId, tokenInDecimals = _ref2.tokenInDecimals, tokenInSymbol = _ref2.tokenInSymbol, tokenOutAddress = _ref2.tokenOutAddress, tokenOutChainId = _ref2.tokenOutChainId, tokenOutDecimals = _ref2.tokenOutDecimals, tokenOutSymbol = _ref2.tokenOutSymbol, amount = _ref2.amount, tradeType = _ref2.tradeType, provider = _ref2.provider;

            if (isAutoRouterSupportedChain(tokenInChainId)) {
              _context2.next = 3;
              break;
            }

            throw new Error("Router does not support this token's chain (chainId: ".concat(tokenInChainId, ")."));

          case 3:
            router = getRouter(tokenInChainId, provider);
            return _context2.abrupt("return", getQuoteResult({
              tradeType: tradeType,
              tokenIn: {
                address: tokenInAddress,
                chainId: tokenInChainId,
                decimals: tokenInDecimals,
                symbol: tokenInSymbol
              },
              tokenOut: {
                address: tokenOutAddress,
                chainId: tokenOutChainId,
                decimals: tokenOutDecimals,
                symbol: tokenOutSymbol
              },
              amount: amount
            }, router, routerConfig));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getClientSideQuoteResult.apply(this, arguments);
}



/***/ })

}]);
//# sourceMappingURL=451.js.map