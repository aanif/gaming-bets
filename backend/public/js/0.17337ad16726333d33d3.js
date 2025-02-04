webpackJsonp([0],{

/***/ 1205:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1277)
}
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1279)
/* template */
var __vue_template__ = __webpack_require__(1330)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-097fa176"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/pages/Home/Home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-097fa176", Component.options)
  } else {
    hotAPI.reload("data-v-097fa176", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1222:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(1234)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 1223:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(1226);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ 1224:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1225)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/layouts/ModalLayout.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-793ff7fa", Component.options)
  } else {
    hotAPI.reload("data-v-793ff7fa", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1225:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("v-app", { attrs: { standalone: "" } }, [
    _c(
      "main",
      [
        _c(
          "v-container",
          {
            staticClass: "pa-0 ma-0 white",
            attrs: { transition: "slide-x-transition", fluid: "" }
          },
          [
            _c(
              "v-card",
              { attrs: { flat: true } },
              [
                _vm._t("toolbar"),
                _vm._v(" "),
                _vm._t("default"),
                _vm._v(" "),
                _vm._t("footer")
              ],
              2
            )
          ],
          1
        )
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-793ff7fa", module.exports)
  }
}

/***/ }),

/***/ 1226:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(1227), __esModule: true };

/***/ }),

/***/ 1227:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1228);
module.exports = __webpack_require__(68).Object.assign;


/***/ }),

/***/ 1228:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(106);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(1229) });


/***/ }),

/***/ 1229:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__(96);
var getKeys = __webpack_require__(641);
var gOPS = __webpack_require__(1230);
var pIE = __webpack_require__(1231);
var toObject = __webpack_require__(642);
var IObject = __webpack_require__(643);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(398)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ 1230:
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 1231:
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ 1232:
/***/ (function(module, exports, __webpack_require__) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "1eb2":
/***/ (function(module, exports, __webpack_require__) {

// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}


/***/ }),

/***/ "cebe":
/***/ (function(module, exports) {

module.exports = __webpack_require__(644);

/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
var setPublicPath = __webpack_require__("1eb2");

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__("cebe");
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);

// CONCATENATED MODULE: ./src/util.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Deep copy the given object.
 *
 * @param  {Object} obj
 * @return {Object}
 */
function deepCopy(obj) {
  if (obj === null || _typeof(obj) !== 'object') {
    return obj;
  }

  var copy = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach(function (key) {
    copy[key] = deepCopy(obj[key]);
  });
  return copy;
}
/**
 * If the given value is not an array, wrap it in one.
 *
 * @param  {Any} value
 * @return {Array}
 */

function arrayWrap(value) {
  return Array.isArray(value) ? value : [value];
}
// CONCATENATED MODULE: ./src/Errors.js
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Errors_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { Errors_typeof = function _typeof(obj) { return typeof obj; }; } else { Errors_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return Errors_typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Errors_Errors =
/*#__PURE__*/
function () {
  /**
   * Create a new error bag instance.
   */
  function Errors() {
    _classCallCheck(this, Errors);

    this.errors = {};
  }
  /**
   * Set the errors object or field error messages.
   *
   * @param {Object|String} field
   * @param {Array|String|undefined} messages
   */


  _createClass(Errors, [{
    key: "set",
    value: function set(field, messages) {
      if (Errors_typeof(field) === 'object') {
        this.errors = field;
      } else {
        this.set(_objectSpread({}, this.errors, _defineProperty({}, field, arrayWrap(messages))));
      }
    }
    /**
     * Get all the errors.
     *
     * @return {Object}
     */

  }, {
    key: "all",
    value: function all() {
      return this.errors;
    }
    /**
     * Determine if there is an error for the given field.
     *
     * @param  {String} field
     * @return {Boolean}
     */

  }, {
    key: "has",
    value: function has(field) {
      return this.errors.hasOwnProperty(field);
    }
    /**
     * Determine if there are any errors for the given fields.
     *
     * @param  {...String} fields
     * @return {Boolean}
     */

  }, {
    key: "hasAny",
    value: function hasAny() {
      var _this = this;

      for (var _len = arguments.length, fields = new Array(_len), _key = 0; _key < _len; _key++) {
        fields[_key] = arguments[_key];
      }

      return fields.some(function (field) {
        return _this.has(field);
      });
    }
    /**
     * Determine if there are any errors.
     *
     * @return {Boolean}
     */

  }, {
    key: "any",
    value: function any() {
      return Object.keys(this.errors).length > 0;
    }
    /**
     * Get the first error message for the given field.
     *
     * @param  String} field
     * @return {String|undefined}
     */

  }, {
    key: "get",
    value: function get(field) {
      if (this.has(field)) {
        return this.getAll(field)[0];
      }
    }
    /**
     * Get all the error messages for the given field.
     *
     * @param  {String} field
     * @return {Array}
     */

  }, {
    key: "getAll",
    value: function getAll(field) {
      return arrayWrap(this.errors[field] || []);
    }
    /**
     * Get the error message for the given fields.
     *
     * @param  {...String} fields
     * @return {Array}
     */

  }, {
    key: "only",
    value: function only() {
      var _this2 = this;

      var messages = [];

      for (var _len2 = arguments.length, fields = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fields[_key2] = arguments[_key2];
      }

      fields.forEach(function (field) {
        var message = _this2.get(field);

        if (message) {
          messages.push(message);
        }
      });
      return messages;
    }
    /**
     * Get all the errors in a flat array.
     *
     * @return {Array}
     */

  }, {
    key: "flatten",
    value: function flatten() {
      return Object.values(this.errors).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    }
    /**
     * Clear one or all error fields.
     *
     * @param {String|undefined} field
     */

  }, {
    key: "clear",
    value: function clear(field) {
      var _this3 = this;

      var errors = {};

      if (field) {
        Object.keys(this.errors).forEach(function (key) {
          if (key !== field) {
            errors[key] = _this3.errors[key];
          }
        });
      }

      this.set(errors);
    }
  }]);

  return Errors;
}();


// CONCATENATED MODULE: ./src/Form.js
function Form_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { Form_typeof = function _typeof(obj) { return typeof obj; }; } else { Form_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return Form_typeof(obj); }

function Form_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { Form_defineProperty(target, key, source[key]); }); } return target; }

function Form_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Form_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Form_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Form_createClass(Constructor, protoProps, staticProps) { if (protoProps) Form_defineProperties(Constructor.prototype, protoProps); if (staticProps) Form_defineProperties(Constructor, staticProps); return Constructor; }





var Form_Form =
/*#__PURE__*/
function () {
  /**
   * Create a new form instance.
   *
   * @param {Object} data
   */
  function Form() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    Form_classCallCheck(this, Form);

    this.busy = false;
    this.successful = false;
    this.errors = new Errors_Errors();
    this.originalData = deepCopy(data);
    Object.assign(this, data);
  }
  /**
   * Fill form data.
   *
   * @param {Object} data
   */


  Form_createClass(Form, [{
    key: "fill",
    value: function fill(data) {
      var _this = this;

      this.keys().forEach(function (key) {
        _this[key] = data[key];
      });
    }
    /**
     * Get the form data.
     *
     * @return {Object}
     */

  }, {
    key: "data",
    value: function data() {
      var _this2 = this;

      return this.keys().reduce(function (data, key) {
        return Form_objectSpread({}, data, Form_defineProperty({}, key, _this2[key]));
      }, {});
    }
    /**
     * Get the form data keys.
     *
     * @return {Array}
     */

  }, {
    key: "keys",
    value: function keys() {
      return Object.keys(this).filter(function (key) {
        return !Form.ignore.includes(key);
      });
    }
    /**
     * Start processing the form.
     */

  }, {
    key: "startProcessing",
    value: function startProcessing() {
      this.errors.clear();
      this.busy = true;
      this.successful = false;
    }
    /**
     * Finish processing the form.
     */

  }, {
    key: "finishProcessing",
    value: function finishProcessing() {
      this.busy = false;
      this.successful = true;
    }
    /**
     * Clear the form errors.
     */

  }, {
    key: "clear",
    value: function clear() {
      this.errors.clear();
      this.successful = false;
    }
    /**
     * Reset the form fields.
     */

  }, {
    key: "reset",
    value: function reset() {
      var _this3 = this;

      Object.keys(this).filter(function (key) {
        return !Form.ignore.includes(key);
      }).forEach(function (key) {
        _this3[key] = deepCopy(_this3.originalData[key]);
      });
    }
    /**
     * Submit the form via a GET request.
     *
     * @param  {String} url
     * @param  {Object} config (axios config)
     * @return {Promise}
     */

  }, {
    key: "get",
    value: function get(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.submit('get', url, config);
    }
    /**
     * Submit the form via a POST request.
     *
     * @param  {String} url
     * @param  {Object} config (axios config)
     * @return {Promise}
     */

  }, {
    key: "post",
    value: function post(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.submit('post', url, config);
    }
    /**
     * Submit the form via a PATCH request.
     *
     * @param  {String} url
     * @param  {Object} config (axios config)
     * @return {Promise}
     */

  }, {
    key: "patch",
    value: function patch(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.submit('patch', url, config);
    }
    /**
     * Submit the form via a PUT request.
     *
     * @param  {String} url
     * @param  {Object} config (axios config)
     * @return {Promise}
     */

  }, {
    key: "put",
    value: function put(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.submit('put', url, config);
    }
    /**
     * Submit the form via a DELETE request.
     *
     * @param  {String} url
     * @param  {Object} config (axios config)
     * @return {Promise}
     */

  }, {
    key: "delete",
    value: function _delete(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.submit('delete', url, config);
    }
    /**
     * Submit the form data via an HTTP request.
     *
     * @param  {String} method (get, post, patch, put)
     * @param  {String} url
     * @param  {Object} config (axios config)
     * @return {Promise}
     */

  }, {
    key: "submit",
    value: function submit(method, url) {
      var _this4 = this;

      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.startProcessing();
      var data = method === 'get' ? {
        params: this.data()
      } : this.data();
      return new Promise(function (resolve, reject) {
        (Form.axios || external_axios_default.a).request(Form_objectSpread({
          url: _this4.route(url),
          method: method,
          data: data
        }, config)).then(function (response) {
          _this4.finishProcessing();

          resolve(response);
        }).catch(function (error) {
          _this4.busy = false;

          if (error.response) {
            _this4.errors.set(_this4.extractErrors(error.response));
          }

          reject(error);
        });
      });
    }
    /**
     * Extract the errors from the response object.
     *
     * @param  {Object} response
     * @return {Object}
     */

  }, {
    key: "extractErrors",
    value: function extractErrors(response) {
      if (!response.data || Form_typeof(response.data) !== 'object') {
        return {
          error: Form.errorMessage
        };
      }

      if (response.data.errors) {
        return Form_objectSpread({}, response.data.errors);
      }

      if (response.data.message) {
        return {
          error: response.data.message
        };
      }

      return Form_objectSpread({}, response.data);
    }
    /**
     * Get a named route.
     *
     * @param  {String} name
     * @return {Object} parameters
     * @return {String}
     */

  }, {
    key: "route",
    value: function route(name) {
      var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var url = name;

      if (Form.routes.hasOwnProperty(name)) {
        url = decodeURI(Form.routes[name]);
      }

      if (Form_typeof(parameters) !== 'object') {
        parameters = {
          id: parameters
        };
      }

      Object.keys(parameters).forEach(function (key) {
        url = url.replace("{".concat(key, "}"), parameters[key]);
      });
      return url;
    }
    /**
     * Clear errors on keydown.
     *
     * @param {KeyboardEvent} event
     */

  }, {
    key: "onKeydown",
    value: function onKeydown(event) {
      if (event.target.name) {
        this.errors.clear(event.target.name);
      }
    }
  }]);

  return Form;
}();

Form_Form.routes = {};
Form_Form.errorMessage = 'Something went wrong. Please try again.';
Form_Form.ignore = ['busy', 'successful', 'errors', 'originalData'];
/* harmony default export */ var src_Form = (Form_Form);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"d2817be2-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/HasError.vue?vue&type=template&id=fcc9e406&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.form.errors.has(_vm.field))?_c('div',{staticClass:"help-block invalid-feedback",domProps:{"innerHTML":_vm._s(_vm.form.errors.get(_vm.field))}}):_vm._e()}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/HasError.vue?vue&type=template&id=fcc9e406&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/HasError.vue?vue&type=script&lang=js&
//
//
//
//
/* harmony default export */ var HasErrorvue_type_script_lang_js_ = ({
  name: 'has-error',
  props: {
    form: {
      type: Object,
      required: true
    },
    field: {
      type: String,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/components/HasError.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_HasErrorvue_type_script_lang_js_ = (HasErrorvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/HasError.vue





/* normalize component */

var component = normalizeComponent(
  components_HasErrorvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "HasError.vue"
/* harmony default export */ var HasError = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"d2817be2-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/AlertError.vue?vue&type=template&id=5610eddd&
var AlertErrorvue_type_template_id_5610eddd_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.form.errors.any())?_c('div',{staticClass:"alert alert-danger alert-dismissible",attrs:{"role":"alert"}},[(_vm.dismissible)?_c('button',{staticClass:"close",attrs:{"type":"button","aria-label":"Close"},on:{"click":_vm.dismiss}},[_c('span',{attrs:{"aria-hidden":"true"}},[_vm._v("×")])]):_vm._e(),_vm._t("default",[(_vm.form.errors.has('error'))?_c('div',{domProps:{"innerHTML":_vm._s(_vm.form.errors.get('error'))}}):_c('div',{domProps:{"innerHTML":_vm._s(_vm.message)}})])],2):_vm._e()}
var AlertErrorvue_type_template_id_5610eddd_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/AlertError.vue?vue&type=template&id=5610eddd&

// CONCATENATED MODULE: ./src/components/Alert.js
/* harmony default export */ var Alert = ({
  props: {
    form: {
      type: Object,
      required: true
    },
    dismissible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    dismiss: function dismiss() {
      if (this.dismissible) {
        this.form.clear();
      }
    }
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/AlertError.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var AlertErrorvue_type_script_lang_js_ = ({
  name: 'alert-error',
  extends: Alert,
  props: {
    message: {
      type: String,
      default: 'There were some problems with your input.'
    }
  }
});
// CONCATENATED MODULE: ./src/components/AlertError.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_AlertErrorvue_type_script_lang_js_ = (AlertErrorvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/AlertError.vue





/* normalize component */

var AlertError_component = normalizeComponent(
  components_AlertErrorvue_type_script_lang_js_,
  AlertErrorvue_type_template_id_5610eddd_render,
  AlertErrorvue_type_template_id_5610eddd_staticRenderFns,
  false,
  null,
  null,
  null
  
)

AlertError_component.options.__file = "AlertError.vue"
/* harmony default export */ var AlertError = (AlertError_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"d2817be2-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/AlertErrors.vue?vue&type=template&id=40d77fd7&
var AlertErrorsvue_type_template_id_40d77fd7_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.form.errors.any())?_c('div',{staticClass:"alert alert-danger alert-dismissible",attrs:{"role":"alert"}},[(_vm.dismissible)?_c('button',{staticClass:"close",attrs:{"type":"button","aria-label":"Close"},on:{"click":_vm.dismiss}},[_c('span',{attrs:{"aria-hidden":"true"}},[_vm._v("×")])]):_vm._e(),(_vm.message)?_c('div',{domProps:{"innerHTML":_vm._s(_vm.message)}}):_vm._e(),_c('ul',_vm._l((_vm.form.errors.flatten()),function(error){return _c('li',{domProps:{"innerHTML":_vm._s(error)}})}))]):_vm._e()}
var AlertErrorsvue_type_template_id_40d77fd7_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/AlertErrors.vue?vue&type=template&id=40d77fd7&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/AlertErrors.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var AlertErrorsvue_type_script_lang_js_ = ({
  name: 'alert-errors',
  extends: Alert,
  props: {
    message: {
      type: String,
      default: 'There were some problems with your input.'
    }
  }
});
// CONCATENATED MODULE: ./src/components/AlertErrors.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_AlertErrorsvue_type_script_lang_js_ = (AlertErrorsvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/AlertErrors.vue





/* normalize component */

var AlertErrors_component = normalizeComponent(
  components_AlertErrorsvue_type_script_lang_js_,
  AlertErrorsvue_type_template_id_40d77fd7_render,
  AlertErrorsvue_type_template_id_40d77fd7_staticRenderFns,
  false,
  null,
  null,
  null
  
)

AlertErrors_component.options.__file = "AlertErrors.vue"
/* harmony default export */ var AlertErrors = (AlertErrors_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"d2817be2-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/AlertSuccess.vue?vue&type=template&id=fd18e236&
var AlertSuccessvue_type_template_id_fd18e236_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.form.successful)?_c('div',{staticClass:"alert alert-success alert-dismissible",attrs:{"role":"alert"}},[(_vm.dismissible)?_c('button',{staticClass:"close",attrs:{"type":"button","aria-label":"Close"},on:{"click":_vm.dismiss}},[_c('span',{attrs:{"aria-hidden":"true"}},[_vm._v("×")])]):_vm._e(),_vm._t("default",[_c('div',{domProps:{"innerHTML":_vm._s(_vm.message)}})])],2):_vm._e()}
var AlertSuccessvue_type_template_id_fd18e236_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/AlertSuccess.vue?vue&type=template&id=fd18e236&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/AlertSuccess.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var AlertSuccessvue_type_script_lang_js_ = ({
  name: 'alert-success',
  extends: Alert,
  props: {
    message: {
      type: String,
      default: ''
    }
  }
});
// CONCATENATED MODULE: ./src/components/AlertSuccess.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_AlertSuccessvue_type_script_lang_js_ = (AlertSuccessvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/AlertSuccess.vue





/* normalize component */

var AlertSuccess_component = normalizeComponent(
  components_AlertSuccessvue_type_script_lang_js_,
  AlertSuccessvue_type_template_id_fd18e236_render,
  AlertSuccessvue_type_template_id_fd18e236_staticRenderFns,
  false,
  null,
  null,
  null
  
)

AlertSuccess_component.options.__file = "AlertSuccess.vue"
/* harmony default export */ var AlertSuccess = (AlertSuccess_component.exports);
// CONCATENATED MODULE: ./src/index.js







// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js
/* concated harmony reexport Form */__webpack_require__.d(__webpack_exports__, "Form", function() { return src_Form; });
/* concated harmony reexport Errors */__webpack_require__.d(__webpack_exports__, "Errors", function() { return Errors_Errors; });
/* concated harmony reexport HasError */__webpack_require__.d(__webpack_exports__, "HasError", function() { return HasError; });
/* concated harmony reexport AlertError */__webpack_require__.d(__webpack_exports__, "AlertError", function() { return AlertError; });
/* concated harmony reexport AlertErrors */__webpack_require__.d(__webpack_exports__, "AlertErrors", function() { return AlertErrors; });
/* concated harmony reexport AlertSuccess */__webpack_require__.d(__webpack_exports__, "AlertSuccess", function() { return AlertSuccess; });


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_Form);



/***/ })

/******/ });

/***/ }),

/***/ 1233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  /* this mixins is responsible for concatinating error messages from vform and vee-validate  */
  methods: {
    /* errorBag is relataed to veeValidate config name*/
    /* form is related to vform */
    errorMessages: function errorMessages(field) {
      return this.errors.collect(field).concat(this.form.errors.only(field));
    },
    hasErrors: function hasErrors(field) {
      var errors = this.errors.collect(field).concat(this.form.errors.only(field));
      if (errors.length > 0) {
        return true;
      }
      return false;
    }
  }
});

/***/ }),

/***/ 1234:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 1235:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1236)
}
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1238)
/* template */
var __vue_template__ = __webpack_require__(1239)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-74ea2a35"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/VLink.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-74ea2a35", Component.options)
  } else {
    hotAPI.reload("data-v-74ea2a35", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1236:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1237);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1222)("b52a5a14", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-74ea2a35\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/sass-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./VLink.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-74ea2a35\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/sass-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./VLink.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1237:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n.styleAvatar[data-v-74ea2a35]{position:relative;margin-left:-55px\n}\n", ""]);

// exports


/***/ }),

/***/ 1238:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    dark: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    href: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: function _default() {
        return "";
      }
    },
    icon: {
      type: String,
      default: function _default() {
        return "";
      }
    },
    iconColor: {
      type: String,
      default: function _default() {
        return this.dark ? "#fafafa" : "#78909C"; // white or blue-grey lighten-1
      }
    },
    linkColor: {
      type: String,
      default: function _default() {
        return this.dark ? "#fafafa" : "#e3b500"; // white or blue-grey lighten-1
      }
    },
    activeColor: {
      type: String,
      default: function _default() {
        return "#f5c300"; // teal lighten 2
      }
    }
  },
  computed: {
    isActive: function isActive() {
      return this.href === this.$route.path;
    },
    isDark: function isDark() {
      return this.dark === true;
    },
    avatarOn: function avatarOn() {
      return !!this.avatar;
    },
    iconOn: function iconOn() {
      return !!this.icon;
    }
  },
  methods: {
    navigate: function navigate(href) {
      var self = this;
      /* if valid url */
      if (self.isURL(href)) {
        window.open(href);
      } else {
        /* when using vue router path */
        this.$router.push({ path: "" + href });
      }
    },
    isURL: function isURL(str) {
      var urlRegex = "^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$";
      var url = new RegExp(urlRegex, "i");
      return str.length < 2083 && url.test(str);
    }
  }
});

/***/ }),

/***/ 1239:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-list-tile",
    {
      class: [{ styleAvatar: _vm.avatarOn }],
      attrs: { avatar: _vm.avatarOn },
      nativeOn: {
        click: function($event) {
          return _vm.navigate(_vm.href)
        }
      }
    },
    [
      _vm.iconOn && !_vm.avatarOn
        ? _c(
            "v-list-tile-action",
            [
              _c(
                "v-icon",
                {
                  style: {
                    color: _vm.isActive ? _vm.activeColor : _vm.iconColor,
                    cursor: _vm.href ? "pointer" : ""
                  }
                },
                [_vm._v(_vm._s(_vm.icon))]
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.iconOn && _vm.avatarOn
        ? _c("v-list-tile-avatar", [
            _c("img", { attrs: { src: _vm.avatar, alt: "" } })
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-list-tile-content",
        [
          _c(
            "v-list-tile-title",
            {
              style: { color: _vm.isActive ? _vm.activeColor : _vm.linkColor }
            },
            [
              _c("span", { style: { cursor: _vm.href ? "pointer" : "" } }, [
                _vm._v(_vm._s(_vm.title))
              ])
            ]
          )
        ],
        1
      ),
      _vm._v(" "),
      _vm.iconOn && _vm.avatarOn
        ? _c(
            "v-list-tile-action",
            [
              _c(
                "v-icon",
                {
                  style: {
                    color: _vm.isActive ? _vm.activeColor : _vm.iconColor,
                    cursor: _vm.href ? "pointer" : ""
                  }
                },
                [_vm._v(_vm._s(_vm.icon))]
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-74ea2a35", module.exports)
  }
}

/***/ }),

/***/ 1240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  methods: {
    isLoggedIn: function isLoggedIn() {
      return !!this.$store.state.auth.isAuthenticated;
    },
    hasRole: function hasRole(payload) {
      var me = this.$store.getters['auth/getMe'];
      return _.includes(me.roles, payload);
    },
    hasPermission: function hasPermission(payload) {
      var me = this.$store.getters['auth/getMe'];
      return _.includes(me.permissions, payload);
    },
    hasAnyPermission: function hasAnyPermission(permissions) {
      var me = this.$store.getters['auth/getMe'];
      return permissions.some(function (p) {
        return me.permissions.includes(p);
      });
    },
    hasAnyRole: function hasAnyRole(roles) {
      var me = this.$store.getters['auth/getMe'];
      return roles.some(function (r) {
        return me.roles.includes(r);
      });
    },
    hasAllRoles: function hasAllRoles(roles) {
      var me = this.$store.getters['auth/getMe'];
      return _.difference(roles, me.roles).length === 0;
    },
    hasAllPermissions: function hasAllPermissions(permissions) {
      var me = this.$store.getters['auth/getMe'];
      return _.difference(permissions, me.permissions).length === 0;
    },
    can: function can(permission) {
      return this.$store.getters['auth/getMe'].can[permission];
    }
  }
});

/***/ }),

/***/ 1241:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1242)
/* template */
var __vue_template__ = __webpack_require__(1257)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/layouts/BangerLayout.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-41936d53", Component.options)
  } else {
    hotAPI.reload("data-v-41936d53", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Partials_Footer__ = __webpack_require__(1243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Partials_Footer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_Partials_Footer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Partials_Navbar__ = __webpack_require__(1245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Partials_Navbar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_Partials_Navbar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Components_modal_Login__ = __webpack_require__(1254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Components_modal_Login___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_Components_modal_Login__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    Footer: __WEBPACK_IMPORTED_MODULE_0_Partials_Footer___default.a,
    Navbar: __WEBPACK_IMPORTED_MODULE_1_Partials_Navbar___default.a,
    Login: __WEBPACK_IMPORTED_MODULE_2_Components_modal_Login___default.a
  }
});

/***/ }),

/***/ 1243:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1244)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/partials/Footer.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-37fc134a", Component.options)
  } else {
    hotAPI.reload("data-v-37fc134a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1244:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("section", { staticStyle: { "background-color": "#010432" } }, [
      _c(
        "section",
        {
          staticStyle: {
            "border-bottom": "3px solid #bf1338",
            "border-top": "3px solid #bf1338"
          }
        },
        [
          _c("div", { staticClass: "container" }, [
            _c("div", { staticClass: "row" }, [
              _c("div", { staticClass: "col-lg-3 col-sm-3" }, [
                _c("div", { staticStyle: { width: "100%", height: "80px" } }, [
                  _c("img", {
                    staticStyle: {
                      display: "inline-block",
                      height: "100%",
                      width: "60%",
                      "margin-top": "0px",
                      "border-radius": "4px",
                      "background-repeat": "no-repeat",
                      "background-position": "center",
                      "background-size": "cover"
                    },
                    attrs: {
                      src: "assets/images/Sponsors/Origins-Logo-WHITE.png",
                      alt: ""
                    }
                  })
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-3 col-sm-3" }, [
                _c("div", { staticStyle: { width: "100%", height: "80px" } }, [
                  _c("img", {
                    staticStyle: {
                      display: "inline-block",
                      height: "100%",
                      width: "60%",
                      "margin-top": "0px",
                      "border-radius": "4px",
                      "background-repeat": "no-repeat",
                      "background-position": "center",
                      "background-size": "cover"
                    },
                    attrs: {
                      src: "assets/images/Sponsors/rent4wearlogoWHITE.png",
                      alt: ""
                    }
                  })
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-3 col-sm-3" }, [
                _c("div", { staticStyle: { width: "100%", height: "80px" } }, [
                  _c("img", {
                    staticStyle: {
                      display: "inline-block",
                      height: "100%",
                      width: "60%",
                      "margin-top": "0px",
                      "border-radius": "4px",
                      "background-repeat": "no-repeat",
                      "background-position": "center",
                      "background-size": "cover"
                    },
                    attrs: {
                      src: "assets/images/Sponsors/TydloslogoWHITE.png",
                      alt: ""
                    }
                  })
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-3 col-sm-3" }, [
                _c("div", { staticStyle: { width: "100%", height: "80px" } }, [
                  _c("img", {
                    staticStyle: {
                      display: "inline-block",
                      height: "100%",
                      width: "60%",
                      "margin-top": "0px",
                      "border-radius": "4px",
                      "background-repeat": "no-repeat",
                      "background-position": "center",
                      "background-size": "cover"
                    },
                    attrs: {
                      src: "assets/images/Sponsors/bee-logo-WHITE.png",
                      alt: ""
                    }
                  })
                ])
              ])
            ])
          ])
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "copy-bg" }, [
        _c("div", { staticClass: "container" }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-lg-7 col-sm-7" }, [
              _c("p", { staticClass: "footer-text1" }, [
                _vm._v("©Copy Right Banger Games, 2020 ")
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-lg-5 col-sm-5" }, [
              _c("div", { staticClass: "row" }, [
                _c("div", { staticClass: "col-lg-6 col-sm-6" }, [
                  _c("p", { staticClass: "footer-options-1" }, [
                    _vm._v("HELP ")
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "footer-options" }, [_vm._v("FAQ")]),
                  _vm._v(" "),
                  _c("p", { staticClass: "footer-options" }, [
                    _vm._v("CONTACT ")
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "footer-options" }, [
                    _vm._v("SPONSORS ")
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "col-lg-6 col-sm-6" }, [
                  _c("p", { staticClass: "footer-options-1" }, [
                    _vm._v("HOW IT WORKS ")
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "footer-options" }, [
                    _vm._v("PRIVACY POLICY ")
                  ]),
                  _vm._v(" "),
                  _c(
                    "p",
                    {
                      staticClass: "footer-options",
                      staticStyle: {
                        "margin-top": "-23px",
                        "line-height": "21px"
                      }
                    },
                    [_vm._v("TERMS & CONDITIONS ")]
                  ),
                  _vm._v(" "),
                  _c("p", { staticClass: "footer-options" }, [
                    _c(
                      "a",
                      {
                        staticStyle: { cursor: "pointer", color: "#a1afd3" },
                        attrs: { href: "/cash-withdrawal" }
                      },
                      [_vm._v("WITHDRWALS")]
                    )
                  ])
                ])
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "row" }, [
              _c("div", { staticClass: "col-lg-7 col-sm-7" }, [
                _c("p", { staticClass: "footer-text-m" }, [
                  _vm._v("©Copy Right Banger Games, 2020 ")
                ])
              ])
            ])
          ])
        ])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-37fc134a", module.exports)
  }
}

/***/ }),

/***/ 1245:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1246)
}
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1248)
/* template */
var __vue_template__ = __webpack_require__(1253)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/partials/Navbar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-52a39182", Component.options)
  } else {
    hotAPI.reload("data-v-52a39182", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1246:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1247);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1222)("6581124e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-52a39182\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Navbar.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-52a39182\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Navbar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1247:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 1248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends__ = __webpack_require__(1223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_core_js_object_keys__ = __webpack_require__(1249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_core_js_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_core_js_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Mixins_acl__ = __webpack_require__(1240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_Components_VLink__ = __webpack_require__(1235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_Components_VLink___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_Components_VLink__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(397);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_4_vuex__["b" /* createNamespacedHelpers */])('auth'),
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["default"] = ({
  mixins: [__WEBPACK_IMPORTED_MODULE_2_Mixins_acl__["a" /* default */]],
  components: {
    VLink: __WEBPACK_IMPORTED_MODULE_3_Components_VLink___default.a
  },
  data: function data() {
    return {
      games: null,
      listdisplay: false,
      temp: null
    };
  },
  mounted: function mounted() {
    var _this = this;

    axios.get('/api/getgames').then(function (response) {
      _this.temp = response.data;
      __WEBPACK_IMPORTED_MODULE_1_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_core_js_object_keys___default()(_this.temp).forEach(function (key) {
        _this.temp[key].href = '/tournaments-' + _this.temp[key].id;
      });
      _this.games = _this.temp;
      // console.log(this.games);
    });
  },


  methods: __WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends___default()({
    tog: function tog() {
      this.listdisplay = !this.listdisplay;
    }
  }, mapActions({
    logout: 'logout'
  }))
});

/***/ }),

/***/ 1249:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(1250), __esModule: true };

/***/ }),

/***/ 1250:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1251);
module.exports = __webpack_require__(68).Object.keys;


/***/ }),

/***/ 1251:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(642);
var $keys = __webpack_require__(641);

__webpack_require__(1252)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ 1252:
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(106);
var core = __webpack_require__(68);
var fails = __webpack_require__(398);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ 1253:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("header", { staticClass: "header" }, [
    _c("section", { staticClass: "top-header" }, [
      _c("div", { staticClass: "container" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-lg-12" }, [
            _c("div", { staticClass: "content" }, [
              _vm._m(0),
              _vm._v(" "),
              _c("div", { staticClass: "right-content" }, [
                _c("ul", { staticClass: "right-list" }, [
                  _vm._m(1),
                  _vm._v(" "),
                  !this.isLoggedIn()
                    ? _c(
                        "li",
                        [
                          _c(
                            "b-button",
                            {
                              staticClass: "sign-in",
                              on: {
                                click: function($event) {
                                  return this.Bus.$emit("open-login")
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "fas fa-user" }),
                              _vm._v(" Sign In\n                  ")
                            ]
                          )
                        ],
                        1
                      )
                    : _c(
                        "li",
                        [
                          _c(
                            "b-button",
                            {
                              staticClass: "sign-in",
                              on: {
                                click: function($event) {
                                  return _vm.logout()
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "fas fa-user-lock" }),
                              _vm._v(" Log Out\n                  ")
                            ]
                          )
                        ],
                        1
                      )
                ])
              ])
            ])
          ])
        ])
      ])
    ]),
    _vm._v(" "),
    _c(
      "nav",
      {
        staticClass: "mobile-nav",
        staticStyle: { "margin-left": "30px" },
        attrs: { role: "navigation" }
      },
      [
        _vm._m(2),
        _vm._v(" "),
        _c(
          "ul",
          { staticClass: "mobile-ul" },
          [
            _c(
              "li",
              [
                _c(
                  "router-link",
                  {
                    staticClass: "mobile-nav-list",
                    attrs: { to: { name: "home" } }
                  },
                  [_vm._v("Home")]
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "li",
              [
                _c(
                  "router-link",
                  {
                    staticClass: "mobile-nav-list",
                    attrs: { to: { name: "sponsors" } }
                  },
                  [_vm._v("Sponsors")]
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "li",
              [
                _c(
                  "router-link",
                  {
                    staticClass: "mobile-nav-list",
                    attrs: { to: { name: "leaderboards" } }
                  },
                  [_vm._v("Leaderboards")]
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "li",
              [
                _c(
                  "router-link",
                  {
                    staticClass: "mobile-nav-list",
                    attrs: { to: { name: "about" } }
                  },
                  [_vm._v("About")]
                )
              ],
              1
            ),
            _vm._v(" "),
            _c("li", [
              _c(
                "a",
                {
                  staticClass: "mobile-nav-list",
                  attrs: { id: "" },
                  on: {
                    click: function($event) {
                      return _vm.tog()
                    }
                  }
                },
                [_vm._v("Game")]
              )
            ]),
            _vm._v(" "),
            _vm._l(_vm.games, function(game) {
              return _c(
                "li",
                {
                  key: game.name,
                  staticStyle: { diplay: "block" },
                  attrs: { id: "game-name" }
                },
                [
                  _vm.listdisplay
                    ? _c(
                        "a",
                        {
                          staticClass: "mobile-nav-list",
                          attrs: { href: game.href }
                        },
                        [_vm._v(_vm._s(game.name))]
                      )
                    : _vm._e()
                ]
              )
            }),
            _vm._v(" "),
            _vm._m(3),
            _vm._v(" "),
            _c(
              "li",
              [
                _c(
                  "router-link",
                  {
                    staticClass: "mobile-nav-list",
                    attrs: { to: { name: "membership" } }
                  },
                  [_vm._v("Membership")]
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "li",
              [
                _c(
                  "router-link",
                  {
                    staticClass: "mobile-nav-list",
                    attrs: { to: { name: "profile" } }
                  },
                  [_vm._v("Profile")]
                )
              ],
              1
            )
          ],
          2
        )
      ]
    ),
    _vm._v(" "),
    _c("div", { staticClass: "mainmenu-area" }, [
      _c("div", { staticClass: "container-fluid" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-lg-12 col-sm-12" }, [
            _c("div", { staticClass: "row" }, [
              _vm._m(4),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-2 col-sm-2" }, [
                _c("ul", { staticClass: "navbar-nav1" }, [
                  _c(
                    "li",
                    { staticClass: "nav-item active" },
                    [
                      _c(
                        "router-link",
                        {
                          staticClass: "nav-link",
                          attrs: { to: { name: "home" } }
                        },
                        [_vm._v("Home")]
                      ),
                      _vm._v(" "),
                      _c(
                        "router-link",
                        {
                          staticClass: "nav-link",
                          staticStyle: { "margin-top": "-20px" },
                          attrs: { to: { name: "sponsors" } }
                        },
                        [_vm._v("Sponsors")]
                      ),
                      _vm._v(" "),
                      _c(
                        "router-link",
                        {
                          staticClass: "nav-link",
                          staticStyle: { "margin-top": "-20px" },
                          attrs: { to: { name: "leaderboards" } }
                        },
                        [_vm._v("Leaderboards")]
                      ),
                      _vm._v(" "),
                      _c(
                        "router-link",
                        {
                          staticClass: "nav-link",
                          staticStyle: { "margin-top": "-20px" },
                          attrs: { to: { name: "about" } }
                        },
                        [_vm._v("About")]
                      )
                    ],
                    1
                  )
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-2 col-sm-2" }, [
                _c("ul", { staticClass: "navbar-nav1" }, [
                  _c(
                    "li",
                    { staticClass: "nav-item" },
                    [
                      _c(
                        "b-dropdown",
                        {
                          staticClass: "m-2",
                          attrs: {
                            id: "dropdown-dropright",
                            dropright: "",
                            text: "Game",
                            variant: "primary"
                          }
                        },
                        [
                          _c(
                            "b-dropdown-item",
                            { attrs: { to: { name: "game-call-of-duty" } } },
                            [_vm._v("Call Of Duty")]
                          ),
                          _vm._v(" "),
                          _c(
                            "b-dropdown-item",
                            { attrs: { to: { name: "game-fortnite" } } },
                            [_vm._v("Fortnite")]
                          ),
                          _vm._v(" "),
                          _c(
                            "b-dropdown-item",
                            { attrs: { to: { name: "game-cs-go" } } },
                            [_vm._v("CS:GO")]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "router-link",
                        {
                          staticClass: "nav-link",
                          staticStyle: { "margin-top": "-20px" },
                          attrs: { to: { name: "bomb-coins" } }
                        },
                        [_vm._v("Bomb Coins")]
                      ),
                      _vm._v(" "),
                      _c(
                        "router-link",
                        {
                          staticClass: "nav-link",
                          staticStyle: { "margin-top": "-20px" },
                          attrs: { to: { name: "membership" } }
                        },
                        [_vm._v("Membership")]
                      ),
                      _vm._v(" "),
                      this.isLoggedIn()
                        ? _c(
                            "router-link",
                            {
                              staticClass: "nav-link",
                              staticStyle: { "margin-top": "-20px" },
                              attrs: { to: { name: "profile" } }
                            },
                            [_vm._v("Profile")]
                          )
                        : _vm._e()
                    ],
                    1
                  )
                ])
              ]),
              _vm._v(" "),
              _vm.listdisplay
                ? _c("div", { staticClass: "col-lg-2 col-sm-2" }, [
                    _c(
                      "ul",
                      {
                        staticClass: "navbar-nav1",
                        attrs: { id: "gameslist" }
                      },
                      _vm._l(_vm.games, function(game) {
                        return _c(
                          "li",
                          {
                            key: game.name,
                            staticClass: "nav-item",
                            staticStyle: { "margin-top": "8px", height: "15px" }
                          },
                          [
                            _c(
                              "a",
                              {
                                staticClass: "nav-link1",
                                attrs: { href: game.href }
                              },
                              [_vm._v(_vm._s(game.name))]
                            )
                          ]
                        )
                      }),
                      0
                    )
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm._m(5)
            ])
          ])
        ])
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "left-content" }, [
      _c("ul", { staticClass: "left-list" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", [
      _c("div", { staticClass: "cart-icon tm-dropdown" }, [
        _c("a", { attrs: { href: "/awards" } }, [
          _c("img", {
            staticStyle: { "margin-bottom": "2px" },
            attrs: { src: "/assets/images/awards/cart.png", alt: "" }
          }),
          _vm._v("  Buy")
        ]),
        _vm._v("\n                      /  \n                    "),
        _c(
          "a",
          { staticClass: "link-btn", attrs: { href: "/cash-withdrawal" } },
          [
            _c("img", {
              staticStyle: { width: "20px" },
              attrs: { src: "assets/images/limas@2x.png", alt: "" }
            }),
            _vm._v(" 0 Limas")
          ]
        )
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "a",
      { staticStyle: { width: "300px" }, attrs: { href: "#", id: "toggle" } },
      [
        _c("i", {
          staticClass: "fas fa-bars fa-lg",
          staticStyle: { color: "#bf1438" }
        }),
        _c("img", {
          staticStyle: { width: "60%", "margin-left": "10%" },
          attrs: { src: "assets/images/bangers-logo.png", alt: "" }
        })
      ]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", [
      _c("a", { staticClass: "mobile-nav-list", attrs: { href: "/awards" } }, [
        _vm._v("Bomb Coins")
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-lg-3 col-sm-3" }, [
      _c("a", { staticClass: "navbar-brand", attrs: { href: "/index" } }, [
        _c("img", { staticClass: "site-logo", attrs: { alt: "" } })
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-lg-3 col-sm-3" }, [
      _c("div", { staticClass: "topbtn" })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-52a39182", module.exports)
  }
}

/***/ }),

/***/ 1254:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1255)
/* template */
var __vue_template__ = __webpack_require__(1256)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/modal/Login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-280c80ec", Component.options)
  } else {
    hotAPI.reload("data-v-280c80ec", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends__ = __webpack_require__(1223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Layouts_ModalLayout_vue__ = __webpack_require__(1224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Layouts_ModalLayout_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_Layouts_ModalLayout_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_Mixins_validation_error__ = __webpack_require__(1233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vform__ = __webpack_require__(1232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vform__);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["b" /* createNamespacedHelpers */])("auth"),
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState;




/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    ModalLayout: __WEBPACK_IMPORTED_MODULE_1_Layouts_ModalLayout_vue___default.a
  },
  mixins: [__WEBPACK_IMPORTED_MODULE_3_Mixins_validation_error__["a" /* default */]],
  data: function data() {
    return {
      dialog: false,
      form: new __WEBPACK_IMPORTED_MODULE_4_vform__["Form"]({
        email: "",
        password: "",
        remember: false
      }),
      password_visible: false
    };
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends___default()({
    icon: function icon() {
      return this.password_visible ? "visibility" : "visibility_off";
    }
  }, mapState({
    isAuthenticated: "isAuthenticated"
  })),
  mounted: function mounted() {
    var _this = this;

    Bus.$on("open-login", function () {
      _this.dialog = true;
    });
    Bus.$on("close-login", function () {
      _this.dialog = false;
    });
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_C_xampp_htdocs_banger_gaming_node_modules_babel_runtime_helpers_extends___default()({
    resetPassword: function resetPassword() {
      var self = this;
      self.$nextTick(function () {
        return self.$router.push({ name: "forgotpassword" });
      });
    },
    goHome: function goHome() {
      var self = this;
      self.$nextTick(function () {
        return self.$router.push({ name: "home" });
      });
    },
    goToRegister: function goToRegister() {
      var self = this;
      self.$nextTick(function () {
        return self.$router.push({ name: "register" });
      });
    },
    login: function login() {
      var self = this;
      self.$validator.validateAll();
      if (!self.errors.any()) {
        self.submit(self.form);
      }
    }
  }, mapActions({
    submit: "login"
  }))
});

/***/ }),

/***/ 1256:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: { width: "500" },
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _c(
        "v-card",
        [
          _c(
            "v-card-title",
            { staticClass: "headline error", attrs: { dark: "" } },
            [_c("span", { staticClass: "white--text" }, [_vm._v("Login")])]
          ),
          _vm._v(" "),
          _c(
            "v-card-text",
            [
              _c(
                "v-container",
                { attrs: { fluid: "" } },
                [
                  _c(
                    "form",
                    {
                      on: {
                        submit: function($event) {
                          $event.preventDefault()
                          return _vm.login()
                        }
                      }
                    },
                    [
                      _c(
                        "v-layout",
                        { attrs: { row: "" } },
                        [
                          _c(
                            "v-flex",
                            {
                              attrs: {
                                xs12: "",
                                sm12: "",
                                md4: "",
                                "offset-md4": "",
                                lg4: "",
                                "offset-lg4": "",
                                xl4: "",
                                "offset-xl4": ""
                              }
                            },
                            [
                              _c("v-text-field", {
                                directives: [
                                  {
                                    name: "validate",
                                    rawName: "v-validate",
                                    value: "required|email",
                                    expression: "'required|email'"
                                  }
                                ],
                                staticClass: "primary--text",
                                class: {
                                  "error--text": _vm.hasErrors("email")
                                },
                                attrs: {
                                  "error-messages": _vm.errorMessages("email"),
                                  name: "email",
                                  label: "Type Your Account Email",
                                  "data-vv-name": "email",
                                  "prepend-icon": "email",
                                  counter: "255"
                                },
                                model: {
                                  value: _vm.form.email,
                                  callback: function($$v) {
                                    _vm.$set(_vm.form, "email", $$v)
                                  },
                                  expression: "form.email"
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-layout",
                        { attrs: { row: "" } },
                        [
                          _c(
                            "v-flex",
                            {
                              attrs: {
                                xs12: "",
                                sm12: "",
                                md4: "",
                                "offset-md4": "",
                                lg4: "",
                                "offset-lg4": "",
                                xl4: "",
                                "offset-xl4": ""
                              }
                            },
                            [
                              _c("v-text-field", {
                                directives: [
                                  {
                                    name: "validate",
                                    rawName: "v-validate",
                                    value: "required|min:6",
                                    expression: "'required|min:6'"
                                  }
                                ],
                                staticClass: "primary--text",
                                class: {
                                  "error--text": _vm.hasErrors("password")
                                },
                                attrs: {
                                  "append-icon": _vm.icon,
                                  type: !_vm.password_visible
                                    ? "password"
                                    : "text",
                                  "error-messages": _vm.errorMessages(
                                    "password"
                                  ),
                                  name: "password",
                                  label: "Enter your password",
                                  hint: "At least 6 characters",
                                  "data-vv-name": "password",
                                  counter: "255",
                                  "prepend-icon": "fa-key"
                                },
                                on: {
                                  "click:append": function() {
                                    return (_vm.password_visible = !_vm.password_visible)
                                  }
                                },
                                model: {
                                  value: _vm.form.password,
                                  callback: function($$v) {
                                    _vm.$set(_vm.form, "password", $$v)
                                  },
                                  expression: "form.password"
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-flex",
                        {
                          attrs: {
                            xs12: "",
                            sm12: "",
                            md4: "",
                            "offset-md4": "",
                            lg4: "",
                            "offset-lg4": "",
                            xl4: "",
                            "offset-xl4": "",
                            "text-xs-center": ""
                          }
                        },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                loading: _vm.form.busy,
                                disabled: _vm.errors.any(),
                                block: "",
                                type: "submit",
                                color: "primary"
                              }
                            },
                            [
                              _vm._v(
                                "\n                            Sign In\n                            "
                              ),
                              _c("v-icon", { attrs: { right: "" } }, [
                                _vm._v(
                                  "\n                                fa-sign-in\n                            "
                                )
                              ])
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        {
                          attrs: {
                            xs6: "",
                            md2: "",
                            "offset-md4": "",
                            "pa-0": ""
                          }
                        },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                dark: "",
                                block: "",
                                color: "secondary"
                              },
                              nativeOn: {
                                click: function($event) {
                                  return _vm.goToRegister()
                                }
                              }
                            },
                            [
                              _vm._v(
                                "\n                            No Account Yet?\n                        "
                              )
                            ]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-flex",
                        { attrs: { xs6: "", md2: "", "pa-0": "" } },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: { dark: "", block: "", color: "error" },
                              nativeOn: {
                                click: function($event) {
                                  return _vm.resetPassword()
                                }
                              }
                            },
                            [
                              _vm._v(
                                "\n                            Forgot Password?\n                        "
                              )
                            ]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-280c80ec", module.exports)
  }
}

/***/ }),

/***/ 1257:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("v-app", {}, [
    _c(
      "main",
      [
        _c("notifications", {
          attrs: { group: "error", position: "top center", duration: 15000 }
        }),
        _vm._v(" "),
        _c("login"),
        _vm._v(" "),
        _c("navbar"),
        _vm._v(" "),
        _c(
          "v-container",
          {
            attrs: {
              transition: "slide-x-transition",
              fluid: "",
              "pa-0": "",
              "ma-0": ""
            }
          },
          [_vm._t("default")],
          2
        )
      ],
      1
    ),
    _vm._v(" "),
    _c("footer")
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-41936d53", module.exports)
  }
}

/***/ }),

/***/ 1277:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1278);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1222)("c8d2adee", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-097fa176\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Home.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-097fa176\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Home.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1278:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n.image[data-v-097fa176] {\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: center center;\n  border: 2px solid #ba9a5a;\n  margin: 15px;\n}\n", ""]);

// exports


/***/ }),

/***/ 1279:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Components_home_MainSlider_vue__ = __webpack_require__(1280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Components_home_MainSlider_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_Components_home_MainSlider_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Components_home_FeaturedGames__ = __webpack_require__(1283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Components_home_FeaturedGames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_Components_home_FeaturedGames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Components_home_CashArea_vue__ = __webpack_require__(1288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Components_home_CashArea_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_Components_home_CashArea_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_Components_home_BombArea_vue__ = __webpack_require__(1290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_Components_home_BombArea_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_Components_home_BombArea_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_Components_home_NewsArea_vue__ = __webpack_require__(1292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_Components_home_NewsArea_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_Components_home_NewsArea_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_Components_home_TopPlayerArea_vue__ = __webpack_require__(1294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_Components_home_TopPlayerArea_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_Components_home_TopPlayerArea_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_Partials_SignupPopup_vue__ = __webpack_require__(1296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_Partials_SignupPopup_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_Partials_SignupPopup_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_Partials_BottomTopbutton_vue__ = __webpack_require__(1298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_Partials_BottomTopbutton_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_Partials_BottomTopbutton_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_Layouts_BangerLayout_vue__ = __webpack_require__(1241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_Layouts_BangerLayout_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_Layouts_BangerLayout_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_Components_home_Parallax_vue__ = __webpack_require__(1300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_Components_home_Parallax_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_Components_home_Parallax_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_Components_home_Showcase_vue__ = __webpack_require__(1302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_Components_home_Showcase_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_Components_home_Showcase_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_Components_home_Pioneer_vue__ = __webpack_require__(1307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_Components_home_Pioneer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_Components_home_Pioneer_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_Components_home_FeatureCase_vue__ = __webpack_require__(1312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_Components_home_FeatureCase_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_Components_home_FeatureCase_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_Components_home_VideoCase_vue__ = __webpack_require__(1317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_Components_home_VideoCase_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_Components_home_VideoCase_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_Components_home_Testimonial_vue__ = __webpack_require__(1322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_Components_home_Testimonial_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_Components_home_Testimonial_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_Components_home_CallToAction_vue__ = __webpack_require__(1325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_Components_home_CallToAction_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_Components_home_CallToAction_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


















/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    BangerLayout: __WEBPACK_IMPORTED_MODULE_8_Layouts_BangerLayout_vue___default.a,
    MainSlider: __WEBPACK_IMPORTED_MODULE_0_Components_home_MainSlider_vue___default.a,
    FeaturedGames: __WEBPACK_IMPORTED_MODULE_1_Components_home_FeaturedGames___default.a,
    CashArea: __WEBPACK_IMPORTED_MODULE_2_Components_home_CashArea_vue___default.a,
    BombArea: __WEBPACK_IMPORTED_MODULE_3_Components_home_BombArea_vue___default.a,
    NewsArea: __WEBPACK_IMPORTED_MODULE_4_Components_home_NewsArea_vue___default.a,
    TopPlayer: __WEBPACK_IMPORTED_MODULE_5_Components_home_TopPlayerArea_vue___default.a,
    SignupPopup: __WEBPACK_IMPORTED_MODULE_6_Partials_SignupPopup_vue___default.a,
    BottomTop: __WEBPACK_IMPORTED_MODULE_7_Partials_BottomTopbutton_vue___default.a,
    ShowCase: __WEBPACK_IMPORTED_MODULE_10_Components_home_Showcase_vue___default.a,
    FeatureCase: __WEBPACK_IMPORTED_MODULE_12_Components_home_FeatureCase_vue___default.a,
    VideoCase: __WEBPACK_IMPORTED_MODULE_13_Components_home_VideoCase_vue___default.a,
    Testimonial: __WEBPACK_IMPORTED_MODULE_14_Components_home_Testimonial_vue___default.a,
    Pioneer: __WEBPACK_IMPORTED_MODULE_11_Components_home_Pioneer_vue___default.a,
    CallToAction: __WEBPACK_IMPORTED_MODULE_15_Components_home_CallToAction_vue___default.a,
    Parallax: __WEBPACK_IMPORTED_MODULE_9_Components_home_Parallax_vue___default.a
  },
  data: function data() {
    return {
      contentClass: { white: true, 'accent--text': true }

    };
  },
  mounted: function mounted() {
    Bus.$emit('footer-content-visible', true);
  }
});

/***/ }),

/***/ 1280:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1281)
/* template */
var __vue_template__ = __webpack_require__(1282)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/MainSlider.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2d9f52cf", Component.options)
  } else {
    hotAPI.reload("data-v-2d9f52cf", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1281:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      slide: 0,
      sliding: null
    };
  },

  methods: {
    onSlideStart: function onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd: function onSlideEnd(slide) {
      this.sliding = false;
    }
  }
});

/***/ }),

/***/ 1282:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "b-carousel",
        {
          staticStyle: { "text-shadow": "1px 1px 2px #333" },
          attrs: {
            id: "carousel-1",
            interval: 4000,
            controls: "",
            indicators: "",
            background: "#ababab",
            "img-width": "1024",
            "img-height": "480"
          },
          on: {
            "sliding-start": _vm.onSlideStart,
            "sliding-end": _vm.onSlideEnd
          },
          model: {
            value: _vm.slide,
            callback: function($$v) {
              _vm.slide = $$v
            },
            expression: "slide"
          }
        },
        [
          _c("b-carousel-slide", {
            attrs: {
              caption: "Call of Duty",
              text:
                "Nulla vitae elit libero, a pharetra augue mollis interdum.",
              "img-src":
                "assets/images/Content-coder/Call-of-duty-homepage2.jpg"
            }
          }),
          _vm._v(" "),
          _c(
            "b-carousel-slide",
            {
              attrs: {
                "img-src": "assets/images/Content-coder/Fortnite-Homepage2.png"
              }
            },
            [_c("h1", [_vm._v("Fortnite")])]
          ),
          _vm._v(" "),
          _c("b-carousel-slide", {
            attrs: {
              "img-src": "assets/images/Content-coder/Csgo-Homepage2.png"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c("p", { staticClass: "mt-4" }, [
        _vm._v("\n    Slide #: " + _vm._s(_vm.slide)),
        _c("br"),
        _vm._v("\n    Sliding: " + _vm._s(_vm.sliding) + "\n  ")
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2d9f52cf", module.exports)
  }
}

/***/ }),

/***/ 1283:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1284)
/* template */
var __vue_template__ = __webpack_require__(1287)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/FeaturedGames.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-171715ee", Component.options)
  } else {
    hotAPI.reload("data-v-171715ee", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mdbvue__ = __webpack_require__(1285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mdbvue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mdbvue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Api_home__ = __webpack_require__(1286);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  name: "CarouselPage",
  components: {
    mdbCarousel: __WEBPACK_IMPORTED_MODULE_0_mdbvue__["mdbCarousel"],
    mdbBtn: __WEBPACK_IMPORTED_MODULE_0_mdbvue__["mdbBtn"],
    mdbCard: __WEBPACK_IMPORTED_MODULE_0_mdbvue__["mdbCard"],
    mdbCardImage: __WEBPACK_IMPORTED_MODULE_0_mdbvue__["mdbCardImage"],
    mdbCardText: __WEBPACK_IMPORTED_MODULE_0_mdbvue__["mdbCardText"],
    mdbCardBody: __WEBPACK_IMPORTED_MODULE_0_mdbvue__["mdbCardBody"]
  },
  data: function data() {
    return {
      basic: []
    };
  },
  mounted: function mounted() {
    var _this = this;

    Object(__WEBPACK_IMPORTED_MODULE_1_Api_home__["a" /* getFeaturedGames */])().then(function (response) {
      _this.basic = response.data;
    });
  }
});

/***/ }),

/***/ 1285:
/***/ (function(module, exports, __webpack_require__) {

(function(e,t){ true?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["mdbvue"]=t():e["mdbvue"]=t()})("undefined"!==typeof self?self:this,(function(){return function(e){var t={};function n(a){if(t[a])return t[a].exports;var i=t[a]={i:a,l:!1,exports:{}};return e[a].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(a,i,function(t){return e[t]}.bind(null,i));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="fae3")}({"010e":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("uz-latn",{months:"Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr".split("_"),monthsShort:"Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek".split("_"),weekdays:"Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba".split("_"),weekdaysShort:"Yak_Dush_Sesh_Chor_Pay_Jum_Shan".split("_"),weekdaysMin:"Ya_Du_Se_Cho_Pa_Ju_Sha".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Bugun soat] LT [da]",nextDay:"[Ertaga] LT [da]",nextWeek:"dddd [kuni soat] LT [da]",lastDay:"[Kecha soat] LT [da]",lastWeek:"[O'tgan] dddd [kuni soat] LT [da]",sameElse:"L"},relativeTime:{future:"Yaqin %s ichida",past:"Bir necha %s oldin",s:"soniya",ss:"%d soniya",m:"bir daqiqa",mm:"%d daqiqa",h:"bir soat",hh:"%d soat",d:"bir kun",dd:"%d kun",M:"bir oy",MM:"%d oy",y:"bir yil",yy:"%d yil"},week:{dow:1,doy:7}});return t}))},"018f":function(e,t,n){"use strict";var a=n("876f"),i=n.n(a);i.a},"02fb":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),monthsParseExact:!0,weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm -നു",LLLL:"dddd, D MMMM YYYY, A h:mm -നു"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",ss:"%d സെക്കൻഡ്",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,meridiemHour:function(e,t){return 12===e&&(e=0),"രാത്രി"===t&&e>=4||"ഉച്ച കഴിഞ്ഞ്"===t||"വൈകുന്നേരം"===t?e+12:e},meridiem:function(e,t,n){return e<4?"രാത്രി":e<12?"രാവിലെ":e<17?"ഉച്ച കഴിഞ്ഞ്":e<20?"വൈകുന്നേരം":"രാത്രി"}});return t}))},"03be":function(e,t,n){"use strict";var a=n("1817"),i=n.n(a);i.a},"03ec":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("cv",{months:"кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),monthsShort:"кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кҫ_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",LLL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",LLLL:"dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ӗнер] LT [сехетре]",nextWeek:"[Ҫитес] dddd LT [сехетре]",lastWeek:"[Иртнӗ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(e){var t=/сехет$/i.exec(e)?"рен":/ҫул$/i.exec(e)?"тан":"ран";return e+t},past:"%s каялла",s:"пӗр-ик ҫеккунт",ss:"%d ҫеккунт",m:"пӗр минут",mm:"%d минут",h:"пӗр сехет",hh:"%d сехет",d:"пӗр кун",dd:"%d кун",M:"пӗр уйӑх",MM:"%d уйӑх",y:"пӗр ҫул",yy:"%d ҫул"},dayOfMonthOrdinalParse:/\d{1,2}-мӗш/,ordinal:"%d-мӗш",week:{dow:1,doy:7}});return t}))},"0481":function(e,t,n){"use strict";var a=n("23e7"),i=n("a2bf"),r=n("7b0b"),o=n("50c4"),s=n("a691"),l=n("65f0");a({target:"Array",proto:!0},{flat:function(){var e=arguments.length?arguments[0]:void 0,t=r(this),n=o(t.length),a=l(t,0);return a.length=i(a,t,t,n,0,void 0===e?1:s(e)),a}})},"0558":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e){return e%100===11||e%10!==1}function n(e,n,a,i){var r=e+" ";switch(a){case"s":return n||i?"nokkrar sekúndur":"nokkrum sekúndum";case"ss":return t(e)?r+(n||i?"sekúndur":"sekúndum"):r+"sekúnda";case"m":return n?"mínúta":"mínútu";case"mm":return t(e)?r+(n||i?"mínútur":"mínútum"):n?r+"mínúta":r+"mínútu";case"hh":return t(e)?r+(n||i?"klukkustundir":"klukkustundum"):r+"klukkustund";case"d":return n?"dagur":i?"dag":"degi";case"dd":return t(e)?n?r+"dagar":r+(i?"daga":"dögum"):n?r+"dagur":r+(i?"dag":"degi");case"M":return n?"mánuður":i?"mánuð":"mánuði";case"MM":return t(e)?n?r+"mánuðir":r+(i?"mánuði":"mánuðum"):n?r+"mánuður":r+(i?"mánuð":"mánuði");case"y":return n||i?"ár":"ári";case"yy":return t(e)?r+(n||i?"ár":"árum"):r+(n||i?"ár":"ári")}}var a=e.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd, D. MMMM YYYY [kl.] H:mm"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:n,ss:n,m:n,mm:n,h:"klukkustund",hh:n,d:n,dd:n,M:n,MM:n,y:n,yy:n},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return a}))},"057f":function(e,t,n){var a=n("fc6a"),i=n("241c").f,r={}.toString,o="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(e){try{return i(e)}catch(t){return o.slice()}};e.exports.f=function(e){return o&&"[object Window]"==r.call(e)?s(e):i(a(e))}},"05bd":function(e,t,n){"use strict";n.r(t),n.d(t,"mdbDropdown",(function(){return d}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{directives:[{name:"mdb-click-outside",rawName:"v-mdb-click-outside",value:e.multiAway,expression:"multiAway"}],ref:"popper",tag:"component",class:e.className,style:e.style},[n("span",{directives:[{name:"mdb-click-outside",rawName:"v-mdb-click-outside",value:e.away,expression:"away"}],staticClass:"dropdown-toggler",attrs:{tabindex:"0"},on:{click:function(t){e.toggle=!e.toggle},keyup:function(t){if(!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;t.stopPropagation(),e.toggle=!e.toggle}}},[e._t("toggle")],2),n("transition",{on:{enter:e.enter,"after-enter":e.afterEnter,"before-leave":e.beforeLeave}},[n("ul",{directives:[{name:"show",rawName:"v-show",value:e.toggle,expression:"toggle"}],ref:"options",staticClass:"list-unstyled mb-0",staticStyle:{"z-index":"1000",transition:"opacity .2s linear"}},[e._t("default")],2)])],1)},i=[],r=(n("99af"),n("7db0"),n("c975"),n("ac1f"),n("1276"),n("c101")),o=n("f0bd"),s={stopProp:function(e){e.stopPropagation()},inserted:function(e,t){var n=function(n){e.contains(n.target)||e===n.target||t.value(n)};e.clickOutside=n;var a=t.modifiers.mousedown?"mousedown":"click";document.addEventListener(a,e.clickOutside),document.addEventListener("touchstart",e.clickOutside)},unbind:function(e,t){if(e.clickOutside){var n=t.modifiers.mousedown?"mousedown":"click";document.removeEventListener(n,e.clickOutside),document.removeEventListener("touchstart",e.clickOutside),delete e.clickOutside}}},l={props:{tag:{type:String,default:"div"},btnGroup:{type:Boolean},dropup:{type:Boolean,default:!1},dropright:{type:Boolean,default:!1},dropleft:{type:Boolean,default:!1},end:{type:Boolean,default:!1},split:{type:Boolean,default:!1},multiLevel:{type:Boolean,default:!1},updatePosition:{type:Boolean,default:!0}},data:function(){return{toggle:!1,popperJS:null,popperOptions:{placement:"bottom",eventsEnabled:!1,modifiers:{offset:{offset:"0"}}}}},mixins:[r["a"]],directives:{mdbClickOutside:s},methods:{away:function(){this.multiLevel||(this.toggle=!1)},multiAway:function(){this.multiLevel&&(this.toggle=!1)},createPopper:function(){var e=this;this.$nextTick((function(){e.popperJS=new o["a"](e.$refs.popper,e.$refs.options,e.popperOptions)}))},updatePopper:function(){this.popperJS?this.popperJS.scheduleUpdate():this.createPopper()},enter:function(e){e.style.opacity=0},afterEnter:function(e){e.style.opacity=1},beforeLeave:function(e){e.style.opacity=0}},computed:{className:function(){return[this.btnGroup?"btn-group":"dropdown",this.mdbClass,this.multiLevel&&"multi-level-dropdown"]},style:function(){return{"margin-left":this.split&&"-0.3rem"}}},mounted:function(){var e=this.dropright||this.dropleft?"0px, 2px":"0px, 0px";this.popperOptions.modifiers.offset.offset=e;var t=this.dropup?"top":this.dropright?"right":this.dropleft?"left":"bottom",n=!1,a=this.$children.find((function(e){return-1!==e.$el.className.indexOf("dropdown-menu")}));a&&(n=a.right);var i=this.end||n?"end":"start",r="".concat(t,"-").concat(i);this.popperOptions.placement=r,this.updatePosition&&(this.popperOptions.eventsEnabled=!0),window.addEventListener("hashchange",this.away)},beforeDestroy:function(){window.removeEventListener("hashchange",this.away)},watch:{toggle:function(e){e&&!this.megaMenu&&this.updatePopper()}}},d={mixins:[l]},u=d,c=u,h=(n("ead7"),n("ee91"),n("2877")),f=Object(h["a"])(c,a,i,!1,null,"547548e8",null);t["default"]=f.exports},"060a":function(e,t,n){"use strict";n.d(t,"b",(function(){return r}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("i",{class:e.className})},i=[],r=(n("c975"),n("c7cd"),{props:{icon:{type:String},size:{type:[Boolean,String],default:!1},fixed:{type:Boolean,default:!1},pull:{type:[Boolean,String],default:!1},border:{type:Boolean,default:!1},spin:{type:Boolean,default:!1},pulse:{type:Boolean,default:!1},rotate:{type:[Boolean,String],default:!1},flip:{type:[Boolean,String],default:!1},inverse:{type:[Boolean,String],default:!1},stack:{type:[Boolean,String],default:!1},color:{type:String,default:""},far:{type:Boolean,default:!1},regular:{type:Boolean,default:!1},fal:{type:Boolean,default:!1},light:{type:Boolean,default:!1},fab:{type:Boolean,default:!1},fad:{type:Boolean,default:!1},duotone:{type:Boolean,default:!1},brands:{type:Boolean,default:!1}},computed:{className:function(){var e=["red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","grey","blue-grey","white"];return[this.far||this.regular?"far":this.fal||this.light?"fal":this.fab||this.brands?"fab":this.fad||this.duotone?"fad":"fas",this.icon&&"fa-"+this.icon,this.size&&"fa-"+this.size,this.fixed&&"fa-fw",this.pull&&"fa-pull-"+this.pull,this.border&&"fa-border",this.spin&&"fa-spin",this.pulse&&"fa-pulse",this.rotate&&"fa-rotate-"+this.rotate,this.flip&&"fa-flip-"+this.flip,this.inverse&&"fa-inverse",this.stack&&"fa-"+this.stack,-1===e.indexOf(this.color)?"text-"+this.color:this.color+"-text"]}}}),o=r,s=o,l=n("2877"),d=Object(l["a"])(s,a,i,!1,null,"c77fa86a",null);t["a"]=d.exports},"06cf":function(e,t,n){var a=n("83ab"),i=n("d1e7"),r=n("5c6c"),o=n("fc6a"),s=n("c04e"),l=n("5135"),d=n("0cfb"),u=Object.getOwnPropertyDescriptor;t.f=a?u:function(e,t){if(e=o(e),t=s(t,!0),d)try{return u(e,t)}catch(n){}if(l(e,t))return r(!i.f.call(e,t),e[t])}},"06d9":function(e,t,n){"use strict";var a=n("072c"),i=n.n(a);i.a},"0721":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D. MMMM, YYYY HH:mm"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",ss:"%d sekundir",m:"ein minuttur",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaður",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return t}))},"072c":function(e,t,n){},"079e":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ja",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日 HH:mm",LLLL:"YYYY年M月D日 dddd HH:mm",l:"YYYY/MM/DD",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日(ddd) HH:mm"},meridiemParse:/午前|午後/i,isPM:function(e){return"午後"===e},meridiem:function(e,t,n){return e<12?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:function(e){return e.week()<this.week()?"[来週]dddd LT":"dddd LT"},lastDay:"[昨日] LT",lastWeek:function(e){return this.week()<e.week()?"[先週]dddd LT":"dddd LT"},sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}日/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"日";default:return e}},relativeTime:{future:"%s後",past:"%s前",s:"数秒",ss:"%d秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}});return t}))},"0a3c":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),n="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),a=[/^ene/i,/^feb/i,/^mar/i,/^abr/i,/^may/i,/^jun/i,/^jul/i,/^ago/i,/^sep/i,/^oct/i,/^nov/i,/^dic/i],i=/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,r=e.defineLocale("es-do",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,a){return e?/-MMM-/.test(a)?n[e.month()]:t[e.month()]:t},monthsRegex:i,monthsShortRegex:i,monthsStrictRegex:/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,monthsShortStrictRegex:/^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,monthsParse:a,longMonthsParse:a,shortMonthsParse:a,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY h:mm A",LLLL:"dddd, D [de] MMMM [de] YYYY h:mm A"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});return r}))},"0a84":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",ss:"%d ثانية",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}});return t}))},"0caa":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n,a){var i={s:["thodde secondanim","thodde second"],ss:[e+" secondanim",e+" second"],m:["eka mintan","ek minute"],mm:[e+" mintanim",e+" mintam"],h:["eka voran","ek vor"],hh:[e+" voranim",e+" voram"],d:["eka disan","ek dis"],dd:[e+" disanim",e+" dis"],M:["eka mhoinean","ek mhoino"],MM:[e+" mhoineanim",e+" mhoine"],y:["eka vorsan","ek voros"],yy:[e+" vorsanim",e+" vorsam"]};return t?i[n][0]:i[n][1]}var n=e.defineLocale("gom-latn",{months:"Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr".split("_"),monthsShort:"Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son'var".split("_"),weekdaysShort:"Ait._Som._Mon._Bud._Bre._Suk._Son.".split("_"),weekdaysMin:"Ai_Sm_Mo_Bu_Br_Su_Sn".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"A h:mm [vazta]",LTS:"A h:mm:ss [vazta]",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY A h:mm [vazta]",LLLL:"dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]",llll:"ddd, D MMM YYYY, A h:mm [vazta]"},calendar:{sameDay:"[Aiz] LT",nextDay:"[Faleam] LT",nextWeek:"[Ieta to] dddd[,] LT",lastDay:"[Kal] LT",lastWeek:"[Fatlo] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%s",past:"%s adim",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}(er)/,ordinal:function(e,t){switch(t){case"D":return e+"er";default:case"M":case"Q":case"DDD":case"d":case"w":case"W":return e}},week:{dow:1,doy:4},meridiemParse:/rati|sokalli|donparam|sanje/,meridiemHour:function(e,t){return 12===e&&(e=0),"rati"===t?e<4?e:e+12:"sokalli"===t?e:"donparam"===t?e>12?e:e+12:"sanje"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"rati":e<12?"sokalli":e<16?"donparam":e<20?"sanje":"rati"}});return n}))},"0cd3":function(e,t,n){"use strict";var a=n("95ed"),i=n.n(a);i.a},"0cfb":function(e,t,n){var a=n("83ab"),i=n("d039"),r=n("cc12");e.exports=!a&&!i((function(){return 7!=Object.defineProperty(r("div"),"a",{get:function(){return 7}}).a}))},"0e49":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("fr-ch",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"di_lu_ma_me_je_ve_sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd’hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",ss:"%d secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|e)/,ordinal:function(e,t){switch(t){default:case"M":case"Q":case"D":case"DDD":case"d":return e+(1===e?"er":"e");case"w":case"W":return e+(1===e?"re":"e")}},week:{dow:1,doy:4}});return t}))},"0e6b":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n},week:{dow:1,doy:4}});return t}))},"0e81":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"},n=e.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[gelecek] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",ss:"%d saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinal:function(e,n){switch(n){case"d":case"D":case"Do":case"DD":return e;default:if(0===e)return e+"'ıncı";var a=e%10,i=e%100-a,r=e>=100?100:null;return e+(t[a]||t[i]||t[r])}},week:{dow:1,doy:7}});return n}))},"0ee8":function(e,t,n){(function(e,n){n(t)})(0,(function(e){"use strict";function t(e,t){return t={exports:{}},e(t,t.exports),t.exports}var n={symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3,stripZeros:!1,fallback:0};function a(e){var t=arguments.length<=1||void 0===arguments[1]?n.decimal:arguments[1],i=arguments.length<=2||void 0===arguments[2]?n.fallback:arguments[2];if(Array.isArray(e))return e.map((function(e){return a(e,t,i)}));if("number"===typeof e)return e;var r=new RegExp("[^0-9-(-)-"+t+"]",["g"]),o=(""+e).replace(r,"").replace(t,".").replace(/\(([-]*\d*[^)]?\d+)\)/g,"-$1").replace(/\((.*)\)/,""),s=(o.match(/-/g)||2).length%2,l=parseFloat(o.replace(/-/g,"")),d=l*(s?-1:1);return isNaN(d)?i:d}function i(e,t){return e=Math.round(Math.abs(e)),isNaN(e)?t:e}function r(e,t){t=i(t,n.precision);var a=Math.pow(10,t);return(Math.round((e+1e-8)*a)/a).toFixed(t)}var o=t((function(e){var t=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable;function a(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=Object.assign||function(e,i){for(var r,o,s=a(e),l=1;l<arguments.length;l++){for(var d in r=Object(arguments[l]),r)t.call(r,d)&&(s[d]=r[d]);if(Object.getOwnPropertySymbols){o=Object.getOwnPropertySymbols(r);for(var u=0;u<o.length;u++)n.call(r,o[u])&&(s[o[u]]=r[o[u]])}}return s}})),s=o&&"object"===typeof o&&"default"in o?o["default"]:o;function l(e,t){var n=e.split(t),a=n[0],i=n[1].replace(/0+$/,"");return i.length>0?a+t+i:a}function d(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];if(Array.isArray(e))return e.map((function(e){return d(e,t)}));t=s({},n,t);var a=e<0?"-":"",i=parseInt(r(Math.abs(e),t.precision),10)+"",o=i.length>3?i.length%3:0,u=a+(o?i.substr(0,o)+t.thousand:"")+i.substr(o).replace(/(\d{3})(?=\d)/g,"$1"+t.thousand)+(t.precision>0?t.decimal+r(Math.abs(e),t.precision).split(".")[1]:"");return t.stripZeros?l(u,t.decimal):u}var u=t((function(e){var t=String.prototype.valueOf,n=function(e){try{return t.call(e),!0}catch(n){return!1}},a=Object.prototype.toString,i="[object String]",r="function"===typeof Symbol&&"symbol"===typeof Symbol.toStringTag;e.exports=function(e){return"string"===typeof e||"object"===typeof e&&(r?n(e):a.call(e)===i)}})),c=u&&"object"===typeof u&&"default"in u?u["default"]:u;function h(e){return c(e)&&e.match("%v")?{pos:e,neg:e.replace("-","").replace("%v","-%v"),zero:e}:e}function f(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];if(Array.isArray(e))return e.map((function(e){return f(e,t)}));t=s({},n,t);var a=h(t.format),i=void 0;return i=e>0?a.pos:e<0?a.neg:a.zero,i.replace("%s",t.symbol).replace("%v",d(Math.abs(e),t))}function m(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];if(!e)return[];t=s({},n,t);var i=h(t.format),r=i.pos.indexOf("%s")<i.pos.indexOf("%v"),o=0,l=e.map((function(e){if(Array.isArray(e))return m(e,t);e=a(e,t.decimal);var n=void 0;n=e>0?i.pos:e<0?i.neg:i.zero;var r=n.replace("%s",t.symbol).replace("%v",d(Math.abs(e),t));return r.length>o&&(o=r.length),r}));return l.map((function(e){return c(e)&&e.length<o?r?e.replace(t.symbol,t.symbol+new Array(o-e.length+1).join(" ")):new Array(o-e.length+1).join(" ")+e:e}))}e.settings=n,e.unformat=a,e.toFixed=r,e.formatMoney=f,e.formatNumber=d,e.formatColumn=m,e.format=f,e.parse=a}))},"0f14":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd [d.] D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"på dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[i] dddd[s kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",ss:"%d sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return t}))},"0f38":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY HH:mm",LLLL:"dddd, MMMM DD, YYYY HH:mm"},calendar:{sameDay:"LT [ngayong araw]",nextDay:"[Bukas ng] LT",nextWeek:"LT [sa susunod na] dddd",lastDay:"LT [kahapon]",lastWeek:"LT [noong nakaraang] dddd",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",ss:"%d segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}});return t}))},"0ff2":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),monthsParseExact:!0,weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] HH:mm",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] HH:mm",llll:"ddd, YYYY[ko] MMM D[a] HH:mm"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",ss:"%d segundo",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});return t}))},"10e8":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.".split("_"),monthsParseExact:!0,weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา H:mm",LLLL:"วันddddที่ D MMMM YYYY เวลา H:mm"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(e){return"หลังเที่ยง"===e},meridiem:function(e,t,n){return e<12?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",ss:"%d วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}});return t}))},1276:function(e,t,n){"use strict";var a=n("d784"),i=n("44e7"),r=n("825a"),o=n("1d80"),s=n("4840"),l=n("8aa5"),d=n("50c4"),u=n("14c3"),c=n("9263"),h=n("d039"),f=[].push,m=Math.min,p=4294967295,_=!h((function(){return!RegExp(p,"y")}));a("split",2,(function(e,t,n){var a;return a="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(e,n){var a=String(o(this)),r=void 0===n?p:n>>>0;if(0===r)return[];if(void 0===e)return[a];if(!i(e))return t.call(a,e,r);var s,l,d,u=[],h=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),m=0,_=new RegExp(e.source,h+"g");while(s=c.call(_,a)){if(l=_.lastIndex,l>m&&(u.push(a.slice(m,s.index)),s.length>1&&s.index<a.length&&f.apply(u,s.slice(1)),d=s[0].length,m=l,u.length>=r))break;_.lastIndex===s.index&&_.lastIndex++}return m===a.length?!d&&_.test("")||u.push(""):u.push(a.slice(m)),u.length>r?u.slice(0,r):u}:"0".split(void 0,0).length?function(e,n){return void 0===e&&0===n?[]:t.call(this,e,n)}:t,[function(t,n){var i=o(this),r=void 0==t?void 0:t[e];return void 0!==r?r.call(t,i,n):a.call(String(i),t,n)},function(e,i){var o=n(a,e,this,i,a!==t);if(o.done)return o.value;var c=r(e),h=String(this),f=s(c,RegExp),g=c.unicode,y=(c.ignoreCase?"i":"")+(c.multiline?"m":"")+(c.unicode?"u":"")+(_?"y":"g"),v=new f(_?c:"^(?:"+c.source+")",y),b=void 0===i?p:i>>>0;if(0===b)return[];if(0===h.length)return null===u(v,h)?[h]:[];var M=0,L=0,k=[];while(L<h.length){v.lastIndex=_?L:0;var w,x=u(v,_?h:h.slice(L));if(null===x||(w=m(d(v.lastIndex+(_?0:L)),h.length))===M)L=l(h,L,g);else{if(k.push(h.slice(M,L)),k.length===b)return k;for(var Y=1;Y<=x.length-1;Y++)if(k.push(x[Y]),k.length===b)return k;L=M=w}}return k.push(h.slice(M)),k}]}),!_)},"129f":function(e,t){e.exports=Object.is||function(e,t){return e===t?0!==e||1/e===1/t:e!=e&&t!=t}},1347:function(e,t,n){},"13d5":function(e,t,n){"use strict";var a=n("23e7"),i=n("d58f").left,r=n("b301");a({target:"Array",proto:!0,forced:r("reduce")},{reduce:function(e){return i(this,e,arguments.length,arguments.length>1?arguments[1]:void 0)}})},"13e9":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={words:{ss:["секунда","секунде","секунди"],m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(e,t){return 1===e?t[0]:e>=2&&e<=4?t[1]:t[2]},translate:function(e,n,a){var i=t.words[a];return 1===a.length?n?i[0]:i[1]:e+" "+t.correctGrammaticalCase(e,i)}},n=e.defineLocale("sr-cyrl",{months:"јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар".split("_"),monthsShort:"јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.".split("_"),monthsParseExact:!0,weekdays:"недеља_понедељак_уторак_среда_четвртак_петак_субота".split("_"),weekdaysShort:"нед._пон._уто._сре._чет._пет._суб.".split("_"),weekdaysMin:"не_по_ут_ср_че_пе_су".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var e=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",ss:t.translate,m:t.translate,mm:t.translate,h:t.translate,hh:t.translate,d:"дан",dd:t.translate,M:"месец",MM:t.translate,y:"годину",yy:t.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});return n}))},"14c3":function(e,t,n){var a=n("c6b6"),i=n("9263");e.exports=function(e,t){var n=e.exec;if("function"===typeof n){var r=n.call(e,t);if("object"!==typeof r)throw TypeError("RegExp exec method returned something other than an Object or null");return r}if("RegExp"!==a(e))throw TypeError("RegExp#exec called on incompatible receiver");return i.call(e,t)}},"159b":function(e,t,n){var a=n("da84"),i=n("fdbc"),r=n("17c2"),o=n("9112");for(var s in i){var l=a[s],d=l&&l.prototype;if(d&&d.forEach!==r)try{o(d,"forEach",r)}catch(u){d.forEach=r}}},"16f9":function(e,t,n){"use strict";var a=n("34bc"),i=n.n(a);i.a},"17c2":function(e,t,n){"use strict";var a=n("b727").forEach,i=n("b301");e.exports=i("forEach")?function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}:[].forEach},1817:function(e,t,n){},1968:function(e,t,n){"use strict";n.d(t,"b",(function(){return o}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,on:{click:e.wave}},[e.text?n("p",{staticClass:"white-text"},[e._v(e._s(e.text))]):e._e(),e._t("default")],2)},i=[],r=n("9327"),o={props:{tag:{type:String,default:"div"},pattern:{type:String},flexCenter:{type:Boolean,default:!1},text:{type:String},waves:{type:Boolean,default:!1},overlay:{type:String}},computed:{className:function(){return["mask",this.pattern?"pattern-"+this.pattern:"",this.flexCenter?"flex-center":"",this.overlay?"rgba-"+this.overlay:"",this.waves?"ripple-parent":""]}},mixins:[r["a"]]},s=o,l=s,d=n("2877"),u=Object(d["a"])(l,a,i,!1,null,"457711ef",null);t["a"]=u.exports},"19aa":function(e,t){e.exports=function(e,t,n){if(!(e instanceof t))throw TypeError("Incorrect "+(n?n+" ":"")+"invocation");return e}},"1b45":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("mt",{months:"Jannar_Frar_Marzu_April_Mejju_Ġunju_Lulju_Awwissu_Settembru_Ottubru_Novembru_Diċembru".split("_"),monthsShort:"Jan_Fra_Mar_Apr_Mej_Ġun_Lul_Aww_Set_Ott_Nov_Diċ".split("_"),weekdays:"Il-Ħadd_It-Tnejn_It-Tlieta_L-Erbgħa_Il-Ħamis_Il-Ġimgħa_Is-Sibt".split("_"),weekdaysShort:"Ħad_Tne_Tli_Erb_Ħam_Ġim_Sib".split("_"),weekdaysMin:"Ħa_Tn_Tl_Er_Ħa_Ġi_Si".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Illum fil-]LT",nextDay:"[Għada fil-]LT",nextWeek:"dddd [fil-]LT",lastDay:"[Il-bieraħ fil-]LT",lastWeek:"dddd [li għadda] [fil-]LT",sameElse:"L"},relativeTime:{future:"f’ %s",past:"%s ilu",s:"ftit sekondi",ss:"%d sekondi",m:"minuta",mm:"%d minuti",h:"siegħa",hh:"%d siegħat",d:"ġurnata",dd:"%d ġranet",M:"xahar",MM:"%d xhur",y:"sena",yy:"%d sni"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});return t}))},"1b53":function(e,t,n){},"1be4":function(e,t,n){var a=n("d066");e.exports=a("document","documentElement")},"1c0b":function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(String(e)+" is not a function");return e}},"1c7a":function(e,t,n){},"1c7e":function(e,t,n){var a=n("b622"),i=a("iterator"),r=!1;try{var o=0,s={next:function(){return{done:!!o++}},return:function(){r=!0}};s[i]=function(){return this},Array.from(s,(function(){throw 2}))}catch(l){}e.exports=function(e,t){if(!t&&!r)return!1;var n=!1;try{var a={};a[i]=function(){return{next:function(){return{done:n=!0}}}},e(a)}catch(l){}return n}},"1cfd":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",0:"0"},n=function(e){return 0===e?0:1===e?1:2===e?2:e%100>=3&&e%100<=10?3:e%100>=11?4:5},a={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},i=function(e){return function(t,i,r,o){var s=n(t),l=a[e][n(t)];return 2===s&&(l=l[i?0:1]),l.replace(/%d/i,t)}},r=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],o=e.defineLocale("ar-ly",{months:r,monthsShort:r,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(e){return"م"===e},meridiem:function(e,t,n){return e<12?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:i("s"),ss:i("s"),m:i("m"),mm:i("m"),h:i("h"),hh:i("h"),d:i("d"),dd:i("d"),M:i("M"),MM:i("M"),y:i("y"),yy:i("y")},preparse:function(e){return e.replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"،")},week:{dow:6,doy:12}});return o}))},"1d80":function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on "+e);return e}},"1dde":function(e,t,n){var a=n("d039"),i=n("b622"),r=i("species");e.exports=function(e){return!a((function(){var t=[],n=t.constructor={};return n[r]=function(){return{foo:1}},1!==t[e](Boolean).foo}))}},"1f84":function(e,t,n){},"1fc1":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t){var n=e.split("_");return t%10===1&&t%100!==11?n[0]:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?n[1]:n[2]}function n(e,n,a){var i={ss:n?"секунда_секунды_секунд":"секунду_секунды_секунд",mm:n?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:n?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===a?n?"хвіліна":"хвіліну":"h"===a?n?"гадзіна":"гадзіну":e+" "+t(i[a],+e)}var a=e.defineLocale("be",{months:{format:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_"),standalone:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_")},monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:{format:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_"),standalone:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),isFormat:/\[ ?[Ууў] ?(?:мінулую|наступную)? ?\] ?dddd/},weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:n,mm:n,h:n,hh:n,d:"дзень",dd:n,M:"месяц",MM:n,y:"год",yy:n},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(e){return/^(дня|вечара)$/.test(e)},meridiem:function(e,t,n){return e<4?"ночы":e<12?"раніцы":e<17?"дня":"вечара"},dayOfMonthOrdinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":case"w":case"W":return e%10!==2&&e%10!==3||e%100===12||e%100===13?e+"-ы":e+"-і";case"D":return e+"-га";default:return e}},week:{dow:1,doy:7}});return a}))},"201b":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ka",{months:{standalone:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),format:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:{standalone:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),format:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_"),isFormat:/(წინა|შემდეგ)/},weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(e){return/(წამი|წუთი|საათი|წელი)/.test(e)?e.replace(/ი$/,"ში"):e+"ში"},past:function(e){return/(წამი|წუთი|საათი|დღე|თვე)/.test(e)?e.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(e)?e.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",ss:"%d წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},dayOfMonthOrdinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(e){return 0===e?e:1===e?e+"-ლი":e<20||e<=100&&e%20===0||e%100===0?"მე-"+e:e+"-ე"},week:{dow:1,doy:7}});return t}))},"21b8":function(e,t,n){},2266:function(e,t,n){var a=n("825a"),i=n("e95a"),r=n("50c4"),o=n("f8c2"),s=n("35a1"),l=n("9bdd"),d=function(e,t){this.stopped=e,this.result=t},u=e.exports=function(e,t,n,u,c){var h,f,m,p,_,g,y,v=o(t,n,u?2:1);if(c)h=e;else{if(f=s(e),"function"!=typeof f)throw TypeError("Target is not iterable");if(i(f)){for(m=0,p=r(e.length);p>m;m++)if(_=u?v(a(y=e[m])[0],y[1]):v(e[m]),_&&_ instanceof d)return _;return new d(!1)}h=f.call(e)}g=h.next;while(!(y=g.call(h)).done)if(_=l(h,v,y.value,u),"object"==typeof _&&_&&_ instanceof d)return _;return new d(!1)};u.stop=function(e){return new d(!0,e)}},"22f8":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 A h:mm",LLLL:"YYYY년 MMMM D일 dddd A h:mm",l:"YYYY.MM.DD.",ll:"YYYY년 MMMM D일",lll:"YYYY년 MMMM D일 A h:mm",llll:"YYYY년 MMMM D일 dddd A h:mm"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇 초",ss:"%d초",m:"1분",mm:"%d분",h:"한 시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한 달",MM:"%d달",y:"일 년",yy:"%d년"},dayOfMonthOrdinalParse:/\d{1,2}(일|월|주)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"일";case"M":return e+"월";case"w":case"W":return e+"주";default:return e}},meridiemParse:/오전|오후/,isPM:function(e){return"오후"===e},meridiem:function(e,t,n){return e<12?"오전":"오후"}});return t}))},"23cb":function(e,t,n){var a=n("a691"),i=Math.max,r=Math.min;e.exports=function(e,t){var n=a(e);return n<0?i(n+t,0):r(n,t)}},"23e7":function(e,t,n){var a=n("da84"),i=n("06cf").f,r=n("9112"),o=n("6eeb"),s=n("ce4e"),l=n("e893"),d=n("94ca");e.exports=function(e,t){var n,u,c,h,f,m,p=e.target,_=e.global,g=e.stat;if(u=_?a:g?a[p]||s(p,{}):(a[p]||{}).prototype,u)for(c in t){if(f=t[c],e.noTargetGet?(m=i(u,c),h=m&&m.value):h=u[c],n=d(_?c:p+(g?".":"#")+c,e.forced),!n&&void 0!==h){if(typeof f===typeof h)continue;l(f,h)}(e.sham||h&&h.sham)&&r(f,"sham",!0),o(u,c,f,e)}}},"241c":function(e,t,n){var a=n("ca84"),i=n("7839"),r=i.concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return a(e,r)}},2421:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},n={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},a=["کانونی دووەم","شوبات","ئازار","نیسان","ئایار","حوزەیران","تەمموز","ئاب","ئەیلوول","تشرینی یەكەم","تشرینی دووەم","كانونی یەکەم"],i=e.defineLocale("ku",{months:a,monthsShort:a,weekdays:"یه‌كشه‌ممه‌_دووشه‌ممه‌_سێشه‌ممه‌_چوارشه‌ممه‌_پێنجشه‌ممه‌_هه‌ینی_شه‌ممه‌".split("_"),weekdaysShort:"یه‌كشه‌م_دووشه‌م_سێشه‌م_چوارشه‌م_پێنجشه‌م_هه‌ینی_شه‌ممه‌".split("_"),weekdaysMin:"ی_د_س_چ_پ_ه_ش".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/ئێواره‌|به‌یانی/,isPM:function(e){return/ئێواره‌/.test(e)},meridiem:function(e,t,n){return e<12?"به‌یانی":"ئێواره‌"},calendar:{sameDay:"[ئه‌مرۆ كاتژمێر] LT",nextDay:"[به‌یانی كاتژمێر] LT",nextWeek:"dddd [كاتژمێر] LT",lastDay:"[دوێنێ كاتژمێر] LT",lastWeek:"dddd [كاتژمێر] LT",sameElse:"L"},relativeTime:{future:"له‌ %s",past:"%s",s:"چه‌ند چركه‌یه‌ك",ss:"چركه‌ %d",m:"یه‌ك خوله‌ك",mm:"%d خوله‌ك",h:"یه‌ك كاتژمێر",hh:"%d كاتژمێر",d:"یه‌ك ڕۆژ",dd:"%d ڕۆژ",M:"یه‌ك مانگ",MM:"%d مانگ",y:"یه‌ك ساڵ",yy:"%d ساڵ"},preparse:function(e){return e.replace(/[١٢٣٤٥٦٧٨٩٠]/g,(function(e){return n[e]})).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"،")},week:{dow:6,doy:12}});return i}))},2532:function(e,t,n){"use strict";var a=n("23e7"),i=n("5a34"),r=n("1d80"),o=n("ab13");a({target:"String",proto:!0,forced:!o("includes")},{includes:function(e){return!!~String(r(this)).indexOf(i(e),arguments.length>1?arguments[1]:void 0)}})},2554:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n){var a=e+" ";switch(n){case"ss":return a+=1===e?"sekunda":2===e||3===e||4===e?"sekunde":"sekundi",a;case"m":return t?"jedna minuta":"jedne minute";case"mm":return a+=1===e?"minuta":2===e||3===e||4===e?"minute":"minuta",a;case"h":return t?"jedan sat":"jednog sata";case"hh":return a+=1===e?"sat":2===e||3===e||4===e?"sata":"sati",a;case"dd":return a+=1===e?"dan":"dana",a;case"MM":return a+=1===e?"mjesec":2===e||3===e||4===e?"mjeseca":"mjeseci",a;case"yy":return a+=1===e?"godina":2===e||3===e||4===e?"godine":"godina",a}}var n=e.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",ss:t,m:t,mm:t,h:t,hh:t,d:"dan",dd:t,M:"mjesec",MM:t,y:"godinu",yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});return n}))},"25f0":function(e,t,n){"use strict";var a=n("6eeb"),i=n("825a"),r=n("d039"),o=n("ad6d"),s="toString",l=RegExp.prototype,d=l[s],u=r((function(){return"/a/b"!=d.call({source:"a",flags:"b"})})),c=d.name!=s;(u||c)&&a(RegExp.prototype,s,(function(){var e=i(this),t=String(e.source),n=e.flags,a=String(void 0===n&&e instanceof RegExp&&!("flags"in l)?o.call(e):n);return"/"+t+"/"+a}),{unsafe:!0})},2626:function(e,t,n){"use strict";var a=n("d066"),i=n("9bf2"),r=n("b622"),o=n("83ab"),s=r("species");e.exports=function(e){var t=a(e),n=i.f;o&&t&&!t[s]&&n(t,s,{configurable:!0,get:function(){return this}})}},"26a4":function(e,t,n){},"26f9":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={ss:"sekundė_sekundžių_sekundes",m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"};function n(e,t,n,a){return t?"kelios sekundės":a?"kelių sekundžių":"kelias sekundes"}function a(e,t,n,a){return t?r(n)[0]:a?r(n)[1]:r(n)[2]}function i(e){return e%10===0||e>10&&e<20}function r(e){return t[e].split("_")}function o(e,t,n,o){var s=e+" ";return 1===e?s+a(e,t,n[0],o):t?s+(i(e)?r(n)[1]:r(n)[0]):o?s+r(n)[1]:s+(i(e)?r(n)[1]:r(n)[2])}var s=e.defineLocale("lt",{months:{format:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),standalone:"sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split("_"),isFormat:/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/},monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:{format:"sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį".split("_"),standalone:"sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),isFormat:/dddd HH:mm/},weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], HH:mm [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], HH:mm [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:n,ss:o,m:a,mm:o,h:a,hh:o,d:a,dd:o,M:a,MM:o,y:a,yy:o},dayOfMonthOrdinalParse:/\d{1,2}-oji/,ordinal:function(e){return e+"-oji"},week:{dow:1,doy:4}});return s}))},2840:function(e,t,n){"use strict";n.r(t),n.d(t,"mdbStepper",(function(){return s}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.simpleV?n("div",{staticClass:"row",class:{"mt-5":e.simpleV}},[n("div",{staticClass:"col-md-12"},[n("ul",{staticClass:"stepper-linear",class:e.simpleClass},e._l(e.steps,(function(t,a){return n("li",{key:a,staticClass:"step",class:{active:a+1===e.activeStep}},[n("a",{staticClass:"ripple-parent w-100",on:{click:function(t){return e.changeActiveStep(a+1)}}},[n("span",{staticClass:"circle",class:{"success-color":a+1<e.activeStep}},[a+1<e.activeStep?n("mdb-icon",{attrs:{icon:"check"}}):n("span",[e._v(e._s(a+1))])],1),n("div",{staticClass:"label"},[e._v(e._s(t.name||"Step "+(a+1)))])]),n("transition",{attrs:{duration:{enter:600,leave:300}},on:{"before-enter":e.beforeEnter,enter:e.enter,"before-leave":e.beforeLeave,leave:e.leave}},[a+1===e.activeStep?n("div",{ref:"stepContent",refInFor:!0,staticClass:"step-content w-100"},[e._v(e._s(t.content))]):e._e()])],1)})),0)])]):e.simpleH?n("div",{staticClass:"row"},[n("div",{staticClass:"col-md-12"},[n("ul",{class:e.simpleClass},e._l(e.steps,(function(t,a){return n("li",{key:a,staticClass:"horizontal-step step",class:{active:a+1===e.activeStep}},[n("a",{staticClass:"ripple-parent w-100",on:{click:function(t){return e.changeActiveStep(a+1)}}},[n("span",{staticClass:"circle",class:{"success-color":a+1<e.activeStep}},[a+1<e.activeStep?n("mdb-icon",{attrs:{icon:"check"}}):n("span",[e._v(e._s(a+1))])],1),n("span",{staticClass:"label"},[e._v(e._s(t.name||"Step "+(a+1)))])]),n("span",{staticClass:"simple-line",style:a+1===e.numOfSteps&&"background-color: transparent"})])})),0),e._l(e.steps,(function(t,a){return n("div",{key:a,staticClass:"step",class:{active:a+1===e.activeStep},staticStyle:{overflow:"hidden"}},[n("transition",{attrs:{"enter-active-class":"animated slideInLeft"}},[a+1===e.activeStep?n("div",{staticClass:"step-content w-100"},[e._v(e._s(t.content))]):e._e()])],1)}))],2)]):e._e()},i=[],r=(n("4160"),n("a9e3"),n("159b"),n("060a")),o={components:{mdbIcon:r["a"]},props:{value:{type:Number,default:1},simpleV:{type:Boolean,default:!1},steps:{type:[Array,Number],required:!0}},data:function(){return{activeStep:1}},computed:{simpleClass:function(){return this.simpleV?"stepper stepper-vertical":"stepper stepper-horizontal"},numOfSteps:function(){return"number"===typeof this.steps?this.steps:this.steps.length}},methods:{beforeEnter:function(e){e.style.height="0"},enter:function(e){e.style.height=e.scrollHeight+"px"},beforeLeave:function(e){e.style.height=e.scrollHeight+"px"},leave:function(e){e.style.height="0"},setStepHeight:function(){this.$refs.stepContent&&this.$refs.stepContent.forEach((function(e){e.style.height=e.scrollHeight+"px"}))}},beforeMount:function(){this.activeStep=this.value},mounted:function(){this.simpleV&&this.setStepHeight()},watch:{activeStep:function(e){this.$emit("input",e)},value:function(e){this.changeActiveStep(e)},steps:function(){this.setStepHeight()}}},s={props:{simpleH:{type:Boolean,default:!0}},methods:{changeActiveStep:function(e){this.activeStep=e}},mixins:[o]},l=s,d=l,u=(n("06d9"),n("2877")),c=Object(u["a"])(d,a,i,!1,null,"28cf9018",null);t["default"]=c.exports},2877:function(e,t,n){"use strict";function a(e,t,n,a,i,r,o,s){var l,d="function"===typeof e?e.options:e;if(t&&(d.render=t,d.staticRenderFns=n,d._compiled=!0),a&&(d.functional=!0),r&&(d._scopeId="data-v-"+r),o?(l=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"===typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(o)},d._ssrRegister=l):i&&(l=s?function(){i.call(this,this.$root.$options.shadowRoot)}:i),l)if(d.functional){d._injectStyles=l;var u=d.render;d.render=function(e,t){return l.call(t),u(e,t)}}else{var c=d.beforeCreate;d.beforeCreate=c?[].concat(c,l):[l]}return{exports:e,options:d}}n.d(t,"a",(function(){return a}))},"291c":function(e,t,n){"use strict";n.d(t,"b",(function(){return r}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e.src&&!e.video?n("img",{class:e.imgClass,attrs:{src:e.src,alt:e.alt}}):e._e(),e.src&&e.video?n("video",{staticClass:"video-fluid",attrs:{autoplay:e.autoplay?"true":null,loop:e.loop?"true":null}},[n("source",{attrs:{src:e.src,type:e.videoType}})]):e._e(),e._t("default")],2)},i=[],r={props:{tag:{type:String,default:"div"},src:{type:String},alt:{type:String},hover:{type:Boolean,default:!1},zoom:{type:Boolean,default:!1},rounded:{type:Boolean,default:!1},shadow:{type:Boolean,default:!1},imageClass:{type:String},wrapperClass:{type:String},gradient:{type:String},circle:{type:Boolean},cascade:{type:Boolean},video:{type:Boolean,default:!1},videoType:{type:String,default:"video/mp4"},autoplay:{type:Boolean,default:!0},loop:{type:Boolean,default:!0}},computed:{className:function(){return["view",this.hover?"overlay":"",this.zoom?"zoom":"",this.wrapperClass?this.wrapperClass:"",this.rounded?"rounded":"",this.circle?"rounded-circle":"",this.gradient?"gradient-card-header "+this.gradient+"-gradient":"",this.cascade&&"view-cascade"]},imgClass:function(){return[this.zoom?"w-100":"","img-fluid",this.imageClass?this.imageClass:"",this.shadow?"hoverable":""]}}},o=r,s=o,l=n("2877"),d=Object(l["a"])(s,a,i,!1,null,null,null);t["a"]=d.exports},2921:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),monthsParseExact:!0,weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysParseExact:!0,meridiemParse:/sa|ch/i,isPM:function(e){return/^ch$/i.test(e)},meridiem:function(e,t,n){return e<12?n?"sa":"SA":n?"ch":"CH"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY HH:mm",LLLL:"dddd, D MMMM [năm] YYYY HH:mm",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",ss:"%d giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}});return t}))},"293c":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={words:{ss:["sekund","sekunda","sekundi"],m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(e,t){return 1===e?t[0]:e>=2&&e<=4?t[1]:t[2]},translate:function(e,n,a){var i=t.words[a];return 1===a.length?n?i[0]:i[1]:e+" "+t.correctGrammaticalCase(e,i)}},n=e.defineLocale("me",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var e=["[prošle] [nedjelje] [u] LT","[prošlog] [ponedjeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srijede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",ss:t.translate,m:t.translate,mm:t.translate,h:t.translate,hh:t.translate,d:"dan",dd:t.translate,M:"mjesec",MM:t.translate,y:"godinu",yy:t.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});return n}))},"2a95":function(e,t,n){"use strict";n.d(t,"b",(function(){return r}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},i=[],r={props:{tag:{type:String,default:"thead"},color:{type:String},textWhite:{type:Boolean,default:!1}},computed:{className:function(){return["dark"!==this.color&&"light"!==this.color?this.color:"thead-".concat(this.color),this.textWhite&&"text-white"]}}},o=r,s=o,l=n("2877"),d=Object(l["a"])(s,a,i,!1,null,"37bf7abc",null);t["a"]=d.exports},"2b57":function(e,t,n){"use strict";n.d(t,"b",(function(){return o}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,on:{click:e.wave}},[n("a",{staticClass:"page-link",attrs:{href:e.href}},[e._t("default")],2)])},i=[],r=n("9327"),o={props:{tag:{type:String,default:"li"},active:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},href:{type:String},waves:{type:Boolean,default:!0},darkWaves:{type:Boolean,default:!0}},computed:{className:function(){return["page-item",!!this.active&&"active",!!this.disabled&&"disabled",!!this.waves&&"ripple-parent"]}},mixins:[r["a"]]},s=o,l=s,d=n("2877"),u=Object(d["a"])(l,a,i,!1,null,"1960fa80",null);t["a"]=u.exports},"2bfb":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(e){return/^nm$/i.test(e)},meridiem:function(e,t,n){return e<12?n?"vm":"VM":n?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",ss:"%d sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}});return t}))},"2bfd":function(e,t,n){},"2c40":function(e,t,n){"use strict";n.r(t),n.d(t,"mdbInput",(function(){return l}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.noWrapper?n(e.whatTagIsThis,{ref:"input",tag:"component",class:e.inputClasses,attrs:{id:e.id,type:e.type,step:e.step,min:e.min,max:e.max,placeholder:e.placeholder,disabled:e.disabled,name:e.name,required:e.required,checked:e.inputChecked,value:e.innerValue,rows:e.rows,maxlength:e.maxlength,"aria-label":e.label||e.ariaLabel||e.placeholder,"aria-describedby":e.ariaDescribedBy,"aria-labelledby":e.ariaLabelledBy,"aria-multiselectable":e.ariaMultiselectable,"aria-disabled":e.ariaDisabled,"aria-required":e.ariaRequired,"aria-haspopup":e.ariaHaspopup,"aria-expanded":e.ariaExpanded,"aria-owns":e.ariaOwns,role:e.role,autofocus:e.autofocus,readOnly:e.readOnly,autocomplete:e.autocomplete},on:{focus:e.focus,blur:e.blur,click:e.onClick,change:e.onChange,input:e.onInput}},[e._v(e._s("textarea"===e.whatTagIsThis&&e.value))]):n("div",{class:e.wrapperClasses},[e.icon?n("i",{class:e.iconClasses}):e._e(),e.$slots.prepend?n("div",{staticClass:"input-group-prepend",attrs:{id:e.prependSlotID}},[e._t("prepend")],2):e._e(),n(e.whatTagIsThis,{ref:"input",tag:"component",class:e.inputClasses,attrs:{id:e.id,type:e.type,step:e.step,min:e.min,max:e.max,placeholder:e.placeholder,disabled:e.disabled,name:e.name,required:e.required,checked:e.inputChecked,value:e.innerValue,rows:e.rows,maxlength:e.maxlength,"aria-label":e.label||e.ariaLabel||e.placeholder,"aria-describedby":e.ariaDescribedBy,"aria-labelledby":e.ariaLabelledBy,"aria-multiselectable":e.ariaMultiselectable,"aria-disabled":e.ariaDisabled,"aria-required":e.ariaRequired,"aria-haspopup":e.ariaHaspopup,"aria-expanded":e.ariaExpanded,"aria-owns":e.ariaOwns,role:e.role,readOnly:e.readOnly,autocomplete:e.autocomplete,autofocus:e.autofocus},on:{focus:e.focus,blur:e.blur,click:e.onClick,change:e.onChange,input:e.onInput}},[e._v(e._s("textarea"===e.whatTagIsThis&&e.value))]),e.label?n("label",{ref:"label",class:e.labelClasses,attrs:{for:e.id},on:{click:e.focus}},[e._v(e._s(e.label))]):e._e(),e.isThisCheckboxLabeless?n("label",{ref:"label",class:e.labelClasses,attrs:{for:e.id},on:{click:e.focus}}):e._e(),e._t("default"),e.$slots.append?n("div",{staticClass:"input-group-append",attrs:{id:e.appendSlotID}},[e._t("append")],2):e._e(),e.validFeedback?n("div",{staticClass:"valid-feedback"},[e._v(e._s(e.validFeedback))]):e._e(),e.invalidFeedback?n("div",{staticClass:"invalid-feedback"},[e._v(e._s(e.invalidFeedback))]):e._e(),e.small?n("small",{staticClass:"form-text text-muted"},[e._v(e._s(e.small))]):e._e()],2)},i=[],r=(n("a9e3"),n("9327")),o=n("c101"),s={props:{basic:{type:Boolean,default:!1},name:{type:String},required:{type:Boolean,default:!1},tag:{type:String,default:"input"},type:{type:String,default:"text"},id:{type:[String,Boolean],default:!1},label:{type:String},filled:{type:Boolean},icon:{type:String},placeholder:{type:String},size:{type:String},disabled:{type:Boolean,default:!1},checked:{type:Boolean,default:!1},navInput:{type:Boolean,default:!1},gap:{type:Boolean,default:!1},waves:{type:Boolean,default:!1},value:{type:[String,Number,Boolean,Array],default:""},labelColor:{type:String},iconClass:{type:String},inline:{type:Boolean},validation:{type:Boolean},customValidation:{type:Boolean},isValid:{type:Boolean},active:{type:Boolean,default:!1},labelClass:{type:[Array,String]},far:{type:Boolean,default:!1},regular:{type:Boolean,default:!1},fal:{type:Boolean,default:!1},light:{type:Boolean,default:!1},fab:{type:Boolean,default:!1},brands:{type:Boolean,default:!1},rows:{type:Number},wrapperClass:{type:[String,Array]},noWrapper:{type:Boolean,value:!1},ariaLabel:{type:String},ariaDescribedBy:{type:String},ariaLabelledBy:{type:String},ariaOwns:{type:String},ariaMultiselectable:Boolean,ariaDisabled:Boolean,ariaRequired:Boolean,ariaHaspopup:Boolean,ariaExpanded:Boolean,role:String,prependSlotID:{type:String},appendSlotID:{type:String},inputClass:{type:String},maxlength:{type:[String,Number]},outline:{type:Boolean,default:!1},validFeedback:{type:[String,Boolean],default:!1},invalidFeedback:{type:[String,Boolean],default:!1},small:{type:String},bg:{type:Boolean},radioValue:{type:String},min:{type:Number},max:{type:Number},step:{type:[Number,Boolean],default:!1},readOnly:{type:Boolean},autofocus:{type:Boolean},autocomplete:{type:String},selectInput:{type:Boolean,default:!1}},data:function(){return{innerValue:this.value,innerChecked:this.checked,isTouched:this.active}},mounted:function(){"checkbox"===this.type||"radio"===this.type?this.$emit("getDefaultValue",this.inputChecked):this.$emit("getDefaultValue",this.innerValue)},computed:{inputChecked:function(){return"checkbox"===this.type?!0===this.value||!0===this.innerChecked:"radio"===this.type&&!(this.value!==this.radioValue&&!this.innerChecked)},inputClasses:function(){return["form-control",!!this.validation&&(this.isValid?"is-valid":"is-invalid"),!!this.customValidation&&(this.isValid?"is-valid":"is-invalid"),this.size&&"form-control-"+this.size,{"filled-in":this.filled,"with-gap":this.gap},"checkbox"===this.type&&(!this.gap&&"form-check-input"),"radio"===this.type&&"form-check-input","textarea"===this.type&&!this.basic&&"md-textarea",this.inputClass&&this.inputClass]},wrapperClasses:function(){return["checkbox"!==this.type&&"radio"!==this.type||!this.inline?("checkbox"===this.type||"radio"===this.type)&&"form-check":"form-check",!this.basic&&"checkbox"!==this.type&&"radio"!==this.type&&"md-form",this.outline&&"md-outline",this.bg&&"md-bg",this.waves&&"ripple-parent",this.doesItGetTheGroupClass&&this.size?"input-group input-group-".concat(this.size):this.doesItGetTheGroupClass&&!this.size?"input-group":!(this.doesItGetTheGroupClass||!this.size)&&"form-".concat(this.size),this.wrapperClass,this.mdbClass]},iconClasses:function(){return[this.far||this.regular?"far":this.fal||this.light?"fal":this.fab||this.brands?"fab":"fas","prefix fa-"+this.icon,this.isTouched&&"active",this.iconClass]},labelClasses:function(){return[{active:(this.placeholder||this.isTouched&&!this.selectInput||""!==this.innerValue)&&"checkbox"!==this.type&&"radio"!==this.type,disabled:this.disabled,"form-check-label":"checkbox"===this.type||"radio"===this.type,"mr-5":!this.isThisCheckboxLabeless},this.labelColor&&"text-"+this.labelColor,this.labelClass]},whatTagIsThis:function(){return"textarea"===this.type?"textarea":this.tag},doesItGetTheGroupClass:function(){return this.$slots.prepend||this.$slots.append||this.basic&&"textarea"===this.type},isThisCheckboxLabeless:function(){return"checkbox"===this.type&&"undefined"===typeof this.label}},methods:{focus:function(e){this.$emit("focus",e),this.isTouched=!0,this.disabled||this.$refs.input.focus(),this.navInput&&(this.$el.firstElementChild.style.borderColor="transparent",this.$el.firstElementChild.style.boxShadow="none")},blur:function(e){"number"===this.type&&("number"===typeof this.min&&this.innerValue<this.min?this.innerValue=this.min:"number"===typeof this.max&&this.innerValue>this.max&&(this.innerValue=this.max),this.$refs.input.value=this.innerValue,this.$emit("change",this.innerValue)),this.$emit("blur",e),this.isTouched=!1,this.navInput&&(this.$el.firstElementChild.style.borderColor="#fff")},onChange:function(e){"checkbox"===this.type?(this.$emit("change",e.target.checked),this.$emit("input",e.target.checked),this.innerChecked=e.target.checked):"radio"===this.type?(this.innerChecked=e.target.checked,this.radioValue&&this.$emit("input",this.radioValue)):this.$emit("change",e.target.value)},onInput:function(e){if("checkbox"!==this.type&&(this.$emit("input",e.target.value),this.innerValue=e.target.value),"text"===this.type||"textarea"===this.type){var t=e.target.selectionStart;this.$nextTick((function(){e.target.setSelectionRange(t,t)}))}},onClick:function(e){this.wave(),this.$emit("click",e)}},mixins:[r["a"],o["a"]],watch:{value:function(e){this.$refs.input.value=e,this.innerValue=e,this.$emit("change",this.innerValue)}}},l={mixins:[s]},d=l,u=d,c=(n("782c"),n("2877")),h=Object(c["a"])(u,a,i,!1,null,"bcf4a656",null);t["default"]=h.exports},"2cf4":function(e,t,n){var a,i,r,o=n("da84"),s=n("d039"),l=n("c6b6"),d=n("f8c2"),u=n("1be4"),c=n("cc12"),h=n("b39a"),f=o.location,m=o.setImmediate,p=o.clearImmediate,_=o.process,g=o.MessageChannel,y=o.Dispatch,v=0,b={},M="onreadystatechange",L=function(e){if(b.hasOwnProperty(e)){var t=b[e];delete b[e],t()}},k=function(e){return function(){L(e)}},w=function(e){L(e.data)},x=function(e){o.postMessage(e+"",f.protocol+"//"+f.host)};m&&p||(m=function(e){var t=[],n=1;while(arguments.length>n)t.push(arguments[n++]);return b[++v]=function(){("function"==typeof e?e:Function(e)).apply(void 0,t)},a(v),v},p=function(e){delete b[e]},"process"==l(_)?a=function(e){_.nextTick(k(e))}:y&&y.now?a=function(e){y.now(k(e))}:g&&!/(iphone|ipod|ipad).*applewebkit/i.test(h)?(i=new g,r=i.port2,i.port1.onmessage=w,a=d(r.postMessage,r,1)):!o.addEventListener||"function"!=typeof postMessage||o.importScripts||s(x)?a=M in c("script")?function(e){u.appendChild(c("script"))[M]=function(){u.removeChild(this),L(e)}}:function(e){setTimeout(k(e),0)}:(a=x,o.addEventListener("message",w,!1))),e.exports={set:m,clear:p}},"2e8c":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("uz",{months:"январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",ss:"%d фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}});return t}))},"30ef":function(e,t,n){
/*!
 * Chart.js v2.8.0
 * https://www.chartjs.org
 * (c) 2019 Chart.js Contributors
 * Released under the MIT License
 */
(function(t,a){e.exports=a(function(){try{return n("c1df")}catch(e){}}())})(0,(function(e){"use strict";e=e&&e.hasOwnProperty("default")?e["default"]:e;var t={rgb2hsl:n,rgb2hsv:a,rgb2hwb:i,rgb2cmyk:o,rgb2keyword:s,rgb2xyz:l,rgb2lab:d,rgb2lch:u,hsl2rgb:c,hsl2hsv:h,hsl2hwb:f,hsl2cmyk:m,hsl2keyword:p,hsv2rgb:_,hsv2hsl:y,hsv2hwb:v,hsv2cmyk:M,hsv2keyword:L,hwb2rgb:k,hwb2hsl:w,hwb2hsv:x,hwb2cmyk:Y,hwb2keyword:S,cmyk2rgb:D,cmyk2hsl:T,cmyk2hsv:H,cmyk2hwb:C,cmyk2keyword:O,keyword2rgb:z,keyword2hsl:R,keyword2hsv:$,keyword2hwb:V,keyword2cmyk:J,keyword2lab:U,keyword2xyz:G,xyz2rgb:j,xyz2lab:P,xyz2lch:A,lab2xyz:E,lab2rgb:B,lab2lch:I,lch2lab:W,lch2xyz:F,lch2rgb:N};function n(e){var t,n,a,i=e[0]/255,r=e[1]/255,o=e[2]/255,s=Math.min(i,r,o),l=Math.max(i,r,o),d=l-s;return l==s?t=0:i==l?t=(r-o)/d:r==l?t=2+(o-i)/d:o==l&&(t=4+(i-r)/d),t=Math.min(60*t,360),t<0&&(t+=360),a=(s+l)/2,n=l==s?0:a<=.5?d/(l+s):d/(2-l-s),[t,100*n,100*a]}function a(e){var t,n,a,i=e[0],r=e[1],o=e[2],s=Math.min(i,r,o),l=Math.max(i,r,o),d=l-s;return n=0==l?0:d/l*1e3/10,l==s?t=0:i==l?t=(r-o)/d:r==l?t=2+(o-i)/d:o==l&&(t=4+(i-r)/d),t=Math.min(60*t,360),t<0&&(t+=360),a=l/255*1e3/10,[t,n,a]}function i(e){var t=e[0],a=e[1],i=e[2],r=n(e)[0],o=1/255*Math.min(t,Math.min(a,i));i=1-1/255*Math.max(t,Math.max(a,i));return[r,100*o,100*i]}function o(e){var t,n,a,i,r=e[0]/255,o=e[1]/255,s=e[2]/255;return i=Math.min(1-r,1-o,1-s),t=(1-r-i)/(1-i)||0,n=(1-o-i)/(1-i)||0,a=(1-s-i)/(1-i)||0,[100*t,100*n,100*a,100*i]}function s(e){return X[JSON.stringify(e)]}function l(e){var t=e[0]/255,n=e[1]/255,a=e[2]/255;t=t>.04045?Math.pow((t+.055)/1.055,2.4):t/12.92,n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92,a=a>.04045?Math.pow((a+.055)/1.055,2.4):a/12.92;var i=.4124*t+.3576*n+.1805*a,r=.2126*t+.7152*n+.0722*a,o=.0193*t+.1192*n+.9505*a;return[100*i,100*r,100*o]}function d(e){var t,n,a,i=l(e),r=i[0],o=i[1],s=i[2];return r/=95.047,o/=100,s/=108.883,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,s=s>.008856?Math.pow(s,1/3):7.787*s+16/116,t=116*o-16,n=500*(r-o),a=200*(o-s),[t,n,a]}function u(e){return I(d(e))}function c(e){var t,n,a,i,r,o=e[0]/360,s=e[1]/100,l=e[2]/100;if(0==s)return r=255*l,[r,r,r];n=l<.5?l*(1+s):l+s-l*s,t=2*l-n,i=[0,0,0];for(var d=0;d<3;d++)a=o+1/3*-(d-1),a<0&&a++,a>1&&a--,r=6*a<1?t+6*(n-t)*a:2*a<1?n:3*a<2?t+(n-t)*(2/3-a)*6:t,i[d]=255*r;return i}function h(e){var t,n,a=e[0],i=e[1]/100,r=e[2]/100;return 0===r?[0,0,0]:(r*=2,i*=r<=1?r:2-r,n=(r+i)/2,t=2*i/(r+i),[a,100*t,100*n])}function f(e){return i(c(e))}function m(e){return o(c(e))}function p(e){return s(c(e))}function _(e){var t=e[0]/60,n=e[1]/100,a=e[2]/100,i=Math.floor(t)%6,r=t-Math.floor(t),o=255*a*(1-n),s=255*a*(1-n*r),l=255*a*(1-n*(1-r));a*=255;switch(i){case 0:return[a,l,o];case 1:return[s,a,o];case 2:return[o,a,l];case 3:return[o,s,a];case 4:return[l,o,a];case 5:return[a,o,s]}}function y(e){var t,n,a=e[0],i=e[1]/100,r=e[2]/100;return n=(2-i)*r,t=i*r,t/=n<=1?n:2-n,t=t||0,n/=2,[a,100*t,100*n]}function v(e){return i(_(e))}function M(e){return o(_(e))}function L(e){return s(_(e))}function k(e){var t,n,a,i,o=e[0]/360,s=e[1]/100,l=e[2]/100,d=s+l;switch(d>1&&(s/=d,l/=d),t=Math.floor(6*o),n=1-l,a=6*o-t,0!=(1&t)&&(a=1-a),i=s+a*(n-s),t){default:case 6:case 0:r=n,g=i,b=s;break;case 1:r=i,g=n,b=s;break;case 2:r=s,g=n,b=i;break;case 3:r=s,g=i,b=n;break;case 4:r=i,g=s,b=n;break;case 5:r=n,g=s,b=i;break}return[255*r,255*g,255*b]}function w(e){return n(k(e))}function x(e){return a(k(e))}function Y(e){return o(k(e))}function S(e){return s(k(e))}function D(e){var t,n,a,i=e[0]/100,r=e[1]/100,o=e[2]/100,s=e[3]/100;return t=1-Math.min(1,i*(1-s)+s),n=1-Math.min(1,r*(1-s)+s),a=1-Math.min(1,o*(1-s)+s),[255*t,255*n,255*a]}function T(e){return n(D(e))}function H(e){return a(D(e))}function C(e){return i(D(e))}function O(e){return s(D(e))}function j(e){var t,n,a,i=e[0]/100,r=e[1]/100,o=e[2]/100;return t=3.2406*i+-1.5372*r+-.4986*o,n=-.9689*i+1.8758*r+.0415*o,a=.0557*i+-.204*r+1.057*o,t=t>.0031308?1.055*Math.pow(t,1/2.4)-.055:t*=12.92,n=n>.0031308?1.055*Math.pow(n,1/2.4)-.055:n*=12.92,a=a>.0031308?1.055*Math.pow(a,1/2.4)-.055:a*=12.92,t=Math.min(Math.max(0,t),1),n=Math.min(Math.max(0,n),1),a=Math.min(Math.max(0,a),1),[255*t,255*n,255*a]}function P(e){var t,n,a,i=e[0],r=e[1],o=e[2];return i/=95.047,r/=100,o/=108.883,i=i>.008856?Math.pow(i,1/3):7.787*i+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,t=116*r-16,n=500*(i-r),a=200*(r-o),[t,n,a]}function A(e){return I(P(e))}function E(e){var t,n,a,i,r=e[0],o=e[1],s=e[2];return r<=8?(n=100*r/903.3,i=n/100*7.787+16/116):(n=100*Math.pow((r+16)/116,3),i=Math.pow(n/100,1/3)),t=t/95.047<=.008856?t=95.047*(o/500+i-16/116)/7.787:95.047*Math.pow(o/500+i,3),a=a/108.883<=.008859?a=108.883*(i-s/200-16/116)/7.787:108.883*Math.pow(i-s/200,3),[t,n,a]}function I(e){var t,n,a,i=e[0],r=e[1],o=e[2];return t=Math.atan2(o,r),n=360*t/2/Math.PI,n<0&&(n+=360),a=Math.sqrt(r*r+o*o),[i,a,n]}function B(e){return j(E(e))}function W(e){var t,n,a,i=e[0],r=e[1],o=e[2];return a=o/360*2*Math.PI,t=r*Math.cos(a),n=r*Math.sin(a),[i,t,n]}function F(e){return E(W(e))}function N(e){return B(W(e))}function z(e){return q[e]}function R(e){return n(z(e))}function $(e){return a(z(e))}function V(e){return i(z(e))}function J(e){return o(z(e))}function U(e){return d(z(e))}function G(e){return l(z(e))}var q={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},X={};for(var K in q)X[JSON.stringify(q[K])]=K;var Z=function(){return new ae};for(var Q in t){Z[Q+"Raw"]=function(e){return function(n){return"number"==typeof n&&(n=Array.prototype.slice.call(arguments)),t[e](n)}}(Q);var ee=/(\w+)2(\w+)/.exec(Q),te=ee[1],ne=ee[2];Z[te]=Z[te]||{},Z[te][ne]=Z[Q]=function(e){return function(n){"number"==typeof n&&(n=Array.prototype.slice.call(arguments));var a=t[e](n);if("string"==typeof a||void 0===a)return a;for(var i=0;i<a.length;i++)a[i]=Math.round(a[i]);return a}}(Q)}var ae=function(){this.convs={}};ae.prototype.routeSpace=function(e,t){var n=t[0];return void 0===n?this.getValues(e):("number"==typeof n&&(n=Array.prototype.slice.call(t)),this.setValues(e,n))},ae.prototype.setValues=function(e,t){return this.space=e,this.convs={},this.convs[e]=t,this},ae.prototype.getValues=function(e){var t=this.convs[e];if(!t){var n=this.space,a=this.convs[n];t=Z[n][e](a),this.convs[e]=t}return t},["rgb","hsl","hsv","cmyk","keyword"].forEach((function(e){ae.prototype[e]=function(t){return this.routeSpace(e,arguments)}}));var ie=Z,re={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},oe={getRgba:se,getHsla:le,getRgb:ue,getHsl:ce,getHwb:de,getAlpha:he,hexString:fe,rgbString:me,rgbaString:pe,percentString:_e,percentaString:ge,hslString:ye,hslaString:ve,hwbString:be,keyword:Me};function se(e){if(e){var t=/^#([a-fA-F0-9]{3,4})$/i,n=/^#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)$/i,a=/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,i=/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,r=/(\w+)/,o=[0,0,0],s=1,l=e.match(t),d="";if(l){l=l[1],d=l[3];for(var u=0;u<o.length;u++)o[u]=parseInt(l[u]+l[u],16);d&&(s=Math.round(parseInt(d+d,16)/255*100)/100)}else if(l=e.match(n)){d=l[2],l=l[1];for(u=0;u<o.length;u++)o[u]=parseInt(l.slice(2*u,2*u+2),16);d&&(s=Math.round(parseInt(d,16)/255*100)/100)}else if(l=e.match(a)){for(u=0;u<o.length;u++)o[u]=parseInt(l[u+1]);s=parseFloat(l[4])}else if(l=e.match(i)){for(u=0;u<o.length;u++)o[u]=Math.round(2.55*parseFloat(l[u+1]));s=parseFloat(l[4])}else if(l=e.match(r)){if("transparent"==l[1])return[0,0,0,0];if(o=re[l[1]],!o)return}for(u=0;u<o.length;u++)o[u]=Le(o[u],0,255);return s=s||0==s?Le(s,0,1):1,o[3]=s,o}}function le(e){if(e){var t=/^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,n=e.match(t);if(n){var a=parseFloat(n[4]),i=Le(parseInt(n[1]),0,360),r=Le(parseFloat(n[2]),0,100),o=Le(parseFloat(n[3]),0,100),s=Le(isNaN(a)?1:a,0,1);return[i,r,o,s]}}}function de(e){if(e){var t=/^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,n=e.match(t);if(n){var a=parseFloat(n[4]),i=Le(parseInt(n[1]),0,360),r=Le(parseFloat(n[2]),0,100),o=Le(parseFloat(n[3]),0,100),s=Le(isNaN(a)?1:a,0,1);return[i,r,o,s]}}}function ue(e){var t=se(e);return t&&t.slice(0,3)}function ce(e){var t=le(e);return t&&t.slice(0,3)}function he(e){var t=se(e);return t||(t=le(e))||(t=de(e))?t[3]:void 0}function fe(e,t){t=void 0!==t&&3===e.length?t:e[3];return"#"+ke(e[0])+ke(e[1])+ke(e[2])+(t>=0&&t<1?ke(Math.round(255*t)):"")}function me(e,t){return t<1||e[3]&&e[3]<1?pe(e,t):"rgb("+e[0]+", "+e[1]+", "+e[2]+")"}function pe(e,t){return void 0===t&&(t=void 0!==e[3]?e[3]:1),"rgba("+e[0]+", "+e[1]+", "+e[2]+", "+t+")"}function _e(e,t){if(t<1||e[3]&&e[3]<1)return ge(e,t);var n=Math.round(e[0]/255*100),a=Math.round(e[1]/255*100),i=Math.round(e[2]/255*100);return"rgb("+n+"%, "+a+"%, "+i+"%)"}function ge(e,t){var n=Math.round(e[0]/255*100),a=Math.round(e[1]/255*100),i=Math.round(e[2]/255*100);return"rgba("+n+"%, "+a+"%, "+i+"%, "+(t||e[3]||1)+")"}function ye(e,t){return t<1||e[3]&&e[3]<1?ve(e,t):"hsl("+e[0]+", "+e[1]+"%, "+e[2]+"%)"}function ve(e,t){return void 0===t&&(t=void 0!==e[3]?e[3]:1),"hsla("+e[0]+", "+e[1]+"%, "+e[2]+"%, "+t+")"}function be(e,t){return void 0===t&&(t=void 0!==e[3]?e[3]:1),"hwb("+e[0]+", "+e[1]+"%, "+e[2]+"%"+(void 0!==t&&1!==t?", "+t:"")+")"}function Me(e){return we[e.slice(0,3)]}function Le(e,t,n){return Math.min(Math.max(t,e),n)}function ke(e){var t=e.toString(16).toUpperCase();return t.length<2?"0"+t:t}var we={};for(var xe in re)we[re[xe]]=xe;var Ye=function(e){return e instanceof Ye?e:this instanceof Ye?(this.valid=!1,this.values={rgb:[0,0,0],hsl:[0,0,0],hsv:[0,0,0],hwb:[0,0,0],cmyk:[0,0,0,0],alpha:1},void("string"===typeof e?(t=oe.getRgba(e),t?this.setValues("rgb",t):(t=oe.getHsla(e))?this.setValues("hsl",t):(t=oe.getHwb(e))&&this.setValues("hwb",t)):"object"===typeof e&&(t=e,void 0!==t.r||void 0!==t.red?this.setValues("rgb",t):void 0!==t.l||void 0!==t.lightness?this.setValues("hsl",t):void 0!==t.v||void 0!==t.value?this.setValues("hsv",t):void 0!==t.w||void 0!==t.whiteness?this.setValues("hwb",t):void 0===t.c&&void 0===t.cyan||this.setValues("cmyk",t)))):new Ye(e);var t};Ye.prototype={isValid:function(){return this.valid},rgb:function(){return this.setSpace("rgb",arguments)},hsl:function(){return this.setSpace("hsl",arguments)},hsv:function(){return this.setSpace("hsv",arguments)},hwb:function(){return this.setSpace("hwb",arguments)},cmyk:function(){return this.setSpace("cmyk",arguments)},rgbArray:function(){return this.values.rgb},hslArray:function(){return this.values.hsl},hsvArray:function(){return this.values.hsv},hwbArray:function(){var e=this.values;return 1!==e.alpha?e.hwb.concat([e.alpha]):e.hwb},cmykArray:function(){return this.values.cmyk},rgbaArray:function(){var e=this.values;return e.rgb.concat([e.alpha])},hslaArray:function(){var e=this.values;return e.hsl.concat([e.alpha])},alpha:function(e){return void 0===e?this.values.alpha:(this.setValues("alpha",e),this)},red:function(e){return this.setChannel("rgb",0,e)},green:function(e){return this.setChannel("rgb",1,e)},blue:function(e){return this.setChannel("rgb",2,e)},hue:function(e){return e&&(e%=360,e=e<0?360+e:e),this.setChannel("hsl",0,e)},saturation:function(e){return this.setChannel("hsl",1,e)},lightness:function(e){return this.setChannel("hsl",2,e)},saturationv:function(e){return this.setChannel("hsv",1,e)},whiteness:function(e){return this.setChannel("hwb",1,e)},blackness:function(e){return this.setChannel("hwb",2,e)},value:function(e){return this.setChannel("hsv",2,e)},cyan:function(e){return this.setChannel("cmyk",0,e)},magenta:function(e){return this.setChannel("cmyk",1,e)},yellow:function(e){return this.setChannel("cmyk",2,e)},black:function(e){return this.setChannel("cmyk",3,e)},hexString:function(){return oe.hexString(this.values.rgb)},rgbString:function(){return oe.rgbString(this.values.rgb,this.values.alpha)},rgbaString:function(){return oe.rgbaString(this.values.rgb,this.values.alpha)},percentString:function(){return oe.percentString(this.values.rgb,this.values.alpha)},hslString:function(){return oe.hslString(this.values.hsl,this.values.alpha)},hslaString:function(){return oe.hslaString(this.values.hsl,this.values.alpha)},hwbString:function(){return oe.hwbString(this.values.hwb,this.values.alpha)},keyword:function(){return oe.keyword(this.values.rgb,this.values.alpha)},rgbNumber:function(){var e=this.values.rgb;return e[0]<<16|e[1]<<8|e[2]},luminosity:function(){for(var e=this.values.rgb,t=[],n=0;n<e.length;n++){var a=e[n]/255;t[n]=a<=.03928?a/12.92:Math.pow((a+.055)/1.055,2.4)}return.2126*t[0]+.7152*t[1]+.0722*t[2]},contrast:function(e){var t=this.luminosity(),n=e.luminosity();return t>n?(t+.05)/(n+.05):(n+.05)/(t+.05)},level:function(e){var t=this.contrast(e);return t>=7.1?"AAA":t>=4.5?"AA":""},dark:function(){var e=this.values.rgb,t=(299*e[0]+587*e[1]+114*e[2])/1e3;return t<128},light:function(){return!this.dark()},negate:function(){for(var e=[],t=0;t<3;t++)e[t]=255-this.values.rgb[t];return this.setValues("rgb",e),this},lighten:function(e){var t=this.values.hsl;return t[2]+=t[2]*e,this.setValues("hsl",t),this},darken:function(e){var t=this.values.hsl;return t[2]-=t[2]*e,this.setValues("hsl",t),this},saturate:function(e){var t=this.values.hsl;return t[1]+=t[1]*e,this.setValues("hsl",t),this},desaturate:function(e){var t=this.values.hsl;return t[1]-=t[1]*e,this.setValues("hsl",t),this},whiten:function(e){var t=this.values.hwb;return t[1]+=t[1]*e,this.setValues("hwb",t),this},blacken:function(e){var t=this.values.hwb;return t[2]+=t[2]*e,this.setValues("hwb",t),this},greyscale:function(){var e=this.values.rgb,t=.3*e[0]+.59*e[1]+.11*e[2];return this.setValues("rgb",[t,t,t]),this},clearer:function(e){var t=this.values.alpha;return this.setValues("alpha",t-t*e),this},opaquer:function(e){var t=this.values.alpha;return this.setValues("alpha",t+t*e),this},rotate:function(e){var t=this.values.hsl,n=(t[0]+e)%360;return t[0]=n<0?360+n:n,this.setValues("hsl",t),this},mix:function(e,t){var n=this,a=e,i=void 0===t?.5:t,r=2*i-1,o=n.alpha()-a.alpha(),s=((r*o===-1?r:(r+o)/(1+r*o))+1)/2,l=1-s;return this.rgb(s*n.red()+l*a.red(),s*n.green()+l*a.green(),s*n.blue()+l*a.blue()).alpha(n.alpha()*i+a.alpha()*(1-i))},toJSON:function(){return this.rgb()},clone:function(){var e,t,n=new Ye,a=this.values,i=n.values;for(var r in a)a.hasOwnProperty(r)&&(e=a[r],t={}.toString.call(e),"[object Array]"===t?i[r]=e.slice(0):"[object Number]"===t?i[r]=e:console.error("unexpected color value:",e));return n}},Ye.prototype.spaces={rgb:["red","green","blue"],hsl:["hue","saturation","lightness"],hsv:["hue","saturation","value"],hwb:["hue","whiteness","blackness"],cmyk:["cyan","magenta","yellow","black"]},Ye.prototype.maxes={rgb:[255,255,255],hsl:[360,100,100],hsv:[360,100,100],hwb:[360,100,100],cmyk:[100,100,100,100]},Ye.prototype.getValues=function(e){for(var t=this.values,n={},a=0;a<e.length;a++)n[e.charAt(a)]=t[e][a];return 1!==t.alpha&&(n.a=t.alpha),n},Ye.prototype.setValues=function(e,t){var n,a,i=this.values,r=this.spaces,o=this.maxes,s=1;if(this.valid=!0,"alpha"===e)s=t;else if(t.length)i[e]=t.slice(0,e.length),s=t[e.length];else if(void 0!==t[e.charAt(0)]){for(n=0;n<e.length;n++)i[e][n]=t[e.charAt(n)];s=t.a}else if(void 0!==t[r[e][0]]){var l=r[e];for(n=0;n<e.length;n++)i[e][n]=t[l[n]];s=t.alpha}if(i.alpha=Math.max(0,Math.min(1,void 0===s?i.alpha:s)),"alpha"===e)return!1;for(n=0;n<e.length;n++)a=Math.max(0,Math.min(o[e][n],i[e][n])),i[e][n]=Math.round(a);for(var d in r)d!==e&&(i[d]=ie[e][d](i[e]));return!0},Ye.prototype.setSpace=function(e,t){var n=t[0];return void 0===n?this.getValues(e):("number"===typeof n&&(n=Array.prototype.slice.call(t)),this.setValues(e,n),this)},Ye.prototype.setChannel=function(e,t,n){var a=this.values[e];return void 0===n?a[t]:(n===a[t]||(a[t]=n,this.setValues(e,a)),this)},"undefined"!==typeof window&&(window.Color=Ye);var Se=Ye,De={noop:function(){},uid:function(){var e=0;return function(){return e++}}(),isNullOrUndef:function(e){return null===e||"undefined"===typeof e},isArray:function(e){if(Array.isArray&&Array.isArray(e))return!0;var t=Object.prototype.toString.call(e);return"[object"===t.substr(0,7)&&"Array]"===t.substr(-6)},isObject:function(e){return null!==e&&"[object Object]"===Object.prototype.toString.call(e)},isFinite:function(e){return("number"===typeof e||e instanceof Number)&&isFinite(e)},valueOrDefault:function(e,t){return"undefined"===typeof e?t:e},valueAtIndexOrDefault:function(e,t,n){return De.valueOrDefault(De.isArray(e)?e[t]:e,n)},callback:function(e,t,n){if(e&&"function"===typeof e.call)return e.apply(n,t)},each:function(e,t,n,a){var i,r,o;if(De.isArray(e))if(r=e.length,a)for(i=r-1;i>=0;i--)t.call(n,e[i],i);else for(i=0;i<r;i++)t.call(n,e[i],i);else if(De.isObject(e))for(o=Object.keys(e),r=o.length,i=0;i<r;i++)t.call(n,e[o[i]],o[i])},arrayEquals:function(e,t){var n,a,i,r;if(!e||!t||e.length!==t.length)return!1;for(n=0,a=e.length;n<a;++n)if(i=e[n],r=t[n],i instanceof Array&&r instanceof Array){if(!De.arrayEquals(i,r))return!1}else if(i!==r)return!1;return!0},clone:function(e){if(De.isArray(e))return e.map(De.clone);if(De.isObject(e)){for(var t={},n=Object.keys(e),a=n.length,i=0;i<a;++i)t[n[i]]=De.clone(e[n[i]]);return t}return e},_merger:function(e,t,n,a){var i=t[e],r=n[e];De.isObject(i)&&De.isObject(r)?De.merge(i,r,a):t[e]=De.clone(r)},_mergerIf:function(e,t,n){var a=t[e],i=n[e];De.isObject(a)&&De.isObject(i)?De.mergeIf(a,i):t.hasOwnProperty(e)||(t[e]=De.clone(i))},merge:function(e,t,n){var a,i,r,o,s,l=De.isArray(t)?t:[t],d=l.length;if(!De.isObject(e))return e;for(n=n||{},a=n.merger||De._merger,i=0;i<d;++i)if(t=l[i],De.isObject(t))for(r=Object.keys(t),s=0,o=r.length;s<o;++s)a(r[s],e,t,n);return e},mergeIf:function(e,t){return De.merge(e,t,{merger:De._mergerIf})},extend:function(e){for(var t=function(t,n){e[n]=t},n=1,a=arguments.length;n<a;++n)De.each(arguments[n],t);return e},inherits:function(e){var t=this,n=e&&e.hasOwnProperty("constructor")?e.constructor:function(){return t.apply(this,arguments)},a=function(){this.constructor=n};return a.prototype=t.prototype,n.prototype=new a,n.extend=De.inherits,e&&De.extend(n.prototype,e),n.__super__=t.prototype,n}},Te=De;De.callCallback=De.callback,De.indexOf=function(e,t,n){return Array.prototype.indexOf.call(e,t,n)},De.getValueOrDefault=De.valueOrDefault,De.getValueAtIndexOrDefault=De.valueAtIndexOrDefault;var He={linear:function(e){return e},easeInQuad:function(e){return e*e},easeOutQuad:function(e){return-e*(e-2)},easeInOutQuad:function(e){return(e/=.5)<1?.5*e*e:-.5*(--e*(e-2)-1)},easeInCubic:function(e){return e*e*e},easeOutCubic:function(e){return(e-=1)*e*e+1},easeInOutCubic:function(e){return(e/=.5)<1?.5*e*e*e:.5*((e-=2)*e*e+2)},easeInQuart:function(e){return e*e*e*e},easeOutQuart:function(e){return-((e-=1)*e*e*e-1)},easeInOutQuart:function(e){return(e/=.5)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)},easeInQuint:function(e){return e*e*e*e*e},easeOutQuint:function(e){return(e-=1)*e*e*e*e+1},easeInOutQuint:function(e){return(e/=.5)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)},easeInSine:function(e){return 1-Math.cos(e*(Math.PI/2))},easeOutSine:function(e){return Math.sin(e*(Math.PI/2))},easeInOutSine:function(e){return-.5*(Math.cos(Math.PI*e)-1)},easeInExpo:function(e){return 0===e?0:Math.pow(2,10*(e-1))},easeOutExpo:function(e){return 1===e?1:1-Math.pow(2,-10*e)},easeInOutExpo:function(e){return 0===e?0:1===e?1:(e/=.5)<1?.5*Math.pow(2,10*(e-1)):.5*(2-Math.pow(2,-10*--e))},easeInCirc:function(e){return e>=1?e:-(Math.sqrt(1-e*e)-1)},easeOutCirc:function(e){return Math.sqrt(1-(e-=1)*e)},easeInOutCirc:function(e){return(e/=.5)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)},easeInElastic:function(e){var t=1.70158,n=0,a=1;return 0===e?0:1===e?1:(n||(n=.3),a<1?(a=1,t=n/4):t=n/(2*Math.PI)*Math.asin(1/a),-a*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/n))},easeOutElastic:function(e){var t=1.70158,n=0,a=1;return 0===e?0:1===e?1:(n||(n=.3),a<1?(a=1,t=n/4):t=n/(2*Math.PI)*Math.asin(1/a),a*Math.pow(2,-10*e)*Math.sin((e-t)*(2*Math.PI)/n)+1)},easeInOutElastic:function(e){var t=1.70158,n=0,a=1;return 0===e?0:2===(e/=.5)?1:(n||(n=.45),a<1?(a=1,t=n/4):t=n/(2*Math.PI)*Math.asin(1/a),e<1?a*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/n)*-.5:a*Math.pow(2,-10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/n)*.5+1)},easeInBack:function(e){var t=1.70158;return e*e*((t+1)*e-t)},easeOutBack:function(e){var t=1.70158;return(e-=1)*e*((t+1)*e+t)+1},easeInOutBack:function(e){var t=1.70158;return(e/=.5)<1?e*e*((1+(t*=1.525))*e-t)*.5:.5*((e-=2)*e*((1+(t*=1.525))*e+t)+2)},easeInBounce:function(e){return 1-He.easeOutBounce(1-e)},easeOutBounce:function(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375},easeInOutBounce:function(e){return e<.5?.5*He.easeInBounce(2*e):.5*He.easeOutBounce(2*e-1)+.5}},Ce={effects:He};Te.easingEffects=He;var Oe=Math.PI,je=Oe/180,Pe=2*Oe,Ae=Oe/2,Ee=Oe/4,Ie=2*Oe/3,Be={clear:function(e){e.ctx.clearRect(0,0,e.width,e.height)},roundedRect:function(e,t,n,a,i,r){if(r){var o=Math.min(r,i/2,a/2),s=t+o,l=n+o,d=t+a-o,u=n+i-o;e.moveTo(t,l),s<d&&l<u?(e.arc(s,l,o,-Oe,-Ae),e.arc(d,l,o,-Ae,0),e.arc(d,u,o,0,Ae),e.arc(s,u,o,Ae,Oe)):s<d?(e.moveTo(s,n),e.arc(d,l,o,-Ae,Ae),e.arc(s,l,o,Ae,Oe+Ae)):l<u?(e.arc(s,l,o,-Oe,0),e.arc(s,u,o,0,Oe)):e.arc(s,l,o,-Oe,Oe),e.closePath(),e.moveTo(t,n)}else e.rect(t,n,a,i)},drawPoint:function(e,t,n,a,i,r){var o,s,l,d,u,c=(r||0)*je;if(t&&"object"===typeof t&&(o=t.toString(),"[object HTMLImageElement]"===o||"[object HTMLCanvasElement]"===o))e.drawImage(t,a-t.width/2,i-t.height/2,t.width,t.height);else if(!(isNaN(n)||n<=0)){switch(e.beginPath(),t){default:e.arc(a,i,n,0,Pe),e.closePath();break;case"triangle":e.moveTo(a+Math.sin(c)*n,i-Math.cos(c)*n),c+=Ie,e.lineTo(a+Math.sin(c)*n,i-Math.cos(c)*n),c+=Ie,e.lineTo(a+Math.sin(c)*n,i-Math.cos(c)*n),e.closePath();break;case"rectRounded":u=.516*n,d=n-u,s=Math.cos(c+Ee)*d,l=Math.sin(c+Ee)*d,e.arc(a-s,i-l,u,c-Oe,c-Ae),e.arc(a+l,i-s,u,c-Ae,c),e.arc(a+s,i+l,u,c,c+Ae),e.arc(a-l,i+s,u,c+Ae,c+Oe),e.closePath();break;case"rect":if(!r){d=Math.SQRT1_2*n,e.rect(a-d,i-d,2*d,2*d);break}c+=Ee;case"rectRot":s=Math.cos(c)*n,l=Math.sin(c)*n,e.moveTo(a-s,i-l),e.lineTo(a+l,i-s),e.lineTo(a+s,i+l),e.lineTo(a-l,i+s),e.closePath();break;case"crossRot":c+=Ee;case"cross":s=Math.cos(c)*n,l=Math.sin(c)*n,e.moveTo(a-s,i-l),e.lineTo(a+s,i+l),e.moveTo(a+l,i-s),e.lineTo(a-l,i+s);break;case"star":s=Math.cos(c)*n,l=Math.sin(c)*n,e.moveTo(a-s,i-l),e.lineTo(a+s,i+l),e.moveTo(a+l,i-s),e.lineTo(a-l,i+s),c+=Ee,s=Math.cos(c)*n,l=Math.sin(c)*n,e.moveTo(a-s,i-l),e.lineTo(a+s,i+l),e.moveTo(a+l,i-s),e.lineTo(a-l,i+s);break;case"line":s=Math.cos(c)*n,l=Math.sin(c)*n,e.moveTo(a-s,i-l),e.lineTo(a+s,i+l);break;case"dash":e.moveTo(a,i),e.lineTo(a+Math.cos(c)*n,i+Math.sin(c)*n);break}e.fill(),e.stroke()}},_isPointInArea:function(e,t){var n=1e-6;return e.x>t.left-n&&e.x<t.right+n&&e.y>t.top-n&&e.y<t.bottom+n},clipArea:function(e,t){e.save(),e.beginPath(),e.rect(t.left,t.top,t.right-t.left,t.bottom-t.top),e.clip()},unclipArea:function(e){e.restore()},lineTo:function(e,t,n,a){var i=n.steppedLine;if(i){if("middle"===i){var r=(t.x+n.x)/2;e.lineTo(r,a?n.y:t.y),e.lineTo(r,a?t.y:n.y)}else"after"===i&&!a||"after"!==i&&a?e.lineTo(t.x,n.y):e.lineTo(n.x,t.y);e.lineTo(n.x,n.y)}else n.tension?e.bezierCurveTo(a?t.controlPointPreviousX:t.controlPointNextX,a?t.controlPointPreviousY:t.controlPointNextY,a?n.controlPointNextX:n.controlPointPreviousX,a?n.controlPointNextY:n.controlPointPreviousY,n.x,n.y):e.lineTo(n.x,n.y)}},We=Be;Te.clear=Be.clear,Te.drawRoundedRectangle=function(e){e.beginPath(),Be.roundedRect.apply(Be,arguments)};var Fe={_set:function(e,t){return Te.merge(this[e]||(this[e]={}),t)}};Fe._set("global",{defaultColor:"rgba(0,0,0,0.1)",defaultFontColor:"#666",defaultFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",defaultFontSize:12,defaultFontStyle:"normal",defaultLineHeight:1.2,showLines:!0});var Ne=Fe,ze=Te.valueOrDefault;function Re(e){return!e||Te.isNullOrUndef(e.size)||Te.isNullOrUndef(e.family)?null:(e.style?e.style+" ":"")+(e.weight?e.weight+" ":"")+e.size+"px "+e.family}var $e={toLineHeight:function(e,t){var n=(""+e).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);if(!n||"normal"===n[1])return 1.2*t;switch(e=+n[2],n[3]){case"px":return e;case"%":e/=100;break;default:break}return t*e},toPadding:function(e){var t,n,a,i;return Te.isObject(e)?(t=+e.top||0,n=+e.right||0,a=+e.bottom||0,i=+e.left||0):t=n=a=i=+e||0,{top:t,right:n,bottom:a,left:i,height:t+a,width:i+n}},_parseFont:function(e){var t=Ne.global,n=ze(e.fontSize,t.defaultFontSize),a={family:ze(e.fontFamily,t.defaultFontFamily),lineHeight:Te.options.toLineHeight(ze(e.lineHeight,t.defaultLineHeight),n),size:n,style:ze(e.fontStyle,t.defaultFontStyle),weight:null,string:""};return a.string=Re(a),a},resolve:function(e,t,n){var a,i,r;for(a=0,i=e.length;a<i;++a)if(r=e[a],void 0!==r&&(void 0!==t&&"function"===typeof r&&(r=r(t)),void 0!==n&&Te.isArray(r)&&(r=r[n]),void 0!==r))return r}},Ve=Te,Je=Ce,Ue=We,Ge=$e;function qe(e,t,n,a){var i,r,o,s,l,d,u,c,h,f=Object.keys(n);for(i=0,r=f.length;i<r;++i)if(o=f[i],d=n[o],t.hasOwnProperty(o)||(t[o]=d),s=t[o],s!==d&&"_"!==o[0]){if(e.hasOwnProperty(o)||(e[o]=s),l=e[o],u=typeof d,u===typeof l)if("string"===u){if(c=Se(l),c.valid&&(h=Se(d),h.valid)){t[o]=h.mix(c,a).rgbString();continue}}else if(Ve.isFinite(l)&&Ve.isFinite(d)){t[o]=l+(d-l)*a;continue}t[o]=d}}Ve.easing=Je,Ve.canvas=Ue,Ve.options=Ge;var Xe=function(e){Ve.extend(this,e),this.initialize.apply(this,arguments)};Ve.extend(Xe.prototype,{initialize:function(){this.hidden=!1},pivot:function(){var e=this;return e._view||(e._view=Ve.clone(e._model)),e._start={},e},transition:function(e){var t=this,n=t._model,a=t._start,i=t._view;return n&&1!==e?(i||(i=t._view={}),a||(a=t._start={}),qe(a,i,n,e),t):(t._view=n,t._start=null,t)},tooltipPosition:function(){return{x:this._model.x,y:this._model.y}},hasValue:function(){return Ve.isNumber(this._model.x)&&Ve.isNumber(this._model.y)}}),Xe.extend=Ve.inherits;var Ke=Xe,Ze=Ke.extend({chart:null,currentStep:0,numSteps:60,easing:"",render:null,onAnimationProgress:null,onAnimationComplete:null}),Qe=Ze;Object.defineProperty(Ze.prototype,"animationObject",{get:function(){return this}}),Object.defineProperty(Ze.prototype,"chartInstance",{get:function(){return this.chart},set:function(e){this.chart=e}}),Ne._set("global",{animation:{duration:1e3,easing:"easeOutQuart",onProgress:Ve.noop,onComplete:Ve.noop}});var et={animations:[],request:null,addAnimation:function(e,t,n,a){var i,r,o=this.animations;for(t.chart=e,t.startTime=Date.now(),t.duration=n,a||(e.animating=!0),i=0,r=o.length;i<r;++i)if(o[i].chart===e)return void(o[i]=t);o.push(t),1===o.length&&this.requestAnimationFrame()},cancelAnimation:function(e){var t=Ve.findIndex(this.animations,(function(t){return t.chart===e}));-1!==t&&(this.animations.splice(t,1),e.animating=!1)},requestAnimationFrame:function(){var e=this;null===e.request&&(e.request=Ve.requestAnimFrame.call(window,(function(){e.request=null,e.startDigest()})))},startDigest:function(){var e=this;e.advance(),e.animations.length>0&&e.requestAnimationFrame()},advance:function(){var e,t,n,a,i=this.animations,r=0;while(r<i.length)e=i[r],t=e.chart,n=e.numSteps,a=Math.floor((Date.now()-e.startTime)/e.duration*n)+1,e.currentStep=Math.min(a,n),Ve.callback(e.render,[t,e],t),Ve.callback(e.onAnimationProgress,[e],t),e.currentStep>=n?(Ve.callback(e.onAnimationComplete,[e],t),t.animating=!1,i.splice(r,1)):++r}},tt=Ve.options.resolve,nt=["push","pop","shift","splice","unshift"];function at(e,t){e._chartjs?e._chartjs.listeners.push(t):(Object.defineProperty(e,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[t]}}),nt.forEach((function(t){var n="onData"+t.charAt(0).toUpperCase()+t.slice(1),a=e[t];Object.defineProperty(e,t,{configurable:!0,enumerable:!1,value:function(){var t=Array.prototype.slice.call(arguments),i=a.apply(this,t);return Ve.each(e._chartjs.listeners,(function(e){"function"===typeof e[n]&&e[n].apply(e,t)})),i}})})))}function it(e,t){var n=e._chartjs;if(n){var a=n.listeners,i=a.indexOf(t);-1!==i&&a.splice(i,1),a.length>0||(nt.forEach((function(t){delete e[t]})),delete e._chartjs)}}var rt=function(e,t){this.initialize(e,t)};Ve.extend(rt.prototype,{datasetElementType:null,dataElementType:null,initialize:function(e,t){var n=this;n.chart=e,n.index=t,n.linkScales(),n.addElements()},updateIndex:function(e){this.index=e},linkScales:function(){var e=this,t=e.getMeta(),n=e.getDataset();null!==t.xAxisID&&t.xAxisID in e.chart.scales||(t.xAxisID=n.xAxisID||e.chart.options.scales.xAxes[0].id),null!==t.yAxisID&&t.yAxisID in e.chart.scales||(t.yAxisID=n.yAxisID||e.chart.options.scales.yAxes[0].id)},getDataset:function(){return this.chart.data.datasets[this.index]},getMeta:function(){return this.chart.getDatasetMeta(this.index)},getScaleForId:function(e){return this.chart.scales[e]},_getValueScaleId:function(){return this.getMeta().yAxisID},_getIndexScaleId:function(){return this.getMeta().xAxisID},_getValueScale:function(){return this.getScaleForId(this._getValueScaleId())},_getIndexScale:function(){return this.getScaleForId(this._getIndexScaleId())},reset:function(){this.update(!0)},destroy:function(){this._data&&it(this._data,this)},createMetaDataset:function(){var e=this,t=e.datasetElementType;return t&&new t({_chart:e.chart,_datasetIndex:e.index})},createMetaData:function(e){var t=this,n=t.dataElementType;return n&&new n({_chart:t.chart,_datasetIndex:t.index,_index:e})},addElements:function(){var e,t,n=this,a=n.getMeta(),i=n.getDataset().data||[],r=a.data;for(e=0,t=i.length;e<t;++e)r[e]=r[e]||n.createMetaData(e);a.dataset=a.dataset||n.createMetaDataset()},addElementAndReset:function(e){var t=this.createMetaData(e);this.getMeta().data.splice(e,0,t),this.updateElement(t,e,!0)},buildOrUpdateElements:function(){var e=this,t=e.getDataset(),n=t.data||(t.data=[]);e._data!==n&&(e._data&&it(e._data,e),n&&Object.isExtensible(n)&&at(n,e),e._data=n),e.resyncElements()},update:Ve.noop,transition:function(e){for(var t=this.getMeta(),n=t.data||[],a=n.length,i=0;i<a;++i)n[i].transition(e);t.dataset&&t.dataset.transition(e)},draw:function(){var e=this.getMeta(),t=e.data||[],n=t.length,a=0;for(e.dataset&&e.dataset.draw();a<n;++a)t[a].draw()},removeHoverStyle:function(e){Ve.merge(e._model,e.$previousStyle||{}),delete e.$previousStyle},setHoverStyle:function(e){var t=this.chart.data.datasets[e._datasetIndex],n=e._index,a=e.custom||{},i=e._model,r=Ve.getHoverColor;e.$previousStyle={backgroundColor:i.backgroundColor,borderColor:i.borderColor,borderWidth:i.borderWidth},i.backgroundColor=tt([a.hoverBackgroundColor,t.hoverBackgroundColor,r(i.backgroundColor)],void 0,n),i.borderColor=tt([a.hoverBorderColor,t.hoverBorderColor,r(i.borderColor)],void 0,n),i.borderWidth=tt([a.hoverBorderWidth,t.hoverBorderWidth,i.borderWidth],void 0,n)},resyncElements:function(){var e=this,t=e.getMeta(),n=e.getDataset().data,a=t.data.length,i=n.length;i<a?t.data.splice(i,a-i):i>a&&e.insertElements(a,i-a)},insertElements:function(e,t){for(var n=0;n<t;++n)this.addElementAndReset(e+n)},onDataPush:function(){var e=arguments.length;this.insertElements(this.getDataset().data.length-e,e)},onDataPop:function(){this.getMeta().data.pop()},onDataShift:function(){this.getMeta().data.shift()},onDataSplice:function(e,t){this.getMeta().data.splice(e,t),this.insertElements(e,arguments.length-2)},onDataUnshift:function(){this.insertElements(0,arguments.length)}}),rt.extend=Ve.inherits;var ot=rt;Ne._set("global",{elements:{arc:{backgroundColor:Ne.global.defaultColor,borderColor:"#fff",borderWidth:2,borderAlign:"center"}}});var st=Ke.extend({inLabelRange:function(e){var t=this._view;return!!t&&Math.pow(e-t.x,2)<Math.pow(t.radius+t.hoverRadius,2)},inRange:function(e,t){var n=this._view;if(n){var a=Ve.getAngleFromPoint(n,{x:e,y:t}),i=a.angle,r=a.distance,o=n.startAngle,s=n.endAngle;while(s<o)s+=2*Math.PI;while(i>s)i-=2*Math.PI;while(i<o)i+=2*Math.PI;var l=i>=o&&i<=s,d=r>=n.innerRadius&&r<=n.outerRadius;return l&&d}return!1},getCenterPoint:function(){var e=this._view,t=(e.startAngle+e.endAngle)/2,n=(e.innerRadius+e.outerRadius)/2;return{x:e.x+Math.cos(t)*n,y:e.y+Math.sin(t)*n}},getArea:function(){var e=this._view;return Math.PI*((e.endAngle-e.startAngle)/(2*Math.PI))*(Math.pow(e.outerRadius,2)-Math.pow(e.innerRadius,2))},tooltipPosition:function(){var e=this._view,t=e.startAngle+(e.endAngle-e.startAngle)/2,n=(e.outerRadius-e.innerRadius)/2+e.innerRadius;return{x:e.x+Math.cos(t)*n,y:e.y+Math.sin(t)*n}},draw:function(){var e,t=this._chart.ctx,n=this._view,a=n.startAngle,i=n.endAngle,r="inner"===n.borderAlign?.33:0;t.save(),t.beginPath(),t.arc(n.x,n.y,Math.max(n.outerRadius-r,0),a,i),t.arc(n.x,n.y,n.innerRadius,i,a,!0),t.closePath(),t.fillStyle=n.backgroundColor,t.fill(),n.borderWidth&&("inner"===n.borderAlign?(t.beginPath(),e=r/n.outerRadius,t.arc(n.x,n.y,n.outerRadius,a-e,i+e),n.innerRadius>r?(e=r/n.innerRadius,t.arc(n.x,n.y,n.innerRadius-r,i+e,a-e,!0)):t.arc(n.x,n.y,r,i+Math.PI/2,a-Math.PI/2),t.closePath(),t.clip(),t.beginPath(),t.arc(n.x,n.y,n.outerRadius,a,i),t.arc(n.x,n.y,n.innerRadius,i,a,!0),t.closePath(),t.lineWidth=2*n.borderWidth,t.lineJoin="round"):(t.lineWidth=n.borderWidth,t.lineJoin="bevel"),t.strokeStyle=n.borderColor,t.stroke()),t.restore()}}),lt=Ve.valueOrDefault,dt=Ne.global.defaultColor;Ne._set("global",{elements:{line:{tension:.4,backgroundColor:dt,borderWidth:3,borderColor:dt,borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",capBezierPoints:!0,fill:!0}}});var ut=Ke.extend({draw:function(){var e,t,n,a,i=this,r=i._view,o=i._chart.ctx,s=r.spanGaps,l=i._children.slice(),d=Ne.global,u=d.elements.line,c=-1;for(i._loop&&l.length&&l.push(l[0]),o.save(),o.lineCap=r.borderCapStyle||u.borderCapStyle,o.setLineDash&&o.setLineDash(r.borderDash||u.borderDash),o.lineDashOffset=lt(r.borderDashOffset,u.borderDashOffset),o.lineJoin=r.borderJoinStyle||u.borderJoinStyle,o.lineWidth=lt(r.borderWidth,u.borderWidth),o.strokeStyle=r.borderColor||d.defaultColor,o.beginPath(),c=-1,e=0;e<l.length;++e)t=l[e],n=Ve.previousItem(l,e),a=t._view,0===e?a.skip||(o.moveTo(a.x,a.y),c=e):(n=-1===c?n:l[c],a.skip||(c!==e-1&&!s||-1===c?o.moveTo(a.x,a.y):Ve.canvas.lineTo(o,n._view,t._view),c=e));o.stroke(),o.restore()}}),ct=Ve.valueOrDefault,ht=Ne.global.defaultColor;function ft(e){var t=this._view;return!!t&&Math.abs(e-t.x)<t.radius+t.hitRadius}function mt(e){var t=this._view;return!!t&&Math.abs(e-t.y)<t.radius+t.hitRadius}Ne._set("global",{elements:{point:{radius:3,pointStyle:"circle",backgroundColor:ht,borderColor:ht,borderWidth:1,hitRadius:1,hoverRadius:4,hoverBorderWidth:1}}});var pt=Ke.extend({inRange:function(e,t){var n=this._view;return!!n&&Math.pow(e-n.x,2)+Math.pow(t-n.y,2)<Math.pow(n.hitRadius+n.radius,2)},inLabelRange:ft,inXRange:ft,inYRange:mt,getCenterPoint:function(){var e=this._view;return{x:e.x,y:e.y}},getArea:function(){return Math.PI*Math.pow(this._view.radius,2)},tooltipPosition:function(){var e=this._view;return{x:e.x,y:e.y,padding:e.radius+e.borderWidth}},draw:function(e){var t=this._view,n=this._chart.ctx,a=t.pointStyle,i=t.rotation,r=t.radius,o=t.x,s=t.y,l=Ne.global,d=l.defaultColor;t.skip||(void 0===e||Ve.canvas._isPointInArea(t,e))&&(n.strokeStyle=t.borderColor||d,n.lineWidth=ct(t.borderWidth,l.elements.point.borderWidth),n.fillStyle=t.backgroundColor||d,Ve.canvas.drawPoint(n,a,r,o,s,i))}}),_t=Ne.global.defaultColor;function gt(e){return e&&void 0!==e.width}function yt(e){var t,n,a,i,r;return gt(e)?(r=e.width/2,t=e.x-r,n=e.x+r,a=Math.min(e.y,e.base),i=Math.max(e.y,e.base)):(r=e.height/2,t=Math.min(e.x,e.base),n=Math.max(e.x,e.base),a=e.y-r,i=e.y+r),{left:t,top:a,right:n,bottom:i}}function vt(e,t,n){return e===t?n:e===n?t:e}function bt(e){var t=e.borderSkipped,n={};return t?(e.horizontal?e.base>e.x&&(t=vt(t,"left","right")):e.base<e.y&&(t=vt(t,"bottom","top")),n[t]=!0,n):n}function Mt(e,t,n){var a,i,r,o,s=e.borderWidth,l=bt(e);return Ve.isObject(s)?(a=+s.top||0,i=+s.right||0,r=+s.bottom||0,o=+s.left||0):a=i=r=o=+s||0,{t:l.top||a<0?0:a>n?n:a,r:l.right||i<0?0:i>t?t:i,b:l.bottom||r<0?0:r>n?n:r,l:l.left||o<0?0:o>t?t:o}}function Lt(e){var t=yt(e),n=t.right-t.left,a=t.bottom-t.top,i=Mt(e,n/2,a/2);return{outer:{x:t.left,y:t.top,w:n,h:a},inner:{x:t.left+i.l,y:t.top+i.t,w:n-i.l-i.r,h:a-i.t-i.b}}}function kt(e,t,n){var a=null===t,i=null===n,r=!(!e||a&&i)&&yt(e);return r&&(a||t>=r.left&&t<=r.right)&&(i||n>=r.top&&n<=r.bottom)}Ne._set("global",{elements:{rectangle:{backgroundColor:_t,borderColor:_t,borderSkipped:"bottom",borderWidth:0}}});var wt=Ke.extend({draw:function(){var e=this._chart.ctx,t=this._view,n=Lt(t),a=n.outer,i=n.inner;e.fillStyle=t.backgroundColor,e.fillRect(a.x,a.y,a.w,a.h),a.w===i.w&&a.h===i.h||(e.save(),e.beginPath(),e.rect(a.x,a.y,a.w,a.h),e.clip(),e.fillStyle=t.borderColor,e.rect(i.x,i.y,i.w,i.h),e.fill("evenodd"),e.restore())},height:function(){var e=this._view;return e.base-e.y},inRange:function(e,t){return kt(this._view,e,t)},inLabelRange:function(e,t){var n=this._view;return gt(n)?kt(n,e,null):kt(n,null,t)},inXRange:function(e){return kt(this._view,e,null)},inYRange:function(e){return kt(this._view,null,e)},getCenterPoint:function(){var e,t,n=this._view;return gt(n)?(e=n.x,t=(n.y+n.base)/2):(e=(n.x+n.base)/2,t=n.y),{x:e,y:t}},getArea:function(){var e=this._view;return gt(e)?e.width*Math.abs(e.y-e.base):e.height*Math.abs(e.x-e.base)},tooltipPosition:function(){var e=this._view;return{x:e.x,y:e.y}}}),xt={},Yt=st,St=ut,Dt=pt,Tt=wt;xt.Arc=Yt,xt.Line=St,xt.Point=Dt,xt.Rectangle=Tt;var Ht=Ve.options.resolve;function Ct(e,t){var n,a,i,r,o=e.isHorizontal()?e.width:e.height,s=e.getTicks();for(i=1,r=t.length;i<r;++i)o=Math.min(o,Math.abs(t[i]-t[i-1]));for(i=0,r=s.length;i<r;++i)a=e.getPixelForTick(i),o=i>0?Math.min(o,a-n):o,n=a;return o}function Ot(e,t,n){var a,i,r=n.barThickness,o=t.stackCount,s=t.pixels[e];return Ve.isNullOrUndef(r)?(a=t.min*n.categoryPercentage,i=n.barPercentage):(a=r*o,i=1),{chunk:a/o,ratio:i,start:s-a/2}}function jt(e,t,n){var a,i,r=t.pixels,o=r[e],s=e>0?r[e-1]:null,l=e<r.length-1?r[e+1]:null,d=n.categoryPercentage;return null===s&&(s=o-(null===l?t.end-t.start:l-o)),null===l&&(l=o+o-s),a=o-(o-Math.min(s,l))/2*d,i=Math.abs(l-s)/2*d,{chunk:i/t.stackCount,ratio:n.barPercentage,start:a}}Ne._set("bar",{hover:{mode:"label"},scales:{xAxes:[{type:"category",categoryPercentage:.8,barPercentage:.9,offset:!0,gridLines:{offsetGridLines:!0}}],yAxes:[{type:"linear"}]}});var Pt=ot.extend({dataElementType:xt.Rectangle,initialize:function(){var e,t=this;ot.prototype.initialize.apply(t,arguments),e=t.getMeta(),e.stack=t.getDataset().stack,e.bar=!0},update:function(e){var t,n,a=this,i=a.getMeta().data;for(a._ruler=a.getRuler(),t=0,n=i.length;t<n;++t)a.updateElement(i[t],t,e)},updateElement:function(e,t,n){var a=this,i=a.getMeta(),r=a.getDataset(),o=a._resolveElementOptions(e,t);e._xScale=a.getScaleForId(i.xAxisID),e._yScale=a.getScaleForId(i.yAxisID),e._datasetIndex=a.index,e._index=t,e._model={backgroundColor:o.backgroundColor,borderColor:o.borderColor,borderSkipped:o.borderSkipped,borderWidth:o.borderWidth,datasetLabel:r.label,label:a.chart.data.labels[t]},a._updateElementGeometry(e,t,n),e.pivot()},_updateElementGeometry:function(e,t,n){var a=this,i=e._model,r=a._getValueScale(),o=r.getBasePixel(),s=r.isHorizontal(),l=a._ruler||a.getRuler(),d=a.calculateBarValuePixels(a.index,t),u=a.calculateBarIndexPixels(a.index,t,l);i.horizontal=s,i.base=n?o:d.base,i.x=s?n?o:d.head:u.center,i.y=s?u.center:n?o:d.head,i.height=s?u.size:void 0,i.width=s?void 0:u.size},_getStacks:function(e){var t,n,a=this,i=a.chart,r=a._getIndexScale(),o=r.options.stacked,s=void 0===e?i.data.datasets.length:e+1,l=[];for(t=0;t<s;++t)n=i.getDatasetMeta(t),n.bar&&i.isDatasetVisible(t)&&(!1===o||!0===o&&-1===l.indexOf(n.stack)||void 0===o&&(void 0===n.stack||-1===l.indexOf(n.stack)))&&l.push(n.stack);return l},getStackCount:function(){return this._getStacks().length},getStackIndex:function(e,t){var n=this._getStacks(e),a=void 0!==t?n.indexOf(t):-1;return-1===a?n.length-1:a},getRuler:function(){var e,t,n,a=this,i=a._getIndexScale(),r=a.getStackCount(),o=a.index,s=i.isHorizontal(),l=s?i.left:i.top,d=l+(s?i.width:i.height),u=[];for(e=0,t=a.getMeta().data.length;e<t;++e)u.push(i.getPixelForValue(null,e,o));return n=Ve.isNullOrUndef(i.options.barThickness)?Ct(i,u):-1,{min:n,pixels:u,start:l,end:d,stackCount:r,scale:i}},calculateBarValuePixels:function(e,t){var n,a,i,r,o,s,l=this,d=l.chart,u=l.getMeta(),c=l._getValueScale(),h=c.isHorizontal(),f=d.data.datasets,m=+c.getRightValue(f[e].data[t]),p=c.options.minBarLength,_=c.options.stacked,g=u.stack,y=0;if(_||void 0===_&&void 0!==g)for(n=0;n<e;++n)a=d.getDatasetMeta(n),a.bar&&a.stack===g&&a.controller._getValueScaleId()===c.id&&d.isDatasetVisible(n)&&(i=+c.getRightValue(f[n].data[t]),(m<0&&i<0||m>=0&&i>0)&&(y+=i));return r=c.getPixelForValue(y),o=c.getPixelForValue(y+m),s=o-r,void 0!==p&&Math.abs(s)<p&&(s=p,o=m>=0&&!h||m<0&&h?r-p:r+p),{size:s,base:r,head:o,center:o+s/2}},calculateBarIndexPixels:function(e,t,n){var a=this,i=n.scale.options,r="flex"===i.barThickness?jt(t,n,i):Ot(t,n,i),o=a.getStackIndex(e,a.getMeta().stack),s=r.start+r.chunk*o+r.chunk/2,l=Math.min(Ve.valueOrDefault(i.maxBarThickness,1/0),r.chunk*r.ratio);return{base:s-l/2,head:s+l/2,center:s,size:l}},draw:function(){var e=this,t=e.chart,n=e._getValueScale(),a=e.getMeta().data,i=e.getDataset(),r=a.length,o=0;for(Ve.canvas.clipArea(t.ctx,t.chartArea);o<r;++o)isNaN(n.getRightValue(i.data[o]))||a[o].draw();Ve.canvas.unclipArea(t.ctx)},_resolveElementOptions:function(e,t){var n,a,i,r=this,o=r.chart,s=o.data.datasets,l=s[r.index],d=e.custom||{},u=o.options.elements.rectangle,c={},h={chart:o,dataIndex:t,dataset:l,datasetIndex:r.index},f=["backgroundColor","borderColor","borderSkipped","borderWidth"];for(n=0,a=f.length;n<a;++n)i=f[n],c[i]=Ht([d[i],l[i],u[i]],h,t);return c}}),At=Ve.valueOrDefault,Et=Ve.options.resolve;Ne._set("bubble",{hover:{mode:"single"},scales:{xAxes:[{type:"linear",position:"bottom",id:"x-axis-0"}],yAxes:[{type:"linear",position:"left",id:"y-axis-0"}]},tooltips:{callbacks:{title:function(){return""},label:function(e,t){var n=t.datasets[e.datasetIndex].label||"",a=t.datasets[e.datasetIndex].data[e.index];return n+": ("+e.xLabel+", "+e.yLabel+", "+a.r+")"}}}});var It=ot.extend({dataElementType:xt.Point,update:function(e){var t=this,n=t.getMeta(),a=n.data;Ve.each(a,(function(n,a){t.updateElement(n,a,e)}))},updateElement:function(e,t,n){var a=this,i=a.getMeta(),r=e.custom||{},o=a.getScaleForId(i.xAxisID),s=a.getScaleForId(i.yAxisID),l=a._resolveElementOptions(e,t),d=a.getDataset().data[t],u=a.index,c=n?o.getPixelForDecimal(.5):o.getPixelForValue("object"===typeof d?d:NaN,t,u),h=n?s.getBasePixel():s.getPixelForValue(d,t,u);e._xScale=o,e._yScale=s,e._options=l,e._datasetIndex=u,e._index=t,e._model={backgroundColor:l.backgroundColor,borderColor:l.borderColor,borderWidth:l.borderWidth,hitRadius:l.hitRadius,pointStyle:l.pointStyle,rotation:l.rotation,radius:n?0:l.radius,skip:r.skip||isNaN(c)||isNaN(h),x:c,y:h},e.pivot()},setHoverStyle:function(e){var t=e._model,n=e._options,a=Ve.getHoverColor;e.$previousStyle={backgroundColor:t.backgroundColor,borderColor:t.borderColor,borderWidth:t.borderWidth,radius:t.radius},t.backgroundColor=At(n.hoverBackgroundColor,a(n.backgroundColor)),t.borderColor=At(n.hoverBorderColor,a(n.borderColor)),t.borderWidth=At(n.hoverBorderWidth,n.borderWidth),t.radius=n.radius+n.hoverRadius},_resolveElementOptions:function(e,t){var n,a,i,r=this,o=r.chart,s=o.data.datasets,l=s[r.index],d=e.custom||{},u=o.options.elements.point,c=l.data[t],h={},f={chart:o,dataIndex:t,dataset:l,datasetIndex:r.index},m=["backgroundColor","borderColor","borderWidth","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth","hoverRadius","hitRadius","pointStyle","rotation"];for(n=0,a=m.length;n<a;++n)i=m[n],h[i]=Et([d[i],l[i],u[i]],f,t);return h.radius=Et([d.radius,c?c.r:void 0,l.radius,u.radius],f,t),h}}),Bt=Ve.options.resolve,Wt=Ve.valueOrDefault;Ne._set("doughnut",{animation:{animateRotate:!0,animateScale:!1},hover:{mode:"single"},legendCallback:function(e){var t=[];t.push('<ul class="'+e.id+'-legend">');var n=e.data,a=n.datasets,i=n.labels;if(a.length)for(var r=0;r<a[0].data.length;++r)t.push('<li><span style="background-color:'+a[0].backgroundColor[r]+'"></span>'),i[r]&&t.push(i[r]),t.push("</li>");return t.push("</ul>"),t.join("")},legend:{labels:{generateLabels:function(e){var t=e.data;return t.labels.length&&t.datasets.length?t.labels.map((function(n,a){var i=e.getDatasetMeta(0),r=t.datasets[0],o=i.data[a],s=o&&o.custom||{},l=e.options.elements.arc,d=Bt([s.backgroundColor,r.backgroundColor,l.backgroundColor],void 0,a),u=Bt([s.borderColor,r.borderColor,l.borderColor],void 0,a),c=Bt([s.borderWidth,r.borderWidth,l.borderWidth],void 0,a);return{text:n,fillStyle:d,strokeStyle:u,lineWidth:c,hidden:isNaN(r.data[a])||i.data[a].hidden,index:a}})):[]}},onClick:function(e,t){var n,a,i,r=t.index,o=this.chart;for(n=0,a=(o.data.datasets||[]).length;n<a;++n)i=o.getDatasetMeta(n),i.data[r]&&(i.data[r].hidden=!i.data[r].hidden);o.update()}},cutoutPercentage:50,rotation:-.5*Math.PI,circumference:2*Math.PI,tooltips:{callbacks:{title:function(){return""},label:function(e,t){var n=t.labels[e.index],a=": "+t.datasets[e.datasetIndex].data[e.index];return Ve.isArray(n)?(n=n.slice(),n[0]+=a):n+=a,n}}}});var Ft=ot.extend({dataElementType:xt.Arc,linkScales:Ve.noop,getRingIndex:function(e){for(var t=0,n=0;n<e;++n)this.chart.isDatasetVisible(n)&&++t;return t},update:function(e){var t,n,a=this,i=a.chart,r=i.chartArea,o=i.options,s=r.right-r.left,l=r.bottom-r.top,d=Math.min(s,l),u={x:0,y:0},c=a.getMeta(),h=c.data,f=o.cutoutPercentage,m=o.circumference,p=a._getRingWeight(a.index);if(m<2*Math.PI){var _=o.rotation%(2*Math.PI);_+=2*Math.PI*(_>=Math.PI?-1:_<-Math.PI?1:0);var g=_+m,y={x:Math.cos(_),y:Math.sin(_)},v={x:Math.cos(g),y:Math.sin(g)},b=_<=0&&g>=0||_<=2*Math.PI&&2*Math.PI<=g,M=_<=.5*Math.PI&&.5*Math.PI<=g||_<=2.5*Math.PI&&2.5*Math.PI<=g,L=_<=-Math.PI&&-Math.PI<=g||_<=Math.PI&&Math.PI<=g,k=_<=.5*-Math.PI&&.5*-Math.PI<=g||_<=1.5*Math.PI&&1.5*Math.PI<=g,w=f/100,x={x:L?-1:Math.min(y.x*(y.x<0?1:w),v.x*(v.x<0?1:w)),y:k?-1:Math.min(y.y*(y.y<0?1:w),v.y*(v.y<0?1:w))},Y={x:b?1:Math.max(y.x*(y.x>0?1:w),v.x*(v.x>0?1:w)),y:M?1:Math.max(y.y*(y.y>0?1:w),v.y*(v.y>0?1:w))},S={width:.5*(Y.x-x.x),height:.5*(Y.y-x.y)};d=Math.min(s/S.width,l/S.height),u={x:-.5*(Y.x+x.x),y:-.5*(Y.y+x.y)}}for(t=0,n=h.length;t<n;++t)h[t]._options=a._resolveElementOptions(h[t],t);for(i.borderWidth=a.getMaxBorderWidth(),i.outerRadius=Math.max((d-i.borderWidth)/2,0),i.innerRadius=Math.max(f?i.outerRadius/100*f:0,0),i.radiusLength=(i.outerRadius-i.innerRadius)/(a._getVisibleDatasetWeightTotal()||1),i.offsetX=u.x*i.outerRadius,i.offsetY=u.y*i.outerRadius,c.total=a.calculateTotal(),a.outerRadius=i.outerRadius-i.radiusLength*a._getRingWeightOffset(a.index),a.innerRadius=Math.max(a.outerRadius-i.radiusLength*p,0),t=0,n=h.length;t<n;++t)a.updateElement(h[t],t,e)},updateElement:function(e,t,n){var a=this,i=a.chart,r=i.chartArea,o=i.options,s=o.animation,l=(r.left+r.right)/2,d=(r.top+r.bottom)/2,u=o.rotation,c=o.rotation,h=a.getDataset(),f=n&&s.animateRotate||e.hidden?0:a.calculateCircumference(h.data[t])*(o.circumference/(2*Math.PI)),m=n&&s.animateScale?0:a.innerRadius,p=n&&s.animateScale?0:a.outerRadius,_=e._options||{};Ve.extend(e,{_datasetIndex:a.index,_index:t,_model:{backgroundColor:_.backgroundColor,borderColor:_.borderColor,borderWidth:_.borderWidth,borderAlign:_.borderAlign,x:l+i.offsetX,y:d+i.offsetY,startAngle:u,endAngle:c,circumference:f,outerRadius:p,innerRadius:m,label:Ve.valueAtIndexOrDefault(h.label,t,i.data.labels[t])}});var g=e._model;n&&s.animateRotate||(g.startAngle=0===t?o.rotation:a.getMeta().data[t-1]._model.endAngle,g.endAngle=g.startAngle+g.circumference),e.pivot()},calculateTotal:function(){var e,t=this.getDataset(),n=this.getMeta(),a=0;return Ve.each(n.data,(function(n,i){e=t.data[i],isNaN(e)||n.hidden||(a+=Math.abs(e))})),a},calculateCircumference:function(e){var t=this.getMeta().total;return t>0&&!isNaN(e)?2*Math.PI*(Math.abs(e)/t):0},getMaxBorderWidth:function(e){var t,n,a,i,r,o,s,l,d=this,u=0,c=d.chart;if(!e)for(t=0,n=c.data.datasets.length;t<n;++t)if(c.isDatasetVisible(t)){a=c.getDatasetMeta(t),e=a.data,t!==d.index&&(r=a.controller);break}if(!e)return 0;for(t=0,n=e.length;t<n;++t)i=e[t],o=r?r._resolveElementOptions(i,t):i._options,"inner"!==o.borderAlign&&(s=o.borderWidth,l=o.hoverBorderWidth,u=s>u?s:u,u=l>u?l:u);return u},setHoverStyle:function(e){var t=e._model,n=e._options,a=Ve.getHoverColor;e.$previousStyle={backgroundColor:t.backgroundColor,borderColor:t.borderColor,borderWidth:t.borderWidth},t.backgroundColor=Wt(n.hoverBackgroundColor,a(n.backgroundColor)),t.borderColor=Wt(n.hoverBorderColor,a(n.borderColor)),t.borderWidth=Wt(n.hoverBorderWidth,n.borderWidth)},_resolveElementOptions:function(e,t){var n,a,i,r=this,o=r.chart,s=r.getDataset(),l=e.custom||{},d=o.options.elements.arc,u={},c={chart:o,dataIndex:t,dataset:s,datasetIndex:r.index},h=["backgroundColor","borderColor","borderWidth","borderAlign","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth"];for(n=0,a=h.length;n<a;++n)i=h[n],u[i]=Bt([l[i],s[i],d[i]],c,t);return u},_getRingWeightOffset:function(e){for(var t=0,n=0;n<e;++n)this.chart.isDatasetVisible(n)&&(t+=this._getRingWeight(n));return t},_getRingWeight:function(e){return Math.max(Wt(this.chart.data.datasets[e].weight,1),0)},_getVisibleDatasetWeightTotal:function(){return this._getRingWeightOffset(this.chart.data.datasets.length)}});Ne._set("horizontalBar",{hover:{mode:"index",axis:"y"},scales:{xAxes:[{type:"linear",position:"bottom"}],yAxes:[{type:"category",position:"left",categoryPercentage:.8,barPercentage:.9,offset:!0,gridLines:{offsetGridLines:!0}}]},elements:{rectangle:{borderSkipped:"left"}},tooltips:{mode:"index",axis:"y"}});var Nt=Pt.extend({_getValueScaleId:function(){return this.getMeta().xAxisID},_getIndexScaleId:function(){return this.getMeta().yAxisID}}),zt=Ve.valueOrDefault,Rt=Ve.options.resolve,$t=Ve.canvas._isPointInArea;function Vt(e,t){return zt(e.showLine,t.showLines)}Ne._set("line",{showLines:!0,spanGaps:!1,hover:{mode:"label"},scales:{xAxes:[{type:"category",id:"x-axis-0"}],yAxes:[{type:"linear",id:"y-axis-0"}]}});var Jt=ot.extend({datasetElementType:xt.Line,dataElementType:xt.Point,update:function(e){var t,n,a=this,i=a.getMeta(),r=i.dataset,o=i.data||[],s=a.getScaleForId(i.yAxisID),l=a.getDataset(),d=Vt(l,a.chart.options);for(d&&(void 0!==l.tension&&void 0===l.lineTension&&(l.lineTension=l.tension),r._scale=s,r._datasetIndex=a.index,r._children=o,r._model=a._resolveLineOptions(r),r.pivot()),t=0,n=o.length;t<n;++t)a.updateElement(o[t],t,e);for(d&&0!==r._model.tension&&a.updateBezierControlPoints(),t=0,n=o.length;t<n;++t)o[t].pivot()},updateElement:function(e,t,n){var a,i,r=this,o=r.getMeta(),s=e.custom||{},l=r.getDataset(),d=r.index,u=l.data[t],c=r.getScaleForId(o.yAxisID),h=r.getScaleForId(o.xAxisID),f=o.dataset._model,m=r._resolvePointOptions(e,t);a=h.getPixelForValue("object"===typeof u?u:NaN,t,d),i=n?c.getBasePixel():r.calculatePointY(u,t,d),e._xScale=h,e._yScale=c,e._options=m,e._datasetIndex=d,e._index=t,e._model={x:a,y:i,skip:s.skip||isNaN(a)||isNaN(i),radius:m.radius,pointStyle:m.pointStyle,rotation:m.rotation,backgroundColor:m.backgroundColor,borderColor:m.borderColor,borderWidth:m.borderWidth,tension:zt(s.tension,f?f.tension:0),steppedLine:!!f&&f.steppedLine,hitRadius:m.hitRadius}},_resolvePointOptions:function(e,t){var n,a,i,r=this,o=r.chart,s=o.data.datasets[r.index],l=e.custom||{},d=o.options.elements.point,u={},c={chart:o,dataIndex:t,dataset:s,datasetIndex:r.index},h={backgroundColor:"pointBackgroundColor",borderColor:"pointBorderColor",borderWidth:"pointBorderWidth",hitRadius:"pointHitRadius",hoverBackgroundColor:"pointHoverBackgroundColor",hoverBorderColor:"pointHoverBorderColor",hoverBorderWidth:"pointHoverBorderWidth",hoverRadius:"pointHoverRadius",pointStyle:"pointStyle",radius:"pointRadius",rotation:"pointRotation"},f=Object.keys(h);for(n=0,a=f.length;n<a;++n)i=f[n],u[i]=Rt([l[i],s[h[i]],s[i],d[i]],c,t);return u},_resolveLineOptions:function(e){var t,n,a,i=this,r=i.chart,o=r.data.datasets[i.index],s=e.custom||{},l=r.options,d=l.elements.line,u={},c=["backgroundColor","borderWidth","borderColor","borderCapStyle","borderDash","borderDashOffset","borderJoinStyle","fill","cubicInterpolationMode"];for(t=0,n=c.length;t<n;++t)a=c[t],u[a]=Rt([s[a],o[a],d[a]]);return u.spanGaps=zt(o.spanGaps,l.spanGaps),u.tension=zt(o.lineTension,d.tension),u.steppedLine=Rt([s.steppedLine,o.steppedLine,d.stepped]),u},calculatePointY:function(e,t,n){var a,i,r,o=this,s=o.chart,l=o.getMeta(),d=o.getScaleForId(l.yAxisID),u=0,c=0;if(d.options.stacked){for(a=0;a<n;a++)if(i=s.data.datasets[a],r=s.getDatasetMeta(a),"line"===r.type&&r.yAxisID===d.id&&s.isDatasetVisible(a)){var h=Number(d.getRightValue(i.data[t]));h<0?c+=h||0:u+=h||0}var f=Number(d.getRightValue(e));return f<0?d.getPixelForValue(c+f):d.getPixelForValue(u+f)}return d.getPixelForValue(e)},updateBezierControlPoints:function(){var e,t,n,a,i=this,r=i.chart,o=i.getMeta(),s=o.dataset._model,l=r.chartArea,d=o.data||[];function u(e,t,n){return Math.max(Math.min(e,n),t)}if(s.spanGaps&&(d=d.filter((function(e){return!e._model.skip}))),"monotone"===s.cubicInterpolationMode)Ve.splineCurveMonotone(d);else for(e=0,t=d.length;e<t;++e)n=d[e]._model,a=Ve.splineCurve(Ve.previousItem(d,e)._model,n,Ve.nextItem(d,e)._model,s.tension),n.controlPointPreviousX=a.previous.x,n.controlPointPreviousY=a.previous.y,n.controlPointNextX=a.next.x,n.controlPointNextY=a.next.y;if(r.options.elements.line.capBezierPoints)for(e=0,t=d.length;e<t;++e)n=d[e]._model,$t(n,l)&&(e>0&&$t(d[e-1]._model,l)&&(n.controlPointPreviousX=u(n.controlPointPreviousX,l.left,l.right),n.controlPointPreviousY=u(n.controlPointPreviousY,l.top,l.bottom)),e<d.length-1&&$t(d[e+1]._model,l)&&(n.controlPointNextX=u(n.controlPointNextX,l.left,l.right),n.controlPointNextY=u(n.controlPointNextY,l.top,l.bottom)))},draw:function(){var e,t=this,n=t.chart,a=t.getMeta(),i=a.data||[],r=n.chartArea,o=i.length,s=0;for(Vt(t.getDataset(),n.options)&&(e=(a.dataset._model.borderWidth||0)/2,Ve.canvas.clipArea(n.ctx,{left:r.left,right:r.right,top:r.top-e,bottom:r.bottom+e}),a.dataset.draw(),Ve.canvas.unclipArea(n.ctx));s<o;++s)i[s].draw(r)},setHoverStyle:function(e){var t=e._model,n=e._options,a=Ve.getHoverColor;e.$previousStyle={backgroundColor:t.backgroundColor,borderColor:t.borderColor,borderWidth:t.borderWidth,radius:t.radius},t.backgroundColor=zt(n.hoverBackgroundColor,a(n.backgroundColor)),t.borderColor=zt(n.hoverBorderColor,a(n.borderColor)),t.borderWidth=zt(n.hoverBorderWidth,n.borderWidth),t.radius=zt(n.hoverRadius,n.radius)}}),Ut=Ve.options.resolve;Ne._set("polarArea",{scale:{type:"radialLinear",angleLines:{display:!1},gridLines:{circular:!0},pointLabels:{display:!1},ticks:{beginAtZero:!0}},animation:{animateRotate:!0,animateScale:!0},startAngle:-.5*Math.PI,legendCallback:function(e){var t=[];t.push('<ul class="'+e.id+'-legend">');var n=e.data,a=n.datasets,i=n.labels;if(a.length)for(var r=0;r<a[0].data.length;++r)t.push('<li><span style="background-color:'+a[0].backgroundColor[r]+'"></span>'),i[r]&&t.push(i[r]),t.push("</li>");return t.push("</ul>"),t.join("")},legend:{labels:{generateLabels:function(e){var t=e.data;return t.labels.length&&t.datasets.length?t.labels.map((function(n,a){var i=e.getDatasetMeta(0),r=t.datasets[0],o=i.data[a],s=o.custom||{},l=e.options.elements.arc,d=Ut([s.backgroundColor,r.backgroundColor,l.backgroundColor],void 0,a),u=Ut([s.borderColor,r.borderColor,l.borderColor],void 0,a),c=Ut([s.borderWidth,r.borderWidth,l.borderWidth],void 0,a);return{text:n,fillStyle:d,strokeStyle:u,lineWidth:c,hidden:isNaN(r.data[a])||i.data[a].hidden,index:a}})):[]}},onClick:function(e,t){var n,a,i,r=t.index,o=this.chart;for(n=0,a=(o.data.datasets||[]).length;n<a;++n)i=o.getDatasetMeta(n),i.data[r].hidden=!i.data[r].hidden;o.update()}},tooltips:{callbacks:{title:function(){return""},label:function(e,t){return t.labels[e.index]+": "+e.yLabel}}}});var Gt=ot.extend({dataElementType:xt.Arc,linkScales:Ve.noop,update:function(e){var t,n,a,i=this,r=i.getDataset(),o=i.getMeta(),s=i.chart.options.startAngle||0,l=i._starts=[],d=i._angles=[],u=o.data;for(i._updateRadius(),o.count=i.countVisibleElements(),t=0,n=r.data.length;t<n;t++)l[t]=s,a=i._computeAngle(t),d[t]=a,s+=a;for(t=0,n=u.length;t<n;++t)u[t]._options=i._resolveElementOptions(u[t],t),i.updateElement(u[t],t,e)},_updateRadius:function(){var e=this,t=e.chart,n=t.chartArea,a=t.options,i=Math.min(n.right-n.left,n.bottom-n.top);t.outerRadius=Math.max(i/2,0),t.innerRadius=Math.max(a.cutoutPercentage?t.outerRadius/100*a.cutoutPercentage:1,0),t.radiusLength=(t.outerRadius-t.innerRadius)/t.getVisibleDatasetCount(),e.outerRadius=t.outerRadius-t.radiusLength*e.index,e.innerRadius=e.outerRadius-t.radiusLength},updateElement:function(e,t,n){var a=this,i=a.chart,r=a.getDataset(),o=i.options,s=o.animation,l=i.scale,d=i.data.labels,u=l.xCenter,c=l.yCenter,h=o.startAngle,f=e.hidden?0:l.getDistanceFromCenterForValue(r.data[t]),m=a._starts[t],p=m+(e.hidden?0:a._angles[t]),_=s.animateScale?0:l.getDistanceFromCenterForValue(r.data[t]),g=e._options||{};Ve.extend(e,{_datasetIndex:a.index,_index:t,_scale:l,_model:{backgroundColor:g.backgroundColor,borderColor:g.borderColor,borderWidth:g.borderWidth,borderAlign:g.borderAlign,x:u,y:c,innerRadius:0,outerRadius:n?_:f,startAngle:n&&s.animateRotate?h:m,endAngle:n&&s.animateRotate?h:p,label:Ve.valueAtIndexOrDefault(d,t,d[t])}}),e.pivot()},countVisibleElements:function(){var e=this.getDataset(),t=this.getMeta(),n=0;return Ve.each(t.data,(function(t,a){isNaN(e.data[a])||t.hidden||n++})),n},setHoverStyle:function(e){var t=e._model,n=e._options,a=Ve.getHoverColor,i=Ve.valueOrDefault;e.$previousStyle={backgroundColor:t.backgroundColor,borderColor:t.borderColor,borderWidth:t.borderWidth},t.backgroundColor=i(n.hoverBackgroundColor,a(n.backgroundColor)),t.borderColor=i(n.hoverBorderColor,a(n.borderColor)),t.borderWidth=i(n.hoverBorderWidth,n.borderWidth)},_resolveElementOptions:function(e,t){var n,a,i,r=this,o=r.chart,s=r.getDataset(),l=e.custom||{},d=o.options.elements.arc,u={},c={chart:o,dataIndex:t,dataset:s,datasetIndex:r.index},h=["backgroundColor","borderColor","borderWidth","borderAlign","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth"];for(n=0,a=h.length;n<a;++n)i=h[n],u[i]=Ut([l[i],s[i],d[i]],c,t);return u},_computeAngle:function(e){var t=this,n=this.getMeta().count,a=t.getDataset(),i=t.getMeta();if(isNaN(a.data[e])||i.data[e].hidden)return 0;var r={chart:t.chart,dataIndex:e,dataset:a,datasetIndex:t.index};return Ut([t.chart.options.elements.arc.angle,2*Math.PI/n],r,e)}});Ne._set("pie",Ve.clone(Ne.doughnut)),Ne._set("pie",{cutoutPercentage:0});var qt=Ft,Xt=Ve.valueOrDefault,Kt=Ve.options.resolve;Ne._set("radar",{scale:{type:"radialLinear"},elements:{line:{tension:0}}});var Zt=ot.extend({datasetElementType:xt.Line,dataElementType:xt.Point,linkScales:Ve.noop,update:function(e){var t,n,a=this,i=a.getMeta(),r=i.dataset,o=i.data||[],s=a.chart.scale,l=a.getDataset();for(void 0!==l.tension&&void 0===l.lineTension&&(l.lineTension=l.tension),r._scale=s,r._datasetIndex=a.index,r._children=o,r._loop=!0,r._model=a._resolveLineOptions(r),r.pivot(),t=0,n=o.length;t<n;++t)a.updateElement(o[t],t,e);for(a.updateBezierControlPoints(),t=0,n=o.length;t<n;++t)o[t].pivot()},updateElement:function(e,t,n){var a=this,i=e.custom||{},r=a.getDataset(),o=a.chart.scale,s=o.getPointPositionForValue(t,r.data[t]),l=a._resolvePointOptions(e,t),d=a.getMeta().dataset._model,u=n?o.xCenter:s.x,c=n?o.yCenter:s.y;e._scale=o,e._options=l,e._datasetIndex=a.index,e._index=t,e._model={x:u,y:c,skip:i.skip||isNaN(u)||isNaN(c),radius:l.radius,pointStyle:l.pointStyle,rotation:l.rotation,backgroundColor:l.backgroundColor,borderColor:l.borderColor,borderWidth:l.borderWidth,tension:Xt(i.tension,d?d.tension:0),hitRadius:l.hitRadius}},_resolvePointOptions:function(e,t){var n,a,i,r=this,o=r.chart,s=o.data.datasets[r.index],l=e.custom||{},d=o.options.elements.point,u={},c={chart:o,dataIndex:t,dataset:s,datasetIndex:r.index},h={backgroundColor:"pointBackgroundColor",borderColor:"pointBorderColor",borderWidth:"pointBorderWidth",hitRadius:"pointHitRadius",hoverBackgroundColor:"pointHoverBackgroundColor",hoverBorderColor:"pointHoverBorderColor",hoverBorderWidth:"pointHoverBorderWidth",hoverRadius:"pointHoverRadius",pointStyle:"pointStyle",radius:"pointRadius",rotation:"pointRotation"},f=Object.keys(h);for(n=0,a=f.length;n<a;++n)i=f[n],u[i]=Kt([l[i],s[h[i]],s[i],d[i]],c,t);return u},_resolveLineOptions:function(e){var t,n,a,i=this,r=i.chart,o=r.data.datasets[i.index],s=e.custom||{},l=r.options.elements.line,d={},u=["backgroundColor","borderWidth","borderColor","borderCapStyle","borderDash","borderDashOffset","borderJoinStyle","fill"];for(t=0,n=u.length;t<n;++t)a=u[t],d[a]=Kt([s[a],o[a],l[a]]);return d.tension=Xt(o.lineTension,l.tension),d},updateBezierControlPoints:function(){var e,t,n,a,i=this,r=i.getMeta(),o=i.chart.chartArea,s=r.data||[];function l(e,t,n){return Math.max(Math.min(e,n),t)}for(e=0,t=s.length;e<t;++e)n=s[e]._model,a=Ve.splineCurve(Ve.previousItem(s,e,!0)._model,n,Ve.nextItem(s,e,!0)._model,n.tension),n.controlPointPreviousX=l(a.previous.x,o.left,o.right),n.controlPointPreviousY=l(a.previous.y,o.top,o.bottom),n.controlPointNextX=l(a.next.x,o.left,o.right),n.controlPointNextY=l(a.next.y,o.top,o.bottom)},setHoverStyle:function(e){var t=e._model,n=e._options,a=Ve.getHoverColor;e.$previousStyle={backgroundColor:t.backgroundColor,borderColor:t.borderColor,borderWidth:t.borderWidth,radius:t.radius},t.backgroundColor=Xt(n.hoverBackgroundColor,a(n.backgroundColor)),t.borderColor=Xt(n.hoverBorderColor,a(n.borderColor)),t.borderWidth=Xt(n.hoverBorderWidth,n.borderWidth),t.radius=Xt(n.hoverRadius,n.radius)}});Ne._set("scatter",{hover:{mode:"single"},scales:{xAxes:[{id:"x-axis-1",type:"linear",position:"bottom"}],yAxes:[{id:"y-axis-1",type:"linear",position:"left"}]},showLines:!1,tooltips:{callbacks:{title:function(){return""},label:function(e){return"("+e.xLabel+", "+e.yLabel+")"}}}});var Qt=Jt,en={bar:Pt,bubble:It,doughnut:Ft,horizontalBar:Nt,line:Jt,polarArea:Gt,pie:qt,radar:Zt,scatter:Qt};function tn(e,t){return e.native?{x:e.x,y:e.y}:Ve.getRelativePosition(e,t)}function nn(e,t){var n,a,i,r,o,s=e.data.datasets;for(a=0,r=s.length;a<r;++a)if(e.isDatasetVisible(a))for(n=e.getDatasetMeta(a),i=0,o=n.data.length;i<o;++i){var l=n.data[i];l._view.skip||t(l)}}function an(e,t){var n=[];return nn(e,(function(e){e.inRange(t.x,t.y)&&n.push(e)})),n}function rn(e,t,n,a){var i=Number.POSITIVE_INFINITY,r=[];return nn(e,(function(e){if(!n||e.inRange(t.x,t.y)){var o=e.getCenterPoint(),s=a(t,o);s<i?(r=[e],i=s):s===i&&r.push(e)}})),r}function on(e){var t=-1!==e.indexOf("x"),n=-1!==e.indexOf("y");return function(e,a){var i=t?Math.abs(e.x-a.x):0,r=n?Math.abs(e.y-a.y):0;return Math.sqrt(Math.pow(i,2)+Math.pow(r,2))}}function sn(e,t,n){var a=tn(t,e);n.axis=n.axis||"x";var i=on(n.axis),r=n.intersect?an(e,a):rn(e,a,!1,i),o=[];return r.length?(e.data.datasets.forEach((function(t,n){if(e.isDatasetVisible(n)){var a=e.getDatasetMeta(n),i=a.data[r[0]._index];i&&!i._view.skip&&o.push(i)}})),o):[]}var ln={modes:{single:function(e,t){var n=tn(t,e),a=[];return nn(e,(function(e){if(e.inRange(n.x,n.y))return a.push(e),a})),a.slice(0,1)},label:sn,index:sn,dataset:function(e,t,n){var a=tn(t,e);n.axis=n.axis||"xy";var i=on(n.axis),r=n.intersect?an(e,a):rn(e,a,!1,i);return r.length>0&&(r=e.getDatasetMeta(r[0]._datasetIndex).data),r},"x-axis":function(e,t){return sn(e,t,{intersect:!1})},point:function(e,t){var n=tn(t,e);return an(e,n)},nearest:function(e,t,n){var a=tn(t,e);n.axis=n.axis||"xy";var i=on(n.axis);return rn(e,a,n.intersect,i)},x:function(e,t,n){var a=tn(t,e),i=[],r=!1;return nn(e,(function(e){e.inXRange(a.x)&&i.push(e),e.inRange(a.x,a.y)&&(r=!0)})),n.intersect&&!r&&(i=[]),i},y:function(e,t,n){var a=tn(t,e),i=[],r=!1;return nn(e,(function(e){e.inYRange(a.y)&&i.push(e),e.inRange(a.x,a.y)&&(r=!0)})),n.intersect&&!r&&(i=[]),i}}};function dn(e,t){return Ve.where(e,(function(e){return e.position===t}))}function un(e,t){e.forEach((function(e,t){return e._tmpIndex_=t,e})),e.sort((function(e,n){var a=t?n:e,i=t?e:n;return a.weight===i.weight?a._tmpIndex_-i._tmpIndex_:a.weight-i.weight})),e.forEach((function(e){delete e._tmpIndex_}))}function cn(e){var t=0,n=0,a=0,i=0;return Ve.each(e,(function(e){if(e.getPadding){var r=e.getPadding();t=Math.max(t,r.top),n=Math.max(n,r.left),a=Math.max(a,r.bottom),i=Math.max(i,r.right)}})),{top:t,left:n,bottom:a,right:i}}function hn(e,t){Ve.each(e,(function(e){t[e.position]+=e.isHorizontal()?e.height:e.width}))}Ne._set("global",{layout:{padding:{top:0,right:0,bottom:0,left:0}}});var fn={defaults:{},addBox:function(e,t){e.boxes||(e.boxes=[]),t.fullWidth=t.fullWidth||!1,t.position=t.position||"top",t.weight=t.weight||0,e.boxes.push(t)},removeBox:function(e,t){var n=e.boxes?e.boxes.indexOf(t):-1;-1!==n&&e.boxes.splice(n,1)},configure:function(e,t,n){for(var a,i=["fullWidth","position","weight"],r=i.length,o=0;o<r;++o)a=i[o],n.hasOwnProperty(a)&&(t[a]=n[a])},update:function(e,t,n){if(e){var a=e.options.layout||{},i=Ve.options.toPadding(a.padding),r=i.left,o=i.right,s=i.top,l=i.bottom,d=dn(e.boxes,"left"),u=dn(e.boxes,"right"),c=dn(e.boxes,"top"),h=dn(e.boxes,"bottom"),f=dn(e.boxes,"chartArea");un(d,!0),un(u,!1),un(c,!0),un(h,!1);var m,p=d.concat(u),_=c.concat(h),g=p.concat(_),y=t-r-o,v=n-s-l,b=y/2,M=(t-b)/p.length,L=y,k=v,w={top:s,left:r,bottom:l,right:o},x=[];Ve.each(g,O),m=cn(g),Ve.each(p,j),hn(p,w),Ve.each(_,j),hn(_,w),Ve.each(p,P),w={top:s,left:r,bottom:l,right:o},hn(g,w);var Y=Math.max(m.left-w.left,0);w.left+=Y,w.right+=Math.max(m.right-w.right,0);var S=Math.max(m.top-w.top,0);w.top+=S,w.bottom+=Math.max(m.bottom-w.bottom,0);var D=n-w.top-w.bottom,T=t-w.left-w.right;T===L&&D===k||(Ve.each(p,(function(e){e.height=D})),Ve.each(_,(function(e){e.fullWidth||(e.width=T)})),k=D,L=T);var H=r+Y,C=s+S;Ve.each(d.concat(c),A),H+=L,C+=k,Ve.each(u,A),Ve.each(h,A),e.chartArea={left:w.left,top:w.top,right:w.left+L,bottom:w.top+k},Ve.each(f,(function(t){t.left=e.chartArea.left,t.top=e.chartArea.top,t.right=e.chartArea.right,t.bottom=e.chartArea.bottom,t.update(L,k)}))}function O(e){var t,n=e.isHorizontal();n?(t=e.update(e.fullWidth?y:L,v/2),k-=t.height):(t=e.update(M,k),L-=t.width),x.push({horizontal:n,width:t.width,box:e})}function j(e){var t=Ve.findNextWhere(x,(function(t){return t.box===e}));if(t)if(t.horizontal){var n={left:Math.max(w.left,m.left),right:Math.max(w.right,m.right),top:0,bottom:0};e.update(e.fullWidth?y:L,v/2,n)}else e.update(t.width,k)}function P(e){var t=Ve.findNextWhere(x,(function(t){return t.box===e})),n={left:0,right:0,top:w.top,bottom:w.bottom};t&&e.update(t.width,k,n)}function A(e){e.isHorizontal()?(e.left=e.fullWidth?r:w.left,e.right=e.fullWidth?t-o:w.left+L,e.top=C,e.bottom=C+e.height,C=e.bottom):(e.left=H,e.right=H+e.width,e.top=w.top,e.bottom=w.top+k,H=e.right)}}},mn={acquireContext:function(e){return e&&e.canvas&&(e=e.canvas),e&&e.getContext("2d")||null}},pn="/*\n * DOM element rendering detection\n * https://davidwalsh.name/detect-node-insertion\n */\n@keyframes chartjs-render-animation {\n\tfrom { opacity: 0.99; }\n\tto { opacity: 1; }\n}\n\n.chartjs-render-monitor {\n\tanimation: chartjs-render-animation 0.001s;\n}\n\n/*\n * DOM element resizing detection\n * https://github.com/marcj/css-element-queries\n */\n.chartjs-size-monitor,\n.chartjs-size-monitor-expand,\n.chartjs-size-monitor-shrink {\n\tposition: absolute;\n\tdirection: ltr;\n\tleft: 0;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\toverflow: hidden;\n\tpointer-events: none;\n\tvisibility: hidden;\n\tz-index: -1;\n}\n\n.chartjs-size-monitor-expand > div {\n\tposition: absolute;\n\twidth: 1000000px;\n\theight: 1000000px;\n\tleft: 0;\n\ttop: 0;\n}\n\n.chartjs-size-monitor-shrink > div {\n\tposition: absolute;\n\twidth: 200%;\n\theight: 200%;\n\tleft: 0;\n\ttop: 0;\n}\n",_n=Object.freeze({default:pn});function gn(e){return e&&e.default||e}var yn=gn(_n),vn="$chartjs",bn="chartjs-",Mn=bn+"size-monitor",Ln=bn+"render-monitor",kn=bn+"render-animation",wn=["animationstart","webkitAnimationStart"],xn={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"};function Yn(e,t){var n=Ve.getStyle(e,t),a=n&&n.match(/^(\d+)(\.\d+)?px$/);return a?Number(a[1]):void 0}function Sn(e,t){var n=e.style,a=e.getAttribute("height"),i=e.getAttribute("width");if(e[vn]={initial:{height:a,width:i,style:{display:n.display,height:n.height,width:n.width}}},n.display=n.display||"block",null===i||""===i){var r=Yn(e,"width");void 0!==r&&(e.width=r)}if(null===a||""===a)if(""===e.style.height)e.height=e.width/(t.options.aspectRatio||2);else{var o=Yn(e,"height");void 0!==r&&(e.height=o)}return e}var Dn=function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("e",null,t)}catch(n){}return e}(),Tn=!!Dn&&{passive:!0};function Hn(e,t,n){e.addEventListener(t,n,Tn)}function Cn(e,t,n){e.removeEventListener(t,n,Tn)}function On(e,t,n,a,i){return{type:e,chart:t,native:i||null,x:void 0!==n?n:null,y:void 0!==a?a:null}}function jn(e,t){var n=xn[e.type]||e.type,a=Ve.getRelativePosition(e,t);return On(n,t,a.x,a.y,e)}function Pn(e,t){var n=!1,a=[];return function(){a=Array.prototype.slice.call(arguments),t=t||this,n||(n=!0,Ve.requestAnimFrame.call(window,(function(){n=!1,e.apply(t,a)})))}}function An(e){var t=document.createElement("div");return t.className=e||"",t}function En(e){var t=1e6,n=An(Mn),a=An(Mn+"-expand"),i=An(Mn+"-shrink");a.appendChild(An()),i.appendChild(An()),n.appendChild(a),n.appendChild(i),n._reset=function(){a.scrollLeft=t,a.scrollTop=t,i.scrollLeft=t,i.scrollTop=t};var r=function(){n._reset(),e()};return Hn(a,"scroll",r.bind(a,"expand")),Hn(i,"scroll",r.bind(i,"shrink")),n}function In(e,t){var n=e[vn]||(e[vn]={}),a=n.renderProxy=function(e){e.animationName===kn&&t()};Ve.each(wn,(function(t){Hn(e,t,a)})),n.reflow=!!e.offsetParent,e.classList.add(Ln)}function Bn(e){var t=e[vn]||{},n=t.renderProxy;n&&(Ve.each(wn,(function(t){Cn(e,t,n)})),delete t.renderProxy),e.classList.remove(Ln)}function Wn(e,t,n){var a=e[vn]||(e[vn]={}),i=a.resizer=En(Pn((function(){if(a.resizer){var i=n.options.maintainAspectRatio&&e.parentNode,r=i?i.clientWidth:0;t(On("resize",n)),i&&i.clientWidth<r&&n.canvas&&t(On("resize",n))}})));In(e,(function(){if(a.resizer){var t=e.parentNode;t&&t!==i.parentNode&&t.insertBefore(i,t.firstChild),i._reset()}}))}function Fn(e){var t=e[vn]||{},n=t.resizer;delete t.resizer,Bn(e),n&&n.parentNode&&n.parentNode.removeChild(n)}function Nn(e,t){var n=e._style||document.createElement("style");e._style||(e._style=n,t="/* Chart.js */\n"+t,n.setAttribute("type","text/css"),document.getElementsByTagName("head")[0].appendChild(n)),n.appendChild(document.createTextNode(t))}var zn={disableCSSInjection:!1,_enabled:"undefined"!==typeof window&&"undefined"!==typeof document,_ensureLoaded:function(){this._loaded||(this._loaded=!0,this.disableCSSInjection||Nn(this,yn))},acquireContext:function(e,t){"string"===typeof e?e=document.getElementById(e):e.length&&(e=e[0]),e&&e.canvas&&(e=e.canvas);var n=e&&e.getContext&&e.getContext("2d");return this._ensureLoaded(),n&&n.canvas===e?(Sn(e,t),n):null},releaseContext:function(e){var t=e.canvas;if(t[vn]){var n=t[vn].initial;["height","width"].forEach((function(e){var a=n[e];Ve.isNullOrUndef(a)?t.removeAttribute(e):t.setAttribute(e,a)})),Ve.each(n.style||{},(function(e,n){t.style[n]=e})),t.width=t.width,delete t[vn]}},addEventListener:function(e,t,n){var a=e.canvas;if("resize"!==t){var i=n[vn]||(n[vn]={}),r=i.proxies||(i.proxies={}),o=r[e.id+"_"+t]=function(t){n(jn(t,e))};Hn(a,t,o)}else Wn(a,n,e)},removeEventListener:function(e,t,n){var a=e.canvas;if("resize"!==t){var i=n[vn]||{},r=i.proxies||{},o=r[e.id+"_"+t];o&&Cn(a,t,o)}else Fn(a)}};Ve.addEvent=Hn,Ve.removeEvent=Cn;var Rn=zn._enabled?zn:mn,$n=Ve.extend({initialize:function(){},acquireContext:function(){},releaseContext:function(){},addEventListener:function(){},removeEventListener:function(){}},Rn);Ne._set("global",{plugins:{}});var Vn={_plugins:[],_cacheId:0,register:function(e){var t=this._plugins;[].concat(e).forEach((function(e){-1===t.indexOf(e)&&t.push(e)})),this._cacheId++},unregister:function(e){var t=this._plugins;[].concat(e).forEach((function(e){var n=t.indexOf(e);-1!==n&&t.splice(n,1)})),this._cacheId++},clear:function(){this._plugins=[],this._cacheId++},count:function(){return this._plugins.length},getAll:function(){return this._plugins},notify:function(e,t,n){var a,i,r,o,s,l=this.descriptors(e),d=l.length;for(a=0;a<d;++a)if(i=l[a],r=i.plugin,s=r[t],"function"===typeof s&&(o=[e].concat(n||[]),o.push(i.options),!1===s.apply(r,o)))return!1;return!0},descriptors:function(e){var t=e.$plugins||(e.$plugins={});if(t.id===this._cacheId)return t.descriptors;var n=[],a=[],i=e&&e.config||{},r=i.options&&i.options.plugins||{};return this._plugins.concat(i.plugins||[]).forEach((function(e){var t=n.indexOf(e);if(-1===t){var i=e.id,o=r[i];!1!==o&&(!0===o&&(o=Ve.clone(Ne.global.plugins[i])),n.push(e),a.push({plugin:e,options:o||{}}))}})),t.descriptors=a,t.id=this._cacheId,a},_invalidate:function(e){delete e.$plugins}},Jn={constructors:{},defaults:{},registerScaleType:function(e,t,n){this.constructors[e]=t,this.defaults[e]=Ve.clone(n)},getScaleConstructor:function(e){return this.constructors.hasOwnProperty(e)?this.constructors[e]:void 0},getScaleDefaults:function(e){return this.defaults.hasOwnProperty(e)?Ve.merge({},[Ne.scale,this.defaults[e]]):{}},updateScaleDefaults:function(e,t){var n=this;n.defaults.hasOwnProperty(e)&&(n.defaults[e]=Ve.extend(n.defaults[e],t))},addScalesToLayout:function(e){Ve.each(e.scales,(function(t){t.fullWidth=t.options.fullWidth,t.position=t.options.position,t.weight=t.options.weight,fn.addBox(e,t)}))}},Un=Ve.valueOrDefault;Ne._set("global",{tooltips:{enabled:!0,custom:null,mode:"nearest",position:"average",intersect:!0,backgroundColor:"rgba(0,0,0,0.8)",titleFontStyle:"bold",titleSpacing:2,titleMarginBottom:6,titleFontColor:"#fff",titleAlign:"left",bodySpacing:2,bodyFontColor:"#fff",bodyAlign:"left",footerFontStyle:"bold",footerSpacing:2,footerMarginTop:6,footerFontColor:"#fff",footerAlign:"left",yPadding:6,xPadding:6,caretPadding:2,caretSize:5,cornerRadius:6,multiKeyBackground:"#fff",displayColors:!0,borderColor:"rgba(0,0,0,0)",borderWidth:0,callbacks:{beforeTitle:Ve.noop,title:function(e,t){var n="",a=t.labels,i=a?a.length:0;if(e.length>0){var r=e[0];r.label?n=r.label:r.xLabel?n=r.xLabel:i>0&&r.index<i&&(n=a[r.index])}return n},afterTitle:Ve.noop,beforeBody:Ve.noop,beforeLabel:Ve.noop,label:function(e,t){var n=t.datasets[e.datasetIndex].label||"";return n&&(n+=": "),Ve.isNullOrUndef(e.value)?n+=e.yLabel:n+=e.value,n},labelColor:function(e,t){var n=t.getDatasetMeta(e.datasetIndex),a=n.data[e.index],i=a._view;return{borderColor:i.borderColor,backgroundColor:i.backgroundColor}},labelTextColor:function(){return this._options.bodyFontColor},afterLabel:Ve.noop,afterBody:Ve.noop,beforeFooter:Ve.noop,footer:Ve.noop,afterFooter:Ve.noop}}});var Gn={average:function(e){if(!e.length)return!1;var t,n,a=0,i=0,r=0;for(t=0,n=e.length;t<n;++t){var o=e[t];if(o&&o.hasValue()){var s=o.tooltipPosition();a+=s.x,i+=s.y,++r}}return{x:a/r,y:i/r}},nearest:function(e,t){var n,a,i,r=t.x,o=t.y,s=Number.POSITIVE_INFINITY;for(n=0,a=e.length;n<a;++n){var l=e[n];if(l&&l.hasValue()){var d=l.getCenterPoint(),u=Ve.distanceBetweenPoints(t,d);u<s&&(s=u,i=l)}}if(i){var c=i.tooltipPosition();r=c.x,o=c.y}return{x:r,y:o}}};function qn(e,t){return t&&(Ve.isArray(t)?Array.prototype.push.apply(e,t):e.push(t)),e}function Xn(e){return("string"===typeof e||e instanceof String)&&e.indexOf("\n")>-1?e.split("\n"):e}function Kn(e){var t=e._xScale,n=e._yScale||e._scale,a=e._index,i=e._datasetIndex,r=e._chart.getDatasetMeta(i).controller,o=r._getIndexScale(),s=r._getValueScale();return{xLabel:t?t.getLabelForIndex(a,i):"",yLabel:n?n.getLabelForIndex(a,i):"",label:o?""+o.getLabelForIndex(a,i):"",value:s?""+s.getLabelForIndex(a,i):"",index:a,datasetIndex:i,x:e._model.x,y:e._model.y}}function Zn(e){var t=Ne.global;return{xPadding:e.xPadding,yPadding:e.yPadding,xAlign:e.xAlign,yAlign:e.yAlign,bodyFontColor:e.bodyFontColor,_bodyFontFamily:Un(e.bodyFontFamily,t.defaultFontFamily),_bodyFontStyle:Un(e.bodyFontStyle,t.defaultFontStyle),_bodyAlign:e.bodyAlign,bodyFontSize:Un(e.bodyFontSize,t.defaultFontSize),bodySpacing:e.bodySpacing,titleFontColor:e.titleFontColor,_titleFontFamily:Un(e.titleFontFamily,t.defaultFontFamily),_titleFontStyle:Un(e.titleFontStyle,t.defaultFontStyle),titleFontSize:Un(e.titleFontSize,t.defaultFontSize),_titleAlign:e.titleAlign,titleSpacing:e.titleSpacing,titleMarginBottom:e.titleMarginBottom,footerFontColor:e.footerFontColor,_footerFontFamily:Un(e.footerFontFamily,t.defaultFontFamily),_footerFontStyle:Un(e.footerFontStyle,t.defaultFontStyle),footerFontSize:Un(e.footerFontSize,t.defaultFontSize),_footerAlign:e.footerAlign,footerSpacing:e.footerSpacing,footerMarginTop:e.footerMarginTop,caretSize:e.caretSize,cornerRadius:e.cornerRadius,backgroundColor:e.backgroundColor,opacity:0,legendColorBackground:e.multiKeyBackground,displayColors:e.displayColors,borderColor:e.borderColor,borderWidth:e.borderWidth}}function Qn(e,t){var n=e._chart.ctx,a=2*t.yPadding,i=0,r=t.body,o=r.reduce((function(e,t){return e+t.before.length+t.lines.length+t.after.length}),0);o+=t.beforeBody.length+t.afterBody.length;var s=t.title.length,l=t.footer.length,d=t.titleFontSize,u=t.bodyFontSize,c=t.footerFontSize;a+=s*d,a+=s?(s-1)*t.titleSpacing:0,a+=s?t.titleMarginBottom:0,a+=o*u,a+=o?(o-1)*t.bodySpacing:0,a+=l?t.footerMarginTop:0,a+=l*c,a+=l?(l-1)*t.footerSpacing:0;var h=0,f=function(e){i=Math.max(i,n.measureText(e).width+h)};return n.font=Ve.fontString(d,t._titleFontStyle,t._titleFontFamily),Ve.each(t.title,f),n.font=Ve.fontString(u,t._bodyFontStyle,t._bodyFontFamily),Ve.each(t.beforeBody.concat(t.afterBody),f),h=t.displayColors?u+2:0,Ve.each(r,(function(e){Ve.each(e.before,f),Ve.each(e.lines,f),Ve.each(e.after,f)})),h=0,n.font=Ve.fontString(c,t._footerFontStyle,t._footerFontFamily),Ve.each(t.footer,f),i+=2*t.xPadding,{width:i,height:a}}function ea(e,t){var n,a,i,r,o,s=e._model,l=e._chart,d=e._chart.chartArea,u="center",c="center";s.y<t.height?c="top":s.y>l.height-t.height&&(c="bottom");var h=(d.left+d.right)/2,f=(d.top+d.bottom)/2;"center"===c?(n=function(e){return e<=h},a=function(e){return e>h}):(n=function(e){return e<=t.width/2},a=function(e){return e>=l.width-t.width/2}),i=function(e){return e+t.width+s.caretSize+s.caretPadding>l.width},r=function(e){return e-t.width-s.caretSize-s.caretPadding<0},o=function(e){return e<=f?"top":"bottom"},n(s.x)?(u="left",i(s.x)&&(u="center",c=o(s.y))):a(s.x)&&(u="right",r(s.x)&&(u="center",c=o(s.y)));var m=e._options;return{xAlign:m.xAlign?m.xAlign:u,yAlign:m.yAlign?m.yAlign:c}}function ta(e,t,n,a){var i=e.x,r=e.y,o=e.caretSize,s=e.caretPadding,l=e.cornerRadius,d=n.xAlign,u=n.yAlign,c=o+s,h=l+s;return"right"===d?i-=t.width:"center"===d&&(i-=t.width/2,i+t.width>a.width&&(i=a.width-t.width),i<0&&(i=0)),"top"===u?r+=c:r-="bottom"===u?t.height+c:t.height/2,"center"===u?"left"===d?i+=c:"right"===d&&(i-=c):"left"===d?i-=h:"right"===d&&(i+=h),{x:i,y:r}}function na(e,t){return"center"===t?e.x+e.width/2:"right"===t?e.x+e.width-e.xPadding:e.x+e.xPadding}function aa(e){return qn([],Xn(e))}var ia=Ke.extend({initialize:function(){this._model=Zn(this._options),this._lastActive=[]},getTitle:function(){var e=this,t=e._options,n=t.callbacks,a=n.beforeTitle.apply(e,arguments),i=n.title.apply(e,arguments),r=n.afterTitle.apply(e,arguments),o=[];return o=qn(o,Xn(a)),o=qn(o,Xn(i)),o=qn(o,Xn(r)),o},getBeforeBody:function(){return aa(this._options.callbacks.beforeBody.apply(this,arguments))},getBody:function(e,t){var n=this,a=n._options.callbacks,i=[];return Ve.each(e,(function(e){var r={before:[],lines:[],after:[]};qn(r.before,Xn(a.beforeLabel.call(n,e,t))),qn(r.lines,a.label.call(n,e,t)),qn(r.after,Xn(a.afterLabel.call(n,e,t))),i.push(r)})),i},getAfterBody:function(){return aa(this._options.callbacks.afterBody.apply(this,arguments))},getFooter:function(){var e=this,t=e._options.callbacks,n=t.beforeFooter.apply(e,arguments),a=t.footer.apply(e,arguments),i=t.afterFooter.apply(e,arguments),r=[];return r=qn(r,Xn(n)),r=qn(r,Xn(a)),r=qn(r,Xn(i)),r},update:function(e){var t,n,a=this,i=a._options,r=a._model,o=a._model=Zn(i),s=a._active,l=a._data,d={xAlign:r.xAlign,yAlign:r.yAlign},u={x:r.x,y:r.y},c={width:r.width,height:r.height},h={x:r.caretX,y:r.caretY};if(s.length){o.opacity=1;var f=[],m=[];h=Gn[i.position].call(a,s,a._eventPosition);var p=[];for(t=0,n=s.length;t<n;++t)p.push(Kn(s[t]));i.filter&&(p=p.filter((function(e){return i.filter(e,l)}))),i.itemSort&&(p=p.sort((function(e,t){return i.itemSort(e,t,l)}))),Ve.each(p,(function(e){f.push(i.callbacks.labelColor.call(a,e,a._chart)),m.push(i.callbacks.labelTextColor.call(a,e,a._chart))})),o.title=a.getTitle(p,l),o.beforeBody=a.getBeforeBody(p,l),o.body=a.getBody(p,l),o.afterBody=a.getAfterBody(p,l),o.footer=a.getFooter(p,l),o.x=h.x,o.y=h.y,o.caretPadding=i.caretPadding,o.labelColors=f,o.labelTextColors=m,o.dataPoints=p,c=Qn(this,o),d=ea(this,c),u=ta(o,c,d,a._chart)}else o.opacity=0;return o.xAlign=d.xAlign,o.yAlign=d.yAlign,o.x=u.x,o.y=u.y,o.width=c.width,o.height=c.height,o.caretX=h.x,o.caretY=h.y,a._model=o,e&&i.custom&&i.custom.call(a,o),a},drawCaret:function(e,t){var n=this._chart.ctx,a=this._view,i=this.getCaretPosition(e,t,a);n.lineTo(i.x1,i.y1),n.lineTo(i.x2,i.y2),n.lineTo(i.x3,i.y3)},getCaretPosition:function(e,t,n){var a,i,r,o,s,l,d=n.caretSize,u=n.cornerRadius,c=n.xAlign,h=n.yAlign,f=e.x,m=e.y,p=t.width,_=t.height;if("center"===h)s=m+_/2,"left"===c?(a=f,i=a-d,r=a,o=s+d,l=s-d):(a=f+p,i=a+d,r=a,o=s-d,l=s+d);else if("left"===c?(i=f+u+d,a=i-d,r=i+d):"right"===c?(i=f+p-u-d,a=i-d,r=i+d):(i=n.caretX,a=i-d,r=i+d),"top"===h)o=m,s=o-d,l=o;else{o=m+_,s=o+d,l=o;var g=r;r=a,a=g}return{x1:a,x2:i,x3:r,y1:o,y2:s,y3:l}},drawTitle:function(e,t,n){var a=t.title;if(a.length){e.x=na(t,t._titleAlign),n.textAlign=t._titleAlign,n.textBaseline="top";var i,r,o=t.titleFontSize,s=t.titleSpacing;for(n.fillStyle=t.titleFontColor,n.font=Ve.fontString(o,t._titleFontStyle,t._titleFontFamily),i=0,r=a.length;i<r;++i)n.fillText(a[i],e.x,e.y),e.y+=o+s,i+1===a.length&&(e.y+=t.titleMarginBottom-s)}},drawBody:function(e,t,n){var a,i=t.bodyFontSize,r=t.bodySpacing,o=t._bodyAlign,s=t.body,l=t.displayColors,d=t.labelColors,u=0,c=l?na(t,"left"):0;n.textAlign=o,n.textBaseline="top",n.font=Ve.fontString(i,t._bodyFontStyle,t._bodyFontFamily),e.x=na(t,o);var h=function(t){n.fillText(t,e.x+u,e.y),e.y+=i+r};n.fillStyle=t.bodyFontColor,Ve.each(t.beforeBody,h),u=l&&"right"!==o?"center"===o?i/2+1:i+2:0,Ve.each(s,(function(r,o){a=t.labelTextColors[o],n.fillStyle=a,Ve.each(r.before,h),Ve.each(r.lines,(function(r){l&&(n.fillStyle=t.legendColorBackground,n.fillRect(c,e.y,i,i),n.lineWidth=1,n.strokeStyle=d[o].borderColor,n.strokeRect(c,e.y,i,i),n.fillStyle=d[o].backgroundColor,n.fillRect(c+1,e.y+1,i-2,i-2),n.fillStyle=a),h(r)})),Ve.each(r.after,h)})),u=0,Ve.each(t.afterBody,h),e.y-=r},drawFooter:function(e,t,n){var a=t.footer;a.length&&(e.x=na(t,t._footerAlign),e.y+=t.footerMarginTop,n.textAlign=t._footerAlign,n.textBaseline="top",n.fillStyle=t.footerFontColor,n.font=Ve.fontString(t.footerFontSize,t._footerFontStyle,t._footerFontFamily),Ve.each(a,(function(a){n.fillText(a,e.x,e.y),e.y+=t.footerFontSize+t.footerSpacing})))},drawBackground:function(e,t,n,a){n.fillStyle=t.backgroundColor,n.strokeStyle=t.borderColor,n.lineWidth=t.borderWidth;var i=t.xAlign,r=t.yAlign,o=e.x,s=e.y,l=a.width,d=a.height,u=t.cornerRadius;n.beginPath(),n.moveTo(o+u,s),"top"===r&&this.drawCaret(e,a),n.lineTo(o+l-u,s),n.quadraticCurveTo(o+l,s,o+l,s+u),"center"===r&&"right"===i&&this.drawCaret(e,a),n.lineTo(o+l,s+d-u),n.quadraticCurveTo(o+l,s+d,o+l-u,s+d),"bottom"===r&&this.drawCaret(e,a),n.lineTo(o+u,s+d),n.quadraticCurveTo(o,s+d,o,s+d-u),"center"===r&&"left"===i&&this.drawCaret(e,a),n.lineTo(o,s+u),n.quadraticCurveTo(o,s,o+u,s),n.closePath(),n.fill(),t.borderWidth>0&&n.stroke()},draw:function(){var e=this._chart.ctx,t=this._view;if(0!==t.opacity){var n={width:t.width,height:t.height},a={x:t.x,y:t.y},i=Math.abs(t.opacity<.001)?0:t.opacity,r=t.title.length||t.beforeBody.length||t.body.length||t.afterBody.length||t.footer.length;this._options.enabled&&r&&(e.save(),e.globalAlpha=i,this.drawBackground(a,t,e,n),a.y+=t.yPadding,this.drawTitle(a,t,e),this.drawBody(a,t,e),this.drawFooter(a,t,e),e.restore())}},handleEvent:function(e){var t=this,n=t._options,a=!1;return t._lastActive=t._lastActive||[],"mouseout"===e.type?t._active=[]:t._active=t._chart.getElementsAtEventForMode(e,n.mode,n),a=!Ve.arrayEquals(t._active,t._lastActive),a&&(t._lastActive=t._active,(n.enabled||n.custom)&&(t._eventPosition={x:e.x,y:e.y},t.update(!0),t.pivot())),a}}),ra=Gn,oa=ia;oa.positioners=ra;var sa=Ve.valueOrDefault;function la(){return Ve.merge({},[].slice.call(arguments),{merger:function(e,t,n,a){if("xAxes"===e||"yAxes"===e){var i,r,o,s=n[e].length;for(t[e]||(t[e]=[]),i=0;i<s;++i)o=n[e][i],r=sa(o.type,"xAxes"===e?"category":"linear"),i>=t[e].length&&t[e].push({}),!t[e][i].type||o.type&&o.type!==t[e][i].type?Ve.merge(t[e][i],[Jn.getScaleDefaults(r),o]):Ve.merge(t[e][i],o)}else Ve._merger(e,t,n,a)}})}function da(){return Ve.merge({},[].slice.call(arguments),{merger:function(e,t,n,a){var i=t[e]||{},r=n[e];"scales"===e?t[e]=la(i,r):"scale"===e?t[e]=Ve.merge(i,[Jn.getScaleDefaults(r.type),r]):Ve._merger(e,t,n,a)}})}function ua(e){e=e||{};var t=e.data=e.data||{};return t.datasets=t.datasets||[],t.labels=t.labels||[],e.options=da(Ne.global,Ne[e.type],e.options||{}),e}function ca(e){var t=e.options;Ve.each(e.scales,(function(t){fn.removeBox(e,t)})),t=da(Ne.global,Ne[e.config.type],t),e.options=e.config.options=t,e.ensureScalesHaveIDs(),e.buildOrUpdateScales(),e.tooltip._options=t.tooltips,e.tooltip.initialize()}function ha(e){return"top"===e||"bottom"===e}Ne._set("global",{elements:{},events:["mousemove","mouseout","click","touchstart","touchmove"],hover:{onHover:null,mode:"nearest",intersect:!0,animationDuration:400},onClick:null,maintainAspectRatio:!0,responsive:!0,responsiveAnimationDuration:0});var fa=function(e,t){return this.construct(e,t),this};Ve.extend(fa.prototype,{construct:function(e,t){var n=this;t=ua(t);var a=$n.acquireContext(e,t),i=a&&a.canvas,r=i&&i.height,o=i&&i.width;n.id=Ve.uid(),n.ctx=a,n.canvas=i,n.config=t,n.width=o,n.height=r,n.aspectRatio=r?o/r:null,n.options=t.options,n._bufferedRender=!1,n.chart=n,n.controller=n,fa.instances[n.id]=n,Object.defineProperty(n,"data",{get:function(){return n.config.data},set:function(e){n.config.data=e}}),a&&i?(n.initialize(),n.update()):console.error("Failed to create chart: can't acquire context from the given item")},initialize:function(){var e=this;return Vn.notify(e,"beforeInit"),Ve.retinaScale(e,e.options.devicePixelRatio),e.bindEvents(),e.options.responsive&&e.resize(!0),e.ensureScalesHaveIDs(),e.buildOrUpdateScales(),e.initToolTip(),Vn.notify(e,"afterInit"),e},clear:function(){return Ve.canvas.clear(this),this},stop:function(){return et.cancelAnimation(this),this},resize:function(e){var t=this,n=t.options,a=t.canvas,i=n.maintainAspectRatio&&t.aspectRatio||null,r=Math.max(0,Math.floor(Ve.getMaximumWidth(a))),o=Math.max(0,Math.floor(i?r/i:Ve.getMaximumHeight(a)));if((t.width!==r||t.height!==o)&&(a.width=t.width=r,a.height=t.height=o,a.style.width=r+"px",a.style.height=o+"px",Ve.retinaScale(t,n.devicePixelRatio),!e)){var s={width:r,height:o};Vn.notify(t,"resize",[s]),n.onResize&&n.onResize(t,s),t.stop(),t.update({duration:n.responsiveAnimationDuration})}},ensureScalesHaveIDs:function(){var e=this.options,t=e.scales||{},n=e.scale;Ve.each(t.xAxes,(function(e,t){e.id=e.id||"x-axis-"+t})),Ve.each(t.yAxes,(function(e,t){e.id=e.id||"y-axis-"+t})),n&&(n.id=n.id||"scale")},buildOrUpdateScales:function(){var e=this,t=e.options,n=e.scales||{},a=[],i=Object.keys(n).reduce((function(e,t){return e[t]=!1,e}),{});t.scales&&(a=a.concat((t.scales.xAxes||[]).map((function(e){return{options:e,dtype:"category",dposition:"bottom"}})),(t.scales.yAxes||[]).map((function(e){return{options:e,dtype:"linear",dposition:"left"}})))),t.scale&&a.push({options:t.scale,dtype:"radialLinear",isDefault:!0,dposition:"chartArea"}),Ve.each(a,(function(t){var a=t.options,r=a.id,o=sa(a.type,t.dtype);ha(a.position)!==ha(t.dposition)&&(a.position=t.dposition),i[r]=!0;var s=null;if(r in n&&n[r].type===o)s=n[r],s.options=a,s.ctx=e.ctx,s.chart=e;else{var l=Jn.getScaleConstructor(o);if(!l)return;s=new l({id:r,type:o,options:a,ctx:e.ctx,chart:e}),n[s.id]=s}s.mergeTicksOptions(),t.isDefault&&(e.scale=s)})),Ve.each(i,(function(e,t){e||delete n[t]})),e.scales=n,Jn.addScalesToLayout(this)},buildOrUpdateControllers:function(){var e=this,t=[];return Ve.each(e.data.datasets,(function(n,a){var i=e.getDatasetMeta(a),r=n.type||e.config.type;if(i.type&&i.type!==r&&(e.destroyDatasetMeta(a),i=e.getDatasetMeta(a)),i.type=r,i.controller)i.controller.updateIndex(a),i.controller.linkScales();else{var o=en[i.type];if(void 0===o)throw new Error('"'+i.type+'" is not a chart type.');i.controller=new o(e,a),t.push(i.controller)}}),e),t},resetElements:function(){var e=this;Ve.each(e.data.datasets,(function(t,n){e.getDatasetMeta(n).controller.reset()}),e)},reset:function(){this.resetElements(),this.tooltip.initialize()},update:function(e){var t=this;if(e&&"object"===typeof e||(e={duration:e,lazy:arguments[1]}),ca(t),Vn._invalidate(t),!1!==Vn.notify(t,"beforeUpdate")){t.tooltip._data=t.data;var n=t.buildOrUpdateControllers();Ve.each(t.data.datasets,(function(e,n){t.getDatasetMeta(n).controller.buildOrUpdateElements()}),t),t.updateLayout(),t.options.animation&&t.options.animation.duration&&Ve.each(n,(function(e){e.reset()})),t.updateDatasets(),t.tooltip.initialize(),t.lastActive=[],Vn.notify(t,"afterUpdate"),t._bufferedRender?t._bufferedRequest={duration:e.duration,easing:e.easing,lazy:e.lazy}:t.render(e)}},updateLayout:function(){var e=this;!1!==Vn.notify(e,"beforeLayout")&&(fn.update(this,this.width,this.height),Vn.notify(e,"afterScaleUpdate"),Vn.notify(e,"afterLayout"))},updateDatasets:function(){var e=this;if(!1!==Vn.notify(e,"beforeDatasetsUpdate")){for(var t=0,n=e.data.datasets.length;t<n;++t)e.updateDataset(t);Vn.notify(e,"afterDatasetsUpdate")}},updateDataset:function(e){var t=this,n=t.getDatasetMeta(e),a={meta:n,index:e};!1!==Vn.notify(t,"beforeDatasetUpdate",[a])&&(n.controller.update(),Vn.notify(t,"afterDatasetUpdate",[a]))},render:function(e){var t=this;e&&"object"===typeof e||(e={duration:e,lazy:arguments[1]});var n=t.options.animation,a=sa(e.duration,n&&n.duration),i=e.lazy;if(!1!==Vn.notify(t,"beforeRender")){var r=function(e){Vn.notify(t,"afterRender"),Ve.callback(n&&n.onComplete,[e],t)};if(n&&a){var o=new Qe({numSteps:a/16.66,easing:e.easing||n.easing,render:function(e,t){var n=Ve.easing.effects[t.easing],a=t.currentStep,i=a/t.numSteps;e.draw(n(i),i,a)},onAnimationProgress:n.onProgress,onAnimationComplete:r});et.addAnimation(t,o,a,i)}else t.draw(),r(new Qe({numSteps:0,chart:t}));return t}},draw:function(e){var t=this;t.clear(),Ve.isNullOrUndef(e)&&(e=1),t.transition(e),t.width<=0||t.height<=0||!1!==Vn.notify(t,"beforeDraw",[e])&&(Ve.each(t.boxes,(function(e){e.draw(t.chartArea)}),t),t.drawDatasets(e),t._drawTooltip(e),Vn.notify(t,"afterDraw",[e]))},transition:function(e){for(var t=this,n=0,a=(t.data.datasets||[]).length;n<a;++n)t.isDatasetVisible(n)&&t.getDatasetMeta(n).controller.transition(e);t.tooltip.transition(e)},drawDatasets:function(e){var t=this;if(!1!==Vn.notify(t,"beforeDatasetsDraw",[e])){for(var n=(t.data.datasets||[]).length-1;n>=0;--n)t.isDatasetVisible(n)&&t.drawDataset(n,e);Vn.notify(t,"afterDatasetsDraw",[e])}},drawDataset:function(e,t){var n=this,a=n.getDatasetMeta(e),i={meta:a,index:e,easingValue:t};!1!==Vn.notify(n,"beforeDatasetDraw",[i])&&(a.controller.draw(t),Vn.notify(n,"afterDatasetDraw",[i]))},_drawTooltip:function(e){var t=this,n=t.tooltip,a={tooltip:n,easingValue:e};!1!==Vn.notify(t,"beforeTooltipDraw",[a])&&(n.draw(),Vn.notify(t,"afterTooltipDraw",[a]))},getElementAtEvent:function(e){return ln.modes.single(this,e)},getElementsAtEvent:function(e){return ln.modes.label(this,e,{intersect:!0})},getElementsAtXAxis:function(e){return ln.modes["x-axis"](this,e,{intersect:!0})},getElementsAtEventForMode:function(e,t,n){var a=ln.modes[t];return"function"===typeof a?a(this,e,n):[]},getDatasetAtEvent:function(e){return ln.modes.dataset(this,e,{intersect:!0})},getDatasetMeta:function(e){var t=this,n=t.data.datasets[e];n._meta||(n._meta={});var a=n._meta[t.id];return a||(a=n._meta[t.id]={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null}),a},getVisibleDatasetCount:function(){for(var e=0,t=0,n=this.data.datasets.length;t<n;++t)this.isDatasetVisible(t)&&e++;return e},isDatasetVisible:function(e){var t=this.getDatasetMeta(e);return"boolean"===typeof t.hidden?!t.hidden:!this.data.datasets[e].hidden},generateLegend:function(){return this.options.legendCallback(this)},destroyDatasetMeta:function(e){var t=this.id,n=this.data.datasets[e],a=n._meta&&n._meta[t];a&&(a.controller.destroy(),delete n._meta[t])},destroy:function(){var e,t,n=this,a=n.canvas;for(n.stop(),e=0,t=n.data.datasets.length;e<t;++e)n.destroyDatasetMeta(e);a&&(n.unbindEvents(),Ve.canvas.clear(n),$n.releaseContext(n.ctx),n.canvas=null,n.ctx=null),Vn.notify(n,"destroy"),delete fa.instances[n.id]},toBase64Image:function(){return this.canvas.toDataURL.apply(this.canvas,arguments)},initToolTip:function(){var e=this;e.tooltip=new oa({_chart:e,_chartInstance:e,_data:e.data,_options:e.options.tooltips},e)},bindEvents:function(){var e=this,t=e._listeners={},n=function(){e.eventHandler.apply(e,arguments)};Ve.each(e.options.events,(function(a){$n.addEventListener(e,a,n),t[a]=n})),e.options.responsive&&(n=function(){e.resize()},$n.addEventListener(e,"resize",n),t.resize=n)},unbindEvents:function(){var e=this,t=e._listeners;t&&(delete e._listeners,Ve.each(t,(function(t,n){$n.removeEventListener(e,n,t)})))},updateHoverStyle:function(e,t,n){var a,i,r,o=n?"setHoverStyle":"removeHoverStyle";for(i=0,r=e.length;i<r;++i)a=e[i],a&&this.getDatasetMeta(a._datasetIndex).controller[o](a)},eventHandler:function(e){var t=this,n=t.tooltip;if(!1!==Vn.notify(t,"beforeEvent",[e])){t._bufferedRender=!0,t._bufferedRequest=null;var a=t.handleEvent(e);n&&(a=n._start?n.handleEvent(e):a|n.handleEvent(e)),Vn.notify(t,"afterEvent",[e]);var i=t._bufferedRequest;return i?t.render(i):a&&!t.animating&&(t.stop(),t.render({duration:t.options.hover.animationDuration,lazy:!0})),t._bufferedRender=!1,t._bufferedRequest=null,t}},handleEvent:function(e){var t=this,n=t.options||{},a=n.hover,i=!1;return t.lastActive=t.lastActive||[],"mouseout"===e.type?t.active=[]:t.active=t.getElementsAtEventForMode(e,a.mode,a),Ve.callback(n.onHover||n.hover.onHover,[e.native,t.active],t),"mouseup"!==e.type&&"click"!==e.type||n.onClick&&n.onClick.call(t,e.native,t.active),t.lastActive.length&&t.updateHoverStyle(t.lastActive,a.mode,!1),t.active.length&&a.mode&&t.updateHoverStyle(t.active,a.mode,!0),i=!Ve.arrayEquals(t.active,t.lastActive),t.lastActive=t.active,i}}),fa.instances={};var ma=fa;fa.Controller=fa,fa.types={},Ve.configMerge=da,Ve.scaleMerge=la;var pa=function(){function e(e,t,n){var a;return"string"===typeof e?(a=parseInt(e,10),-1!==e.indexOf("%")&&(a=a/100*t.parentNode[n])):a=e,a}function t(e){return void 0!==e&&null!==e&&"none"!==e}function n(n,a,i){var r=document.defaultView,o=Ve._getParentNode(n),s=r.getComputedStyle(n)[a],l=r.getComputedStyle(o)[a],d=t(s),u=t(l),c=Number.POSITIVE_INFINITY;return d||u?Math.min(d?e(s,n,i):c,u?e(l,o,i):c):"none"}Ve.where=function(e,t){if(Ve.isArray(e)&&Array.prototype.filter)return e.filter(t);var n=[];return Ve.each(e,(function(e){t(e)&&n.push(e)})),n},Ve.findIndex=Array.prototype.findIndex?function(e,t,n){return e.findIndex(t,n)}:function(e,t,n){n=void 0===n?e:n;for(var a=0,i=e.length;a<i;++a)if(t.call(n,e[a],a,e))return a;return-1},Ve.findNextWhere=function(e,t,n){Ve.isNullOrUndef(n)&&(n=-1);for(var a=n+1;a<e.length;a++){var i=e[a];if(t(i))return i}},Ve.findPreviousWhere=function(e,t,n){Ve.isNullOrUndef(n)&&(n=e.length);for(var a=n-1;a>=0;a--){var i=e[a];if(t(i))return i}},Ve.isNumber=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},Ve.almostEquals=function(e,t,n){return Math.abs(e-t)<n},Ve.almostWhole=function(e,t){var n=Math.round(e);return n-t<e&&n+t>e},Ve.max=function(e){return e.reduce((function(e,t){return isNaN(t)?e:Math.max(e,t)}),Number.NEGATIVE_INFINITY)},Ve.min=function(e){return e.reduce((function(e,t){return isNaN(t)?e:Math.min(e,t)}),Number.POSITIVE_INFINITY)},Ve.sign=Math.sign?function(e){return Math.sign(e)}:function(e){return e=+e,0===e||isNaN(e)?e:e>0?1:-1},Ve.log10=Math.log10?function(e){return Math.log10(e)}:function(e){var t=Math.log(e)*Math.LOG10E,n=Math.round(t),a=e===Math.pow(10,n);return a?n:t},Ve.toRadians=function(e){return e*(Math.PI/180)},Ve.toDegrees=function(e){return e*(180/Math.PI)},Ve._decimalPlaces=function(e){if(Ve.isFinite(e)){var t=1,n=0;while(Math.round(e*t)/t!==e)t*=10,n++;return n}},Ve.getAngleFromPoint=function(e,t){var n=t.x-e.x,a=t.y-e.y,i=Math.sqrt(n*n+a*a),r=Math.atan2(a,n);return r<-.5*Math.PI&&(r+=2*Math.PI),{angle:r,distance:i}},Ve.distanceBetweenPoints=function(e,t){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))},Ve.aliasPixel=function(e){return e%2===0?0:.5},Ve._alignPixel=function(e,t,n){var a=e.currentDevicePixelRatio,i=n/2;return Math.round((t-i)*a)/a+i},Ve.splineCurve=function(e,t,n,a){var i=e.skip?t:e,r=t,o=n.skip?t:n,s=Math.sqrt(Math.pow(r.x-i.x,2)+Math.pow(r.y-i.y,2)),l=Math.sqrt(Math.pow(o.x-r.x,2)+Math.pow(o.y-r.y,2)),d=s/(s+l),u=l/(s+l);d=isNaN(d)?0:d,u=isNaN(u)?0:u;var c=a*d,h=a*u;return{previous:{x:r.x-c*(o.x-i.x),y:r.y-c*(o.y-i.y)},next:{x:r.x+h*(o.x-i.x),y:r.y+h*(o.y-i.y)}}},Ve.EPSILON=Number.EPSILON||1e-14,Ve.splineCurveMonotone=function(e){var t,n,a,i,r,o,s,l,d,u=(e||[]).map((function(e){return{model:e._model,deltaK:0,mK:0}})),c=u.length;for(t=0;t<c;++t)if(a=u[t],!a.model.skip){if(n=t>0?u[t-1]:null,i=t<c-1?u[t+1]:null,i&&!i.model.skip){var h=i.model.x-a.model.x;a.deltaK=0!==h?(i.model.y-a.model.y)/h:0}!n||n.model.skip?a.mK=a.deltaK:!i||i.model.skip?a.mK=n.deltaK:this.sign(n.deltaK)!==this.sign(a.deltaK)?a.mK=0:a.mK=(n.deltaK+a.deltaK)/2}for(t=0;t<c-1;++t)a=u[t],i=u[t+1],a.model.skip||i.model.skip||(Ve.almostEquals(a.deltaK,0,this.EPSILON)?a.mK=i.mK=0:(r=a.mK/a.deltaK,o=i.mK/a.deltaK,l=Math.pow(r,2)+Math.pow(o,2),l<=9||(s=3/Math.sqrt(l),a.mK=r*s*a.deltaK,i.mK=o*s*a.deltaK)));for(t=0;t<c;++t)a=u[t],a.model.skip||(n=t>0?u[t-1]:null,i=t<c-1?u[t+1]:null,n&&!n.model.skip&&(d=(a.model.x-n.model.x)/3,a.model.controlPointPreviousX=a.model.x-d,a.model.controlPointPreviousY=a.model.y-d*a.mK),i&&!i.model.skip&&(d=(i.model.x-a.model.x)/3,a.model.controlPointNextX=a.model.x+d,a.model.controlPointNextY=a.model.y+d*a.mK))},Ve.nextItem=function(e,t,n){return n?t>=e.length-1?e[0]:e[t+1]:t>=e.length-1?e[e.length-1]:e[t+1]},Ve.previousItem=function(e,t,n){return n?t<=0?e[e.length-1]:e[t-1]:t<=0?e[0]:e[t-1]},Ve.niceNum=function(e,t){var n,a=Math.floor(Ve.log10(e)),i=e/Math.pow(10,a);return n=t?i<1.5?1:i<3?2:i<7?5:10:i<=1?1:i<=2?2:i<=5?5:10,n*Math.pow(10,a)},Ve.requestAnimFrame=function(){return"undefined"===typeof window?function(e){e()}:window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){return window.setTimeout(e,1e3/60)}}(),Ve.getRelativePosition=function(e,t){var n,a,i=e.originalEvent||e,r=e.target||e.srcElement,o=r.getBoundingClientRect(),s=i.touches;s&&s.length>0?(n=s[0].clientX,a=s[0].clientY):(n=i.clientX,a=i.clientY);var l=parseFloat(Ve.getStyle(r,"padding-left")),d=parseFloat(Ve.getStyle(r,"padding-top")),u=parseFloat(Ve.getStyle(r,"padding-right")),c=parseFloat(Ve.getStyle(r,"padding-bottom")),h=o.right-o.left-l-u,f=o.bottom-o.top-d-c;return n=Math.round((n-o.left-l)/h*r.width/t.currentDevicePixelRatio),a=Math.round((a-o.top-d)/f*r.height/t.currentDevicePixelRatio),{x:n,y:a}},Ve.getConstraintWidth=function(e){return n(e,"max-width","clientWidth")},Ve.getConstraintHeight=function(e){return n(e,"max-height","clientHeight")},Ve._calculatePadding=function(e,t,n){return t=Ve.getStyle(e,t),t.indexOf("%")>-1?n*parseInt(t,10)/100:parseInt(t,10)},Ve._getParentNode=function(e){var t=e.parentNode;return t&&"[object ShadowRoot]"===t.toString()&&(t=t.host),t},Ve.getMaximumWidth=function(e){var t=Ve._getParentNode(e);if(!t)return e.clientWidth;var n=t.clientWidth,a=Ve._calculatePadding(t,"padding-left",n),i=Ve._calculatePadding(t,"padding-right",n),r=n-a-i,o=Ve.getConstraintWidth(e);return isNaN(o)?r:Math.min(r,o)},Ve.getMaximumHeight=function(e){var t=Ve._getParentNode(e);if(!t)return e.clientHeight;var n=t.clientHeight,a=Ve._calculatePadding(t,"padding-top",n),i=Ve._calculatePadding(t,"padding-bottom",n),r=n-a-i,o=Ve.getConstraintHeight(e);return isNaN(o)?r:Math.min(r,o)},Ve.getStyle=function(e,t){return e.currentStyle?e.currentStyle[t]:document.defaultView.getComputedStyle(e,null).getPropertyValue(t)},Ve.retinaScale=function(e,t){var n=e.currentDevicePixelRatio=t||"undefined"!==typeof window&&window.devicePixelRatio||1;if(1!==n){var a=e.canvas,i=e.height,r=e.width;a.height=i*n,a.width=r*n,e.ctx.scale(n,n),a.style.height||a.style.width||(a.style.height=i+"px",a.style.width=r+"px")}},Ve.fontString=function(e,t,n){return t+" "+e+"px "+n},Ve.longestText=function(e,t,n,a){a=a||{};var i=a.data=a.data||{},r=a.garbageCollect=a.garbageCollect||[];a.font!==t&&(i=a.data={},r=a.garbageCollect=[],a.font=t),e.font=t;var o=0;Ve.each(n,(function(t){void 0!==t&&null!==t&&!0!==Ve.isArray(t)?o=Ve.measureText(e,i,r,o,t):Ve.isArray(t)&&Ve.each(t,(function(t){void 0===t||null===t||Ve.isArray(t)||(o=Ve.measureText(e,i,r,o,t))}))}));var s=r.length/2;if(s>n.length){for(var l=0;l<s;l++)delete i[r[l]];r.splice(0,s)}return o},Ve.measureText=function(e,t,n,a,i){var r=t[i];return r||(r=t[i]=e.measureText(i).width,n.push(i)),r>a&&(a=r),a},Ve.numberOfLabelLines=function(e){var t=1;return Ve.each(e,(function(e){Ve.isArray(e)&&e.length>t&&(t=e.length)})),t},Ve.color=Se?function(e){return e instanceof CanvasGradient&&(e=Ne.global.defaultColor),Se(e)}:function(e){return console.error("Color.js not found!"),e},Ve.getHoverColor=function(e){return e instanceof CanvasPattern||e instanceof CanvasGradient?e:Ve.color(e).saturate(.5).darken(.1).rgbString()}};function _a(){throw new Error("This method is not implemented: either no adapter can be found or an incomplete integration was provided.")}function ga(e){this.options=e||{}}Ve.extend(ga.prototype,{formats:_a,parse:_a,format:_a,add:_a,diff:_a,startOf:_a,endOf:_a,_create:function(e){return e}}),ga.override=function(e){Ve.extend(ga.prototype,e)};var ya=ga,va={_date:ya},ba={formatters:{values:function(e){return Ve.isArray(e)?e:""+e},linear:function(e,t,n){var a=n.length>3?n[2]-n[1]:n[1]-n[0];Math.abs(a)>1&&e!==Math.floor(e)&&(a=e-Math.floor(e));var i=Ve.log10(Math.abs(a)),r="";if(0!==e){var o=Math.max(Math.abs(n[0]),Math.abs(n[n.length-1]));if(o<1e-4){var s=Ve.log10(Math.abs(e));r=e.toExponential(Math.floor(s)-Math.floor(i))}else{var l=-1*Math.floor(i);l=Math.max(Math.min(l,20),0),r=e.toFixed(l)}}else r="0";return r},logarithmic:function(e,t,n){var a=e/Math.pow(10,Math.floor(Ve.log10(e)));return 0===e?"0":1===a||2===a||5===a||0===t||t===n.length-1?e.toExponential():""}}},Ma=Ve.valueOrDefault,La=Ve.valueAtIndexOrDefault;function ka(e){var t,n,a=[];for(t=0,n=e.length;t<n;++t)a.push(e[t].label);return a}function wa(e,t,n){var a=e.getPixelForTick(t);return n&&(1===e.getTicks().length?a-=e.isHorizontal()?Math.max(a-e.left,e.right-a):Math.max(a-e.top,e.bottom-a):a-=0===t?(e.getPixelForTick(1)-a)/2:(a-e.getPixelForTick(t-1))/2),a}function xa(e,t,n){return Ve.isArray(t)?Ve.longestText(e,n,t):e.measureText(t).width}Ne._set("scale",{display:!0,position:"left",offset:!1,gridLines:{display:!0,color:"rgba(0, 0, 0, 0.1)",lineWidth:1,drawBorder:!0,drawOnChartArea:!0,drawTicks:!0,tickMarkLength:10,zeroLineWidth:1,zeroLineColor:"rgba(0,0,0,0.25)",zeroLineBorderDash:[],zeroLineBorderDashOffset:0,offsetGridLines:!1,borderDash:[],borderDashOffset:0},scaleLabel:{display:!1,labelString:"",padding:{top:4,bottom:4}},ticks:{beginAtZero:!1,minRotation:0,maxRotation:50,mirror:!1,padding:0,reverse:!1,display:!0,autoSkip:!0,autoSkipPadding:0,labelOffset:0,callback:ba.formatters.values,minor:{},major:{}}});var Ya=Ke.extend({getPadding:function(){var e=this;return{left:e.paddingLeft||0,top:e.paddingTop||0,right:e.paddingRight||0,bottom:e.paddingBottom||0}},getTicks:function(){return this._ticks},mergeTicksOptions:function(){var e=this.options.ticks;for(var t in!1===e.minor&&(e.minor={display:!1}),!1===e.major&&(e.major={display:!1}),e)"major"!==t&&"minor"!==t&&("undefined"===typeof e.minor[t]&&(e.minor[t]=e[t]),"undefined"===typeof e.major[t]&&(e.major[t]=e[t]))},beforeUpdate:function(){Ve.callback(this.options.beforeUpdate,[this])},update:function(e,t,n){var a,i,r,o,s,l,d=this;for(d.beforeUpdate(),d.maxWidth=e,d.maxHeight=t,d.margins=Ve.extend({left:0,right:0,top:0,bottom:0},n),d._maxLabelLines=0,d.longestLabelWidth=0,d.longestTextCache=d.longestTextCache||{},d.beforeSetDimensions(),d.setDimensions(),d.afterSetDimensions(),d.beforeDataLimits(),d.determineDataLimits(),d.afterDataLimits(),d.beforeBuildTicks(),s=d.buildTicks()||[],s=d.afterBuildTicks(s)||s,d.beforeTickToLabelConversion(),r=d.convertTicksToLabels(s)||d.ticks,d.afterTickToLabelConversion(),d.ticks=r,a=0,i=r.length;a<i;++a)o=r[a],l=s[a],l?l.label=o:s.push(l={label:o,major:!1});return d._ticks=s,d.beforeCalculateTickRotation(),d.calculateTickRotation(),d.afterCalculateTickRotation(),d.beforeFit(),d.fit(),d.afterFit(),d.afterUpdate(),d.minSize},afterUpdate:function(){Ve.callback(this.options.afterUpdate,[this])},beforeSetDimensions:function(){Ve.callback(this.options.beforeSetDimensions,[this])},setDimensions:function(){var e=this;e.isHorizontal()?(e.width=e.maxWidth,e.left=0,e.right=e.width):(e.height=e.maxHeight,e.top=0,e.bottom=e.height),e.paddingLeft=0,e.paddingTop=0,e.paddingRight=0,e.paddingBottom=0},afterSetDimensions:function(){Ve.callback(this.options.afterSetDimensions,[this])},beforeDataLimits:function(){Ve.callback(this.options.beforeDataLimits,[this])},determineDataLimits:Ve.noop,afterDataLimits:function(){Ve.callback(this.options.afterDataLimits,[this])},beforeBuildTicks:function(){Ve.callback(this.options.beforeBuildTicks,[this])},buildTicks:Ve.noop,afterBuildTicks:function(e){var t=this;return Ve.isArray(e)&&e.length?Ve.callback(t.options.afterBuildTicks,[t,e]):(t.ticks=Ve.callback(t.options.afterBuildTicks,[t,t.ticks])||t.ticks,e)},beforeTickToLabelConversion:function(){Ve.callback(this.options.beforeTickToLabelConversion,[this])},convertTicksToLabels:function(){var e=this,t=e.options.ticks;e.ticks=e.ticks.map(t.userCallback||t.callback,this)},afterTickToLabelConversion:function(){Ve.callback(this.options.afterTickToLabelConversion,[this])},beforeCalculateTickRotation:function(){Ve.callback(this.options.beforeCalculateTickRotation,[this])},calculateTickRotation:function(){var e=this,t=e.ctx,n=e.options.ticks,a=ka(e._ticks),i=Ve.options._parseFont(n);t.font=i.string;var r=n.minRotation||0;if(a.length&&e.options.display&&e.isHorizontal()){var o,s,l=Ve.longestText(t,i.string,a,e.longestTextCache),d=l,u=e.getPixelForTick(1)-e.getPixelForTick(0)-6;while(d>u&&r<n.maxRotation){var c=Ve.toRadians(r);if(o=Math.cos(c),s=Math.sin(c),s*l>e.maxHeight){r--;break}r++,d=o*l}}e.labelRotation=r},afterCalculateTickRotation:function(){Ve.callback(this.options.afterCalculateTickRotation,[this])},beforeFit:function(){Ve.callback(this.options.beforeFit,[this])},fit:function(){var e=this,t=e.minSize={width:0,height:0},n=ka(e._ticks),a=e.options,i=a.ticks,r=a.scaleLabel,o=a.gridLines,s=e._isVisible(),l=a.position,d=e.isHorizontal(),u=Ve.options._parseFont,c=u(i),h=a.gridLines.tickMarkLength;if(t.width=d?e.isFullWidth()?e.maxWidth-e.margins.left-e.margins.right:e.maxWidth:s&&o.drawTicks?h:0,t.height=d?s&&o.drawTicks?h:0:e.maxHeight,r.display&&s){var f=u(r),m=Ve.options.toPadding(r.padding),p=f.lineHeight+m.height;d?t.height+=p:t.width+=p}if(i.display&&s){var _=Ve.longestText(e.ctx,c.string,n,e.longestTextCache),g=Ve.numberOfLabelLines(n),y=.5*c.size,v=e.options.ticks.padding;if(e._maxLabelLines=g,e.longestLabelWidth=_,d){var b=Ve.toRadians(e.labelRotation),M=Math.cos(b),L=Math.sin(b),k=L*_+c.lineHeight*g+y;t.height=Math.min(e.maxHeight,t.height+k+v),e.ctx.font=c.string;var w,x,Y=xa(e.ctx,n[0],c.string),S=xa(e.ctx,n[n.length-1],c.string),D=e.getPixelForTick(0)-e.left,T=e.right-e.getPixelForTick(n.length-1);0!==e.labelRotation?(w="bottom"===l?M*Y:M*y,x="bottom"===l?M*y:M*S):(w=Y/2,x=S/2),e.paddingLeft=Math.max(w-D,0)+3,e.paddingRight=Math.max(x-T,0)+3}else i.mirror?_=0:_+=v+y,t.width=Math.min(e.maxWidth,t.width+_),e.paddingTop=c.size/2,e.paddingBottom=c.size/2}e.handleMargins(),e.width=t.width,e.height=t.height},handleMargins:function(){var e=this;e.margins&&(e.paddingLeft=Math.max(e.paddingLeft-e.margins.left,0),e.paddingTop=Math.max(e.paddingTop-e.margins.top,0),e.paddingRight=Math.max(e.paddingRight-e.margins.right,0),e.paddingBottom=Math.max(e.paddingBottom-e.margins.bottom,0))},afterFit:function(){Ve.callback(this.options.afterFit,[this])},isHorizontal:function(){return"top"===this.options.position||"bottom"===this.options.position},isFullWidth:function(){return this.options.fullWidth},getRightValue:function(e){if(Ve.isNullOrUndef(e))return NaN;if(("number"===typeof e||e instanceof Number)&&!isFinite(e))return NaN;if(e)if(this.isHorizontal()){if(void 0!==e.x)return this.getRightValue(e.x)}else if(void 0!==e.y)return this.getRightValue(e.y);return e},getLabelForIndex:Ve.noop,getPixelForValue:Ve.noop,getValueForPixel:Ve.noop,getPixelForTick:function(e){var t=this,n=t.options.offset;if(t.isHorizontal()){var a=t.width-(t.paddingLeft+t.paddingRight),i=a/Math.max(t._ticks.length-(n?0:1),1),r=i*e+t.paddingLeft;n&&(r+=i/2);var o=t.left+r;return o+=t.isFullWidth()?t.margins.left:0,o}var s=t.height-(t.paddingTop+t.paddingBottom);return t.top+e*(s/(t._ticks.length-1))},getPixelForDecimal:function(e){var t=this;if(t.isHorizontal()){var n=t.width-(t.paddingLeft+t.paddingRight),a=n*e+t.paddingLeft,i=t.left+a;return i+=t.isFullWidth()?t.margins.left:0,i}return t.top+e*t.height},getBasePixel:function(){return this.getPixelForValue(this.getBaseValue())},getBaseValue:function(){var e=this,t=e.min,n=e.max;return e.beginAtZero?0:t<0&&n<0?n:t>0&&n>0?t:0},_autoSkip:function(e){var t,n,a=this,i=a.isHorizontal(),r=a.options.ticks.minor,o=e.length,s=!1,l=r.maxTicksLimit,d=a._tickSize()*(o-1),u=i?a.width-(a.paddingLeft+a.paddingRight):a.height-(a.paddingTop+a.PaddingBottom),c=[];for(d>u&&(s=1+Math.floor(d/u)),o>l&&(s=Math.max(s,1+Math.floor(o/l))),t=0;t<o;t++)n=e[t],s>1&&t%s>0&&delete n.label,c.push(n);return c},_tickSize:function(){var e=this,t=e.isHorizontal(),n=e.options.ticks.minor,a=Ve.toRadians(e.labelRotation),i=Math.abs(Math.cos(a)),r=Math.abs(Math.sin(a)),o=n.autoSkipPadding||0,s=e.longestLabelWidth+o||0,l=Ve.options._parseFont(n),d=e._maxLabelLines*l.lineHeight+o||0;return t?d*i>s*r?s/i:d/r:d*r<s*i?d/i:s/r},_isVisible:function(){var e,t,n,a=this,i=a.chart,r=a.options.display;if("auto"!==r)return!!r;for(e=0,t=i.data.datasets.length;e<t;++e)if(i.isDatasetVisible(e)&&(n=i.getDatasetMeta(e),n.xAxisID===a.id||n.yAxisID===a.id))return!0;return!1},draw:function(e){var t=this,n=t.options;if(t._isVisible()){var a,i,r,o=t.chart,s=t.ctx,l=Ne.global,d=l.defaultFontColor,u=n.ticks.minor,c=n.ticks.major||u,h=n.gridLines,f=n.scaleLabel,m=n.position,p=0!==t.labelRotation,_=u.mirror,g=t.isHorizontal(),y=Ve.options._parseFont,v=u.display&&u.autoSkip?t._autoSkip(t.getTicks()):t.getTicks(),b=Ma(u.fontColor,d),M=y(u),L=M.lineHeight,k=Ma(c.fontColor,d),w=y(c),x=u.padding,Y=u.labelOffset,S=h.drawTicks?h.tickMarkLength:0,D=Ma(f.fontColor,d),T=y(f),H=Ve.options.toPadding(f.padding),C=Ve.toRadians(t.labelRotation),O=[],j=h.drawBorder?La(h.lineWidth,0,0):0,P=Ve._alignPixel;"top"===m?(a=P(o,t.bottom,j),i=t.bottom-S,r=a-j/2):"bottom"===m?(a=P(o,t.top,j),i=a+j/2,r=t.top+S):"left"===m?(a=P(o,t.right,j),i=t.right-S,r=a-j/2):(a=P(o,t.left,j),i=a+j/2,r=t.left+S);var A=1e-7;if(Ve.each(v,(function(a,s){if(!Ve.isNullOrUndef(a.label)){var l,d,u,c,f,y,v,b,M,k,w,D,T,H,E,I,B=a.label;s===t.zeroLineIndex&&n.offset===h.offsetGridLines?(l=h.zeroLineWidth,d=h.zeroLineColor,u=h.zeroLineBorderDash||[],c=h.zeroLineBorderDashOffset||0):(l=La(h.lineWidth,s),d=La(h.color,s),u=h.borderDash||[],c=h.borderDashOffset||0);var W=Ve.isArray(B)?B.length:1,F=wa(t,s,h.offsetGridLines);if(g){var N=S+x;F<t.left-A&&(d="rgba(0,0,0,0)"),f=v=M=w=P(o,F,l),y=i,b=r,T=t.getPixelForTick(s)+Y,"top"===m?(k=P(o,e.top,j)+j/2,D=e.bottom,E=((p?1:.5)-W)*L,I=p?"left":"center",H=t.bottom-N):(k=e.top,D=P(o,e.bottom,j)-j/2,E=(p?0:.5)*L,I=p?"right":"center",H=t.top+N)}else{var z=(_?0:S)+x;F<t.top-A&&(d="rgba(0,0,0,0)"),f=i,v=r,y=b=k=D=P(o,F,l),H=t.getPixelForTick(s)+Y,E=(1-W)*L/2,"left"===m?(M=P(o,e.left,j)+j/2,w=e.right,I=_?"left":"right",T=t.right-z):(M=e.left,w=P(o,e.right,j)-j/2,I=_?"right":"left",T=t.left+z)}O.push({tx1:f,ty1:y,tx2:v,ty2:b,x1:M,y1:k,x2:w,y2:D,labelX:T,labelY:H,glWidth:l,glColor:d,glBorderDash:u,glBorderDashOffset:c,rotation:-1*C,label:B,major:a.major,textOffset:E,textAlign:I})}})),Ve.each(O,(function(e){var t=e.glWidth,n=e.glColor;if(h.display&&t&&n&&(s.save(),s.lineWidth=t,s.strokeStyle=n,s.setLineDash&&(s.setLineDash(e.glBorderDash),s.lineDashOffset=e.glBorderDashOffset),s.beginPath(),h.drawTicks&&(s.moveTo(e.tx1,e.ty1),s.lineTo(e.tx2,e.ty2)),h.drawOnChartArea&&(s.moveTo(e.x1,e.y1),s.lineTo(e.x2,e.y2)),s.stroke(),s.restore()),u.display){s.save(),s.translate(e.labelX,e.labelY),s.rotate(e.rotation),s.font=e.major?w.string:M.string,s.fillStyle=e.major?k:b,s.textBaseline="middle",s.textAlign=e.textAlign;var a=e.label,i=e.textOffset;if(Ve.isArray(a))for(var r=0;r<a.length;++r)s.fillText(""+a[r],0,i),i+=L;else s.fillText(a,0,i);s.restore()}})),f.display){var E,I,B=0,W=T.lineHeight/2;if(g)E=t.left+(t.right-t.left)/2,I="bottom"===m?t.bottom-W-H.bottom:t.top+W+H.top;else{var F="left"===m;E=F?t.left+W+H.top:t.right-W-H.top,I=t.top+(t.bottom-t.top)/2,B=F?-.5*Math.PI:.5*Math.PI}s.save(),s.translate(E,I),s.rotate(B),s.textAlign="center",s.textBaseline="middle",s.fillStyle=D,s.font=T.string,s.fillText(f.labelString,0,0),s.restore()}if(j){var N,z,R,$,V=j,J=La(h.lineWidth,v.length-1,0);g?(N=P(o,t.left,V)-V/2,z=P(o,t.right,J)+J/2,R=$=a):(R=P(o,t.top,V)-V/2,$=P(o,t.bottom,J)+J/2,N=z=a),s.lineWidth=j,s.strokeStyle=La(h.color,0),s.beginPath(),s.moveTo(N,R),s.lineTo(z,$),s.stroke()}}}}),Sa={position:"bottom"},Da=Ya.extend({getLabels:function(){var e=this.chart.data;return this.options.labels||(this.isHorizontal()?e.xLabels:e.yLabels)||e.labels},determineDataLimits:function(){var e,t=this,n=t.getLabels();t.minIndex=0,t.maxIndex=n.length-1,void 0!==t.options.ticks.min&&(e=n.indexOf(t.options.ticks.min),t.minIndex=-1!==e?e:t.minIndex),void 0!==t.options.ticks.max&&(e=n.indexOf(t.options.ticks.max),t.maxIndex=-1!==e?e:t.maxIndex),t.min=n[t.minIndex],t.max=n[t.maxIndex]},buildTicks:function(){var e=this,t=e.getLabels();e.ticks=0===e.minIndex&&e.maxIndex===t.length-1?t:t.slice(e.minIndex,e.maxIndex+1)},getLabelForIndex:function(e,t){var n=this,a=n.chart;return a.getDatasetMeta(t).controller._getValueScaleId()===n.id?n.getRightValue(a.data.datasets[t].data[e]):n.ticks[e-n.minIndex]},getPixelForValue:function(e,t){var n,a=this,i=a.options.offset,r=Math.max(a.maxIndex+1-a.minIndex-(i?0:1),1);if(void 0!==e&&null!==e&&(n=a.isHorizontal()?e.x:e.y),void 0!==n||void 0!==e&&isNaN(t)){var o=a.getLabels();e=n||e;var s=o.indexOf(e);t=-1!==s?s:t}if(a.isHorizontal()){var l=a.width/r,d=l*(t-a.minIndex);return i&&(d+=l/2),a.left+d}var u=a.height/r,c=u*(t-a.minIndex);return i&&(c+=u/2),a.top+c},getPixelForTick:function(e){return this.getPixelForValue(this.ticks[e],e+this.minIndex,null)},getValueForPixel:function(e){var t,n=this,a=n.options.offset,i=Math.max(n._ticks.length-(a?0:1),1),r=n.isHorizontal(),o=(r?n.width:n.height)/i;return e-=r?n.left:n.top,a&&(e-=o/2),t=e<=0?0:Math.round(e/o),t+n.minIndex},getBasePixel:function(){return this.bottom}}),Ta=Sa;Da._defaults=Ta;var Ha=Ve.noop,Ca=Ve.isNullOrUndef;function Oa(e,t){var n,a,i,r,o=[],s=1e-14,l=e.stepSize,d=l||1,u=e.maxTicks-1,c=e.min,h=e.max,f=e.precision,m=t.min,p=t.max,_=Ve.niceNum((p-m)/u/d)*d;if(_<s&&Ca(c)&&Ca(h))return[m,p];r=Math.ceil(p/_)-Math.floor(m/_),r>u&&(_=Ve.niceNum(r*_/u/d)*d),l||Ca(f)?n=Math.pow(10,Ve._decimalPlaces(_)):(n=Math.pow(10,f),_=Math.ceil(_*n)/n),a=Math.floor(m/_)*_,i=Math.ceil(p/_)*_,l&&(!Ca(c)&&Ve.almostWhole(c/_,_/1e3)&&(a=c),!Ca(h)&&Ve.almostWhole(h/_,_/1e3)&&(i=h)),r=(i-a)/_,r=Ve.almostEquals(r,Math.round(r),_/1e3)?Math.round(r):Math.ceil(r),a=Math.round(a*n)/n,i=Math.round(i*n)/n,o.push(Ca(c)?a:c);for(var g=1;g<r;++g)o.push(Math.round((a+g*_)*n)/n);return o.push(Ca(h)?i:h),o}var ja=Ya.extend({getRightValue:function(e){return"string"===typeof e?+e:Ya.prototype.getRightValue.call(this,e)},handleTickRangeOptions:function(){var e=this,t=e.options,n=t.ticks;if(n.beginAtZero){var a=Ve.sign(e.min),i=Ve.sign(e.max);a<0&&i<0?e.max=0:a>0&&i>0&&(e.min=0)}var r=void 0!==n.min||void 0!==n.suggestedMin,o=void 0!==n.max||void 0!==n.suggestedMax;void 0!==n.min?e.min=n.min:void 0!==n.suggestedMin&&(null===e.min?e.min=n.suggestedMin:e.min=Math.min(e.min,n.suggestedMin)),void 0!==n.max?e.max=n.max:void 0!==n.suggestedMax&&(null===e.max?e.max=n.suggestedMax:e.max=Math.max(e.max,n.suggestedMax)),r!==o&&e.min>=e.max&&(r?e.max=e.min+1:e.min=e.max-1),e.min===e.max&&(e.max++,n.beginAtZero||e.min--)},getTickLimit:function(){var e,t=this,n=t.options.ticks,a=n.stepSize,i=n.maxTicksLimit;return a?e=Math.ceil(t.max/a)-Math.floor(t.min/a)+1:(e=t._computeTickLimit(),i=i||11),i&&(e=Math.min(i,e)),e},_computeTickLimit:function(){return Number.POSITIVE_INFINITY},handleDirectionalChanges:Ha,buildTicks:function(){var e=this,t=e.options,n=t.ticks,a=e.getTickLimit();a=Math.max(2,a);var i={maxTicks:a,min:n.min,max:n.max,precision:n.precision,stepSize:Ve.valueOrDefault(n.fixedStepSize,n.stepSize)},r=e.ticks=Oa(i,e);e.handleDirectionalChanges(),e.max=Ve.max(r),e.min=Ve.min(r),n.reverse?(r.reverse(),e.start=e.max,e.end=e.min):(e.start=e.min,e.end=e.max)},convertTicksToLabels:function(){var e=this;e.ticksAsNumbers=e.ticks.slice(),e.zeroLineIndex=e.ticks.indexOf(0),Ya.prototype.convertTicksToLabels.call(e)}}),Pa={position:"left",ticks:{callback:ba.formatters.linear}},Aa=ja.extend({determineDataLimits:function(){var e=this,t=e.options,n=e.chart,a=n.data,i=a.datasets,r=e.isHorizontal(),o=0,s=1;function l(t){return r?t.xAxisID===e.id:t.yAxisID===e.id}e.min=null,e.max=null;var d=t.stacked;if(void 0===d&&Ve.each(i,(function(e,t){if(!d){var a=n.getDatasetMeta(t);n.isDatasetVisible(t)&&l(a)&&void 0!==a.stack&&(d=!0)}})),t.stacked||d){var u={};Ve.each(i,(function(a,i){var r=n.getDatasetMeta(i),o=[r.type,void 0===t.stacked&&void 0===r.stack?i:"",r.stack].join(".");void 0===u[o]&&(u[o]={positiveValues:[],negativeValues:[]});var s=u[o].positiveValues,d=u[o].negativeValues;n.isDatasetVisible(i)&&l(r)&&Ve.each(a.data,(function(n,a){var i=+e.getRightValue(n);isNaN(i)||r.data[a].hidden||(s[a]=s[a]||0,d[a]=d[a]||0,t.relativePoints?s[a]=100:i<0?d[a]+=i:s[a]+=i)}))})),Ve.each(u,(function(t){var n=t.positiveValues.concat(t.negativeValues),a=Ve.min(n),i=Ve.max(n);e.min=null===e.min?a:Math.min(e.min,a),e.max=null===e.max?i:Math.max(e.max,i)}))}else Ve.each(i,(function(t,a){var i=n.getDatasetMeta(a);n.isDatasetVisible(a)&&l(i)&&Ve.each(t.data,(function(t,n){var a=+e.getRightValue(t);isNaN(a)||i.data[n].hidden||((null===e.min||a<e.min)&&(e.min=a),(null===e.max||a>e.max)&&(e.max=a))}))}));e.min=isFinite(e.min)&&!isNaN(e.min)?e.min:o,e.max=isFinite(e.max)&&!isNaN(e.max)?e.max:s,this.handleTickRangeOptions()},_computeTickLimit:function(){var e,t=this;return t.isHorizontal()?Math.ceil(t.width/40):(e=Ve.options._parseFont(t.options.ticks),Math.ceil(t.height/e.lineHeight))},handleDirectionalChanges:function(){this.isHorizontal()||this.ticks.reverse()},getLabelForIndex:function(e,t){return+this.getRightValue(this.chart.data.datasets[t].data[e])},getPixelForValue:function(e){var t,n=this,a=n.start,i=+n.getRightValue(e),r=n.end-a;return t=n.isHorizontal()?n.left+n.width/r*(i-a):n.bottom-n.height/r*(i-a),t},getValueForPixel:function(e){var t=this,n=t.isHorizontal(),a=n?t.width:t.height,i=(n?e-t.left:t.bottom-e)/a;return t.start+(t.end-t.start)*i},getPixelForTick:function(e){return this.getPixelForValue(this.ticksAsNumbers[e])}}),Ea=Pa;Aa._defaults=Ea;var Ia=Ve.valueOrDefault;function Ba(e,t){var n,a,i=[],r=Ia(e.min,Math.pow(10,Math.floor(Ve.log10(t.min)))),o=Math.floor(Ve.log10(t.max)),s=Math.ceil(t.max/Math.pow(10,o));0===r?(n=Math.floor(Ve.log10(t.minNotZero)),a=Math.floor(t.minNotZero/Math.pow(10,n)),i.push(r),r=a*Math.pow(10,n)):(n=Math.floor(Ve.log10(r)),a=Math.floor(r/Math.pow(10,n)));var l=n<0?Math.pow(10,Math.abs(n)):1;do{i.push(r),++a,10===a&&(a=1,++n,l=n>=0?1:l),r=Math.round(a*Math.pow(10,n)*l)/l}while(n<o||n===o&&a<s);var d=Ia(e.max,r);return i.push(d),i}var Wa={position:"left",ticks:{callback:ba.formatters.logarithmic}};function Fa(e,t){return Ve.isFinite(e)&&e>=0?e:t}var Na=Ya.extend({determineDataLimits:function(){var e=this,t=e.options,n=e.chart,a=n.data,i=a.datasets,r=e.isHorizontal();function o(t){return r?t.xAxisID===e.id:t.yAxisID===e.id}e.min=null,e.max=null,e.minNotZero=null;var s=t.stacked;if(void 0===s&&Ve.each(i,(function(e,t){if(!s){var a=n.getDatasetMeta(t);n.isDatasetVisible(t)&&o(a)&&void 0!==a.stack&&(s=!0)}})),t.stacked||s){var l={};Ve.each(i,(function(a,i){var r=n.getDatasetMeta(i),s=[r.type,void 0===t.stacked&&void 0===r.stack?i:"",r.stack].join(".");n.isDatasetVisible(i)&&o(r)&&(void 0===l[s]&&(l[s]=[]),Ve.each(a.data,(function(t,n){var a=l[s],i=+e.getRightValue(t);isNaN(i)||r.data[n].hidden||i<0||(a[n]=a[n]||0,a[n]+=i)})))})),Ve.each(l,(function(t){if(t.length>0){var n=Ve.min(t),a=Ve.max(t);e.min=null===e.min?n:Math.min(e.min,n),e.max=null===e.max?a:Math.max(e.max,a)}}))}else Ve.each(i,(function(t,a){var i=n.getDatasetMeta(a);n.isDatasetVisible(a)&&o(i)&&Ve.each(t.data,(function(t,n){var a=+e.getRightValue(t);isNaN(a)||i.data[n].hidden||a<0||((null===e.min||a<e.min)&&(e.min=a),(null===e.max||a>e.max)&&(e.max=a),0!==a&&(null===e.minNotZero||a<e.minNotZero)&&(e.minNotZero=a))}))}));this.handleTickRangeOptions()},handleTickRangeOptions:function(){var e=this,t=e.options.ticks,n=1,a=10;e.min=Fa(t.min,e.min),e.max=Fa(t.max,e.max),e.min===e.max&&(0!==e.min&&null!==e.min?(e.min=Math.pow(10,Math.floor(Ve.log10(e.min))-1),e.max=Math.pow(10,Math.floor(Ve.log10(e.max))+1)):(e.min=n,e.max=a)),null===e.min&&(e.min=Math.pow(10,Math.floor(Ve.log10(e.max))-1)),null===e.max&&(e.max=0!==e.min?Math.pow(10,Math.floor(Ve.log10(e.min))+1):a),null===e.minNotZero&&(e.min>0?e.minNotZero=e.min:e.max<1?e.minNotZero=Math.pow(10,Math.floor(Ve.log10(e.max))):e.minNotZero=n)},buildTicks:function(){var e=this,t=e.options.ticks,n=!e.isHorizontal(),a={min:Fa(t.min),max:Fa(t.max)},i=e.ticks=Ba(a,e);e.max=Ve.max(i),e.min=Ve.min(i),t.reverse?(n=!n,e.start=e.max,e.end=e.min):(e.start=e.min,e.end=e.max),n&&i.reverse()},convertTicksToLabels:function(){this.tickValues=this.ticks.slice(),Ya.prototype.convertTicksToLabels.call(this)},getLabelForIndex:function(e,t){return+this.getRightValue(this.chart.data.datasets[t].data[e])},getPixelForTick:function(e){return this.getPixelForValue(this.tickValues[e])},_getFirstTickValue:function(e){var t=Math.floor(Ve.log10(e)),n=Math.floor(e/Math.pow(10,t));return n*Math.pow(10,t)},getPixelForValue:function(e){var t,n,a,i,r,o=this,s=o.options.ticks,l=s.reverse,d=Ve.log10,u=o._getFirstTickValue(o.minNotZero),c=0;return e=+o.getRightValue(e),l?(a=o.end,i=o.start,r=-1):(a=o.start,i=o.end,r=1),o.isHorizontal()?(t=o.width,n=l?o.right:o.left):(t=o.height,r*=-1,n=l?o.top:o.bottom),e!==a&&(0===a&&(c=Ia(s.fontSize,Ne.global.defaultFontSize),t-=c,a=u),0!==e&&(c+=t/(d(i)-d(a))*(d(e)-d(a))),n+=r*c),n},getValueForPixel:function(e){var t,n,a,i,r=this,o=r.options.ticks,s=o.reverse,l=Ve.log10,d=r._getFirstTickValue(r.minNotZero);if(s?(n=r.end,a=r.start):(n=r.start,a=r.end),r.isHorizontal()?(t=r.width,i=s?r.right-e:e-r.left):(t=r.height,i=s?e-r.top:r.bottom-e),i!==n){if(0===n){var u=Ia(o.fontSize,Ne.global.defaultFontSize);i-=u,t-=u,n=d}i*=l(a)-l(n),i/=t,i=Math.pow(10,l(n)+i)}return i}}),za=Wa;Na._defaults=za;var Ra=Ve.valueOrDefault,$a=Ve.valueAtIndexOrDefault,Va=Ve.options.resolve,Ja={display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,color:"rgba(0, 0, 0, 0.1)",lineWidth:1,borderDash:[],borderDashOffset:0},gridLines:{circular:!1},ticks:{showLabelBackdrop:!0,backdropColor:"rgba(255,255,255,0.75)",backdropPaddingY:2,backdropPaddingX:2,callback:ba.formatters.linear},pointLabels:{display:!0,fontSize:10,callback:function(e){return e}}};function Ua(e){var t=e.options;return t.angleLines.display||t.pointLabels.display?e.chart.data.labels.length:0}function Ga(e){var t=e.ticks;return t.display&&e.display?Ra(t.fontSize,Ne.global.defaultFontSize)+2*t.backdropPaddingY:0}function qa(e,t,n){return Ve.isArray(n)?{w:Ve.longestText(e,e.font,n),h:n.length*t}:{w:e.measureText(n).width,h:t}}function Xa(e,t,n,a,i){return e===a||e===i?{start:t-n/2,end:t+n/2}:e<a||e>i?{start:t-n,end:t}:{start:t,end:t+n}}function Ka(e){var t,n,a,i=Ve.options._parseFont(e.options.pointLabels),r={l:0,r:e.width,t:0,b:e.height-e.paddingTop},o={};e.ctx.font=i.string,e._pointLabelSizes=[];var s=Ua(e);for(t=0;t<s;t++){a=e.getPointPosition(t,e.drawingArea+5),n=qa(e.ctx,i.lineHeight,e.pointLabels[t]||""),e._pointLabelSizes[t]=n;var l=e.getIndexAngle(t),d=Ve.toDegrees(l)%360,u=Xa(d,a.x,n.w,0,180),c=Xa(d,a.y,n.h,90,270);u.start<r.l&&(r.l=u.start,o.l=l),u.end>r.r&&(r.r=u.end,o.r=l),c.start<r.t&&(r.t=c.start,o.t=l),c.end>r.b&&(r.b=c.end,o.b=l)}e.setReductions(e.drawingArea,r,o)}function Za(e){return 0===e||180===e?"center":e<180?"left":"right"}function Qa(e,t,n,a){var i,r,o=n.y+a/2;if(Ve.isArray(t))for(i=0,r=t.length;i<r;++i)e.fillText(t[i],n.x,o),o+=a;else e.fillText(t,n.x,o)}function ei(e,t,n){90===e||270===e?n.y-=t.h/2:(e>270||e<90)&&(n.y-=t.h)}function ti(e){var t=e.ctx,n=e.options,a=n.angleLines,i=n.gridLines,r=n.pointLabels,o=Ra(a.lineWidth,i.lineWidth),s=Ra(a.color,i.color),l=Ga(n);t.save(),t.lineWidth=o,t.strokeStyle=s,t.setLineDash&&(t.setLineDash(Va([a.borderDash,i.borderDash,[]])),t.lineDashOffset=Va([a.borderDashOffset,i.borderDashOffset,0]));var d=e.getDistanceFromCenterForValue(n.ticks.reverse?e.min:e.max),u=Ve.options._parseFont(r);t.font=u.string,t.textBaseline="middle";for(var c=Ua(e)-1;c>=0;c--){if(a.display&&o&&s){var h=e.getPointPosition(c,d);t.beginPath(),t.moveTo(e.xCenter,e.yCenter),t.lineTo(h.x,h.y),t.stroke()}if(r.display){var f=0===c?l/2:0,m=e.getPointPosition(c,d+f+5),p=$a(r.fontColor,c,Ne.global.defaultFontColor);t.fillStyle=p;var _=e.getIndexAngle(c),g=Ve.toDegrees(_);t.textAlign=Za(g),ei(g,e._pointLabelSizes[c],m),Qa(t,e.pointLabels[c]||"",m,u.lineHeight)}}t.restore()}function ni(e,t,n,a){var i,r=e.ctx,o=t.circular,s=Ua(e),l=$a(t.color,a-1),d=$a(t.lineWidth,a-1);if((o||s)&&l&&d){if(r.save(),r.strokeStyle=l,r.lineWidth=d,r.setLineDash&&(r.setLineDash(t.borderDash||[]),r.lineDashOffset=t.borderDashOffset||0),r.beginPath(),o)r.arc(e.xCenter,e.yCenter,n,0,2*Math.PI);else{i=e.getPointPosition(0,n),r.moveTo(i.x,i.y);for(var u=1;u<s;u++)i=e.getPointPosition(u,n),r.lineTo(i.x,i.y)}r.closePath(),r.stroke(),r.restore()}}function ai(e){return Ve.isNumber(e)?e:0}var ii=ja.extend({setDimensions:function(){var e=this;e.width=e.maxWidth,e.height=e.maxHeight,e.paddingTop=Ga(e.options)/2,e.xCenter=Math.floor(e.width/2),e.yCenter=Math.floor((e.height-e.paddingTop)/2),e.drawingArea=Math.min(e.height-e.paddingTop,e.width)/2},determineDataLimits:function(){var e=this,t=e.chart,n=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;Ve.each(t.data.datasets,(function(i,r){if(t.isDatasetVisible(r)){var o=t.getDatasetMeta(r);Ve.each(i.data,(function(t,i){var r=+e.getRightValue(t);isNaN(r)||o.data[i].hidden||(n=Math.min(r,n),a=Math.max(r,a))}))}})),e.min=n===Number.POSITIVE_INFINITY?0:n,e.max=a===Number.NEGATIVE_INFINITY?0:a,e.handleTickRangeOptions()},_computeTickLimit:function(){return Math.ceil(this.drawingArea/Ga(this.options))},convertTicksToLabels:function(){var e=this;ja.prototype.convertTicksToLabels.call(e),e.pointLabels=e.chart.data.labels.map(e.options.pointLabels.callback,e)},getLabelForIndex:function(e,t){return+this.getRightValue(this.chart.data.datasets[t].data[e])},fit:function(){var e=this,t=e.options;t.display&&t.pointLabels.display?Ka(e):e.setCenterPoint(0,0,0,0)},setReductions:function(e,t,n){var a=this,i=t.l/Math.sin(n.l),r=Math.max(t.r-a.width,0)/Math.sin(n.r),o=-t.t/Math.cos(n.t),s=-Math.max(t.b-(a.height-a.paddingTop),0)/Math.cos(n.b);i=ai(i),r=ai(r),o=ai(o),s=ai(s),a.drawingArea=Math.min(Math.floor(e-(i+r)/2),Math.floor(e-(o+s)/2)),a.setCenterPoint(i,r,o,s)},setCenterPoint:function(e,t,n,a){var i=this,r=i.width-t-i.drawingArea,o=e+i.drawingArea,s=n+i.drawingArea,l=i.height-i.paddingTop-a-i.drawingArea;i.xCenter=Math.floor((o+r)/2+i.left),i.yCenter=Math.floor((s+l)/2+i.top+i.paddingTop)},getIndexAngle:function(e){var t=2*Math.PI/Ua(this),n=this.chart.options&&this.chart.options.startAngle?this.chart.options.startAngle:0,a=n*Math.PI*2/360;return e*t+a},getDistanceFromCenterForValue:function(e){var t=this;if(null===e)return 0;var n=t.drawingArea/(t.max-t.min);return t.options.ticks.reverse?(t.max-e)*n:(e-t.min)*n},getPointPosition:function(e,t){var n=this,a=n.getIndexAngle(e)-Math.PI/2;return{x:Math.cos(a)*t+n.xCenter,y:Math.sin(a)*t+n.yCenter}},getPointPositionForValue:function(e,t){return this.getPointPosition(e,this.getDistanceFromCenterForValue(t))},getBasePosition:function(){var e=this,t=e.min,n=e.max;return e.getPointPositionForValue(0,e.beginAtZero?0:t<0&&n<0?n:t>0&&n>0?t:0)},draw:function(){var e=this,t=e.options,n=t.gridLines,a=t.ticks;if(t.display){var i=e.ctx,r=this.getIndexAngle(0),o=Ve.options._parseFont(a);(t.angleLines.display||t.pointLabels.display)&&ti(e),Ve.each(e.ticks,(function(t,s){if(s>0||a.reverse){var l=e.getDistanceFromCenterForValue(e.ticksAsNumbers[s]);if(n.display&&0!==s&&ni(e,n,l,s),a.display){var d=Ra(a.fontColor,Ne.global.defaultFontColor);if(i.font=o.string,i.save(),i.translate(e.xCenter,e.yCenter),i.rotate(r),a.showLabelBackdrop){var u=i.measureText(t).width;i.fillStyle=a.backdropColor,i.fillRect(-u/2-a.backdropPaddingX,-l-o.size/2-a.backdropPaddingY,u+2*a.backdropPaddingX,o.size+2*a.backdropPaddingY)}i.textAlign="center",i.textBaseline="middle",i.fillStyle=d,i.fillText(t,0,-l),i.restore()}}}))}}}),ri=Ja;ii._defaults=ri;var oi=Ve.valueOrDefault,si=Number.MIN_SAFE_INTEGER||-9007199254740991,li=Number.MAX_SAFE_INTEGER||9007199254740991,di={millisecond:{common:!0,size:1,steps:[1,2,5,10,20,50,100,250,500]},second:{common:!0,size:1e3,steps:[1,2,5,10,15,30]},minute:{common:!0,size:6e4,steps:[1,2,5,10,15,30]},hour:{common:!0,size:36e5,steps:[1,2,3,6,12]},day:{common:!0,size:864e5,steps:[1,2,5]},week:{common:!1,size:6048e5,steps:[1,2,3,4]},month:{common:!0,size:2628e6,steps:[1,2,3]},quarter:{common:!1,size:7884e6,steps:[1,2,3,4]},year:{common:!0,size:3154e7}},ui=Object.keys(di);function ci(e,t){return e-t}function hi(e){var t,n,a,i={},r=[];for(t=0,n=e.length;t<n;++t)a=e[t],i[a]||(i[a]=!0,r.push(a));return r}function fi(e,t,n,a){if("linear"===a||!e.length)return[{time:t,pos:0},{time:n,pos:1}];var i,r,o,s,l,d=[],u=[t];for(i=0,r=e.length;i<r;++i)s=e[i],s>t&&s<n&&u.push(s);for(u.push(n),i=0,r=u.length;i<r;++i)l=u[i+1],o=u[i-1],s=u[i],void 0!==o&&void 0!==l&&Math.round((l+o)/2)===s||d.push({time:s,pos:i/(r-1)});return d}function mi(e,t,n){var a,i,r,o=0,s=e.length-1;while(o>=0&&o<=s){if(a=o+s>>1,i=e[a-1]||null,r=e[a],!i)return{lo:null,hi:r};if(r[t]<n)o=a+1;else{if(!(i[t]>n))return{lo:i,hi:r};s=a-1}}return{lo:r,hi:null}}function pi(e,t,n,a){var i=mi(e,t,n),r=i.lo?i.hi?i.lo:e[e.length-2]:e[0],o=i.lo?i.hi?i.hi:e[e.length-1]:e[1],s=o[t]-r[t],l=s?(n-r[t])/s:0,d=(o[a]-r[a])*l;return r[a]+d}function _i(e,t){var n=e._adapter,a=e.options.time,i=a.parser,r=i||a.format,o=t;return"function"===typeof i&&(o=i(o)),Ve.isFinite(o)||(o="string"===typeof r?n.parse(o,r):n.parse(o)),null!==o?+o:(i||"function"!==typeof r||(o=r(t),Ve.isFinite(o)||(o=n.parse(o))),o)}function gi(e,t){if(Ve.isNullOrUndef(t))return null;var n=e.options.time,a=_i(e,e.getRightValue(t));return null===a||n.round&&(a=+e._adapter.startOf(a,n.round)),a}function yi(e,t,n,a){var i,r,o,s=t-e,l=di[n],d=l.size,u=l.steps;if(!u)return Math.ceil(s/(a*d));for(i=0,r=u.length;i<r;++i)if(o=u[i],Math.ceil(s/(d*o))<=a)break;return o}function vi(e,t,n,a){var i,r,o,s=ui.length;for(i=ui.indexOf(e);i<s-1;++i)if(r=di[ui[i]],o=r.steps?r.steps[r.steps.length-1]:li,r.common&&Math.ceil((n-t)/(o*r.size))<=a)return ui[i];return ui[s-1]}function bi(e,t,n,a,i){var r,o,s=ui.length;for(r=s-1;r>=ui.indexOf(n);r--)if(o=ui[r],di[o].common&&e._adapter.diff(i,a,o)>=t.length)return o;return ui[n?ui.indexOf(n):0]}function Mi(e){for(var t=ui.indexOf(e)+1,n=ui.length;t<n;++t)if(di[ui[t]].common)return ui[t]}function Li(e,t,n,a){var i,r=e._adapter,o=e.options,s=o.time,l=s.unit||vi(s.minUnit,t,n,a),d=Mi(l),u=oi(s.stepSize,s.unitStepSize),c="week"===l&&s.isoWeekday,h=o.ticks.major.enabled,f=di[l],m=t,p=n,_=[];for(u||(u=yi(t,n,l,a)),c&&(m=+r.startOf(m,"isoWeek",c),p=+r.startOf(p,"isoWeek",c)),m=+r.startOf(m,c?"day":l),p=+r.startOf(p,c?"day":l),p<n&&(p=+r.add(p,1,l)),i=m,h&&d&&!c&&!s.round&&(i=+r.startOf(i,d),i=+r.add(i,~~((m-i)/(f.size*u))*u,l));i<p;i=+r.add(i,u,l))_.push(+i);return _.push(+i),_}function ki(e,t,n,a,i){var r,o,s=0,l=0;return i.offset&&t.length&&(i.time.min||(r=pi(e,"time",t[0],"pos"),s=1===t.length?1-r:(pi(e,"time",t[1],"pos")-r)/2),i.time.max||(o=pi(e,"time",t[t.length-1],"pos"),l=1===t.length?o:(o-pi(e,"time",t[t.length-2],"pos"))/2)),{start:s,end:l}}function wi(e,t,n){var a,i,r,o,s=[];for(a=0,i=t.length;a<i;++a)r=t[a],o=!!n&&r===+e._adapter.startOf(r,n),s.push({value:r,major:o});return s}var xi={position:"bottom",distribution:"linear",bounds:"data",adapters:{},time:{parser:!1,format:!1,unit:!1,round:!1,displayFormat:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{autoSkip:!1,source:"auto",major:{enabled:!1}}},Yi=Ya.extend({initialize:function(){this.mergeTicksOptions(),Ya.prototype.initialize.call(this)},update:function(){var e=this,t=e.options,n=t.time||(t.time={}),a=e._adapter=new va._date(t.adapters.date);return n.format&&console.warn("options.time.format is deprecated and replaced by options.time.parser."),Ve.mergeIf(n.displayFormats,a.formats()),Ya.prototype.update.apply(e,arguments)},getRightValue:function(e){return e&&void 0!==e.t&&(e=e.t),Ya.prototype.getRightValue.call(this,e)},determineDataLimits:function(){var e,t,n,a,i,r,o=this,s=o.chart,l=o._adapter,d=o.options.time,u=d.unit||"day",c=li,h=si,f=[],m=[],p=[],_=s.data.labels||[];for(e=0,n=_.length;e<n;++e)p.push(gi(o,_[e]));for(e=0,n=(s.data.datasets||[]).length;e<n;++e)if(s.isDatasetVisible(e))if(i=s.data.datasets[e].data,Ve.isObject(i[0]))for(m[e]=[],t=0,a=i.length;t<a;++t)r=gi(o,i[t]),f.push(r),m[e][t]=r;else{for(t=0,a=p.length;t<a;++t)f.push(p[t]);m[e]=p.slice(0)}else m[e]=[];p.length&&(p=hi(p).sort(ci),c=Math.min(c,p[0]),h=Math.max(h,p[p.length-1])),f.length&&(f=hi(f).sort(ci),c=Math.min(c,f[0]),h=Math.max(h,f[f.length-1])),c=gi(o,d.min)||c,h=gi(o,d.max)||h,c=c===li?+l.startOf(Date.now(),u):c,h=h===si?+l.endOf(Date.now(),u)+1:h,o.min=Math.min(c,h),o.max=Math.max(c+1,h),o._horizontal=o.isHorizontal(),o._table=[],o._timestamps={data:f,datasets:m,labels:p}},buildTicks:function(){var e,t,n,a=this,i=a.min,r=a.max,o=a.options,s=o.time,l=[],d=[];switch(o.ticks.source){case"data":l=a._timestamps.data;break;case"labels":l=a._timestamps.labels;break;case"auto":default:l=Li(a,i,r,a.getLabelCapacity(i),o)}for("ticks"===o.bounds&&l.length&&(i=l[0],r=l[l.length-1]),i=gi(a,s.min)||i,r=gi(a,s.max)||r,e=0,t=l.length;e<t;++e)n=l[e],n>=i&&n<=r&&d.push(n);return a.min=i,a.max=r,a._unit=s.unit||bi(a,d,s.minUnit,a.min,a.max),a._majorUnit=Mi(a._unit),a._table=fi(a._timestamps.data,i,r,o.distribution),a._offsets=ki(a._table,d,i,r,o),o.ticks.reverse&&d.reverse(),wi(a,d,a._majorUnit)},getLabelForIndex:function(e,t){var n=this,a=n._adapter,i=n.chart.data,r=n.options.time,o=i.labels&&e<i.labels.length?i.labels[e]:"",s=i.datasets[t].data[e];return Ve.isObject(s)&&(o=n.getRightValue(s)),r.tooltipFormat?a.format(_i(n,o),r.tooltipFormat):"string"===typeof o?o:a.format(_i(n,o),r.displayFormats.datetime)},tickFormatFunction:function(e,t,n,a){var i=this,r=i._adapter,o=i.options,s=o.time.displayFormats,l=s[i._unit],d=i._majorUnit,u=s[d],c=+r.startOf(e,d),h=o.ticks.major,f=h.enabled&&d&&u&&e===c,m=r.format(e,a||(f?u:l)),p=f?h:o.ticks.minor,_=oi(p.callback,p.userCallback);return _?_(m,t,n):m},convertTicksToLabels:function(e){var t,n,a=[];for(t=0,n=e.length;t<n;++t)a.push(this.tickFormatFunction(e[t].value,t,e));return a},getPixelForOffset:function(e){var t=this,n=t.options.ticks.reverse,a=t._horizontal?t.width:t.height,i=t._horizontal?n?t.right:t.left:n?t.bottom:t.top,r=pi(t._table,"time",e,"pos"),o=a*(t._offsets.start+r)/(t._offsets.start+1+t._offsets.end);return n?i-o:i+o},getPixelForValue:function(e,t,n){var a=this,i=null;if(void 0!==t&&void 0!==n&&(i=a._timestamps.datasets[n][t]),null===i&&(i=gi(a,e)),null!==i)return a.getPixelForOffset(i)},getPixelForTick:function(e){var t=this.getTicks();return e>=0&&e<t.length?this.getPixelForOffset(t[e].value):null},getValueForPixel:function(e){var t=this,n=t._horizontal?t.width:t.height,a=t._horizontal?t.left:t.top,i=(n?(e-a)/n:0)*(t._offsets.start+1+t._offsets.start)-t._offsets.end,r=pi(t._table,"pos",i,"time");return t._adapter._create(r)},getLabelWidth:function(e){var t=this,n=t.options.ticks,a=t.ctx.measureText(e).width,i=Ve.toRadians(n.maxRotation),r=Math.cos(i),o=Math.sin(i),s=oi(n.fontSize,Ne.global.defaultFontSize);return a*r+s*o},getLabelCapacity:function(e){var t=this,n=t.options.time.displayFormats.millisecond,a=t.tickFormatFunction(e,0,[],n),i=t.getLabelWidth(a),r=t.isHorizontal()?t.width:t.height,o=Math.floor(r/i);return o>0?o:1}}),Si=xi;Yi._defaults=Si;var Di={category:Da,linear:Aa,logarithmic:Na,radialLinear:ii,time:Yi},Ti={datetime:"MMM D, YYYY, h:mm:ss a",millisecond:"h:mm:ss.SSS a",second:"h:mm:ss a",minute:"h:mm a",hour:"hA",day:"MMM D",week:"ll",month:"MMM YYYY",quarter:"[Q]Q - YYYY",year:"YYYY"};va._date.override("function"===typeof e?{_id:"moment",formats:function(){return Ti},parse:function(t,n){return"string"===typeof t&&"string"===typeof n?t=e(t,n):t instanceof e||(t=e(t)),t.isValid()?t.valueOf():null},format:function(t,n){return e(t).format(n)},add:function(t,n,a){return e(t).add(n,a).valueOf()},diff:function(t,n,a){return e.duration(e(t).diff(e(n))).as(a)},startOf:function(t,n,a){return t=e(t),"isoWeek"===n?t.isoWeekday(a).valueOf():t.startOf(n).valueOf()},endOf:function(t,n){return e(t).endOf(n).valueOf()},_create:function(t){return e(t)}}:{}),Ne._set("global",{plugins:{filler:{propagate:!0}}});var Hi={dataset:function(e){var t=e.fill,n=e.chart,a=n.getDatasetMeta(t),i=a&&n.isDatasetVisible(t),r=i&&a.dataset._children||[],o=r.length||0;return o?function(e,t){return t<o&&r[t]._view||null}:null},boundary:function(e){var t=e.boundary,n=t?t.x:null,a=t?t.y:null;return function(e){return{x:null===n?e.x:n,y:null===a?e.y:a}}}};function Ci(e,t,n){var a,i=e._model||{},r=i.fill;if(void 0===r&&(r=!!i.backgroundColor),!1===r||null===r)return!1;if(!0===r)return"origin";if(a=parseFloat(r,10),isFinite(a)&&Math.floor(a)===a)return"-"!==r[0]&&"+"!==r[0]||(a=t+a),!(a===t||a<0||a>=n)&&a;switch(r){case"bottom":return"start";case"top":return"end";case"zero":return"origin";case"origin":case"start":case"end":return r;default:return!1}}function Oi(e){var t,n=e.el._model||{},a=e.el._scale||{},i=e.fill,r=null;if(isFinite(i))return null;if("start"===i?r=void 0===n.scaleBottom?a.bottom:n.scaleBottom:"end"===i?r=void 0===n.scaleTop?a.top:n.scaleTop:void 0!==n.scaleZero?r=n.scaleZero:a.getBasePosition?r=a.getBasePosition():a.getBasePixel&&(r=a.getBasePixel()),void 0!==r&&null!==r){if(void 0!==r.x&&void 0!==r.y)return r;if(Ve.isFinite(r))return t=a.isHorizontal(),{x:t?r:null,y:t?null:r}}return null}function ji(e,t,n){var a,i=e[t],r=i.fill,o=[t];if(!n)return r;while(!1!==r&&-1===o.indexOf(r)){if(!isFinite(r))return r;if(a=e[r],!a)return!1;if(a.visible)return r;o.push(r),r=a.fill}return!1}function Pi(e){var t=e.fill,n="dataset";return!1===t?null:(isFinite(t)||(n="boundary"),Hi[n](e))}function Ai(e){return e&&!e.skip}function Ei(e,t,n,a,i){var r;if(a&&i){for(e.moveTo(t[0].x,t[0].y),r=1;r<a;++r)Ve.canvas.lineTo(e,t[r-1],t[r]);for(e.lineTo(n[i-1].x,n[i-1].y),r=i-1;r>0;--r)Ve.canvas.lineTo(e,n[r],n[r-1],!0)}}function Ii(e,t,n,a,i,r){var o,s,l,d,u,c,h,f=t.length,m=a.spanGaps,p=[],_=[],g=0,y=0;for(e.beginPath(),o=0,s=f+!!r;o<s;++o)l=o%f,d=t[l]._view,u=n(d,l,a),c=Ai(d),h=Ai(u),c&&h?(g=p.push(d),y=_.push(u)):g&&y&&(m?(c&&p.push(d),h&&_.push(u)):(Ei(e,p,_,g,y),g=y=0,p=[],_=[]));Ei(e,p,_,g,y),e.closePath(),e.fillStyle=i,e.fill()}var Bi={id:"filler",afterDatasetsUpdate:function(e,t){var n,a,i,r,o=(e.data.datasets||[]).length,s=t.propagate,l=[];for(a=0;a<o;++a)n=e.getDatasetMeta(a),i=n.dataset,r=null,i&&i._model&&i instanceof xt.Line&&(r={visible:e.isDatasetVisible(a),fill:Ci(i,a,o),chart:e,el:i}),n.$filler=r,l.push(r);for(a=0;a<o;++a)r=l[a],r&&(r.fill=ji(l,a,s),r.boundary=Oi(r),r.mapper=Pi(r))},beforeDatasetDraw:function(e,t){var n=t.meta.$filler;if(n){var a=e.ctx,i=n.el,r=i._view,o=i._children||[],s=n.mapper,l=r.backgroundColor||Ne.global.defaultColor;s&&l&&o.length&&(Ve.canvas.clipArea(a,e.chartArea),Ii(a,o,s,r,l,i._loop),Ve.canvas.unclipArea(a))}}},Wi=Ve.noop,Fi=Ve.valueOrDefault;function Ni(e,t){return e.usePointStyle&&e.boxWidth>t?t:e.boxWidth}Ne._set("global",{legend:{display:!0,position:"top",fullWidth:!0,reverse:!1,weight:1e3,onClick:function(e,t){var n=t.datasetIndex,a=this.chart,i=a.getDatasetMeta(n);i.hidden=null===i.hidden?!a.data.datasets[n].hidden:null,a.update()},onHover:null,onLeave:null,labels:{boxWidth:40,padding:10,generateLabels:function(e){var t=e.data;return Ve.isArray(t.datasets)?t.datasets.map((function(t,n){return{text:t.label,fillStyle:Ve.isArray(t.backgroundColor)?t.backgroundColor[0]:t.backgroundColor,hidden:!e.isDatasetVisible(n),lineCap:t.borderCapStyle,lineDash:t.borderDash,lineDashOffset:t.borderDashOffset,lineJoin:t.borderJoinStyle,lineWidth:t.borderWidth,strokeStyle:t.borderColor,pointStyle:t.pointStyle,datasetIndex:n}}),this):[]}}},legendCallback:function(e){var t=[];t.push('<ul class="'+e.id+'-legend">');for(var n=0;n<e.data.datasets.length;n++)t.push('<li><span style="background-color:'+e.data.datasets[n].backgroundColor+'"></span>'),e.data.datasets[n].label&&t.push(e.data.datasets[n].label),t.push("</li>");return t.push("</ul>"),t.join("")}});var zi=Ke.extend({initialize:function(e){Ve.extend(this,e),this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1},beforeUpdate:Wi,update:function(e,t,n){var a=this;return a.beforeUpdate(),a.maxWidth=e,a.maxHeight=t,a.margins=n,a.beforeSetDimensions(),a.setDimensions(),a.afterSetDimensions(),a.beforeBuildLabels(),a.buildLabels(),a.afterBuildLabels(),a.beforeFit(),a.fit(),a.afterFit(),a.afterUpdate(),a.minSize},afterUpdate:Wi,beforeSetDimensions:Wi,setDimensions:function(){var e=this;e.isHorizontal()?(e.width=e.maxWidth,e.left=0,e.right=e.width):(e.height=e.maxHeight,e.top=0,e.bottom=e.height),e.paddingLeft=0,e.paddingTop=0,e.paddingRight=0,e.paddingBottom=0,e.minSize={width:0,height:0}},afterSetDimensions:Wi,beforeBuildLabels:Wi,buildLabels:function(){var e=this,t=e.options.labels||{},n=Ve.callback(t.generateLabels,[e.chart],e)||[];t.filter&&(n=n.filter((function(n){return t.filter(n,e.chart.data)}))),e.options.reverse&&n.reverse(),e.legendItems=n},afterBuildLabels:Wi,beforeFit:Wi,fit:function(){var e=this,t=e.options,n=t.labels,a=t.display,i=e.ctx,r=Ve.options._parseFont(n),o=r.size,s=e.legendHitBoxes=[],l=e.minSize,d=e.isHorizontal();if(d?(l.width=e.maxWidth,l.height=a?10:0):(l.width=a?10:0,l.height=e.maxHeight),a)if(i.font=r.string,d){var u=e.lineWidths=[0],c=0;i.textAlign="left",i.textBaseline="top",Ve.each(e.legendItems,(function(e,t){var a=Ni(n,o),r=a+o/2+i.measureText(e.text).width;(0===t||u[u.length-1]+r+n.padding>l.width)&&(c+=o+n.padding,u[u.length-(t>0?0:1)]=n.padding),s[t]={left:0,top:0,width:r,height:o},u[u.length-1]+=r+n.padding})),l.height+=c}else{var h=n.padding,f=e.columnWidths=[],m=n.padding,p=0,_=0,g=o+h;Ve.each(e.legendItems,(function(e,t){var a=Ni(n,o),r=a+o/2+i.measureText(e.text).width;t>0&&_+g>l.height-h&&(m+=p+n.padding,f.push(p),p=0,_=0),p=Math.max(p,r),_+=g,s[t]={left:0,top:0,width:r,height:o}})),m+=p,f.push(p),l.width+=m}e.width=l.width,e.height=l.height},afterFit:Wi,isHorizontal:function(){return"top"===this.options.position||"bottom"===this.options.position},draw:function(){var e=this,t=e.options,n=t.labels,a=Ne.global,i=a.defaultColor,r=a.elements.line,o=e.width,s=e.lineWidths;if(t.display){var l,d=e.ctx,u=Fi(n.fontColor,a.defaultFontColor),c=Ve.options._parseFont(n),h=c.size;d.textAlign="left",d.textBaseline="middle",d.lineWidth=.5,d.strokeStyle=u,d.fillStyle=u,d.font=c.string;var f=Ni(n,h),m=e.legendHitBoxes,p=function(e,n,a){if(!(isNaN(f)||f<=0)){d.save();var o=Fi(a.lineWidth,r.borderWidth);if(d.fillStyle=Fi(a.fillStyle,i),d.lineCap=Fi(a.lineCap,r.borderCapStyle),d.lineDashOffset=Fi(a.lineDashOffset,r.borderDashOffset),d.lineJoin=Fi(a.lineJoin,r.borderJoinStyle),d.lineWidth=o,d.strokeStyle=Fi(a.strokeStyle,i),d.setLineDash&&d.setLineDash(Fi(a.lineDash,r.borderDash)),t.labels&&t.labels.usePointStyle){var s=f*Math.SQRT2/2,l=e+f/2,u=n+h/2;Ve.canvas.drawPoint(d,a.pointStyle,s,l,u)}else 0!==o&&d.strokeRect(e,n,f,h),d.fillRect(e,n,f,h);d.restore()}},_=function(e,t,n,a){var i=h/2,r=f+i+e,o=t+i;d.fillText(n.text,r,o),n.hidden&&(d.beginPath(),d.lineWidth=2,d.moveTo(r,o),d.lineTo(r+a,o),d.stroke())},g=e.isHorizontal();l=g?{x:e.left+(o-s[0])/2+n.padding,y:e.top+n.padding,line:0}:{x:e.left+n.padding,y:e.top+n.padding,line:0};var y=h+n.padding;Ve.each(e.legendItems,(function(t,a){var i=d.measureText(t.text).width,r=f+h/2+i,u=l.x,c=l.y;g?a>0&&u+r+n.padding>e.left+e.minSize.width&&(c=l.y+=y,l.line++,u=l.x=e.left+(o-s[l.line])/2+n.padding):a>0&&c+y>e.top+e.minSize.height&&(u=l.x=u+e.columnWidths[l.line]+n.padding,c=l.y=e.top+n.padding,l.line++),p(u,c,t),m[a].left=u,m[a].top=c,_(u,c,t,i),g?l.x+=r+n.padding:l.y+=y}))}},_getLegendItemAt:function(e,t){var n,a,i,r=this;if(e>=r.left&&e<=r.right&&t>=r.top&&t<=r.bottom)for(i=r.legendHitBoxes,n=0;n<i.length;++n)if(a=i[n],e>=a.left&&e<=a.left+a.width&&t>=a.top&&t<=a.top+a.height)return r.legendItems[n];return null},handleEvent:function(e){var t,n=this,a=n.options,i="mouseup"===e.type?"click":e.type;if("mousemove"===i){if(!a.onHover&&!a.onLeave)return}else{if("click"!==i)return;if(!a.onClick)return}t=n._getLegendItemAt(e.x,e.y),"click"===i?t&&a.onClick&&a.onClick.call(n,e.native,t):(a.onLeave&&t!==n._hoveredItem&&(n._hoveredItem&&a.onLeave.call(n,e.native,n._hoveredItem),n._hoveredItem=t),a.onHover&&t&&a.onHover.call(n,e.native,t))}});function Ri(e,t){var n=new zi({ctx:e.ctx,options:t,chart:e});fn.configure(e,n,t),fn.addBox(e,n),e.legend=n}var $i={id:"legend",_element:zi,beforeInit:function(e){var t=e.options.legend;t&&Ri(e,t)},beforeUpdate:function(e){var t=e.options.legend,n=e.legend;t?(Ve.mergeIf(t,Ne.global.legend),n?(fn.configure(e,n,t),n.options=t):Ri(e,t)):n&&(fn.removeBox(e,n),delete e.legend)},afterEvent:function(e,t){var n=e.legend;n&&n.handleEvent(t)}},Vi=Ve.noop;Ne._set("global",{title:{display:!1,fontStyle:"bold",fullWidth:!0,padding:10,position:"top",text:"",weight:2e3}});var Ji=Ke.extend({initialize:function(e){var t=this;Ve.extend(t,e),t.legendHitBoxes=[]},beforeUpdate:Vi,update:function(e,t,n){var a=this;return a.beforeUpdate(),a.maxWidth=e,a.maxHeight=t,a.margins=n,a.beforeSetDimensions(),a.setDimensions(),a.afterSetDimensions(),a.beforeBuildLabels(),a.buildLabels(),a.afterBuildLabels(),a.beforeFit(),a.fit(),a.afterFit(),a.afterUpdate(),a.minSize},afterUpdate:Vi,beforeSetDimensions:Vi,setDimensions:function(){var e=this;e.isHorizontal()?(e.width=e.maxWidth,e.left=0,e.right=e.width):(e.height=e.maxHeight,e.top=0,e.bottom=e.height),e.paddingLeft=0,e.paddingTop=0,e.paddingRight=0,e.paddingBottom=0,e.minSize={width:0,height:0}},afterSetDimensions:Vi,beforeBuildLabels:Vi,buildLabels:Vi,afterBuildLabels:Vi,beforeFit:Vi,fit:function(){var e=this,t=e.options,n=t.display,a=e.minSize,i=Ve.isArray(t.text)?t.text.length:1,r=Ve.options._parseFont(t),o=n?i*r.lineHeight+2*t.padding:0;e.isHorizontal()?(a.width=e.maxWidth,a.height=o):(a.width=o,a.height=e.maxHeight),e.width=a.width,e.height=a.height},afterFit:Vi,isHorizontal:function(){var e=this.options.position;return"top"===e||"bottom"===e},draw:function(){var e=this,t=e.ctx,n=e.options;if(n.display){var a,i,r,o=Ve.options._parseFont(n),s=o.lineHeight,l=s/2+n.padding,d=0,u=e.top,c=e.left,h=e.bottom,f=e.right;t.fillStyle=Ve.valueOrDefault(n.fontColor,Ne.global.defaultFontColor),t.font=o.string,e.isHorizontal()?(i=c+(f-c)/2,r=u+l,a=f-c):(i="left"===n.position?c+l:f-l,r=u+(h-u)/2,a=h-u,d=Math.PI*("left"===n.position?-.5:.5)),t.save(),t.translate(i,r),t.rotate(d),t.textAlign="center",t.textBaseline="middle";var m=n.text;if(Ve.isArray(m))for(var p=0,_=0;_<m.length;++_)t.fillText(m[_],0,p,a),p+=s;else t.fillText(m,0,0,a);t.restore()}}});function Ui(e,t){var n=new Ji({ctx:e.ctx,options:t,chart:e});fn.configure(e,n,t),fn.addBox(e,n),e.titleBlock=n}var Gi={id:"title",_element:Ji,beforeInit:function(e){var t=e.options.title;t&&Ui(e,t)},beforeUpdate:function(e){var t=e.options.title,n=e.titleBlock;t?(Ve.mergeIf(t,Ne.global.title),n?(fn.configure(e,n,t),n.options=t):Ui(e,t)):n&&(fn.removeBox(e,n),delete e.titleBlock)}},qi={},Xi=Bi,Ki=$i,Zi=Gi;for(var Qi in qi.filler=Xi,qi.legend=Ki,qi.title=Zi,ma.helpers=Ve,pa(ma),ma._adapters=va,ma.Animation=Qe,ma.animationService=et,ma.controllers=en,ma.DatasetController=ot,ma.defaults=Ne,ma.Element=Ke,ma.elements=xt,ma.Interaction=ln,ma.layouts=fn,ma.platform=$n,ma.plugins=Vn,ma.Scale=Ya,ma.scaleService=Jn,ma.Ticks=ba,ma.Tooltip=oa,ma.helpers.each(Di,(function(e,t){ma.scaleService.registerScaleType(t,e,e._defaults)})),qi)qi.hasOwnProperty(Qi)&&ma.plugins.register(qi[Qi]);ma.platform.initialize();var er=ma;return"undefined"!==typeof window&&(window.Chart=ma),ma.Chart=ma,ma.Legend=qi.legend._element,ma.Title=qi.title._element,ma.pluginService=ma.plugins,ma.PluginBase=ma.Element.extend({}),ma.canvasHelpers=ma.helpers.canvas,ma.layoutService=ma.layouts,ma.LinearScaleBase=ja,ma.helpers.each(["Bar","Bubble","Doughnut","Line","PolarArea","Radar","Scatter"],(function(e){ma[e]=function(t,n){return new ma(t,ma.helpers.merge(n||{},{type:e.charAt(0).toLowerCase()+e.slice(1)}))}})),er}))},3187:function(e,t,n){"use strict";var a=n("a4e1"),i=n.n(a);i.a},3300:function(e,t,n){"use strict";var a=n("4e9b"),i=n.n(a);i.a},"34bc":function(e,t,n){},"35a1":function(e,t,n){var a=n("f5df"),i=n("3f8c"),r=n("b622"),o=r("iterator");e.exports=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[a(e)]}},"37e8":function(e,t,n){var a=n("83ab"),i=n("9bf2"),r=n("825a"),o=n("df75");e.exports=a?Object.defineProperties:function(e,t){r(e);var n,a=o(t),s=a.length,l=0;while(s>l)i.f(e,n=a[l++],t[n]);return e}},3886:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n}});return t}))},"39a6":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n},week:{dow:1,doy:4}});return t}))},"39bd":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},n={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};function a(e,t,n,a){var i="";if(t)switch(n){case"s":i="काही सेकंद";break;case"ss":i="%d सेकंद";break;case"m":i="एक मिनिट";break;case"mm":i="%d मिनिटे";break;case"h":i="एक तास";break;case"hh":i="%d तास";break;case"d":i="एक दिवस";break;case"dd":i="%d दिवस";break;case"M":i="एक महिना";break;case"MM":i="%d महिने";break;case"y":i="एक वर्ष";break;case"yy":i="%d वर्षे";break}else switch(n){case"s":i="काही सेकंदां";break;case"ss":i="%d सेकंदां";break;case"m":i="एका मिनिटा";break;case"mm":i="%d मिनिटां";break;case"h":i="एका तासा";break;case"hh":i="%d तासां";break;case"d":i="एका दिवसा";break;case"dd":i="%d दिवसां";break;case"M":i="एका महिन्या";break;case"MM":i="%d महिन्यां";break;case"y":i="एका वर्षा";break;case"yy":i="%d वर्षां";break}return i.replace(/%d/i,e)}var i=e.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm वाजता",LLLL:"dddd, D MMMM YYYY, A h:mm वाजता"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%sमध्ये",past:"%sपूर्वी",s:a,ss:a,m:a,mm:a,h:a,hh:a,d:a,dd:a,M:a,MM:a,y:a,yy:a},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(e,t){return 12===e&&(e=0),"रात्री"===t?e<4?e:e+12:"सकाळी"===t?e:"दुपारी"===t?e>=10?e:e+12:"सायंकाळी"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"रात्री":e<10?"सकाळी":e<17?"दुपारी":e<20?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}});return i}))},"3a39":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},n={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},a=e.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),monthsParseExact:!0,weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आ._सो._मं._बु._बि._शु._श.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, Aको h:mm बजे",LLLL:"dddd, D MMMM YYYY, Aको h:mm बजे"},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/राति|बिहान|दिउँसो|साँझ/,meridiemHour:function(e,t){return 12===e&&(e=0),"राति"===t?e<4?e:e+12:"बिहान"===t?e:"दिउँसो"===t?e>=10?e:e+12:"साँझ"===t?e+12:void 0},meridiem:function(e,t,n){return e<3?"राति":e<12?"बिहान":e<16?"दिउँसो":e<20?"साँझ":"राति"},calendar:{sameDay:"[आज] LT",nextDay:"[भोलि] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडि",s:"केही क्षण",ss:"%d सेकेण्ड",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:0,doy:6}});return a}))},"3a3c":function(e,t,n){"use strict";n.d(t,"b",(function(){return r}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:e.wrapperClasses,style:{maxHeight:e.maxHeight}},[n(e.tag,{tag:"component",class:e.tableClasses,style:e.tableStyle},[e._t("default")],2)],1)},i=[],r=(n("c7cd"),{props:{autoWidth:{type:Boolean,default:!1},bordered:{type:Boolean,default:!1},borderless:{type:Boolean,default:!1},btn:{type:Boolean,default:!1},dark:{type:Boolean,default:!1},datatable:{type:Boolean,default:!1},dtScrollY:{type:Boolean,default:!1},fixed:{type:Boolean,default:!1},hover:{type:Boolean,default:!1},responsive:{type:Boolean,default:!1},responsiveSm:{type:Boolean,default:!1},responsiveMd:{type:Boolean,default:!1},responsiveLg:{type:Boolean,default:!1},responsiveXl:{type:Boolean,default:!1},scrollY:{type:Boolean,defautl:!1},sm:{type:Boolean,default:!1},striped:{type:Boolean,default:!1},tag:{type:String,default:"table"},maxHeight:{type:String},tableStyle:{type:String},mdbScroll:{type:Boolean,default:!1}},computed:{wrapperClasses:function(){return[this.dark&&"table-dark",this.dtScrollY&&"dataTables-scrollBody",this.responsive&&"table-responsive",this.responsiveSm&&"table-responsive-sm",this.responsiveMd&&"table-responsive-md",this.responsiveLg&&"table-responsive-lg",this.responsiveXl&&"table-responsive-xl",this.scrollY&&"table-wrapper-scroll-y"]},tableClasses:function(){return["table",this.autoWidth&&"w-auto",this.bordered&&"table-bordered",this.borderless&&"table-borderless",this.btn&&"btn-table",this.datatable&&"dataTable",this.fixed&&"table-fixed",this.hover&&"table-hover",this.sm&&"table-sm",this.striped&&"table-striped"]}}}),o=r,s=o,l=(n("ccef"),n("2877")),d=Object(l["a"])(s,a,i,!1,null,"39ccf35b",null);t["a"]=d.exports},"3b1b":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={0:"-ум",1:"-ум",2:"-юм",3:"-юм",4:"-ум",5:"-ум",6:"-ум",7:"-ум",8:"-ум",9:"-ум",10:"-ум",12:"-ум",13:"-ум",20:"-ум",30:"-юм",40:"-ум",50:"-ум",60:"-ум",70:"-ум",80:"-ум",90:"-ум",100:"-ум"},n=e.defineLocale("tg",{months:"январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"якшанбе_душанбе_сешанбе_чоршанбе_панҷшанбе_ҷумъа_шанбе".split("_"),weekdaysShort:"яшб_дшб_сшб_чшб_пшб_ҷум_шнб".split("_"),weekdaysMin:"яш_дш_сш_чш_пш_ҷм_шб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Имрӯз соати] LT",nextDay:"[Пагоҳ соати] LT",lastDay:"[Дирӯз соати] LT",nextWeek:"dddd[и] [ҳафтаи оянда соати] LT",lastWeek:"dddd[и] [ҳафтаи гузашта соати] LT",sameElse:"L"},relativeTime:{future:"баъди %s",past:"%s пеш",s:"якчанд сония",m:"як дақиқа",mm:"%d дақиқа",h:"як соат",hh:"%d соат",d:"як рӯз",dd:"%d рӯз",M:"як моҳ",MM:"%d моҳ",y:"як сол",yy:"%d сол"},meridiemParse:/шаб|субҳ|рӯз|бегоҳ/,meridiemHour:function(e,t){return 12===e&&(e=0),"шаб"===t?e<4?e:e+12:"субҳ"===t?e:"рӯз"===t?e>=11?e:e+12:"бегоҳ"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"шаб":e<11?"субҳ":e<16?"рӯз":e<19?"бегоҳ":"шаб"},dayOfMonthOrdinalParse:/\d{1,2}-(ум|юм)/,ordinal:function(e){var n=e%10,a=e>=100?100:null;return e+(t[e]||t[n]||t[a])},week:{dow:1,doy:7}});return n}))},"3bbe":function(e,t,n){var a=n("861d");e.exports=function(e){if(!a(e)&&null!==e)throw TypeError("Can't set "+String(e)+" as a prototype");return e}},"3c0d":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),n="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"),a=[/^led/i,/^úno/i,/^bře/i,/^dub/i,/^kvě/i,/^(čvn|červen$|června)/i,/^(čvc|červenec|července)/i,/^srp/i,/^zář/i,/^říj/i,/^lis/i,/^pro/i],i=/^(leden|únor|březen|duben|květen|červenec|července|červen|června|srpen|září|říjen|listopad|prosinec|led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i;function r(e){return e>1&&e<5&&1!==~~(e/10)}function o(e,t,n,a){var i=e+" ";switch(n){case"s":return t||a?"pár sekund":"pár sekundami";case"ss":return t||a?i+(r(e)?"sekundy":"sekund"):i+"sekundami";case"m":return t?"minuta":a?"minutu":"minutou";case"mm":return t||a?i+(r(e)?"minuty":"minut"):i+"minutami";case"h":return t?"hodina":a?"hodinu":"hodinou";case"hh":return t||a?i+(r(e)?"hodiny":"hodin"):i+"hodinami";case"d":return t||a?"den":"dnem";case"dd":return t||a?i+(r(e)?"dny":"dní"):i+"dny";case"M":return t||a?"měsíc":"měsícem";case"MM":return t||a?i+(r(e)?"měsíce":"měsíců"):i+"měsíci";case"y":return t||a?"rok":"rokem";case"yy":return t||a?i+(r(e)?"roky":"let"):i+"lety"}}var s=e.defineLocale("cs",{months:t,monthsShort:n,monthsRegex:i,monthsShortRegex:i,monthsStrictRegex:/^(leden|ledna|února|únor|březen|března|duben|dubna|květen|května|červenec|července|červen|června|srpen|srpna|září|říjen|října|listopadu|listopad|prosinec|prosince)/i,monthsShortStrictRegex:/^(led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i,monthsParse:a,longMonthsParse:a,shortMonthsParse:a,weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm",l:"D. M. YYYY"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:o,ss:o,m:o,mm:o,h:o,hh:o,d:o,dd:o,M:o,MM:o,y:o,yy:o},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return s}))},"3ca3":function(e,t,n){"use strict";var a=n("6547").charAt,i=n("69f3"),r=n("7dd0"),o="String Iterator",s=i.set,l=i.getterFor(o);r(String,"String",(function(e){s(this,{type:o,string:String(e),index:0})}),(function(){var e,t=l(this),n=t.string,i=t.index;return i>=n.length?{value:void 0,done:!0}:(e=a(n,i),t.index+=e.length,{value:e,done:!1})}))},"3de5":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"௧",2:"௨",3:"௩",4:"௪",5:"௫",6:"௬",7:"௭",8:"௮",9:"௯",0:"௦"},n={"௧":"1","௨":"2","௩":"3","௪":"4","௫":"5","௬":"6","௭":"7","௮":"8","௯":"9","௦":"0"},a=e.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, HH:mm",LLLL:"dddd, D MMMM YYYY, HH:mm"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",ss:"%d விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},dayOfMonthOrdinalParse:/\d{1,2}வது/,ordinal:function(e){return e+"வது"},preparse:function(e){return e.replace(/[௧௨௩௪௫௬௭௮௯௦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(e,t,n){return e<2?" யாமம்":e<6?" வைகறை":e<10?" காலை":e<14?" நண்பகல்":e<18?" எற்பாடு":e<22?" மாலை":" யாமம்"},meridiemHour:function(e,t){return 12===e&&(e=0),"யாமம்"===t?e<2?e:e+12:"வைகறை"===t||"காலை"===t||"நண்பகல்"===t&&e>=10?e:e+12},week:{dow:0,doy:6}});return a}))},"3e92":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"೧",2:"೨",3:"೩",4:"೪",5:"೫",6:"೬",7:"೭",8:"೮",9:"೯",0:"೦"},n={"೧":"1","೨":"2","೩":"3","೪":"4","೫":"5","೬":"6","೭":"7","೮":"8","೯":"9","೦":"0"},a=e.defineLocale("kn",{months:"ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್".split("_"),monthsShort:"ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂ_ಅಕ್ಟೋ_ನವೆಂ_ಡಿಸೆಂ".split("_"),monthsParseExact:!0,weekdays:"ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ".split("_"),weekdaysShort:"ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ".split("_"),weekdaysMin:"ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[ಇಂದು] LT",nextDay:"[ನಾಳೆ] LT",nextWeek:"dddd, LT",lastDay:"[ನಿನ್ನೆ] LT",lastWeek:"[ಕೊನೆಯ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ನಂತರ",past:"%s ಹಿಂದೆ",s:"ಕೆಲವು ಕ್ಷಣಗಳು",ss:"%d ಸೆಕೆಂಡುಗಳು",m:"ಒಂದು ನಿಮಿಷ",mm:"%d ನಿಮಿಷ",h:"ಒಂದು ಗಂಟೆ",hh:"%d ಗಂಟೆ",d:"ಒಂದು ದಿನ",dd:"%d ದಿನ",M:"ಒಂದು ತಿಂಗಳು",MM:"%d ತಿಂಗಳು",y:"ಒಂದು ವರ್ಷ",yy:"%d ವರ್ಷ"},preparse:function(e){return e.replace(/[೧೨೩೪೫೬೭೮೯೦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,meridiemHour:function(e,t){return 12===e&&(e=0),"ರಾತ್ರಿ"===t?e<4?e:e+12:"ಬೆಳಿಗ್ಗೆ"===t?e:"ಮಧ್ಯಾಹ್ನ"===t?e>=10?e:e+12:"ಸಂಜೆ"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"ರಾತ್ರಿ":e<10?"ಬೆಳಿಗ್ಗೆ":e<17?"ಮಧ್ಯಾಹ್ನ":e<20?"ಸಂಜೆ":"ರಾತ್ರಿ"},dayOfMonthOrdinalParse:/\d{1,2}(ನೇ)/,ordinal:function(e){return e+"ನೇ"},week:{dow:0,doy:6}});return a}))},"3f2f":function(e,t,n){},"3f8c":function(e,t){e.exports={}},4069:function(e,t,n){var a=n("44d2");a("flat")},4160:function(e,t,n){"use strict";var a=n("23e7"),i=n("17c2");a({target:"Array",proto:!0,forced:[].forEach!=i},{forEach:i})},"423e":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ar-kw",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",ss:"%d ثانية",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:0,doy:12}});return t}))},"428f":function(e,t,n){e.exports=n("da84")},"440c":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n,a){var i={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return t?i[n][0]:i[n][1]}function n(e){var t=e.substr(0,e.indexOf(" "));return i(t)?"a "+e:"an "+e}function a(e){var t=e.substr(0,e.indexOf(" "));return i(t)?"viru "+e:"virun "+e}function i(e){if(e=parseInt(e,10),isNaN(e))return!1;if(e<0)return!0;if(e<10)return 4<=e&&e<=7;if(e<100){var t=e%10,n=e/10;return i(0===t?n:t)}if(e<1e4){while(e>=10)e/=10;return i(e)}return e/=1e3,i(e)}var r=e.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm [Auer]",LLLL:"dddd, D. MMMM YYYY H:mm [Auer]"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:n,past:a,s:"e puer Sekonnen",ss:"%d Sekonnen",m:t,mm:"%d Minutten",h:t,hh:"%d Stonnen",d:t,dd:"%d Deeg",M:t,MM:"%d Méint",y:t,yy:"%d Joer"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return r}))},"44ad":function(e,t,n){var a=n("d039"),i=n("c6b6"),r="".split;e.exports=a((function(){return!Object("z").propertyIsEnumerable(0)}))?function(e){return"String"==i(e)?r.call(e,""):Object(e)}:Object},"44d2":function(e,t,n){var a=n("b622"),i=n("7c73"),r=n("9112"),o=a("unscopables"),s=Array.prototype;void 0==s[o]&&r(s,o,i(null)),e.exports=function(e){s[o][e]=!0}},"44de":function(e,t,n){var a=n("da84");e.exports=function(e,t){var n=a.console;n&&n.error&&(1===arguments.length?n.error(e):n.error(e,t))}},"44e7":function(e,t,n){var a=n("861d"),i=n("c6b6"),r=n("b622"),o=r("match");e.exports=function(e){var t;return a(e)&&(void 0!==(t=e[o])?!!t:"RegExp"==i(e))}},"466d":function(e,t,n){"use strict";var a=n("d784"),i=n("825a"),r=n("50c4"),o=n("1d80"),s=n("8aa5"),l=n("14c3");a("match",1,(function(e,t,n){return[function(t){var n=o(this),a=void 0==t?void 0:t[e];return void 0!==a?a.call(t,n):new RegExp(t)[e](String(n))},function(e){var a=n(t,e,this);if(a.done)return a.value;var o=i(e),d=String(this);if(!o.global)return l(o,d);var u=o.unicode;o.lastIndex=0;var c,h=[],f=0;while(null!==(c=l(o,d))){var m=String(c[0]);h[f]=m,""===m&&(o.lastIndex=s(d,r(o.lastIndex),u)),f++}return 0===f?null:h}]}))},4678:function(e,t,n){var a={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-SG":"cdab","./en-SG.js":"cdab","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-nz":"6f50","./en-nz.js":"6f50","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-tw":"90ea","./zh-tw.js":"90ea"};function i(e){var t=r(e);return n(t)}function r(e){if(!n.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}i.keys=function(){return Object.keys(a)},i.resolve=r,e.exports=i,i.id="4678"},4840:function(e,t,n){var a=n("825a"),i=n("1c0b"),r=n("b622"),o=r("species");e.exports=function(e,t){var n,r=a(e).constructor;return void 0===r||void 0==(n=a(r)[o])?t:i(n)}},"485c":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"},n=e.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyə",ss:"%d saniyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(e){return/^(gündüz|axşam)$/.test(e)},meridiem:function(e,t,n){return e<4?"gecə":e<12?"səhər":e<17?"gündüz":"axşam"},dayOfMonthOrdinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(e){if(0===e)return e+"-ıncı";var n=e%10,a=e%100-n,i=e>=100?100:null;return e+(t[n]||t[a]||t[i])},week:{dow:1,doy:7}});return n}))},4930:function(e,t,n){var a=n("d039");e.exports=!!Object.getOwnPropertySymbols&&!a((function(){return!String(Symbol())}))},"49ab":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("zh-hk",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日 HH:mm",LLLL:"YYYY年M月D日dddd HH:mm",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(e,t){return 12===e&&(e=0),"凌晨"===t||"早上"===t||"上午"===t?e:"中午"===t?e>=11?e:e+12:"下午"===t||"晚上"===t?e+12:void 0},meridiem:function(e,t,n){var a=100*e+t;return a<600?"凌晨":a<900?"早上":a<1130?"上午":a<1230?"中午":a<1800?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(日|月|週)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"日";case"M":return e+"月";case"w":case"W":return e+"週";default:return e}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",ss:"%d 秒",m:"1 分鐘",mm:"%d 分鐘",h:"1 小時",hh:"%d 小時",d:"1 天",dd:"%d 天",M:"1 個月",MM:"%d 個月",y:"1 年",yy:"%d 年"}});return t}))},"4aed":function(e,t,n){"use strict";var a=n("9bf6"),i=n.n(a);i.a},"4b5c":function(e,t,n){"use strict";n.d(t,"b",(function(){return l}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.btnClasses,attrs:{type:e.type,role:e.role},on:{click:e.handleClick}},[e.icon&&!e.iconRight?n("mdb-icon",{class:e.iconClasses,attrs:{icon:e.icon,far:e.far||e.regular,fal:e.fal||e.light,fab:e.fab||e.brands,fad:e.fad||e.duotone,color:e.iconColor}}):e._e(),e._t("default"),e.icon&&e.iconRight?n("mdb-icon",{class:e.iconClasses,attrs:{icon:e.icon,far:e.far||e.regular,fal:e.fal||e.light,fab:e.fab||e.brands,fad:e.fad||e.duotone,color:e.iconColor}}):e._e()],2)},i=[],r=(n("0481"),n("4069"),n("9327")),o=n("060a"),s=n("c101"),l={components:{mdbIcon:o["a"]},props:{tag:{type:String,default:"button"},color:{type:String,default:"default"},outline:{type:String},size:{type:String},block:{type:Boolean,default:!1},role:{type:String},type:{type:String,default:"button"},active:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},icon:{type:String},iconLeft:{type:Boolean,default:!1},iconRight:{type:Boolean,default:!1},waves:{type:Boolean,default:!0},gradient:{type:String},rounded:{type:Boolean,default:!1},floating:{type:Boolean,default:!1},flat:{type:Boolean,default:!1},action:{type:Boolean,default:!1},transparent:{type:Boolean,default:!1},save:{type:Boolean,default:!1},iconClass:{type:[String,Array],default:null},iconColor:{type:String},far:{type:Boolean,default:!1},regular:{type:Boolean,default:!1},fal:{type:Boolean,default:!1},light:{type:Boolean,default:!1},fab:{type:Boolean,default:!1},brands:{type:Boolean,default:!1},fad:{type:Boolean,default:!1},duotone:{type:Boolean,default:!1},group:{type:Boolean,default:!1},text:{type:String}},methods:{handleClick:function(e){this.wave(e),this.$emit("click",this)}},computed:{btnClasses:function(){return[this.floating?"btn-floating":"btn",this.outline?"btn-outline-"+this.outline:this.flat?"btn-flat":this.transparent?"":"btn-"+this.color,this.size&&"btn-"+this.size,this.block&&"btn-block",this.disabled&&"disabled",this.gradient&&this.gradient+"-gradient",this.rounded&&"btn-rounded",this.action&&"btn-action",this.save&&"btn-save",this.active&&"active",this.waves&&"ripple-parent",this.group&&"m-0 px-3 py-2",this.group&&this.outline&&"z-depth-0",this.text&&"".concat(this.text,"-text"),this.mdbClass]},iconClasses:function(){return["px-1",this.iconClass]}},mixins:[r["a"],s["a"]]},d=l,u=d,c=(n("6a61"),n("2877")),h=Object(c["a"])(u,a,i,!1,null,"bc7807ae",null);t["a"]=h.exports},"4ba9":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n){var a=e+" ";switch(n){case"ss":return a+=1===e?"sekunda":2===e||3===e||4===e?"sekunde":"sekundi",a;case"m":return t?"jedna minuta":"jedne minute";case"mm":return a+=1===e?"minuta":2===e||3===e||4===e?"minute":"minuta",a;case"h":return t?"jedan sat":"jednog sata";case"hh":return a+=1===e?"sat":2===e||3===e||4===e?"sata":"sati",a;case"dd":return a+=1===e?"dan":"dana",a;case"MM":return a+=1===e?"mjesec":2===e||3===e||4===e?"mjeseca":"mjeseci",a;case"yy":return a+=1===e?"godina":2===e||3===e||4===e?"godine":"godina",a}}var n=e.defineLocale("hr",{months:{format:"siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca".split("_"),standalone:"siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_")},monthsShort:"sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",ss:t,m:t,mm:t,h:t,hh:t,d:"dan",dd:t,M:"mjesec",MM:t,y:"godinu",yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});return n}))},"4c52":function(e,t,n){"use strict";var a=n("df76"),i=n.n(a);i.a},"4d64":function(e,t,n){var a=n("fc6a"),i=n("50c4"),r=n("23cb"),o=function(e){return function(t,n,o){var s,l=a(t),d=i(l.length),u=r(o,d);if(e&&n!=n){while(d>u)if(s=l[u++],s!=s)return!0}else for(;d>u;u++)if((e||u in l)&&l[u]===n)return e||u||0;return!e&&-1}};e.exports={includes:o(!0),indexOf:o(!1)}},"4de4":function(e,t,n){"use strict";var a=n("23e7"),i=n("b727").filter,r=n("1dde");a({target:"Array",proto:!0,forced:!r("filter")},{filter:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},"4df4":function(e,t,n){"use strict";var a=n("f8c2"),i=n("7b0b"),r=n("9bdd"),o=n("e95a"),s=n("50c4"),l=n("8418"),d=n("35a1");e.exports=function(e){var t,n,u,c,h,f=i(e),m="function"==typeof this?this:Array,p=arguments.length,_=p>1?arguments[1]:void 0,g=void 0!==_,y=0,v=d(f);if(g&&(_=a(_,p>2?arguments[2]:void 0,2)),void 0==v||m==Array&&o(v))for(t=s(f.length),n=new m(t);t>y;y++)l(n,y,g?_(f[y],y):f[y]);else for(c=v.call(f),h=c.next,n=new m;!(u=h.call(c)).done;y++)l(n,y,g?r(c,_,[u.value,y],!0):u.value);return n.length=y,n}},"4e9b":function(e,t,n){},"4fad":function(e,t,n){var a=n("23e7"),i=n("6f53").entries;a({target:"Object",stat:!0},{entries:function(e){return i(e)}})},5038:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Agt_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"siang"===t?e>=11?e:e+12:"sore"===t||"malam"===t?e+12:void 0},meridiem:function(e,t,n){return e<11?"pagi":e<15?"siang":e<19?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",ss:"%d detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}});return t}))},"50c4":function(e,t,n){var a=n("a691"),i=Math.min;e.exports=function(e){return e>0?i(a(e),9007199254740991):0}},5120:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=["Eanáir","Feabhra","Márta","Aibreán","Bealtaine","Méitheamh","Iúil","Lúnasa","Meán Fómhair","Deaireadh Fómhair","Samhain","Nollaig"],n=["Eaná","Feab","Márt","Aibr","Beal","Méit","Iúil","Lúna","Meán","Deai","Samh","Noll"],a=["Dé Domhnaigh","Dé Luain","Dé Máirt","Dé Céadaoin","Déardaoin","Dé hAoine","Dé Satharn"],i=["Dom","Lua","Mái","Céa","Déa","hAo","Sat"],r=["Do","Lu","Má","Ce","Dé","hA","Sa"],o=e.defineLocale("ga",{months:t,monthsShort:n,monthsParseExact:!0,weekdays:a,weekdaysShort:i,weekdaysMin:r,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Inniu ag] LT",nextDay:"[Amárach ag] LT",nextWeek:"dddd [ag] LT",lastDay:"[Inné aig] LT",lastWeek:"dddd [seo caite] [ag] LT",sameElse:"L"},relativeTime:{future:"i %s",past:"%s ó shin",s:"cúpla soicind",ss:"%d soicind",m:"nóiméad",mm:"%d nóiméad",h:"uair an chloig",hh:"%d uair an chloig",d:"lá",dd:"%d lá",M:"mí",MM:"%d mí",y:"bliain",yy:"%d bliain"},dayOfMonthOrdinalParse:/\d{1,2}(d|na|mh)/,ordinal:function(e){var t=1===e?"d":e%10===2?"na":"mh";return e+t},week:{dow:1,doy:4}});return o}))},"512e":function(e,t,n){"use strict";var a=n("2bfd"),i=n.n(a);i.a},5135:function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},5294:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"],n=["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"],a=e.defineLocale("ur",{months:t,monthsShort:t,weekdays:n,weekdaysShort:n,weekdaysMin:n,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd، D MMMM YYYY HH:mm"},meridiemParse:/صبح|شام/,isPM:function(e){return"شام"===e},meridiem:function(e,t,n){return e<12?"صبح":"شام"},calendar:{sameDay:"[آج بوقت] LT",nextDay:"[کل بوقت] LT",nextWeek:"dddd [بوقت] LT",lastDay:"[گذشتہ روز بوقت] LT",lastWeek:"[گذشتہ] dddd [بوقت] LT",sameElse:"L"},relativeTime:{future:"%s بعد",past:"%s قبل",s:"چند سیکنڈ",ss:"%d سیکنڈ",m:"ایک منٹ",mm:"%d منٹ",h:"ایک گھنٹہ",hh:"%d گھنٹے",d:"ایک دن",dd:"%d دن",M:"ایک ماہ",MM:"%d ماہ",y:"ایک سال",yy:"%d سال"},preparse:function(e){return e.replace(/،/g,",")},postformat:function(e){return e.replace(/,/g,"،")},week:{dow:1,doy:4}});return a}))},"52bd":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ss",{months:"Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split("_"),monthsShort:"Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo".split("_"),weekdays:"Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo".split("_"),weekdaysShort:"Lis_Umb_Lsb_Les_Lsi_Lsh_Umg".split("_"),weekdaysMin:"Li_Us_Lb_Lt_Ls_Lh_Ug".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Namuhla nga] LT",nextDay:"[Kusasa nga] LT",nextWeek:"dddd [nga] LT",lastDay:"[Itolo nga] LT",lastWeek:"dddd [leliphelile] [nga] LT",sameElse:"L"},relativeTime:{future:"nga %s",past:"wenteka nga %s",s:"emizuzwana lomcane",ss:"%d mzuzwana",m:"umzuzu",mm:"%d emizuzu",h:"lihora",hh:"%d emahora",d:"lilanga",dd:"%d emalanga",M:"inyanga",MM:"%d tinyanga",y:"umnyaka",yy:"%d iminyaka"},meridiemParse:/ekuseni|emini|entsambama|ebusuku/,meridiem:function(e,t,n){return e<11?"ekuseni":e<15?"emini":e<19?"entsambama":"ebusuku"},meridiemHour:function(e,t){return 12===e&&(e=0),"ekuseni"===t?e:"emini"===t?e>=11?e:e+12:"entsambama"===t||"ebusuku"===t?0===e?0:e+12:void 0},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:"%d",week:{dow:1,doy:4}});return t}))},5319:function(e,t,n){"use strict";var a=n("d784"),i=n("825a"),r=n("7b0b"),o=n("50c4"),s=n("a691"),l=n("1d80"),d=n("8aa5"),u=n("14c3"),c=Math.max,h=Math.min,f=Math.floor,m=/\$([$&'`]|\d\d?|<[^>]*>)/g,p=/\$([$&'`]|\d\d?)/g,_=function(e){return void 0===e?e:String(e)};a("replace",2,(function(e,t,n){return[function(n,a){var i=l(this),r=void 0==n?void 0:n[e];return void 0!==r?r.call(n,i,a):t.call(String(i),n,a)},function(e,r){var l=n(t,e,this,r);if(l.done)return l.value;var f=i(e),m=String(this),p="function"===typeof r;p||(r=String(r));var g=f.global;if(g){var y=f.unicode;f.lastIndex=0}var v=[];while(1){var b=u(f,m);if(null===b)break;if(v.push(b),!g)break;var M=String(b[0]);""===M&&(f.lastIndex=d(m,o(f.lastIndex),y))}for(var L="",k=0,w=0;w<v.length;w++){b=v[w];for(var x=String(b[0]),Y=c(h(s(b.index),m.length),0),S=[],D=1;D<b.length;D++)S.push(_(b[D]));var T=b.groups;if(p){var H=[x].concat(S,Y,m);void 0!==T&&H.push(T);var C=String(r.apply(void 0,H))}else C=a(x,m,Y,S,T,r);Y>=k&&(L+=m.slice(k,Y)+C,k=Y+x.length)}return L+m.slice(k)}];function a(e,n,a,i,o,s){var l=a+e.length,d=i.length,u=p;return void 0!==o&&(o=r(o),u=m),t.call(s,u,(function(t,r){var s;switch(r.charAt(0)){case"$":return"$";case"&":return e;case"`":return n.slice(0,a);case"'":return n.slice(l);case"<":s=o[r.slice(1,-1)];break;default:var u=+r;if(0===u)return t;if(u>d){var c=f(u/10);return 0===c?t:c<=d?void 0===i[c-1]?r.charAt(1):i[c-1]+r.charAt(1):t}s=i[u-1]}return void 0===s?"":s}))}}))},"55c9":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),n="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),a=[/^ene/i,/^feb/i,/^mar/i,/^abr/i,/^may/i,/^jun/i,/^jul/i,/^ago/i,/^sep/i,/^oct/i,/^nov/i,/^dic/i],i=/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,r=e.defineLocale("es-us",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,a){return e?/-MMM-/.test(a)?n[e.month()]:t[e.month()]:t},monthsRegex:i,monthsShortRegex:i,monthsStrictRegex:/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,monthsShortStrictRegex:/^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,monthsParse:a,longMonthsParse:a,shortMonthsParse:a,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"MM/DD/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY h:mm A",LLLL:"dddd, D [de] MMMM [de] YYYY h:mm A"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:0,doy:6}});return r}))},5692:function(e,t,n){var a=n("c430"),i=n("c6cd");(e.exports=function(e,t){return i[e]||(i[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.3.2",mode:a?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},"56ef":function(e,t,n){var a=n("d066"),i=n("241c"),r=n("7418"),o=n("825a");e.exports=a("Reflect","ownKeys")||function(e){var t=i.f(o(e)),n=r.f;return n?t.concat(n(e)):t}},"576c":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("tet",{months:"Janeiru_Fevereiru_Marsu_Abril_Maiu_Juñu_Jullu_Agustu_Setembru_Outubru_Novembru_Dezembru".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingu_Segunda_Tersa_Kuarta_Kinta_Sesta_Sabadu".split("_"),weekdaysShort:"Dom_Seg_Ters_Kua_Kint_Sest_Sab".split("_"),weekdaysMin:"Do_Seg_Te_Ku_Ki_Ses_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ohin iha] LT",nextDay:"[Aban iha] LT",nextWeek:"dddd [iha] LT",lastDay:"[Horiseik iha] LT",lastWeek:"dddd [semana kotuk] [iha] LT",sameElse:"L"},relativeTime:{future:"iha %s",past:"%s liuba",s:"minutu balun",ss:"minutu %d",m:"minutu ida",mm:"minutu %d",h:"oras ida",hh:"oras %d",d:"loron ida",dd:"loron %d",M:"fulan ida",MM:"fulan %d",y:"tinan ida",yy:"tinan %d"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n},week:{dow:1,doy:4}});return t}))},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,n){var a=n("1d80"),i=n("5899"),r="["+i+"]",o=RegExp("^"+r+r+"*"),s=RegExp(r+r+"*$"),l=function(e){return function(t){var n=String(a(t));return 1&e&&(n=n.replace(o,"")),2&e&&(n=n.replace(s,"")),n}};e.exports={start:l(1),end:l(2),trim:l(3)}},"598a":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=["ޖެނުއަރީ","ފެބްރުއަރީ","މާރިޗު","އޭޕްރީލު","މޭ","ޖޫން","ޖުލައި","އޯގަސްޓު","ސެޕްޓެމްބަރު","އޮކްޓޯބަރު","ނޮވެމްބަރު","ޑިސެމްބަރު"],n=["އާދިއްތަ","ހޯމަ","އަންގާރަ","ބުދަ","ބުރާސްފަތި","ހުކުރު","ހޮނިހިރު"],a=e.defineLocale("dv",{months:t,monthsShort:t,weekdays:n,weekdaysShort:n,weekdaysMin:"އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/M/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/މކ|މފ/,isPM:function(e){return"މފ"===e},meridiem:function(e,t,n){return e<12?"މކ":"މފ"},calendar:{sameDay:"[މިއަދު] LT",nextDay:"[މާދަމާ] LT",nextWeek:"dddd LT",lastDay:"[އިއްޔެ] LT",lastWeek:"[ފާއިތުވި] dddd LT",sameElse:"L"},relativeTime:{future:"ތެރޭގައި %s",past:"ކުރިން %s",s:"ސިކުންތުކޮޅެއް",ss:"d% ސިކުންތު",m:"މިނިޓެއް",mm:"މިނިޓު %d",h:"ގަޑިއިރެއް",hh:"ގަޑިއިރު %d",d:"ދުވަހެއް",dd:"ދުވަސް %d",M:"މަހެއް",MM:"މަސް %d",y:"އަހަރެއް",yy:"އަހަރު %d"},preparse:function(e){return e.replace(/،/g,",")},postformat:function(e){return e.replace(/,/g,"،")},week:{dow:7,doy:12}});return a}))},"59e7":function(e,t,n){"use strict";var a=n("5fb2"),i=n.n(a);i.a},"5a34":function(e,t,n){var a=n("44e7");e.exports=function(e){if(a(e))throw TypeError("The method doesn't accept regular expressions");return e}},"5b14":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");function n(e,t,n,a){var i=e;switch(n){case"s":return a||t?"néhány másodperc":"néhány másodperce";case"ss":return i+(a||t)?" másodperc":" másodperce";case"m":return"egy"+(a||t?" perc":" perce");case"mm":return i+(a||t?" perc":" perce");case"h":return"egy"+(a||t?" óra":" órája");case"hh":return i+(a||t?" óra":" órája");case"d":return"egy"+(a||t?" nap":" napja");case"dd":return i+(a||t?" nap":" napja");case"M":return"egy"+(a||t?" hónap":" hónapja");case"MM":return i+(a||t?" hónap":" hónapja");case"y":return"egy"+(a||t?" év":" éve");case"yy":return i+(a||t?" év":" éve")}return""}function a(e){return(e?"":"[múlt] ")+"["+t[this.day()]+"] LT[-kor]"}var i=e.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"},meridiemParse:/de|du/i,isPM:function(e){return"u"===e.charAt(1).toLowerCase()},meridiem:function(e,t,n){return e<12?!0===n?"de":"DE":!0===n?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return a.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return a.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:n,ss:n,m:n,mm:n,h:n,hh:n,d:n,dd:n,M:n,MM:n,y:n,yy:n},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return i}))},"5bea":function(e,t,n){},"5c3a":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(e,t){return 12===e&&(e=0),"凌晨"===t||"早上"===t||"上午"===t?e:"下午"===t||"晚上"===t?e+12:e>=11?e:e+12},meridiem:function(e,t,n){var a=100*e+t;return a<600?"凌晨":a<900?"早上":a<1130?"上午":a<1230?"中午":a<1800?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(日|月|周)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"日";case"M":return e+"月";case"w":case"W":return e+"周";default:return e}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",ss:"%d 秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},week:{dow:1,doy:4}});return t}))},"5c6c":function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},"5cbb":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("te",{months:"జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జులై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్".split("_"),monthsShort:"జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జులై_ఆగ._సెప్._అక్టో._నవ._డిసె.".split("_"),monthsParseExact:!0,weekdays:"ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం".split("_"),weekdaysShort:"ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని".split("_"),weekdaysMin:"ఆ_సో_మం_బు_గు_శు_శ".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[నేడు] LT",nextDay:"[రేపు] LT",nextWeek:"dddd, LT",lastDay:"[నిన్న] LT",lastWeek:"[గత] dddd, LT",sameElse:"L"},relativeTime:{future:"%s లో",past:"%s క్రితం",s:"కొన్ని క్షణాలు",ss:"%d సెకన్లు",m:"ఒక నిమిషం",mm:"%d నిమిషాలు",h:"ఒక గంట",hh:"%d గంటలు",d:"ఒక రోజు",dd:"%d రోజులు",M:"ఒక నెల",MM:"%d నెలలు",y:"ఒక సంవత్సరం",yy:"%d సంవత్సరాలు"},dayOfMonthOrdinalParse:/\d{1,2}వ/,ordinal:"%dవ",meridiemParse:/రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,meridiemHour:function(e,t){return 12===e&&(e=0),"రాత్రి"===t?e<4?e:e+12:"ఉదయం"===t?e:"మధ్యాహ్నం"===t?e>=10?e:e+12:"సాయంత్రం"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"రాత్రి":e<10?"ఉదయం":e<17?"మధ్యాహ్నం":e<20?"సాయంత్రం":"రాత్రి"},week:{dow:0,doy:6}});return t}))},"5d26":function(e,t,n){},"5ea8":function(e,t,n){},"5ef3":function(e,t,n){"use strict";var a=n("ab61"),i=n.n(a);i.a},"5f59":function(e,t,n){},"5fb2":function(e,t,n){},"5fbd":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [kl.] HH:mm",LLLL:"dddd D MMMM YYYY [kl.] HH:mm",lll:"D MMM YYYY HH:mm",llll:"ddd D MMM YYYY HH:mm"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"[På] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",ss:"%d sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},dayOfMonthOrdinalParse:/\d{1,2}(e|a)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"e":1===t||2===t?"a":"e";return e+n},week:{dow:1,doy:4}});return t}))},"602b":function(e,t,n){},"60da":function(e,t,n){"use strict";var a=n("83ab"),i=n("d039"),r=n("df75"),o=n("7418"),s=n("d1e7"),l=n("7b0b"),d=n("44ad"),u=Object.assign;e.exports=!u||i((function(){var e={},t={},n=Symbol(),a="abcdefghijklmnopqrst";return e[n]=7,a.split("").forEach((function(e){t[e]=e})),7!=u({},e)[n]||r(u({},t)).join("")!=a}))?function(e,t){var n=l(e),i=arguments.length,u=1,c=o.f,h=s.f;while(i>u){var f,m=d(arguments[u++]),p=c?r(m).concat(c(m)):r(m),_=p.length,g=0;while(_>g)f=p[g++],a&&!h.call(m,f)||(n[f]=m[f])}return n}:u},6117:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ug-cn",{months:"يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر".split("_"),monthsShort:"يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر".split("_"),weekdays:"يەكشەنبە_دۈشەنبە_سەيشەنبە_چارشەنبە_پەيشەنبە_جۈمە_شەنبە".split("_"),weekdaysShort:"يە_دۈ_سە_چا_پە_جۈ_شە".split("_"),weekdaysMin:"يە_دۈ_سە_چا_پە_جۈ_شە".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY-يىلىM-ئاينىڭD-كۈنى",LLL:"YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm",LLLL:"dddd، YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm"},meridiemParse:/يېرىم كېچە|سەھەر|چۈشتىن بۇرۇن|چۈش|چۈشتىن كېيىن|كەچ/,meridiemHour:function(e,t){return 12===e&&(e=0),"يېرىم كېچە"===t||"سەھەر"===t||"چۈشتىن بۇرۇن"===t?e:"چۈشتىن كېيىن"===t||"كەچ"===t?e+12:e>=11?e:e+12},meridiem:function(e,t,n){var a=100*e+t;return a<600?"يېرىم كېچە":a<900?"سەھەر":a<1130?"چۈشتىن بۇرۇن":a<1230?"چۈش":a<1800?"چۈشتىن كېيىن":"كەچ"},calendar:{sameDay:"[بۈگۈن سائەت] LT",nextDay:"[ئەتە سائەت] LT",nextWeek:"[كېلەركى] dddd [سائەت] LT",lastDay:"[تۆنۈگۈن] LT",lastWeek:"[ئالدىنقى] dddd [سائەت] LT",sameElse:"L"},relativeTime:{future:"%s كېيىن",past:"%s بۇرۇن",s:"نەچچە سېكونت",ss:"%d سېكونت",m:"بىر مىنۇت",mm:"%d مىنۇت",h:"بىر سائەت",hh:"%d سائەت",d:"بىر كۈن",dd:"%d كۈن",M:"بىر ئاي",MM:"%d ئاي",y:"بىر يىل",yy:"%d يىل"},dayOfMonthOrdinalParse:/\d{1,2}(-كۈنى|-ئاي|-ھەپتە)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"-كۈنى";case"w":case"W":return e+"-ھەپتە";default:return e}},preparse:function(e){return e.replace(/،/g,",")},postformat:function(e){return e.replace(/,/g,"،")},week:{dow:1,doy:7}});return t}))},6236:function(e,t,n){"use strict";var a=n("cfd1"),i=n.n(a);i.a},"62e4":function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},6403:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"tengahari"===t?e>=11?e:e+12:"petang"===t||"malam"===t?e+12:void 0},meridiem:function(e,t,n){return e<11?"pagi":e<15?"tengahari":e<19?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",ss:"%d saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}});return t}))},6462:function(e,t,n){},"64fb":function(e,t,n){"use strict";var a=n("a801"),i=n.n(a);i.a},6547:function(e,t,n){var a=n("a691"),i=n("1d80"),r=function(e){return function(t,n){var r,o,s=String(i(t)),l=a(n),d=s.length;return l<0||l>=d?e?"":void 0:(r=s.charCodeAt(l),r<55296||r>56319||l+1===d||(o=s.charCodeAt(l+1))<56320||o>57343?e?s.charAt(l):r:e?s.slice(l,l+2):o-56320+(r-55296<<10)+65536)}};e.exports={codeAt:r(!1),charAt:r(!0)}},6583:function(e,t,n){"use strict";n.d(t,"b",(function(){return r}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},i=[],r={props:{tag:{type:String,default:"tbody"},color:{type:String}},computed:{className:function(){return[this.color?"tbody-"+this.color:""]}}},o=r,s=o,l=n("2877"),d=Object(l["a"])(s,a,i,!1,null,"2730f04a",null);t["a"]=d.exports},"65d4":function(e,t,n){},"65db":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato".split("_"),weekdaysShort:"dim_lun_mard_merk_ĵaŭ_ven_sab".split("_"),weekdaysMin:"di_lu_ma_me_ĵa_ve_sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D[-a de] MMMM, YYYY",LLL:"D[-a de] MMMM, YYYY HH:mm",LLLL:"dddd, [la] D[-a de] MMMM, YYYY HH:mm"},meridiemParse:/[ap]\.t\.m/i,isPM:function(e){return"p"===e.charAt(0).toLowerCase()},meridiem:function(e,t,n){return e>11?n?"p.t.m.":"P.T.M.":n?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"post %s",past:"antaŭ %s",s:"sekundoj",ss:"%d sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},dayOfMonthOrdinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}});return t}))},"65f0":function(e,t,n){var a=n("861d"),i=n("e8b5"),r=n("b622"),o=r("species");e.exports=function(e,t){var n;return i(e)&&(n=e.constructor,"function"!=typeof n||n!==Array&&!i(n.prototype)?a(n)&&(n=n[o],null===n&&(n=void 0)):n=void 0),new(void 0===n?Array:n)(0===t?0:t)}},"66ff":function(e,t,n){"use strict";var a=n("602b"),i=n.n(a);i.a},6784:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=["جنوري","فيبروري","مارچ","اپريل","مئي","جون","جولاءِ","آگسٽ","سيپٽمبر","آڪٽوبر","نومبر","ڊسمبر"],n=["آچر","سومر","اڱارو","اربع","خميس","جمع","ڇنڇر"],a=e.defineLocale("sd",{months:t,monthsShort:t,weekdays:n,weekdaysShort:n,weekdaysMin:n,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd، D MMMM YYYY HH:mm"},meridiemParse:/صبح|شام/,isPM:function(e){return"شام"===e},meridiem:function(e,t,n){return e<12?"صبح":"شام"},calendar:{sameDay:"[اڄ] LT",nextDay:"[سڀاڻي] LT",nextWeek:"dddd [اڳين هفتي تي] LT",lastDay:"[ڪالهه] LT",lastWeek:"[گزريل هفتي] dddd [تي] LT",sameElse:"L"},relativeTime:{future:"%s پوء",past:"%s اڳ",s:"چند سيڪنڊ",ss:"%d سيڪنڊ",m:"هڪ منٽ",mm:"%d منٽ",h:"هڪ ڪلاڪ",hh:"%d ڪلاڪ",d:"هڪ ڏينهن",dd:"%d ڏينهن",M:"هڪ مهينو",MM:"%d مهينا",y:"هڪ سال",yy:"%d سال"},preparse:function(e){return e.replace(/،/g,",")},postformat:function(e){return e.replace(/,/g,"،")},week:{dow:1,doy:4}});return a}))},6887:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n){var a={mm:"munutenn",MM:"miz",dd:"devezh"};return e+" "+i(a[n],e)}function n(e){switch(a(e)){case 1:case 3:case 4:case 5:case 9:return e+" bloaz";default:return e+" vloaz"}}function a(e){return e>9?a(e%10):e}function i(e,t){return 2===t?r(e):e}function r(e){var t={m:"v",b:"v",d:"z"};return void 0===t[e.charAt(0)]?e:t[e.charAt(0)]+e.substring(1)}var o=e.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY h[e]mm A",LLLL:"dddd, D [a viz] MMMM YYYY h[e]mm A"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",ss:"%d eilenn",m:"ur vunutenn",mm:t,h:"un eur",hh:"%d eur",d:"un devezh",dd:t,M:"ur miz",MM:t,y:"ur bloaz",yy:n},dayOfMonthOrdinalParse:/\d{1,2}(añ|vet)/,ordinal:function(e){var t=1===e?"añ":"vet";return e+t},week:{dow:1,doy:4}});return o}))},"688b":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("mi",{months:"Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea".split("_"),monthsShort:"Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki".split("_"),monthsRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsStrictRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsShortRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsShortStrictRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,weekdays:"Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei".split("_"),weekdaysShort:"Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),weekdaysMin:"Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [i] HH:mm",LLLL:"dddd, D MMMM YYYY [i] HH:mm"},calendar:{sameDay:"[i teie mahana, i] LT",nextDay:"[apopo i] LT",nextWeek:"dddd [i] LT",lastDay:"[inanahi i] LT",lastWeek:"dddd [whakamutunga i] LT",sameElse:"L"},relativeTime:{future:"i roto i %s",past:"%s i mua",s:"te hēkona ruarua",ss:"%d hēkona",m:"he meneti",mm:"%d meneti",h:"te haora",hh:"%d haora",d:"he ra",dd:"%d ra",M:"he marama",MM:"%d marama",y:"he tau",yy:"%d tau"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});return t}))},6909:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"[Во] dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",ss:"%d секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},dayOfMonthOrdinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(e){var t=e%10,n=e%100;return 0===e?e+"-ев":0===n?e+"-ен":n>10&&n<20?e+"-ти":1===t?e+"-ви":2===t?e+"-ри":7===t||8===t?e+"-ми":e+"-ти"},week:{dow:1,doy:7}});return t}))},"69f3":function(e,t,n){var a,i,r,o=n("7f9a"),s=n("da84"),l=n("861d"),d=n("9112"),u=n("5135"),c=n("f772"),h=n("d012"),f=s.WeakMap,m=function(e){return r(e)?i(e):a(e,{})},p=function(e){return function(t){var n;if(!l(t)||(n=i(t)).type!==e)throw TypeError("Incompatible receiver, "+e+" required");return n}};if(o){var _=new f,g=_.get,y=_.has,v=_.set;a=function(e,t){return v.call(_,e,t),t},i=function(e){return g.call(_,e)||{}},r=function(e){return y.call(_,e)}}else{var b=c("state");h[b]=!0,a=function(e,t){return d(e,b,t),t},i=function(e){return u(e,b)?e[b]:{}},r=function(e){return u(e,b)}}e.exports={set:a,get:i,has:r,enforce:m,getterFor:p}},"6a61":function(e,t,n){"use strict";var a=n("bf18"),i=n.n(a);i.a},"6ba7":function(e,t,n){"use strict";n.r(t),n.d(t,"mdbDatatable",(function(){return C}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"dataTables_wrapper",style:e.wrapperStyle},[n("mdb-row",[n("mdb-col",{attrs:{sm:"6",md:"8"}},[n("mdb-row",[n("mdb-col",{attrs:{sm:"12",md:"4"}},[e.pagination?n("datatable-select",{attrs:{title:e.entriesTitle,options:e.options},on:{getValue:e.updateEntries}}):e._e()],1),n("mdb-col",{staticClass:"pt-2"},[e.refresh?n("mdb-btn",{staticClass:"mt-4",attrs:{size:"sm",outline:e.btnColor},on:{click:e.updateData}},[n("mdb-icon",{attrs:{icon:"sync"}})],1):e._e()],1)],1)],1),e.searching?n("mdb-col",{attrs:{sm:"6",md:"4"}},[n("datatable-search",{staticClass:"mt-4 pt-2",attrs:{placeholder:e.searchPlaceholder},on:{getValue:e.updateSearch}})],1):e._e()],1),n("mdb-tbl",e._b({class:{"mdb-scroll-y":e.scrollY},style:"max-height: "+(e.scrollY?e.maxHeight?e.maxHeight:"280px":null)+";",attrs:{sm:"",datatable:""}},"mdb-tbl",e.tableProps,!1),[n("mdb-tbl-head",{staticClass:"table-header",attrs:{color:e.headerColor,textWhite:e.headerWhite}},[n("tr",[e.checkbox&&e.focus?n("th"):e._e(),e._l(e.columns,(function(t){return n("th",{key:t.field,staticClass:"th-sm sorting",on:{click:function(n){return e.sort(t.field,t.sort)}}},[e._v(" "+e._s(t.label)+" "),e.sorting&&t.sort?n("i",{staticClass:"fas fa-sort float-right"}):e._e()])}))],2)]),n("mdb-tbl-body",[e._l(e.pages[e.activePage],(function(t,a){return n("tr",{key:a,class:(e.focus&&"selectable-row")+" "+(e.focus&&e.rowsDisplay.indexOf(t)===e.hovered?e.hoverColor:"")+" "+(e.focus&&e.rowsDisplay.indexOf(t)===e.selected?e.selectColor:""),attrs:{tabindex:e.focus&&"1"},on:{mouseenter:function(n){e.hovered=e.rowsDisplay.indexOf(t)},mouseleave:function(t){e.hovered=-1},click:function(n){return e.selectRow(t)}}},[e.checkbox&&e.focus?n("td",{staticClass:"text-center"},[n("mdb-icon",{staticClass:"px-3",attrs:{icon:e.rowsDisplay.indexOf(t)===e.selected?"check-square":"square",far:""}})],1):e._e(),e._l(t,(function(t,a){return n("td",{key:a},[n("div",{domProps:{innerHTML:e._s(t)}})])}))],2)})),e.pages.length?e._e():n("tr",[n("td",{attrs:{colspan:e.columns.length}},[e._v(e._s(e.noFoundMessage))])])],2),e.tfoot?n("mdb-tbl-head",{staticClass:"table-footer",attrs:{tag:"tfoot"}},[n("tr",[e.checkbox&&e.focus?n("th"):e._e(),e._l(e.columns,(function(t){return n("th",{key:t.field+"_foot",staticClass:"th-sm sorting"},[e._v(" "+e._s(t.label)+" ")])}))],2)]):e._e()],1),e.pagination?n("div",{staticClass:"row"},[n("div",{staticClass:"col-sm-12 col-md-5"},[n("div",{staticClass:"dataTables_info",attrs:{role:"status","aria-live":"polite"}},[e._v(" "+e._s(e.showingText)+": "+e._s(e.activePage>0?e.activePage*e.entries:e.activePage+1)+" - "+e._s(e.pages.length-1>e.activePage?e.pages[e.activePage].length*(e.activePage+1):e.filteredRows.length)+" ("+e._s(e.filteredRows.length)+") ")])]),n("div",{staticClass:"col-sm-12 col-md-7"},[n("div",{staticClass:"dataTables_paginate float-right"},[n("mdb-pagination",{attrs:{id:"pagination",color:e.paginationColor}},[e.pages.length>e.display?n("mdb-page-item",{attrs:{disabled:0===e.activePage},nativeOn:{click:function(t){return e.changePage(0)}}},[e.arrows?n("mdb-icon",{attrs:{icon:"angle-double-left"}}):n("p",{staticClass:"pagination"},[e._v(e._s(e.start))])],1):e._e(),n("mdb-page-item",{attrs:{disabled:0===e.activePage},nativeOn:{click:function(t){return e.changePage(e.activePage-1)}}},[e.arrows?n("mdb-icon",{attrs:{icon:"angle-left"}}):n("p",{staticClass:"pagination"},[e._v(e._s(e.previous))])],1),e._l(e.visiblePages,(function(t,a){return n("mdb-page-item",{key:a,attrs:{active:e.activePage===e.pages.indexOf(e.visiblePages[a])},nativeOn:{click:function(t){e.changePage(e.pages.indexOf(e.visiblePages[a]))}}},[e._v(" "+e._s(e.pages.indexOf(e.visiblePages[a])+1)+" ")])})),n("mdb-page-item",{attrs:{disabled:e.activePage===e.pages.length-1},nativeOn:{click:function(t){return e.changePage(e.activePage+1)}}},[e.arrows?n("mdb-icon",{attrs:{icon:"angle-right"}}):n("p",{staticClass:"pagination"},[e._v(e._s(e.next))])],1),e.pages.length>e.display?n("mdb-page-item",{attrs:{disabled:e.activePage===e.pages.length-1},nativeOn:{click:function(t){return e.changePage(e.pages.length-1)}}},[e.arrows?n("mdb-icon",{attrs:{icon:"angle-double-right"}}):n("p",{staticClass:"pagination"},[e._v(e._s(e.end))])],1):e._e()],2)],1)])]):e._e()],1)},i=[],r=(n("4de4"),n("d3b7"),n("ac1f"),n("25f0"),n("466d"),n("841c"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"dataTables_length bs-select pb-2"},[n("label",[e._v(" "+e._s(e.title)+" ")]),n("select",{directives:[{name:"model",rawName:"v-model",value:e.entries,expression:"entries"}],staticClass:"custom-select custom-select-sm form-control form-control-sm",on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){var t="_value"in e?e._value:e.value;return t}));e.entries=t.target.multiple?n:n[0]}}},e._l(e.options,(function(t){return n("option",{key:t},[e._v(e._s(t))])})),0)])}),o=[],s=(n("e260"),n("ddb0"),{name:"DatatableSelect",props:{options:{type:Array},title:{type:String,default:"Show entries"}},data:function(){return{entries:this.options[0]}},watch:{entries:function(){this.$emit("getValue",this.entries)}}}),l=s,d=l,u=n("2877"),c=Object(u["a"])(d,r,o,!1,null,null,null),h=c.exports,f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"dataTables_filter float-right pb-2"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.search,expression:"search"}],staticClass:"form-control form-control-sm",attrs:{type:"search",placeholder:e.placeholder},domProps:{value:e.search},on:{input:function(t){t.target.composing||(e.search=t.target.value)}}})])},m=[],p={name:"DatatableSearch",data:function(){return{search:""}},props:{placeholder:{type:String,default:"Search"}},watch:{search:function(){this.$emit("getValue",this.search)}}},_=p,g=_,y=Object(u["a"])(g,f,m,!1,null,null,null),v=y.exports,b=(n("99af"),n("c740"),n("4160"),n("c975"),n("d81d"),n("fb6a"),n("a9e3"),n("e6cf"),n("5319"),n("c7cd"),n("159b"),n("060a")),M=n("c8b9"),L=n("9a03"),k=n("4b5c"),w=n("3a3c"),x=n("2a95"),Y=n("6583"),S=n("e601"),D=n("2b57"),T=n("2c40"),H={components:{mdbTbl:w["a"],mdbTblHead:x["a"],mdbTblBody:Y["a"],mdbPagination:S["a"],mdbPageItem:D["a"],mdbInput:T["default"],mdbIcon:b["a"],mdbRow:M["a"],mdbCol:L["a"],mdbBtn:k["a"]},props:{data:{type:[Object,String],default:function(){return{columns:[],rows:[]}}},autoWidth:{type:Boolean,default:!1},bordered:{type:Boolean,default:!1},borderless:{type:Boolean,default:!1},dark:{type:Boolean,default:!1},fixed:{type:Boolean,default:!1},headerColor:{type:String},headerWhite:{type:Boolean,default:!1},hover:{type:Boolean,default:!1},maxWidth:{type:String},maxHeight:{type:String},order:{type:Array},pagination:{type:Boolean,default:!0},responsive:{type:Boolean,default:!1},responsiveSm:{type:Boolean,default:!1},responsiveMd:{type:Boolean,default:!1},responsiveLg:{type:Boolean,default:!1},responsiveXl:{type:Boolean,default:!1},scrollY:{type:Boolean,defautl:!1},searching:{type:Boolean,default:!0},sorting:{type:Boolean,default:!0},striped:{type:Boolean,default:!1},start:{type:String,default:"Start"},end:{type:String,default:"End"},next:{type:String,default:"Next"},previous:{type:String,default:"Previous"},arrows:{type:Boolean,default:!1},display:{type:Number,default:5},defaultRow:{type:String,default:"-"},defaultCol:{type:String,default:"undefined"},tfoot:{type:Boolean,default:!0},reactive:{type:Boolean,default:!1},refresh:{type:Boolean,default:!1},time:{type:Number,default:5e3},searchPlaceholder:{type:String},entriesTitle:{type:String},noFoundMessage:{type:String,default:"No matching records found"},showingText:{type:String,default:"Showing"},focus:{type:Boolean,default:!1},btnColor:{type:String,default:"primary"},selectColor:{type:String,default:"blue lighten-4"},hoverColor:{type:String,default:"blue lighten-5"},paginationColor:{type:String,default:"blue"},checkbox:{type:Boolean,default:!1}},data:function(){return{updatedKey:null,reactiveFlag:!1,recentSort:null,interval:null,selected:-1,hovered:-1,rows:this.data.rows||[],columns:this.data.columns||[],entries:10,pages:[],activePage:0,search:"",tableProps:{autoWidth:this.autoWidth,bordered:this.bordered,borderless:this.borderless,dark:this.dark,fixed:this.fixed,hover:this.hover,responsive:this.responsive,responsiveSm:this.responsiveSm,responsiveMd:this.responsiveMd,responsiveLg:this.responsiveLg,responsiveXl:this.responsiveXl,striped:this.striped,dtScrollY:this.scrollY,maxHeight:this.maxHeight},wrapperStyle:{maxWidth:this.maxWidth?this.maxWidth:"100%",margin:"0 auto"}}},computed:{rowsDisplay:function(){return this.formatRows()},visiblePages:function(){var e=this.activePage-Math.floor(this.display/2)>0?this.activePage-Math.floor(this.display/2):0,t=e+this.display<this.pages.length?e+this.display:this.pages.length;return t-e<this.display&&t-this.display>=0&&(e=t-this.display),this.pages.slice(e,t)},componentKey:function(){return this.updatedKey}},methods:{changePage:function(e){this.activePage=e},sort:function(e,t){var n=this.rows[this.selected];e&&(this.recentSort={field:e,sort:t},this.sorting&&("asc"===t?this.rows.sort((function(t,n){return t[e]>n[e]?1:-1})):this.rows.sort((function(t,n){return t[e]>n[e]?-1:1})),this.columns[this.columns.findIndex((function(t){return t.field===e}))].sort="asc"===t?"desc":"desc"===t?"asc":null)),this.selected=this.rows.indexOf(n)},escapeRegExp:function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")},updateEntries:function(e){this.entries=e},updateSearch:function(e){this.search=this.escapeRegExp(e),this.activePage=0},fetchData:function(){var e=this;fetch(this.data).then((function(e){return e.json()})).then((function(t){e.columns=t.columns,e.rows=t.rows,e.$emit("fields",e.columns)})).then((function(){e.recentSort&&e.sort(e.recentSort.field,e.recentSort.sort)})).catch((function(e){return console.log(e)}))},updateData:function(){this.fetchData(),this.reactiveFlag=!0,this.updatedKey=Math.floor(1e8*Math.random())},selectRow:function(e){var t=this.rowsDisplay.indexOf(e);this.selected===t&&(t=-1),this.selected=t,this.$emit("selectRow",t)},formatRows:function(){var e=this;this.setDefaultColumns();var t=[];return this.rows.map((function(n){var a=[];e.columns.forEach((function(t){var i=n[t.field]||e.defaultRow;i=t.format?t.format(i):i,a.push(i)})),t.push(a)})),t},setDefaultColumns:function(){var e=this;this.columns.forEach((function(t,n){t||(e.columns[n]={label:e.defaultCol,field:e.defaultCol.concat(n),sort:"asc"})}))}},mounted:function(){"string"===typeof this.data&&this.fetchData(),this.reactive&&(this.interval=setInterval(this.updateData,this.time));var e=Math.ceil(this.filteredRows.length/this.entries);if(this.pages=[],this.pagination)for(var t=1;t<=e;t++){var n=t*this.entries;this.pages.push(this.filteredRows.slice(n-this.entries,n))}else this.pages.push(this.filteredRows);this.activePage=0,this.order&&this.sort(this.columns[this.order[0]].field,this.order[1]),this.$emit("pages",this.pages),this.$emit("fields",this.columns)},beforeDestroy:function(){this.reactive&&window.clearInterval(this.interval)},watch:{data:function(e){this.columns=e.columns},entries:function(){var e=Math.ceil(this.filteredRows.length/this.entries);this.pages=[];for(var t=1;t<=e;t++){var n=t*this.entries;this.pages.push(this.filteredRows.slice(n-this.entries,n))}this.activePage=this.activePage<this.pages.length?this.activePage:this.pages.length-1,this.$emit("pages",this.pages)},filteredRows:function(){var e=this.activePage,t=Math.ceil(this.filteredRows.length/this.entries);if(this.pages=[],this.pagination)for(var n=1;n<=t;n++){var a=n*this.entries;this.pages.push(this.filteredRows.slice(a-this.entries,a))}else this.pages.push(this.filteredRows);!1===this.reactiveFlag&&(this.activePage=0),this.activePage=e,this.$emit("pages",this.pages)}}},C={name:"Datatable",data:function(){return{options:[10,25,50,100]}},components:{DatatableSearch:v,DatatableSelect:h},computed:{filteredRows:function(){var e=this;return this.rowsDisplay.filter((function(t){return t.filter((function(t){return t.toString().toLowerCase().match(e.search.toLowerCase())})).length>0}))}},mixins:[H]},O=C,j=O,P=(n("8e8f"),n("4c52"),Object(u["a"])(j,a,i,!1,null,"9e461b42",null));t["default"]=P.exports},"6ce3":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split("_"),monthsParseExact:!0,weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"sø._ma._ti._on._to._fr._lø.".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] HH:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"noen sekunder",ss:"%d sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return t}))},"6d79":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={0:"-ші",1:"-ші",2:"-ші",3:"-ші",4:"-ші",5:"-ші",6:"-шы",7:"-ші",8:"-ші",9:"-шы",10:"-шы",20:"-шы",30:"-шы",40:"-шы",50:"-ші",60:"-шы",70:"-ші",80:"-ші",90:"-шы",100:"-ші"},n=e.defineLocale("kk",{months:"қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан".split("_"),monthsShort:"қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел".split("_"),weekdays:"жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі".split("_"),weekdaysShort:"жек_дүй_сей_сәр_бей_жұм_сен".split("_"),weekdaysMin:"жк_дй_сй_ср_бй_жм_сн".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Бүгін сағат] LT",nextDay:"[Ертең сағат] LT",nextWeek:"dddd [сағат] LT",lastDay:"[Кеше сағат] LT",lastWeek:"[Өткен аптаның] dddd [сағат] LT",sameElse:"L"},relativeTime:{future:"%s ішінде",past:"%s бұрын",s:"бірнеше секунд",ss:"%d секунд",m:"бір минут",mm:"%d минут",h:"бір сағат",hh:"%d сағат",d:"бір күн",dd:"%d күн",M:"бір ай",MM:"%d ай",y:"бір жыл",yy:"%d жыл"},dayOfMonthOrdinalParse:/\d{1,2}-(ші|шы)/,ordinal:function(e){var n=e%10,a=e>=100?100:null;return e+(t[e]||t[n]||t[a])},week:{dow:1,doy:7}});return n}))},"6d83":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",ss:"%d ثانية",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}});return t}))},"6e98":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato".split("_"),weekdaysShort:"dom_lun_mar_mer_gio_ven_sab".split("_"),weekdaysMin:"do_lu_ma_me_gi_ve_sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(e){return(/^[0-9].+$/.test(e)?"tra":"in")+" "+e},past:"%s fa",s:"alcuni secondi",ss:"%d secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});return t}))},"6eeb":function(e,t,n){var a=n("da84"),i=n("5692"),r=n("9112"),o=n("5135"),s=n("ce4e"),l=n("9e81"),d=n("69f3"),u=d.get,c=d.enforce,h=String(l).split("toString");i("inspectSource",(function(e){return l.call(e)})),(e.exports=function(e,t,n,i){var l=!!i&&!!i.unsafe,d=!!i&&!!i.enumerable,u=!!i&&!!i.noTargetGet;"function"==typeof n&&("string"!=typeof t||o(n,"name")||r(n,"name",t),c(n).source=h.join("string"==typeof t?t:"")),e!==a?(l?!u&&e[t]&&(d=!0):delete e[t],d?e[t]=n:r(e,t,n)):d?e[t]=n:s(t,n)})(Function.prototype,"toString",(function(){return"function"==typeof this&&u(this).source||l.call(this)}))},"6f12":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("it-ch",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato".split("_"),weekdaysShort:"dom_lun_mar_mer_gio_ven_sab".split("_"),weekdaysMin:"do_lu_ma_me_gi_ve_sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(e){return(/^[0-9].+$/.test(e)?"tra":"in")+" "+e},past:"%s fa",s:"alcuni secondi",ss:"%d secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});return t}))},"6f50":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("en-nz",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n},week:{dow:1,doy:4}});return t}))},"6f53":function(e,t,n){var a=n("83ab"),i=n("df75"),r=n("fc6a"),o=n("d1e7").f,s=function(e){return function(t){var n,s=r(t),l=i(s),d=l.length,u=0,c=[];while(d>u)n=l[u++],a&&!o.call(s,n)||c.push(e?[n,s[n]]:s[n]);return c}};e.exports={entries:s(!0),values:s(!1)}},7118:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_"),n="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),a=e.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(e,a){return e?/-MMM-/.test(a)?n[e.month()]:t[e.month()]:t},monthsParseExact:!0,weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",ss:"%d sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}});return a}))},7156:function(e,t,n){var a=n("861d"),i=n("d2bb");e.exports=function(e,t,n){var r,o;return i&&"function"==typeof(r=t.constructor)&&r!==n&&a(o=r.prototype)&&o!==n.prototype&&i(e,o),e}},7333:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("en-il",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n}});return t}))},7418:function(e,t){t.f=Object.getOwnPropertySymbols},"746f":function(e,t,n){var a=n("428f"),i=n("5135"),r=n("c032"),o=n("9bf2").f;e.exports=function(e){var t=a.Symbol||(a.Symbol={});i(t,e)||o(t,e,{value:r.f(e)})}},"74dc":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("sw",{months:"Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des".split("_"),weekdays:"Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi".split("_"),weekdaysShort:"Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos".split("_"),weekdaysMin:"J2_J3_J4_J5_Al_Ij_J1".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[leo saa] LT",nextDay:"[kesho saa] LT",nextWeek:"[wiki ijayo] dddd [saat] LT",lastDay:"[jana] LT",lastWeek:"[wiki iliyopita] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s baadaye",past:"tokea %s",s:"hivi punde",ss:"sekunde %d",m:"dakika moja",mm:"dakika %d",h:"saa limoja",hh:"masaa %d",d:"siku moja",dd:"masiku %d",M:"mwezi mmoja",MM:"miezi %d",y:"mwaka mmoja",yy:"miaka %d"},week:{dow:1,doy:7}});return t}))},7829:function(e,t,n){"use strict";var a=n("ffab"),i=n.n(a);i.a},"782c":function(e,t,n){"use strict";var a=n("c700"),i=n.n(a);i.a},7839:function(e,t){e.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},"7b0b":function(e,t,n){var a=n("1d80");e.exports=function(e){return Object(a(e))}},"7be6":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),n="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");function a(e){return e>1&&e<5}function i(e,t,n,i){var r=e+" ";switch(n){case"s":return t||i?"pár sekúnd":"pár sekundami";case"ss":return t||i?r+(a(e)?"sekundy":"sekúnd"):r+"sekundami";case"m":return t?"minúta":i?"minútu":"minútou";case"mm":return t||i?r+(a(e)?"minúty":"minút"):r+"minútami";case"h":return t?"hodina":i?"hodinu":"hodinou";case"hh":return t||i?r+(a(e)?"hodiny":"hodín"):r+"hodinami";case"d":return t||i?"deň":"dňom";case"dd":return t||i?r+(a(e)?"dni":"dní"):r+"dňami";case"M":return t||i?"mesiac":"mesiacom";case"MM":return t||i?r+(a(e)?"mesiace":"mesiacov"):r+"mesiacmi";case"y":return t||i?"rok":"rokom";case"yy":return t||i?r+(a(e)?"roky":"rokov"):r+"rokmi"}}var r=e.defineLocale("sk",{months:t,monthsShort:n,weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:i,ss:i,m:i,mm:i,h:i,hh:i,d:i,dd:i,M:i,MM:i,y:i,yy:i},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return r}))},"7c73":function(e,t,n){var a=n("825a"),i=n("37e8"),r=n("7839"),o=n("d012"),s=n("1be4"),l=n("cc12"),d=n("f772"),u=d("IE_PROTO"),c="prototype",h=function(){},f=function(){var e,t=l("iframe"),n=r.length,a="<",i="script",o=">",d="java"+i+":";t.style.display="none",s.appendChild(t),t.src=String(d),e=t.contentWindow.document,e.open(),e.write(a+i+o+"document.F=Object"+a+"/"+i+o),e.close(),f=e.F;while(n--)delete f[c][r[n]];return f()};e.exports=Object.create||function(e,t){var n;return null!==e?(h[c]=a(e),n=new h,h[c]=null,n[u]=e):n=f(),void 0===t?n:i(n,t)},o[u]=!0},"7c80":function(e,t,n){"use strict";var a=n("1347"),i=n.n(a);i.a},"7db0":function(e,t,n){"use strict";var a=n("23e7"),i=n("b727").find,r=n("44d2"),o="find",s=!0;o in[]&&Array(1)[o]((function(){s=!1})),a({target:"Array",proto:!0,forced:s},{find:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}}),r(o)},"7dd0":function(e,t,n){"use strict";var a=n("23e7"),i=n("9ed3"),r=n("e163"),o=n("d2bb"),s=n("d44e"),l=n("9112"),d=n("6eeb"),u=n("b622"),c=n("c430"),h=n("3f8c"),f=n("ae93"),m=f.IteratorPrototype,p=f.BUGGY_SAFARI_ITERATORS,_=u("iterator"),g="keys",y="values",v="entries",b=function(){return this};e.exports=function(e,t,n,u,f,M,L){i(n,t,u);var k,w,x,Y=function(e){if(e===f&&C)return C;if(!p&&e in T)return T[e];switch(e){case g:return function(){return new n(this,e)};case y:return function(){return new n(this,e)};case v:return function(){return new n(this,e)}}return function(){return new n(this)}},S=t+" Iterator",D=!1,T=e.prototype,H=T[_]||T["@@iterator"]||f&&T[f],C=!p&&H||Y(f),O="Array"==t&&T.entries||H;if(O&&(k=r(O.call(new e)),m!==Object.prototype&&k.next&&(c||r(k)===m||(o?o(k,m):"function"!=typeof k[_]&&l(k,_,b)),s(k,S,!0,!0),c&&(h[S]=b))),f==y&&H&&H.name!==y&&(D=!0,C=function(){return H.call(this)}),c&&!L||T[_]===C||l(T,_,C),h[t]=C,f)if(w={values:Y(y),keys:M?C:Y(g),entries:Y(v)},L)for(x in w)(p||D||!(x in T))&&d(T,x,w[x]);else a({target:t,proto:!0,forced:p||D},w);return w}},"7efe":function(e,t,n){},"7f33":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("yo",{months:"Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀".split("_"),monthsShort:"Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀".split("_"),weekdays:"Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta".split("_"),weekdaysShort:"Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá".split("_"),weekdaysMin:"Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Ònì ni] LT",nextDay:"[Ọ̀la ni] LT",nextWeek:"dddd [Ọsẹ̀ tón'bọ] [ni] LT",lastDay:"[Àna ni] LT",lastWeek:"dddd [Ọsẹ̀ tólọ́] [ni] LT",sameElse:"L"},relativeTime:{future:"ní %s",past:"%s kọjá",s:"ìsẹjú aayá die",ss:"aayá %d",m:"ìsẹjú kan",mm:"ìsẹjú %d",h:"wákati kan",hh:"wákati %d",d:"ọjọ́ kan",dd:"ọjọ́ %d",M:"osù kan",MM:"osù %d",y:"ọdún kan",yy:"ọdún %d"},dayOfMonthOrdinalParse:/ọjọ́\s\d{1,2}/,ordinal:"ọjọ́ %d",week:{dow:1,doy:4}});return t}))},"7f9a":function(e,t,n){var a=n("da84"),i=n("9e81"),r=a.WeakMap;e.exports="function"===typeof r&&/native code/.test(i.call(r))},8155:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n,a){var i=e+" ";switch(n){case"s":return t||a?"nekaj sekund":"nekaj sekundami";case"ss":return i+=1===e?t?"sekundo":"sekundi":2===e?t||a?"sekundi":"sekundah":e<5?t||a?"sekunde":"sekundah":"sekund",i;case"m":return t?"ena minuta":"eno minuto";case"mm":return i+=1===e?t?"minuta":"minuto":2===e?t||a?"minuti":"minutama":e<5?t||a?"minute":"minutami":t||a?"minut":"minutami",i;case"h":return t?"ena ura":"eno uro";case"hh":return i+=1===e?t?"ura":"uro":2===e?t||a?"uri":"urama":e<5?t||a?"ure":"urami":t||a?"ur":"urami",i;case"d":return t||a?"en dan":"enim dnem";case"dd":return i+=1===e?t||a?"dan":"dnem":2===e?t||a?"dni":"dnevoma":t||a?"dni":"dnevi",i;case"M":return t||a?"en mesec":"enim mesecem";case"MM":return i+=1===e?t||a?"mesec":"mesecem":2===e?t||a?"meseca":"mesecema":e<5?t||a?"mesece":"meseci":t||a?"mesecev":"meseci",i;case"y":return t||a?"eno leto":"enim letom";case"yy":return i+=1===e?t||a?"leto":"letom":2===e?t||a?"leti":"letoma":e<5?t||a?"leta":"leti":t||a?"let":"leti",i}}var n=e.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejšnjo] [nedeljo] [ob] LT";case 3:return"[prejšnjo] [sredo] [ob] LT";case 6:return"[prejšnjo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"pred %s",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});return n}))},"81d5":function(e,t,n){"use strict";var a=n("7b0b"),i=n("23cb"),r=n("50c4");e.exports=function(e){var t=a(this),n=r(t.length),o=arguments.length,s=i(o>1?arguments[1]:void 0,n),l=o>2?arguments[2]:void 0,d=void 0===l?n:i(l,n);while(d>s)t[s++]=e;return t}},"81e9":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),n=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",t[7],t[8],t[9]];function a(e,t,n,a){var r="";switch(n){case"s":return a?"muutaman sekunnin":"muutama sekunti";case"ss":return a?"sekunnin":"sekuntia";case"m":return a?"minuutin":"minuutti";case"mm":r=a?"minuutin":"minuuttia";break;case"h":return a?"tunnin":"tunti";case"hh":r=a?"tunnin":"tuntia";break;case"d":return a?"päivän":"päivä";case"dd":r=a?"päivän":"päivää";break;case"M":return a?"kuukauden":"kuukausi";case"MM":r=a?"kuukauden":"kuukautta";break;case"y":return a?"vuoden":"vuosi";case"yy":r=a?"vuoden":"vuotta";break}return r=i(e,a)+" "+r,r}function i(e,a){return e<10?a?n[e]:t[e]:e}var r=e.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:a,ss:a,m:a,mm:a,h:a,hh:a,d:a,dd:a,M:a,MM:a,y:a,yy:a},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return r}))},8230:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},n={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},a=e.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(e){return"م"===e},meridiem:function(e,t,n){return e<12?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",ss:"%d ثانية",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(e){return e.replace(/[١٢٣٤٥٦٧٨٩٠]/g,(function(e){return n[e]})).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"،")},week:{dow:0,doy:6}});return a}))},"825a":function(e,t,n){var a=n("861d");e.exports=function(e){if(!a(e))throw TypeError(String(e)+" is not an object");return e}},"83ab":function(e,t,n){var a=n("d039");e.exports=!a((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},8418:function(e,t,n){"use strict";var a=n("c04e"),i=n("9bf2"),r=n("5c6c");e.exports=function(e,t,n){var o=a(t);o in e?i.f(e,o,r(0,n)):e[o]=n}},"841c":function(e,t,n){"use strict";var a=n("d784"),i=n("825a"),r=n("1d80"),o=n("129f"),s=n("14c3");a("search",1,(function(e,t,n){return[function(t){var n=r(this),a=void 0==t?void 0:t[e];return void 0!==a?a.call(t,n):new RegExp(t)[e](String(n))},function(e){var a=n(t,e,this);if(a.done)return a.value;var r=i(e),l=String(this),d=r.lastIndex;o(d,0)||(r.lastIndex=0);var u=s(r,l);return o(r.lastIndex,d)||(r.lastIndex=d),null===u?-1:u.index}]}))},"84aa":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",ss:"%d секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},dayOfMonthOrdinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(e){var t=e%10,n=e%100;return 0===e?e+"-ев":0===n?e+"-ен":n>10&&n<20?e+"-ти":1===t?e+"-ви":2===t?e+"-ри":7===t||8===t?e+"-ми":e+"-ти"},week:{dow:1,doy:7}});return t}))},"857a":function(e,t,n){var a=n("1d80"),i=/"/g;e.exports=function(e,t,n,r){var o=String(a(e)),s="<"+t;return""!==n&&(s+=" "+n+'="'+String(r).replace(i,"&quot;")+'"'),s+">"+o+"</"+t+">"}},"861d":function(e,t){e.exports=function(e){return"object"===typeof e?null!==e:"function"===typeof e}},8689:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"},n={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"},a=e.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",ss:"%d စက္ကန့်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(e){return e.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},week:{dow:1,doy:4}});return a}))},"876f":function(e,t,n){},8840:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("gl",{months:"xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro".split("_"),monthsShort:"xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"domingo_luns_martes_mércores_xoves_venres_sábado".split("_"),weekdaysShort:"dom._lun._mar._mér._xov._ven._sáb.".split("_"),weekdaysMin:"do_lu_ma_mé_xo_ve_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(e){return 0===e.indexOf("un")?"n"+e:"en "+e},past:"hai %s",s:"uns segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});return t}))},8875:function(e,t,n){var a,i,r;(function(n,o){i=[],a=o,r="function"===typeof a?a.apply(t,i):a,void 0===r||(e.exports=r)})("undefined"!==typeof self&&self,(function(){function e(){if(document.currentScript)return document.currentScript;try{throw new Error}catch(c){var e,t,n,a=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,i=/@([^@]*):(\d+):(\d+)\s*$/gi,r=a.exec(c.stack)||i.exec(c.stack),o=r&&r[1]||!1,s=r&&r[2]||!1,l=document.location.href.replace(document.location.hash,""),d=document.getElementsByTagName("script");o===l&&(e=document.documentElement.outerHTML,t=new RegExp("(?:[^\\n]+?\\n){0,"+(s-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),n=e.replace(t,"$1").trim());for(var u=0;u<d.length;u++){if("interactive"===d[u].readyState)return d[u];if(d[u].src===o)return d[u];if(o===l&&d[u].innerHTML&&d[u].innerHTML.trim()===n)return d[u]}return null}}return e}))},"88c8":function(e,t,n){"use strict";var a=n("3f2f"),i=n.n(a);i.a},"898b":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),n="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),a=[/^ene/i,/^feb/i,/^mar/i,/^abr/i,/^may/i,/^jun/i,/^jul/i,/^ago/i,/^sep/i,/^oct/i,/^nov/i,/^dic/i],i=/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,r=e.defineLocale("es",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,a){return e?/-MMM-/.test(a)?n[e.month()]:t[e.month()]:t},monthsRegex:i,monthsShortRegex:i,monthsStrictRegex:/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,monthsShortStrictRegex:/^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,monthsParse:a,longMonthsParse:a,shortMonthsParse:a,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",ss:"%d segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});return r}))},"8aa5":function(e,t,n){"use strict";var a=n("6547").charAt;e.exports=function(e,t,n){return t+(n?a(e,t).length:1)}},"8d47":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e){return e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}var n=e.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(e,t){return e?"string"===typeof t&&/D/.test(t.substring(0,t.indexOf("MMMM")))?this._monthsGenitiveEl[e.month()]:this._monthsNominativeEl[e.month()]:this._monthsNominativeEl},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(e,t,n){return e>11?n?"μμ":"ΜΜ":n?"πμ":"ΠΜ"},isPM:function(e){return"μ"===(e+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(e,n){var a=this._calendarEl[e],i=n&&n.hours();return t(a)&&(a=a.apply(n)),a.replace("{}",i%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",ss:"%d δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},dayOfMonthOrdinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}});return n}))},"8d57":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),n="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");function a(e){return e%10<5&&e%10>1&&~~(e/10)%10!==1}function i(e,t,n){var i=e+" ";switch(n){case"ss":return i+(a(e)?"sekundy":"sekund");case"m":return t?"minuta":"minutę";case"mm":return i+(a(e)?"minuty":"minut");case"h":return t?"godzina":"godzinę";case"hh":return i+(a(e)?"godziny":"godzin");case"MM":return i+(a(e)?"miesiące":"miesięcy");case"yy":return i+(a(e)?"lata":"lat")}}var r=e.defineLocale("pl",{months:function(e,a){return e?""===a?"("+n[e.month()]+"|"+t[e.month()]+")":/D MMMM/.test(a)?n[e.month()]:t[e.month()]:t},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"ndz_pon_wt_śr_czw_pt_sob".split("_"),weekdaysMin:"Nd_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:function(){switch(this.day()){case 0:return"[W niedzielę o] LT";case 2:return"[We wtorek o] LT";case 3:return"[W środę o] LT";case 6:return"[W sobotę o] LT";default:return"[W] dddd [o] LT"}},lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",ss:i,m:i,mm:i,h:i,hh:i,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:i,y:"rok",yy:i},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return r}))},"8df4":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"},n={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"},a=e.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(e){return/بعد از ظهر/.test(e)},meridiem:function(e,t,n){return e<12?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چند ثانیه",ss:"ثانیه d%",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(e){return e.replace(/[۰-۹]/g,(function(e){return n[e]})).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"،")},dayOfMonthOrdinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}});return a}))},"8e73":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},n={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},a=function(e){return 0===e?0:1===e?1:2===e?2:e%100>=3&&e%100<=10?3:e%100>=11?4:5},i={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},r=function(e){return function(t,n,r,o){var s=a(t),l=i[e][a(t)];return 2===s&&(l=l[n?0:1]),l.replace(/%d/i,t)}},o=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],s=e.defineLocale("ar",{months:o,monthsShort:o,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(e){return"م"===e},meridiem:function(e,t,n){return e<12?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:r("s"),ss:r("s"),m:r("m"),mm:r("m"),h:r("h"),hh:r("h"),d:r("d"),dd:r("d"),M:r("M"),MM:r("M"),y:r("y"),yy:r("y")},preparse:function(e){return e.replace(/[١٢٣٤٥٦٧٨٩٠]/g,(function(e){return n[e]})).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]})).replace(/,/g,"،")},week:{dow:6,doy:12}});return s}))},"8e8f":function(e,t,n){"use strict";var a=n("26a4"),i=n.n(a);i.a},"8f40":function(e,t,n){"use strict";var a=n("65d4"),i=n.n(a);i.a},9043:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"},n={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"},a=e.defineLocale("bn",{months:"জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি".split("_"),weekdaysMin:"রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm সময়",LLLL:"dddd, D MMMM YYYY, A h:mm সময়"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কয়েক সেকেন্ড",ss:"%d সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(e){return e.replace(/[১২৩৪৫৬৭৮৯০]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/রাত|সকাল|দুপুর|বিকাল|রাত/,meridiemHour:function(e,t){return 12===e&&(e=0),"রাত"===t&&e>=4||"দুপুর"===t&&e<5||"বিকাল"===t?e+12:e},meridiem:function(e,t,n){return e<4?"রাত":e<10?"সকাল":e<17?"দুপুর":e<20?"বিকাল":"রাত"},week:{dow:0,doy:6}});return a}))},"90e3":function(e,t){var n=0,a=Math.random();e.exports=function(e){return"Symbol("+String(void 0===e?"":e)+")_"+(++n+a).toString(36)}},"90ea":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日 HH:mm",LLLL:"YYYY年M月D日dddd HH:mm",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(e,t){return 12===e&&(e=0),"凌晨"===t||"早上"===t||"上午"===t?e:"中午"===t?e>=11?e:e+12:"下午"===t||"晚上"===t?e+12:void 0},meridiem:function(e,t,n){var a=100*e+t;return a<600?"凌晨":a<900?"早上":a<1130?"上午":a<1230?"中午":a<1800?"下午":"晚上"},calendar:{sameDay:"[今天] LT",nextDay:"[明天] LT",nextWeek:"[下]dddd LT",lastDay:"[昨天] LT",lastWeek:"[上]dddd LT",sameElse:"L"},dayOfMonthOrdinalParse:/\d{1,2}(日|月|週)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"日";case"M":return e+"月";case"w":case"W":return e+"週";default:return e}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",ss:"%d 秒",m:"1 分鐘",mm:"%d 分鐘",h:"1 小時",hh:"%d 小時",d:"1 天",dd:"%d 天",M:"1 個月",MM:"%d 個月",y:"1 年",yy:"%d 年"}});return t}))},9112:function(e,t,n){var a=n("83ab"),i=n("9bf2"),r=n("5c6c");e.exports=a?function(e,t,n){return i.f(e,t,r(1,n))}:function(e,t,n){return e[t]=n,e}},9263:function(e,t,n){"use strict";var a=n("ad6d"),i=RegExp.prototype.exec,r=String.prototype.replace,o=i,s=function(){var e=/a/,t=/b*/g;return i.call(e,"a"),i.call(t,"a"),0!==e.lastIndex||0!==t.lastIndex}(),l=void 0!==/()??/.exec("")[1],d=s||l;d&&(o=function(e){var t,n,o,d,u=this;return l&&(n=new RegExp("^"+u.source+"$(?!\\s)",a.call(u))),s&&(t=u.lastIndex),o=i.call(u,e),s&&o&&(u.lastIndex=u.global?o.index+o[0].length:t),l&&o&&o.length>1&&r.call(o[0],n,(function(){for(d=1;d<arguments.length-2;d++)void 0===arguments[d]&&(o[d]=void 0)})),o}),e.exports=o},9327:function(e,t,n){"use strict";n("7efe");t["a"]={props:{waves:{type:Boolean,default:!0},darkWaves:{type:Boolean,default:!1}},methods:{wave:function(e){this.waves&&(this.target=e.target.classList.contains("ripple-parent")?e.currentTarget:e.target.parentElement,this.getOffsets(e),this.waveData={top:e.pageY-this.offsetTop,left:e.pageX-this.offsetLeft,height:this.$el.offsetHeight,width:this.$el.offsetWidth},(this.wavesFixed||this.isNavFixed)&&(this.waveData.top=e.clientY-this.offsetTop),this.createRipple(),this.rippleAnimate(),this.rippleRemove(this.target,this.rippleElement))},getOffsets:function(){if(this.target.offsetParent){this.offsetLeft=this.target.offsetLeft,this.offsetTop=this.target.offsetTop,this.parentOffset=this.target.offsetParent;while(this.parentOffset)this.offsetLeft+=this.parentOffset.offsetLeft,this.offsetTop+=this.parentOffset.offsetTop,this.parentOffset=this.parentOffset.offsetParent}},createRipple:function(){this.rippleElement=document.createElement("div"),this.rippleElement.classList.add("ripple"),this.rippleElement.style.top=this.waveData.top-this.waveData.width/2+"px",this.rippleElement.style.left=this.waveData.left-this.waveData.width/2+"px",this.rippleElement.style.height=this.waveData.width+"px",this.rippleElement.style.width=this.waveData.width+"px",this.darkWaves&&(this.rippleElement.style.background="rgba(0, 0, 0, 0.2)"),this.target.appendChild(this.rippleElement)},rippleAnimate:function(){this.rippleElement.classList.add("is-reppling")},rippleRemove:function(e,t){this.remove=setTimeout((function(){e.removeChild(t)}),600)}}}},"94ca":function(e,t,n){var a=n("d039"),i=/#|\.prototype\./,r=function(e,t){var n=s[o(e)];return n==d||n!=l&&("function"==typeof t?a(t):!!t)},o=r.normalize=function(e){return String(e).replace(i,".").toLowerCase()},s=r.data={},l=r.NATIVE="N",d=r.POLYFILL="P";e.exports=r},"957c":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t){var n=e.split("_");return t%10===1&&t%100!==11?n[0]:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?n[1]:n[2]}function n(e,n,a){var i={ss:n?"секунда_секунды_секунд":"секунду_секунды_секунд",mm:n?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===a?n?"минута":"минуту":e+" "+t(i[a],+e)}var a=[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[йя]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i],i=e.defineLocale("ru",{months:{format:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),standalone:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_")},monthsShort:{format:"янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"),standalone:"янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_")},weekdays:{standalone:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),format:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_"),isFormat:/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/},weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:a,longMonthsParse:a,shortMonthsParse:a,monthsRegex:/^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,monthsShortRegex:/^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,monthsStrictRegex:/^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,monthsShortStrictRegex:/^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., H:mm",LLLL:"dddd, D MMMM YYYY г., H:mm"},calendar:{sameDay:"[Сегодня, в] LT",nextDay:"[Завтра, в] LT",lastDay:"[Вчера, в] LT",nextWeek:function(e){if(e.week()===this.week())return 2===this.day()?"[Во] dddd, [в] LT":"[В] dddd, [в] LT";switch(this.day()){case 0:return"[В следующее] dddd, [в] LT";case 1:case 2:case 4:return"[В следующий] dddd, [в] LT";case 3:case 5:case 6:return"[В следующую] dddd, [в] LT"}},lastWeek:function(e){if(e.week()===this.week())return 2===this.day()?"[Во] dddd, [в] LT":"[В] dddd, [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd, [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd, [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd, [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",ss:n,m:n,mm:n,h:"час",hh:n,d:"день",dd:n,M:"месяц",MM:n,y:"год",yy:n},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(e){return/^(дня|вечера)$/.test(e)},meridiem:function(e,t,n){return e<4?"ночи":e<12?"утра":e<17?"дня":"вечера"},dayOfMonthOrdinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":return e+"-й";case"D":return e+"-го";case"w":case"W":return e+"-я";default:return e}},week:{dow:1,doy:4}});return i}))},"958b":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n,a){switch(n){case"s":return t?"хэдхэн секунд":"хэдхэн секундын";case"ss":return e+(t?" секунд":" секундын");case"m":case"mm":return e+(t?" минут":" минутын");case"h":case"hh":return e+(t?" цаг":" цагийн");case"d":case"dd":return e+(t?" өдөр":" өдрийн");case"M":case"MM":return e+(t?" сар":" сарын");case"y":case"yy":return e+(t?" жил":" жилийн");default:return e}}var n=e.defineLocale("mn",{months:"Нэгдүгээр сар_Хоёрдугаар сар_Гуравдугаар сар_Дөрөвдүгээр сар_Тавдугаар сар_Зургадугаар сар_Долдугаар сар_Наймдугаар сар_Есдүгээр сар_Аравдугаар сар_Арван нэгдүгээр сар_Арван хоёрдугаар сар".split("_"),monthsShort:"1 сар_2 сар_3 сар_4 сар_5 сар_6 сар_7 сар_8 сар_9 сар_10 сар_11 сар_12 сар".split("_"),monthsParseExact:!0,weekdays:"Ням_Даваа_Мягмар_Лхагва_Пүрэв_Баасан_Бямба".split("_"),weekdaysShort:"Ням_Дав_Мяг_Лха_Пүр_Баа_Бям".split("_"),weekdaysMin:"Ня_Да_Мя_Лх_Пү_Ба_Бя".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY оны MMMMын D",LLL:"YYYY оны MMMMын D HH:mm",LLLL:"dddd, YYYY оны MMMMын D HH:mm"},meridiemParse:/ҮӨ|ҮХ/i,isPM:function(e){return"ҮХ"===e},meridiem:function(e,t,n){return e<12?"ҮӨ":"ҮХ"},calendar:{sameDay:"[Өнөөдөр] LT",nextDay:"[Маргааш] LT",nextWeek:"[Ирэх] dddd LT",lastDay:"[Өчигдөр] LT",lastWeek:"[Өнгөрсөн] dddd LT",sameElse:"L"},relativeTime:{future:"%s дараа",past:"%s өмнө",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2} өдөр/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+" өдөр";default:return e}}});return n}))},"95ed":function(e,t,n){},9609:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={0:"-чү",1:"-чи",2:"-чи",3:"-чү",4:"-чү",5:"-чи",6:"-чы",7:"-чи",8:"-чи",9:"-чу",10:"-чу",20:"-чы",30:"-чу",40:"-чы",50:"-чү",60:"-чы",70:"-чи",80:"-чи",90:"-чу",100:"-чү"},n=e.defineLocale("ky",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),weekdays:"Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби".split("_"),weekdaysShort:"Жек_Дүй_Шей_Шар_Бей_Жум_Ише".split("_"),weekdaysMin:"Жк_Дй_Шй_Шр_Бй_Жм_Иш".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Бүгүн саат] LT",nextDay:"[Эртең саат] LT",nextWeek:"dddd [саат] LT",lastDay:"[Кечээ саат] LT",lastWeek:"[Өткөн аптанын] dddd [күнү] [саат] LT",sameElse:"L"},relativeTime:{future:"%s ичинде",past:"%s мурун",s:"бирнече секунд",ss:"%d секунд",m:"бир мүнөт",mm:"%d мүнөт",h:"бир саат",hh:"%d саат",d:"бир күн",dd:"%d күн",M:"бир ай",MM:"%d ай",y:"бир жыл",yy:"%d жыл"},dayOfMonthOrdinalParse:/\d{1,2}-(чи|чы|чү|чу)/,ordinal:function(e){var n=e%10,a=e>=100?100:null;return e+(t[e]||t[n]||t[a])},week:{dow:1,doy:7}});return n}))},"972c":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n){var a={ss:"secunde",mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},i=" ";return(e%100>=20||e>=100&&e%100===0)&&(i=" de "),e+i+a[n]}var n=e.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",ss:t,m:"un minut",mm:t,h:"o oră",hh:t,d:"o zi",dd:t,M:"o lună",MM:t,y:"un an",yy:t},week:{dow:1,doy:7}});return n}))},9797:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",ss:"%d eiliad",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},dayOfMonthOrdinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(e){var t=e,n="",a=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return t>20?n=40===t||50===t||60===t||80===t||100===t?"fed":"ain":t>0&&(n=a[t]),e+n},week:{dow:1,doy:4}});return t}))},"99af":function(e,t,n){"use strict";var a=n("23e7"),i=n("d039"),r=n("e8b5"),o=n("861d"),s=n("7b0b"),l=n("50c4"),d=n("8418"),u=n("65f0"),c=n("1dde"),h=n("b622"),f=h("isConcatSpreadable"),m=9007199254740991,p="Maximum allowed index exceeded",_=!i((function(){var e=[];return e[f]=!1,e.concat()[0]!==e})),g=c("concat"),y=function(e){if(!o(e))return!1;var t=e[f];return void 0!==t?!!t:r(e)},v=!_||!g;a({target:"Array",proto:!0,forced:v},{concat:function(e){var t,n,a,i,r,o=s(this),c=u(o,0),h=0;for(t=-1,a=arguments.length;t<a;t++)if(r=-1===t?o:arguments[t],y(r)){if(i=l(r.length),h+i>m)throw TypeError(p);for(n=0;n<i;n++,h++)n in r&&d(c,h,r[n])}else{if(h>=m)throw TypeError(p);d(c,h++,r)}return c.length=h,c}})},"9a03":function(e,t,n){"use strict";n.d(t,"b",(function(){return o}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},i=[],r=n("c101"),o={props:{tag:{type:String,default:"div"},col:{type:String},sm:{type:String},md:{type:String},lg:{type:String},xl:{type:String},offset:{type:String},offsetSm:{type:String},offsetMd:{type:String},offsetLg:{type:String},offsetXl:{type:String}},computed:{className:function(){return[this.col?"col-"+this.col:"",this.sm?"col-sm-"+this.sm:"",this.md?"col-md-"+this.md:"",this.lg?"col-lg-"+this.lg:"",this.xl?"col-xl-"+this.xl:"",this.col||this.sm||this.md||this.lg||this.xl?"":"col",this.offset?"offset-"+this.offset:"",this.offsetSm?"offset-sm-"+this.offsetSm:"",this.offsetMd?"offset-md-"+this.offsetMd:"",this.offsetLg?"offset-lg-"+this.offsetLg:"",this.offsetXl?"offset-xl-"+this.offsetXl:"",this.mdbClass]}},mixins:[r["a"]]},s=o,l=s,d=n("2877"),u=Object(d["a"])(l,a,i,!1,null,"5e2edc68",null);t["a"]=u.exports},"9b84":function(e,t,n){"use strict";var a=n("6462"),i=n.n(a);i.a},"9bdd":function(e,t,n){var a=n("825a");e.exports=function(e,t,n,i){try{return i?t(a(n)[0],n[1]):t(n)}catch(o){var r=e["return"];throw void 0!==r&&a(r.call(e)),o}}},"9bf2":function(e,t,n){var a=n("83ab"),i=n("0cfb"),r=n("825a"),o=n("c04e"),s=Object.defineProperty;t.f=a?s:function(e,t,n){if(r(e),t=o(t,!0),r(n),i)try{return s(e,t,n)}catch(a){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return"value"in n&&(e[t]=n.value),e}},"9bf6":function(e,t,n){},"9e81":function(e,t,n){var a=n("5692");e.exports=a("native-function-to-string",Function.toString)},"9ed3":function(e,t,n){"use strict";var a=n("ae93").IteratorPrototype,i=n("7c73"),r=n("5c6c"),o=n("d44e"),s=n("3f8c"),l=function(){return this};e.exports=function(e,t,n){var d=t+" Iterator";return e.prototype=i(a,{next:r(1,n)}),o(e,d,!1,!0),s[d]=l,e}},"9f26":function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"di_lu_ma_me_je_ve_sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd’hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",ss:"%d secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|)/,ordinal:function(e,t){switch(t){case"D":return e+(1===e?"er":"");default:case"M":case"Q":case"DDD":case"d":return e+(1===e?"er":"e");case"w":case"W":return e+(1===e?"re":"e")}},week:{dow:1,doy:4}});return t}))},a0bb:function(e,t,n){"use strict";var a=n("1b53"),i=n.n(a);i.a},a2bf:function(e,t,n){"use strict";var a=n("e8b5"),i=n("50c4"),r=n("f8c2"),o=function(e,t,n,s,l,d,u,c){var h,f=l,m=0,p=!!u&&r(u,c,3);while(m<s){if(m in n){if(h=p?p(n[m],m,t):n[m],d>0&&a(h))f=o(e,t,h,i(h.length),f,d-1)-1;else{if(f>=9007199254740991)throw TypeError("Exceed the acceptable array length");e[f]=h}f++}m++}return f};e.exports=o},a356:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ar-dz",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"أح_إث_ثلا_أر_خم_جم_سب".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",ss:"%d ثانية",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:0,doy:4}});return t}))},a433:function(e,t,n){"use strict";n.r(t),n.d(t,"mdbCarousel",(function(){return d}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e.indicators?n("ol",{staticClass:"carousel-indicators"},e._l(e.items,(function(t,a){return n("li",{key:a,class:{active:e.activeItem===a},on:{click:function(t){return e.changeActiveItem(a)}}})})),0):e._e(),n("div",{staticClass:"carousel-inner"},[n("div",{staticClass:"items-container w-100 p-0"},e._l(e.items,(function(t,a){return n("div",{key:a,staticClass:"item animated",class:""+(a===e.activeItem?e.enterClass:e.leaveClass),style:"z-index: "+(a===e.activeItem?"2":a===e.prevItem?"1":"0")+"; position: "+(a===e.activeItem?"relative":"absolute")+";"},[n("div",[e.customSlots?e._t(""+(a+1)):n("mdb-view",[e.items[a].img?n("img",{staticClass:"d-block w-100",attrs:{src:e.items[a].src,alt:e.items[a].alt}}):e._e(),e.items[a].video?n("video",{staticClass:"video-fluid d-block",attrs:{autoPlay:e.items[a].auto,loop:e.items[a].loop},domProps:{muted:e.items[a].muted}},[n("source",{attrs:{src:e.items[a].src,type:"video/mp4"}})]):e._e(),e.items[a].mask?n("mdb-mask",{attrs:{overlay:e.items[a].mask}}):e._e()],1),"number"!==typeof e.items&&e.items[a].caption?n("div",{staticClass:"carousel-caption animated",class:e.items[a].caption.animation?e.items[a].caption.animation:"fadeIn"},[e.items[a].caption.title?n("h3",{staticClass:"h3-responsive"},[e._v(" "+e._s(e.items[a].caption.title)+" ")]):e._e(),e.items[a].caption.text?n("p",[e._v(e._s(e.items[a].caption.text))]):e._e()]):e._e()],2)])})),0),e.controlls?n("div",[n("a",{staticClass:"carousel-control-prev",on:{click:function(t){return e.changeActiveItem(e.activeItem-1)}}},[e.controllIcons&&e.controllIcons.length>0?n("i",{class:e.controllIcons[0]}):n("span",{staticClass:"carousel-control-prev-icon",attrs:{"aria-hidden":"true"}}),n("span",{staticClass:"sr-only"},[e._v("Prev")])]),n("a",{staticClass:"carousel-control-next",on:{click:function(t){return e.changeActiveItem(e.activeItem+1)}}},[e.controllIcons&&e.controllIcons.length>0?n("i",{class:e.controllIcons[1]}):n("span",{staticClass:"carousel-control-next-icon",attrs:{"aria-hidden":"true"}}),n("span",{staticClass:"sr-only"},[e._v("Next")])])]):e._e()])])},i=[],r=(n("a9e3"),n("4b5c")),o=n("291c"),s=n("1968"),l={components:{mdbBtn:r["a"],mdbView:o["a"],mdbMask:s["a"]},props:{tag:{type:String,default:"div"},value:{type:Number,default:0},interval:{type:Number},items:{type:[Array,Number],required:!0},slide:{type:Boolean,default:!1},controlls:{type:Boolean,default:!1},controllIcons:{type:Array},indicators:{type:Boolean,default:!1}},data:function(){return{activeItem:0,prevItem:null,prevDirection:null,slidingInterval:null,queue:0,leaveClass:"fadeOut",enterClass:"fadeIn",transition:!1}},computed:{customSlots:function(){return"number"===typeof this.items}},methods:{changeActiveItem:function(e){var t=this;if(e!==this.activeItem){var n=this.numOfItems-1;if(this.prevItem=this.activeItem,this.transition=!0,!this.slide){this.leaveClass="fadeOut",this.enterClass="fadeIn";var a=e<0?n:e>n?0:e;return this.activeItem=a,void setTimeout((function(){t.transition=!1}),1e3)}var i=e>this.activeItem?1:-1,r=e-this.activeItem;this.slide?i>0?(this.leaveClass=this.one&&1!==this.visibleItems?"slideOutOneLeft":"slideOutLeft",this.enterClass=this.one&&1!==this.visibleItems?"slideInOneRight":"slideInRight"):(this.leaveClass=this.one&&1!==this.visibleItems?"slideOutOneRight":"slideOutRight",this.enterClass=this.one&&1!==this.visibleItems?"slideInOneLeft":"slideInLeft"):(this.leaveClass="fadeOut",this.enterClass="fadeIn");var o=this.activeItem+i<0?n:this.activeItem+i>n?0:this.activeItem+i;this.activeItem=o,r-=i,setTimeout((function(){0===r?t.transition=!1:t.changeActiveItem(e)}),1e3)}},changeItem:function(e){this.transition&&this.queue<3&&this.queue>-3?this.queue+=e-this.activeItem:this.changeActiveItem(e)},clearQueue:function(){if(this.queue>0)this.changeItem(this.activeItem+1),this.queue-=1;else{if(0===this.queue)return;this.changeItem(this.activeItem-1),this.queue+=1}}},mounted:function(){var e=this;this.activeItem=this.value,this.interval&&(this.slidingInterval=window.setTimeout((function(){return e.changeActiveItem(e.activeItem+1)}),this.interval))},beforeDestroy:function(){this.interval&&window.clearInterval(this.slidingInterval)},watch:{activeItem:function(e){var t=this;this.$emit("input",e),this.interval&&(window.clearTimeout(this.slidingInterval),this.slidingInterval=window.setTimeout((function(){return t.changeActiveItem(t.activeItem+1)}),this.interval))},value:function(e){e!==this.activeItem&&this.changeActiveItem(e)},transition:function(e){if(!e&&0!==this.queue){var t=this.queue/Math.abs(this.queue);this.changeActiveItem(this.activeItem+t),this.queue-=t}}}},d={computed:{className:function(){return["carousel","carousel-fade"]},numOfItems:function(){return"number"===typeof this.items?this.items:this.items.length}},mixins:[l]},u=d,c=u,h=(n("ae98"),n("2877")),f=Object(h["a"])(c,a,i,!1,null,"45e7fe2e",null);t["default"]=f.exports},a434:function(e,t,n){"use strict";var a=n("23e7"),i=n("23cb"),r=n("a691"),o=n("50c4"),s=n("7b0b"),l=n("65f0"),d=n("8418"),u=n("1dde"),c=Math.max,h=Math.min,f=9007199254740991,m="Maximum allowed length exceeded";a({target:"Array",proto:!0,forced:!u("splice")},{splice:function(e,t){var n,a,u,p,_,g,y=s(this),v=o(y.length),b=i(e,v),M=arguments.length;if(0===M?n=a=0:1===M?(n=0,a=v-b):(n=M-2,a=h(c(r(t),0),v-b)),v+n-a>f)throw TypeError(m);for(u=l(y,a),p=0;p<a;p++)_=b+p,_ in y&&d(u,p,y[_]);if(u.length=a,n<a){for(p=b;p<v-a;p++)_=p+a,g=p+n,_ in y?y[g]=y[_]:delete y[g];for(p=v;p>v-a+n;p--)delete y[p-1]}else if(n>a)for(p=v-a;p>b;p--)_=p+a-1,g=p+n-1,_ in y?y[g]=y[_]:delete y[g];for(p=0;p<n;p++)y[p+b]=arguments[p+2];return y.length=v-a+n,u}})},a4a1:function(e,t,n){(function(e,n){n(t)})(0,(function(e){"use strict";
/*!
   * perfect-scrollbar v1.4.0
   * (c) 2018 Hyunje Jun
   * @license MIT
   */function t(e){return getComputedStyle(e)}function n(e,t){for(var n in t){var a=t[n];"number"===typeof a&&(a+="px"),e.style[n]=a}return e}function a(e){var t=document.createElement("div");return t.className=e,t}var i="undefined"!==typeof Element&&(Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector);function r(e,t){if(!i)throw new Error("No element matching method supported");return i.call(e,t)}function o(e){e.remove?e.remove():e.parentNode&&e.parentNode.removeChild(e)}function s(e,t){return Array.prototype.filter.call(e.children,(function(e){return r(e,t)}))}var l={main:"ps",element:{thumb:function(e){return"ps__thumb-"+e},rail:function(e){return"ps__rail-"+e},consuming:"ps__child--consume"},state:{focus:"ps--focus",clicking:"ps--clicking",active:function(e){return"ps--active-"+e},scrolling:function(e){return"ps--scrolling-"+e}}},d={x:null,y:null};function u(e,t){var n=e.element.classList,a=l.state.scrolling(t);n.contains(a)?clearTimeout(d[t]):n.add(a)}function c(e,t){d[t]=setTimeout((function(){return e.isAlive&&e.element.classList.remove(l.state.scrolling(t))}),e.settings.scrollingThreshold)}function h(e,t){u(e,t),c(e,t)}var f=function(e){this.element=e,this.handlers={}},m={isEmpty:{configurable:!0}};f.prototype.bind=function(e,t){"undefined"===typeof this.handlers[e]&&(this.handlers[e]=[]),this.handlers[e].push(t),this.element.addEventListener(e,t,!1)},f.prototype.unbind=function(e,t){var n=this;this.handlers[e]=this.handlers[e].filter((function(a){return!(!t||a===t)||(n.element.removeEventListener(e,a,!1),!1)}))},f.prototype.unbindAll=function(){var e=this;for(var t in e.handlers)e.unbind(t)},m.isEmpty.get=function(){var e=this;return Object.keys(this.handlers).every((function(t){return 0===e.handlers[t].length}))},Object.defineProperties(f.prototype,m);var p=function(){this.eventElements=[]};function _(e){if("function"===typeof window.CustomEvent)return new CustomEvent(e);var t=document.createEvent("CustomEvent");return t.initCustomEvent(e,!1,!1,void 0),t}p.prototype.eventElement=function(e){var t=this.eventElements.filter((function(t){return t.element===e}))[0];return t||(t=new f(e),this.eventElements.push(t)),t},p.prototype.bind=function(e,t,n){this.eventElement(e).bind(t,n)},p.prototype.unbind=function(e,t,n){var a=this.eventElement(e);a.unbind(t,n),a.isEmpty&&this.eventElements.splice(this.eventElements.indexOf(a),1)},p.prototype.unbindAll=function(){this.eventElements.forEach((function(e){return e.unbindAll()})),this.eventElements=[]},p.prototype.once=function(e,t,n){var a=this.eventElement(e),i=function(e){a.unbind(t,i),n(e)};a.bind(t,i)};var g=function(e,t,n,a,i){var r;if(void 0===a&&(a=!0),void 0===i&&(i=!1),"top"===t)r=["contentHeight","containerHeight","scrollTop","y","up","down"];else{if("left"!==t)throw new Error("A proper axis should be provided");r=["contentWidth","containerWidth","scrollLeft","x","left","right"]}y(e,n,r,a,i)};function y(e,t,n,a,i){var r=n[0],o=n[1],s=n[2],l=n[3],d=n[4],u=n[5];void 0===a&&(a=!0),void 0===i&&(i=!1);var c=e.element;e.reach[l]=null,c[s]<1&&(e.reach[l]="start"),c[s]>e[r]-e[o]-1&&(e.reach[l]="end"),t&&(c.dispatchEvent(_("ps-scroll-"+l)),t<0?c.dispatchEvent(_("ps-scroll-"+d)):t>0&&c.dispatchEvent(_("ps-scroll-"+u)),a&&h(e,l)),e.reach[l]&&(t||i)&&c.dispatchEvent(_("ps-"+l+"-reach-"+e.reach[l]))}function v(e){return parseInt(e,10)||0}function b(e){return r(e,"input,[contenteditable]")||r(e,"select,[contenteditable]")||r(e,"textarea,[contenteditable]")||r(e,"button,[contenteditable]")}function M(e){var n=t(e);return v(n.width)+v(n.paddingLeft)+v(n.paddingRight)+v(n.borderLeftWidth)+v(n.borderRightWidth)}var L={isWebKit:"undefined"!==typeof document&&"WebkitAppearance"in document.documentElement.style,supportsTouch:"undefined"!==typeof window&&("ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch),supportsIePointer:"undefined"!==typeof navigator&&navigator.msMaxTouchPoints,isChrome:"undefined"!==typeof navigator&&/Chrome/i.test(navigator&&navigator.userAgent)},k=function(e){var t=e.element,n=Math.floor(t.scrollTop);e.containerWidth=t.clientWidth,e.containerHeight=t.clientHeight,e.contentWidth=t.scrollWidth,e.contentHeight=t.scrollHeight,t.contains(e.scrollbarXRail)||(s(t,l.element.rail("x")).forEach((function(e){return o(e)})),t.appendChild(e.scrollbarXRail)),t.contains(e.scrollbarYRail)||(s(t,l.element.rail("y")).forEach((function(e){return o(e)})),t.appendChild(e.scrollbarYRail)),!e.settings.suppressScrollX&&e.containerWidth+e.settings.scrollXMarginOffset<e.contentWidth?(e.scrollbarXActive=!0,e.railXWidth=e.containerWidth-e.railXMarginWidth,e.railXRatio=e.containerWidth/e.railXWidth,e.scrollbarXWidth=w(e,v(e.railXWidth*e.containerWidth/e.contentWidth)),e.scrollbarXLeft=v((e.negativeScrollAdjustment+t.scrollLeft)*(e.railXWidth-e.scrollbarXWidth)/(e.contentWidth-e.containerWidth))):e.scrollbarXActive=!1,!e.settings.suppressScrollY&&e.containerHeight+e.settings.scrollYMarginOffset<e.contentHeight?(e.scrollbarYActive=!0,e.railYHeight=e.containerHeight-e.railYMarginHeight,e.railYRatio=e.containerHeight/e.railYHeight,e.scrollbarYHeight=w(e,v(e.railYHeight*e.containerHeight/e.contentHeight)),e.scrollbarYTop=v(n*(e.railYHeight-e.scrollbarYHeight)/(e.contentHeight-e.containerHeight))):e.scrollbarYActive=!1,e.scrollbarXLeft>=e.railXWidth-e.scrollbarXWidth&&(e.scrollbarXLeft=e.railXWidth-e.scrollbarXWidth),e.scrollbarYTop>=e.railYHeight-e.scrollbarYHeight&&(e.scrollbarYTop=e.railYHeight-e.scrollbarYHeight),x(t,e),e.scrollbarXActive?t.classList.add(l.state.active("x")):(t.classList.remove(l.state.active("x")),e.scrollbarXWidth=0,e.scrollbarXLeft=0,t.scrollLeft=0),e.scrollbarYActive?t.classList.add(l.state.active("y")):(t.classList.remove(l.state.active("y")),e.scrollbarYHeight=0,e.scrollbarYTop=0,t.scrollTop=0)};function w(e,t){return e.settings.minScrollbarLength&&(t=Math.max(t,e.settings.minScrollbarLength)),e.settings.maxScrollbarLength&&(t=Math.min(t,e.settings.maxScrollbarLength)),t}function x(e,t){var a={width:t.railXWidth},i=Math.floor(e.scrollTop);t.isRtl?a.left=t.negativeScrollAdjustment+e.scrollLeft+t.containerWidth-t.contentWidth:a.left=e.scrollLeft,t.isScrollbarXUsingBottom?a.bottom=t.scrollbarXBottom-i:a.top=t.scrollbarXTop+i,n(t.scrollbarXRail,a);var r={top:i,height:t.railYHeight};t.isScrollbarYUsingRight?t.isRtl?r.right=t.contentWidth-(t.negativeScrollAdjustment+e.scrollLeft)-t.scrollbarYRight-t.scrollbarYOuterWidth:r.right=t.scrollbarYRight-e.scrollLeft:t.isRtl?r.left=t.negativeScrollAdjustment+e.scrollLeft+2*t.containerWidth-t.contentWidth-t.scrollbarYLeft-t.scrollbarYOuterWidth:r.left=t.scrollbarYLeft+e.scrollLeft,n(t.scrollbarYRail,r),n(t.scrollbarX,{left:t.scrollbarXLeft,width:t.scrollbarXWidth-t.railBorderXWidth}),n(t.scrollbarY,{top:t.scrollbarYTop,height:t.scrollbarYHeight-t.railBorderYWidth})}var Y=function(e){e.event.bind(e.scrollbarY,"mousedown",(function(e){return e.stopPropagation()})),e.event.bind(e.scrollbarYRail,"mousedown",(function(t){var n=t.pageY-window.pageYOffset-e.scrollbarYRail.getBoundingClientRect().top,a=n>e.scrollbarYTop?1:-1;e.element.scrollTop+=a*e.containerHeight,k(e),t.stopPropagation()})),e.event.bind(e.scrollbarX,"mousedown",(function(e){return e.stopPropagation()})),e.event.bind(e.scrollbarXRail,"mousedown",(function(t){var n=t.pageX-window.pageXOffset-e.scrollbarXRail.getBoundingClientRect().left,a=n>e.scrollbarXLeft?1:-1;e.element.scrollLeft+=a*e.containerWidth,k(e),t.stopPropagation()}))},S=function(e){D(e,["containerWidth","contentWidth","pageX","railXWidth","scrollbarX","scrollbarXWidth","scrollLeft","x","scrollbarXRail"]),D(e,["containerHeight","contentHeight","pageY","railYHeight","scrollbarY","scrollbarYHeight","scrollTop","y","scrollbarYRail"])};function D(e,t){var n=t[0],a=t[1],i=t[2],r=t[3],o=t[4],s=t[5],d=t[6],h=t[7],f=t[8],m=e.element,p=null,_=null,g=null;function y(t){m[d]=p+g*(t[i]-_),u(e,h),k(e),t.stopPropagation(),t.preventDefault()}function v(){c(e,h),e[f].classList.remove(l.state.clicking),e.event.unbind(e.ownerDocument,"mousemove",y)}e.event.bind(e[o],"mousedown",(function(t){p=m[d],_=t[i],g=(e[a]-e[n])/(e[r]-e[s]),e.event.bind(e.ownerDocument,"mousemove",y),e.event.once(e.ownerDocument,"mouseup",v),e[f].classList.add(l.state.clicking),t.stopPropagation(),t.preventDefault()}))}var T=function(e){var t=e.element,n=function(){return r(t,":hover")},a=function(){return r(e.scrollbarX,":focus")||r(e.scrollbarY,":focus")};function i(n,a){var i=Math.floor(t.scrollTop);if(0===n){if(!e.scrollbarYActive)return!1;if(0===i&&a>0||i>=e.contentHeight-e.containerHeight&&a<0)return!e.settings.wheelPropagation}var r=t.scrollLeft;if(0===a){if(!e.scrollbarXActive)return!1;if(0===r&&n<0||r>=e.contentWidth-e.containerWidth&&n>0)return!e.settings.wheelPropagation}return!0}e.event.bind(e.ownerDocument,"keydown",(function(r){if(!(r.isDefaultPrevented&&r.isDefaultPrevented()||r.defaultPrevented)&&(n()||a())){var o=document.activeElement?document.activeElement:e.ownerDocument.activeElement;if(o){if("IFRAME"===o.tagName)o=o.contentDocument.activeElement;else while(o.shadowRoot)o=o.shadowRoot.activeElement;if(b(o))return}var s=0,l=0;switch(r.which){case 37:s=r.metaKey?-e.contentWidth:r.altKey?-e.containerWidth:-30;break;case 38:l=r.metaKey?e.contentHeight:r.altKey?e.containerHeight:30;break;case 39:s=r.metaKey?e.contentWidth:r.altKey?e.containerWidth:30;break;case 40:l=r.metaKey?-e.contentHeight:r.altKey?-e.containerHeight:-30;break;case 32:l=r.shiftKey?e.containerHeight:-e.containerHeight;break;case 33:l=e.containerHeight;break;case 34:l=-e.containerHeight;break;case 36:l=e.contentHeight;break;case 35:l=-e.contentHeight;break;default:return}e.settings.suppressScrollX&&0!==s||e.settings.suppressScrollY&&0!==l||(t.scrollTop-=l,t.scrollLeft+=s,k(e),i(s,l)&&r.preventDefault())}}))},H=function(e){var n=e.element;function a(t,a){var i,r=Math.floor(n.scrollTop),o=0===n.scrollTop,s=r+n.offsetHeight===n.scrollHeight,l=0===n.scrollLeft,d=n.scrollLeft+n.offsetWidth===n.scrollWidth;return i=Math.abs(a)>Math.abs(t)?o||s:l||d,!i||!e.settings.wheelPropagation}function i(e){var t=e.deltaX,n=-1*e.deltaY;return"undefined"!==typeof t&&"undefined"!==typeof n||(t=-1*e.wheelDeltaX/6,n=e.wheelDeltaY/6),e.deltaMode&&1===e.deltaMode&&(t*=10,n*=10),t!==t&&n!==n&&(t=0,n=e.wheelDelta),e.shiftKey?[-n,-t]:[t,n]}function r(e,a,i){if(!L.isWebKit&&n.querySelector("select:focus"))return!0;if(!n.contains(e))return!1;var r=e;while(r&&r!==n){if(r.classList.contains(l.element.consuming))return!0;var o=t(r),s=[o.overflow,o.overflowX,o.overflowY].join("");if(s.match(/(scroll|auto)/)){var d=r.scrollHeight-r.clientHeight;if(d>0&&!(0===r.scrollTop&&i>0)&&!(r.scrollTop===d&&i<0))return!0;var u=r.scrollWidth-r.clientWidth;if(u>0&&!(0===r.scrollLeft&&a<0)&&!(r.scrollLeft===u&&a>0))return!0}r=r.parentNode}return!1}function o(t){var o=i(t),s=o[0],l=o[1];if(!r(t.target,s,l)){var d=!1;e.settings.useBothWheelAxes?e.scrollbarYActive&&!e.scrollbarXActive?(l?n.scrollTop-=l*e.settings.wheelSpeed:n.scrollTop+=s*e.settings.wheelSpeed,d=!0):e.scrollbarXActive&&!e.scrollbarYActive&&(s?n.scrollLeft+=s*e.settings.wheelSpeed:n.scrollLeft-=l*e.settings.wheelSpeed,d=!0):(n.scrollTop-=l*e.settings.wheelSpeed,n.scrollLeft+=s*e.settings.wheelSpeed),k(e),d=d||a(s,l),d&&!t.ctrlKey&&(t.stopPropagation(),t.preventDefault())}}"undefined"!==typeof window.onwheel?e.event.bind(n,"wheel",o):"undefined"!==typeof window.onmousewheel&&e.event.bind(n,"mousewheel",o)},C=function(e){if(L.supportsTouch||L.supportsIePointer){var n=e.element,a={},i=0,r={},o=null;L.supportsTouch?(e.event.bind(n,"touchstart",h),e.event.bind(n,"touchmove",m),e.event.bind(n,"touchend",p)):L.supportsIePointer&&(window.PointerEvent?(e.event.bind(n,"pointerdown",h),e.event.bind(n,"pointermove",m),e.event.bind(n,"pointerup",p)):window.MSPointerEvent&&(e.event.bind(n,"MSPointerDown",h),e.event.bind(n,"MSPointerMove",m),e.event.bind(n,"MSPointerUp",p)))}function s(t,a){var i=Math.floor(n.scrollTop),r=n.scrollLeft,o=Math.abs(t),s=Math.abs(a);if(s>o){if(a<0&&i===e.contentHeight-e.containerHeight||a>0&&0===i)return 0===window.scrollY&&a>0&&L.isChrome}else if(o>s&&(t<0&&r===e.contentWidth-e.containerWidth||t>0&&0===r))return!0;return!0}function d(t,a){n.scrollTop-=a,n.scrollLeft-=t,k(e)}function u(e){return e.targetTouches?e.targetTouches[0]:e}function c(e){return(!e.pointerType||"pen"!==e.pointerType||0!==e.buttons)&&(!(!e.targetTouches||1!==e.targetTouches.length)||!(!e.pointerType||"mouse"===e.pointerType||e.pointerType===e.MSPOINTER_TYPE_MOUSE))}function h(e){if(c(e)){var t=u(e);a.pageX=t.pageX,a.pageY=t.pageY,i=(new Date).getTime(),null!==o&&clearInterval(o)}}function f(e,a,i){if(!n.contains(e))return!1;var r=e;while(r&&r!==n){if(r.classList.contains(l.element.consuming))return!0;var o=t(r),s=[o.overflow,o.overflowX,o.overflowY].join("");if(s.match(/(scroll|auto)/)){var d=r.scrollHeight-r.clientHeight;if(d>0&&!(0===r.scrollTop&&i>0)&&!(r.scrollTop===d&&i<0))return!0;var u=r.scrollLeft-r.clientWidth;if(u>0&&!(0===r.scrollLeft&&a<0)&&!(r.scrollLeft===u&&a>0))return!0}r=r.parentNode}return!1}function m(e){if(c(e)){var t=u(e),n={pageX:t.pageX,pageY:t.pageY},o=n.pageX-a.pageX,l=n.pageY-a.pageY;if(f(e.target,o,l))return;d(o,l),a=n;var h=(new Date).getTime(),m=h-i;m>0&&(r.x=o/m,r.y=l/m,i=h),s(o,l)&&e.preventDefault()}}function p(){e.settings.swipeEasing&&(clearInterval(o),o=setInterval((function(){e.isInitialized?clearInterval(o):r.x||r.y?Math.abs(r.x)<.01&&Math.abs(r.y)<.01?clearInterval(o):(d(30*r.x,30*r.y),r.x*=.8,r.y*=.8):clearInterval(o)}),10))}},O=function(){return{handlers:["click-rail","drag-thumb","keyboard","wheel","touch"],maxScrollbarLength:null,minScrollbarLength:null,scrollingThreshold:1e3,scrollXMarginOffset:0,scrollYMarginOffset:0,suppressScrollX:!1,suppressScrollY:!1,swipeEasing:!0,useBothWheelAxes:!1,wheelPropagation:!0,wheelSpeed:1}},j={"click-rail":Y,"drag-thumb":S,keyboard:T,wheel:H,touch:C},P=function(e,i){var r=this;if(void 0===i&&(i={}),"string"===typeof e&&(e=document.querySelector(e)),!e||!e.nodeName)throw new Error("no element is specified to initialize PerfectScrollbar");for(var o in this.element=e,e.classList.add(l.main),this.settings=O(),i)r.settings[o]=i[o];this.containerWidth=null,this.containerHeight=null,this.contentWidth=null,this.contentHeight=null;var s=function(){return e.classList.add(l.state.focus)},d=function(){return e.classList.remove(l.state.focus)};this.isRtl="rtl"===t(e).direction,this.isNegativeScroll=function(){var t=e.scrollLeft,n=null;return e.scrollLeft=-1,n=e.scrollLeft<0,e.scrollLeft=t,n}(),this.negativeScrollAdjustment=this.isNegativeScroll?e.scrollWidth-e.clientWidth:0,this.event=new p,this.ownerDocument=e.ownerDocument||document,this.scrollbarXRail=a(l.element.rail("x")),e.appendChild(this.scrollbarXRail),this.scrollbarX=a(l.element.thumb("x")),this.scrollbarXRail.appendChild(this.scrollbarX),this.scrollbarX.setAttribute("tabindex",0),this.event.bind(this.scrollbarX,"focus",s),this.event.bind(this.scrollbarX,"blur",d),this.scrollbarXActive=null,this.scrollbarXWidth=null,this.scrollbarXLeft=null;var u=t(this.scrollbarXRail);this.scrollbarXBottom=parseInt(u.bottom,10),isNaN(this.scrollbarXBottom)?(this.isScrollbarXUsingBottom=!1,this.scrollbarXTop=v(u.top)):this.isScrollbarXUsingBottom=!0,this.railBorderXWidth=v(u.borderLeftWidth)+v(u.borderRightWidth),n(this.scrollbarXRail,{display:"block"}),this.railXMarginWidth=v(u.marginLeft)+v(u.marginRight),n(this.scrollbarXRail,{display:""}),this.railXWidth=null,this.railXRatio=null,this.scrollbarYRail=a(l.element.rail("y")),e.appendChild(this.scrollbarYRail),this.scrollbarY=a(l.element.thumb("y")),this.scrollbarYRail.appendChild(this.scrollbarY),this.scrollbarY.setAttribute("tabindex",0),this.event.bind(this.scrollbarY,"focus",s),this.event.bind(this.scrollbarY,"blur",d),this.scrollbarYActive=null,this.scrollbarYHeight=null,this.scrollbarYTop=null;var c=t(this.scrollbarYRail);this.scrollbarYRight=parseInt(c.right,10),isNaN(this.scrollbarYRight)?(this.isScrollbarYUsingRight=!1,this.scrollbarYLeft=v(c.left)):this.isScrollbarYUsingRight=!0,this.scrollbarYOuterWidth=this.isRtl?M(this.scrollbarY):null,this.railBorderYWidth=v(c.borderTopWidth)+v(c.borderBottomWidth),n(this.scrollbarYRail,{display:"block"}),this.railYMarginHeight=v(c.marginTop)+v(c.marginBottom),n(this.scrollbarYRail,{display:""}),this.railYHeight=null,this.railYRatio=null,this.reach={x:e.scrollLeft<=0?"start":e.scrollLeft>=this.contentWidth-this.containerWidth?"end":null,y:e.scrollTop<=0?"start":e.scrollTop>=this.contentHeight-this.containerHeight?"end":null},this.isAlive=!0,this.settings.handlers.forEach((function(e){return j[e](r)})),this.lastScrollTop=Math.floor(e.scrollTop),this.lastScrollLeft=e.scrollLeft,this.event.bind(this.element,"scroll",(function(e){return r.onScroll(e)})),k(this)};P.prototype.update=function(){this.isAlive&&(this.negativeScrollAdjustment=this.isNegativeScroll?this.element.scrollWidth-this.element.clientWidth:0,n(this.scrollbarXRail,{display:"block"}),n(this.scrollbarYRail,{display:"block"}),this.railXMarginWidth=v(t(this.scrollbarXRail).marginLeft)+v(t(this.scrollbarXRail).marginRight),this.railYMarginHeight=v(t(this.scrollbarYRail).marginTop)+v(t(this.scrollbarYRail).marginBottom),n(this.scrollbarXRail,{display:"none"}),n(this.scrollbarYRail,{display:"none"}),k(this),g(this,"top",0,!1,!0),g(this,"left",0,!1,!0),n(this.scrollbarXRail,{display:""}),n(this.scrollbarYRail,{display:""}))},P.prototype.onScroll=function(e){this.isAlive&&(k(this),g(this,"top",this.element.scrollTop-this.lastScrollTop),g(this,"left",this.element.scrollLeft-this.lastScrollLeft),this.lastScrollTop=Math.floor(this.element.scrollTop),this.lastScrollLeft=this.element.scrollLeft)},P.prototype.destroy=function(){this.isAlive&&(this.event.unbindAll(),o(this.scrollbarX),o(this.scrollbarY),o(this.scrollbarXRail),o(this.scrollbarYRail),this.removePsClasses(),this.element=null,this.scrollbarX=null,this.scrollbarY=null,this.scrollbarXRail=null,this.scrollbarYRail=null,this.isAlive=!1)},P.prototype.removePsClasses=function(){this.element.className=this.element.className.split(" ").filter((function(e){return!e.match(/^ps([-_].+|)$/)})).join(" ")};var A={name:"PerfectScrollbar",props:{options:{type:Object,required:!1,default:function(){}},tag:{type:String,required:!1,default:"div"},watchOptions:{type:Boolean,required:!1,default:!1}},data:function(){return{ps:null}},watch:{watchOptions:function(e){!e&&this.watcher?this.watcher():this.createWatcher()}},mounted:function(){this.create(),this.watchOptions&&this.createWatcher()},updated:function(){var e=this;this.$nextTick((function(){e.update()}))},beforeDestroy:function(){this.destroy()},methods:{create:function(){this.ps&&this.$isServer||(this.ps=new P(this.$refs.container,this.options))},createWatcher:function(){var e=this;this.watcher=this.$watch("options",(function(){e.destroy(),e.create()}),{deep:!0})},update:function(){this.ps&&this.ps.update()},destroy:function(){this.ps&&(this.ps.destroy(),this.ps=null)}},render:function(e){return e(this.tag,{ref:"container",class:"ps",on:this.$listeners},this.$slots.default)}};function E(e,t){t&&(t.name&&"string"===typeof t.name&&(A.name=t.name),t.options&&"object"===typeof t.options&&(A.props.options.default=function(){return t.options}),t.tag&&"string"===typeof t.tag&&(A.props.tag.default=t.tag),t.watchOptions&&"boolean"===typeof t.watchOptions&&(A.props.watchOptions=t.watchOptions)),e.component(A.name,A)}e.install=E,e.PerfectScrollbar=A,e.default=E,Object.defineProperty(e,"__esModule",{value:!0})}))},a4d3:function(e,t,n){"use strict";var a=n("23e7"),i=n("da84"),r=n("c430"),o=n("83ab"),s=n("4930"),l=n("d039"),d=n("5135"),u=n("e8b5"),c=n("861d"),h=n("825a"),f=n("7b0b"),m=n("fc6a"),p=n("c04e"),_=n("5c6c"),g=n("7c73"),y=n("df75"),v=n("241c"),b=n("057f"),M=n("7418"),L=n("06cf"),k=n("9bf2"),w=n("d1e7"),x=n("9112"),Y=n("6eeb"),S=n("5692"),D=n("f772"),T=n("d012"),H=n("90e3"),C=n("b622"),O=n("c032"),j=n("746f"),P=n("d44e"),A=n("69f3"),E=n("b727").forEach,I=D("hidden"),B="Symbol",W="prototype",F=C("toPrimitive"),N=A.set,z=A.getterFor(B),R=Object[W],$=i.Symbol,V=i.JSON,J=V&&V.stringify,U=L.f,G=k.f,q=b.f,X=w.f,K=S("symbols"),Z=S("op-symbols"),Q=S("string-to-symbol-registry"),ee=S("symbol-to-string-registry"),te=S("wks"),ne=i.QObject,ae=!ne||!ne[W]||!ne[W].findChild,ie=o&&l((function(){return 7!=g(G({},"a",{get:function(){return G(this,"a",{value:7}).a}})).a}))?function(e,t,n){var a=U(R,t);a&&delete R[t],G(e,t,n),a&&e!==R&&G(R,t,a)}:G,re=function(e,t){var n=K[e]=g($[W]);return N(n,{type:B,tag:e,description:t}),o||(n.description=t),n},oe=s&&"symbol"==typeof $.iterator?function(e){return"symbol"==typeof e}:function(e){return Object(e)instanceof $},se=function(e,t,n){e===R&&se(Z,t,n),h(e);var a=p(t,!0);return h(n),d(K,a)?(n.enumerable?(d(e,I)&&e[I][a]&&(e[I][a]=!1),n=g(n,{enumerable:_(0,!1)})):(d(e,I)||G(e,I,_(1,{})),e[I][a]=!0),ie(e,a,n)):G(e,a,n)},le=function(e,t){h(e);var n=m(t),a=y(n).concat(fe(n));return E(a,(function(t){o&&!ue.call(n,t)||se(e,t,n[t])})),e},de=function(e,t){return void 0===t?g(e):le(g(e),t)},ue=function(e){var t=p(e,!0),n=X.call(this,t);return!(this===R&&d(K,t)&&!d(Z,t))&&(!(n||!d(this,t)||!d(K,t)||d(this,I)&&this[I][t])||n)},ce=function(e,t){var n=m(e),a=p(t,!0);if(n!==R||!d(K,a)||d(Z,a)){var i=U(n,a);return!i||!d(K,a)||d(n,I)&&n[I][a]||(i.enumerable=!0),i}},he=function(e){var t=q(m(e)),n=[];return E(t,(function(e){d(K,e)||d(T,e)||n.push(e)})),n},fe=function(e){var t=e===R,n=q(t?Z:m(e)),a=[];return E(n,(function(e){!d(K,e)||t&&!d(R,e)||a.push(K[e])})),a};s||($=function(){if(this instanceof $)throw TypeError("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,t=H(e),n=function(e){this===R&&n.call(Z,e),d(this,I)&&d(this[I],t)&&(this[I][t]=!1),ie(this,t,_(1,e))};return o&&ae&&ie(R,t,{configurable:!0,set:n}),re(t,e)},Y($[W],"toString",(function(){return z(this).tag})),w.f=ue,k.f=se,L.f=ce,v.f=b.f=he,M.f=fe,o&&(G($[W],"description",{configurable:!0,get:function(){return z(this).description}}),r||Y(R,"propertyIsEnumerable",ue,{unsafe:!0})),O.f=function(e){return re(C(e),e)}),a({global:!0,wrap:!0,forced:!s,sham:!s},{Symbol:$}),E(y(te),(function(e){j(e)})),a({target:B,stat:!0,forced:!s},{for:function(e){var t=String(e);if(d(Q,t))return Q[t];var n=$(t);return Q[t]=n,ee[n]=t,n},keyFor:function(e){if(!oe(e))throw TypeError(e+" is not a symbol");if(d(ee,e))return ee[e]},useSetter:function(){ae=!0},useSimple:function(){ae=!1}}),a({target:"Object",stat:!0,forced:!s,sham:!o},{create:de,defineProperty:se,defineProperties:le,getOwnPropertyDescriptor:ce}),a({target:"Object",stat:!0,forced:!s},{getOwnPropertyNames:he,getOwnPropertySymbols:fe}),a({target:"Object",stat:!0,forced:l((function(){M.f(1)}))},{getOwnPropertySymbols:function(e){return M.f(f(e))}}),V&&a({target:"JSON",stat:!0,forced:!s||l((function(){var e=$();return"[null]"!=J([e])||"{}"!=J({a:e})||"{}"!=J(Object(e))}))},{stringify:function(e){var t,n,a=[e],i=1;while(arguments.length>i)a.push(arguments[i++]);if(n=t=a[1],(c(t)||void 0!==e)&&!oe(e))return u(t)||(t=function(e,t){if("function"==typeof n&&(t=n.call(this,e,t)),!oe(t))return t}),a[1]=t,J.apply(V,a)}}),$[W][F]||x($[W],F,$[W].valueOf),P($,B),T[I]=!0},a4e1:function(e,t,n){},a630:function(e,t,n){var a=n("23e7"),i=n("4df4"),r=n("1c7e"),o=!r((function(e){Array.from(e)}));a({target:"Array",stat:!0,forced:o},{from:i})},a691:function(e,t){var n=Math.ceil,a=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?a:n)(e)}},a7fa:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("bm",{months:"Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo".split("_"),monthsShort:"Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des".split("_"),weekdays:"Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri".split("_"),weekdaysShort:"Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib".split("_"),weekdaysMin:"Ka_Nt_Ta_Ar_Al_Ju_Si".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"MMMM [tile] D [san] YYYY",LLL:"MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm",LLLL:"dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm"},calendar:{sameDay:"[Bi lɛrɛ] LT",nextDay:"[Sini lɛrɛ] LT",nextWeek:"dddd [don lɛrɛ] LT",lastDay:"[Kunu lɛrɛ] LT",lastWeek:"dddd [tɛmɛnen lɛrɛ] LT",sameElse:"L"},relativeTime:{future:"%s kɔnɔ",past:"a bɛ %s bɔ",s:"sanga dama dama",ss:"sekondi %d",m:"miniti kelen",mm:"miniti %d",h:"lɛrɛ kelen",hh:"lɛrɛ %d",d:"tile kelen",dd:"tile %d",M:"kalo kelen",MM:"kalo %d",y:"san kelen",yy:"san %d"},week:{dow:1,doy:4}});return t}))},a801:function(e,t,n){},a9be:function(e,t,n){
/*!
 * chartjs-plugin-datalabels v0.7.0
 * https://chartjs-plugin-datalabels.netlify.com
 * (c) 2019 Chart.js Contributors
 * Released under the MIT license
 */
(function(t,a){e.exports=a(n("30ef"))})(0,(function(e){"use strict";e=e&&e.hasOwnProperty("default")?e["default"]:e;var t=e.helpers,n=function(){if("undefined"!==typeof window){if(window.devicePixelRatio)return window.devicePixelRatio;var e=window.screen;if(e)return(e.deviceXDPI||1)/(e.logicalXDPI||1)}return 1}(),a={toTextLines:function(e){var n,a=[];e=[].concat(e);while(e.length)n=e.pop(),"string"===typeof n?a.unshift.apply(a,n.split("\n")):Array.isArray(n)?e.push.apply(e,n):t.isNullOrUndef(e)||a.unshift(""+n);return a},toFontString:function(e){return!e||t.isNullOrUndef(e.size)||t.isNullOrUndef(e.family)?null:(e.style?e.style+" ":"")+(e.weight?e.weight+" ":"")+e.size+"px "+e.family},textSize:function(e,t,n){var a,i=[].concat(t),r=i.length,o=e.font,s=0;for(e.font=n.string,a=0;a<r;++a)s=Math.max(e.measureText(i[a]).width,s);return e.font=o,{height:r*n.lineHeight,width:s}},parseFont:function(n){var i=e.defaults.global,r=t.valueOrDefault(n.size,i.defaultFontSize),o={family:t.valueOrDefault(n.family,i.defaultFontFamily),lineHeight:t.options.toLineHeight(n.lineHeight,r),size:r,style:t.valueOrDefault(n.style,i.defaultFontStyle),weight:t.valueOrDefault(n.weight,null),string:""};return o.string=a.toFontString(o),o},bound:function(e,t,n){return Math.max(e,Math.min(t,n))},arrayDiff:function(e,t){var n,a,i,r,o=e.slice(),s=[];for(n=0,i=t.length;n<i;++n)r=t[n],a=o.indexOf(r),-1===a?s.push([r,1]):o.splice(a,1);for(n=0,i=o.length;n<i;++n)s.push([o[n],-1]);return s},rasterize:function(e){return Math.round(e*n)/n}};function i(e,t){var n=t.x,a=t.y;if(null===n)return{x:0,y:-1};if(null===a)return{x:1,y:0};var i=e.x-n,r=e.y-a,o=Math.sqrt(i*i+r*r);return{x:o?i/o:0,y:o?r/o:-1}}function r(e,t,n,a,i){switch(i){case"center":n=a=0;break;case"bottom":n=0,a=1;break;case"right":n=1,a=0;break;case"left":n=-1,a=0;break;case"top":n=0,a=-1;break;case"start":n=-n,a=-a;break;case"end":break;default:i*=Math.PI/180,n=Math.cos(i),a=Math.sin(i);break}return{x:e,y:t,vx:n,vy:a}}var o=0,s=1,l=2,d=4,u=8;function c(e,t,n){var a=o;return e<n.left?a|=s:e>n.right&&(a|=l),t<n.top?a|=u:t>n.bottom&&(a|=d),a}function h(e,t){var n,a,i,r=e.x0,o=e.y0,h=e.x1,f=e.y1,m=c(r,o,t),p=c(h,f,t);while(1){if(!(m|p)||m&p)break;n=m||p,n&u?(a=r+(h-r)*(t.top-o)/(f-o),i=t.top):n&d?(a=r+(h-r)*(t.bottom-o)/(f-o),i=t.bottom):n&l?(i=o+(f-o)*(t.right-r)/(h-r),a=t.right):n&s&&(i=o+(f-o)*(t.left-r)/(h-r),a=t.left),n===m?(r=a,o=i,m=c(r,o,t)):(h=a,f=i,p=c(h,f,t))}return{x0:r,x1:h,y0:o,y1:f}}function f(e,t){var n,a,i=t.anchor,o=e;return t.clamp&&(o=h(o,t.area)),"start"===i?(n=o.x0,a=o.y0):"end"===i?(n=o.x1,a=o.y1):(n=(o.x0+o.x1)/2,a=(o.y0+o.y1)/2),r(n,a,e.vx,e.vy,t.align)}var m={arc:function(e,t){var n=(e.startAngle+e.endAngle)/2,a=Math.cos(n),i=Math.sin(n),r=e.innerRadius,o=e.outerRadius;return f({x0:e.x+a*r,y0:e.y+i*r,x1:e.x+a*o,y1:e.y+i*o,vx:a,vy:i},t)},point:function(e,t){var n=i(e,t.origin),a=n.x*e.radius,r=n.y*e.radius;return f({x0:e.x-a,y0:e.y-r,x1:e.x+a,y1:e.y+r,vx:n.x,vy:n.y},t)},rect:function(e,t){var n=i(e,t.origin),a=e.x,r=e.y,o=0,s=0;return e.horizontal?(a=Math.min(e.x,e.base),o=Math.abs(e.base-e.x)):(r=Math.min(e.y,e.base),s=Math.abs(e.base-e.y)),f({x0:a,y0:r+s,x1:a+o,y1:r,vx:n.x,vy:n.y},t)},fallback:function(e,t){var n=i(e,t.origin);return f({x0:e.x,y0:e.y,x1:e.x,y1:e.y,vx:n.x,vy:n.y},t)}},p=e.helpers,_=a.rasterize;function g(e){var t=e.borderWidth||0,n=e.padding,a=e.size.height,i=e.size.width,r=-i/2,o=-a/2;return{frame:{x:r-n.left-t,y:o-n.top-t,w:i+n.width+2*t,h:a+n.height+2*t},text:{x:r,y:o,w:i,h:a}}}function y(e){var t=e._model.horizontal,n=e._scale||t&&e._xScale||e._yScale;if(!n)return null;if(void 0!==n.xCenter&&void 0!==n.yCenter)return{x:n.xCenter,y:n.yCenter};var a=n.getBasePixel();return t?{x:a,y:null}:{x:null,y:a}}function v(t){return t instanceof e.elements.Arc?m.arc:t instanceof e.elements.Point?m.point:t instanceof e.elements.Rectangle?m.rect:m.fallback}function b(e,t,n){var a=n.backgroundColor,i=n.borderColor,r=n.borderWidth;(a||i&&r)&&(e.beginPath(),p.canvas.roundedRect(e,_(t.x)+r/2,_(t.y)+r/2,_(t.w)-r,_(t.h)-r,n.borderRadius),e.closePath(),a&&(e.fillStyle=a,e.fill()),i&&r&&(e.strokeStyle=i,e.lineWidth=r,e.lineJoin="miter",e.stroke()))}function M(e,t,n){var a=n.lineHeight,i=e.w,r=e.x,o=e.y+a/2;return"center"===t?r+=i/2:"end"!==t&&"right"!==t||(r+=i),{h:a,w:i,x:r,y:o}}function L(e,t,n){var a=e.shadowBlur,i=n.stroked,r=_(n.x),o=_(n.y),s=_(n.w);i&&e.strokeText(t,r,o,s),n.filled&&(a&&i&&(e.shadowBlur=0),e.fillText(t,r,o,s),a&&i&&(e.shadowBlur=a))}function k(e,t,n,a){var i,r=a.textAlign,o=a.color,s=!!o,l=a.font,d=t.length,u=a.textStrokeColor,c=a.textStrokeWidth,h=u&&c;if(d&&(s||h))for(n=M(n,r,l),e.font=l.string,e.textAlign=r,e.textBaseline="middle",e.shadowBlur=a.textShadowBlur,e.shadowColor=a.textShadowColor,s&&(e.fillStyle=o),h&&(e.lineJoin="round",e.lineWidth=c,e.strokeStyle=u),i=0,d=t.length;i<d;++i)L(e,t[i],{stroked:h,filled:s,w:n.w,x:n.x,y:n.y+n.h*i})}var w=function(e,t,n,a){var i=this;i._config=e,i._index=a,i._model=null,i._rects=null,i._ctx=t,i._el=n};p.extend(w.prototype,{_modelize:function(t,n,i,r){var o=this,s=o._index,l=p.options.resolve,d=a.parseFont(l([i.font,{}],r,s)),u=l([i.color,e.defaults.global.defaultFontColor],r,s);return{align:l([i.align,"center"],r,s),anchor:l([i.anchor,"center"],r,s),area:r.chart.chartArea,backgroundColor:l([i.backgroundColor,null],r,s),borderColor:l([i.borderColor,null],r,s),borderRadius:l([i.borderRadius,0],r,s),borderWidth:l([i.borderWidth,0],r,s),clamp:l([i.clamp,!1],r,s),clip:l([i.clip,!1],r,s),color:u,display:t,font:d,lines:n,offset:l([i.offset,0],r,s),opacity:l([i.opacity,1],r,s),origin:y(o._el),padding:p.options.toPadding(l([i.padding,0],r,s)),positioner:v(o._el),rotation:l([i.rotation,0],r,s)*(Math.PI/180),size:a.textSize(o._ctx,n,d),textAlign:l([i.textAlign,"start"],r,s),textShadowBlur:l([i.textShadowBlur,0],r,s),textShadowColor:l([i.textShadowColor,u],r,s),textStrokeColor:l([i.textStrokeColor,u],r,s),textStrokeWidth:l([i.textStrokeWidth,0],r,s)}},update:function(e){var t,n,i,r=this,o=null,s=null,l=r._index,d=r._config,u=p.options.resolve([d.display,!0],e,l);u&&(t=e.dataset.data[l],n=p.valueOrDefault(p.callback(d.formatter,[t,e]),t),i=p.isNullOrUndef(n)?[]:a.toTextLines(n),i.length&&(o=r._modelize(u,i,d,e),s=g(o))),r._model=o,r._rects=s},geometry:function(){return this._rects?this._rects.frame:{}},rotation:function(){return this._model?this._model.rotation:0},visible:function(){return this._model&&this._model.opacity},model:function(){return this._model},draw:function(e,t){var n,i=this,r=e.ctx,o=i._model,s=i._rects;this.visible()&&(r.save(),o.clip&&(n=o.area,r.beginPath(),r.rect(n.left,n.top,n.right-n.left,n.bottom-n.top),r.clip()),r.globalAlpha=a.bound(0,o.opacity,1),r.translate(_(t.x),_(t.y)),r.rotate(o.rotation),b(r,s.frame,o),k(r,o.lines,s.text,o),r.restore())}});var x=e.helpers,Y=Number.MIN_SAFE_INTEGER||-9007199254740991,S=Number.MAX_SAFE_INTEGER||9007199254740991;function D(e,t,n){var a=Math.cos(n),i=Math.sin(n),r=t.x,o=t.y;return{x:r+a*(e.x-r)-i*(e.y-o),y:o+i*(e.x-r)+a*(e.y-o)}}function T(e,t){var n,a,i,r,o,s=S,l=Y,d=t.origin;for(n=0;n<e.length;++n)a=e[n],i=a.x-d.x,r=a.y-d.y,o=t.vx*i+t.vy*r,s=Math.min(s,o),l=Math.max(l,o);return{min:s,max:l}}function H(e,t){var n=t.x-e.x,a=t.y-e.y,i=Math.sqrt(n*n+a*a);return{vx:(t.x-e.x)/i,vy:(t.y-e.y)/i,origin:e,ln:i}}var C=function(){this._rotation=0,this._rect={x:0,y:0,w:0,h:0}};function O(e,t,n){var a=t.positioner(e,t),i=a.vx,r=a.vy;if(!i&&!r)return{x:a.x,y:a.y};var o=n.w,s=n.h,l=t.rotation,d=Math.abs(o/2*Math.cos(l))+Math.abs(s/2*Math.sin(l)),u=Math.abs(o/2*Math.sin(l))+Math.abs(s/2*Math.cos(l)),c=1/Math.max(Math.abs(i),Math.abs(r));return d*=i*c,u*=r*c,d+=t.offset*i,u+=t.offset*r,{x:a.x+d,y:a.y+u}}function j(e,t){var n,a,i,r;for(n=e.length-1;n>=0;--n)for(i=e[n].$layout,a=n-1;a>=0&&i._visible;--a)r=e[a].$layout,r._visible&&i._box.intersects(r._box)&&t(i,r);return e}function P(e){var t,n,a,i,r,o;for(t=0,n=e.length;t<n;++t)a=e[t],i=a.$layout,i._visible&&(r=a.geometry(),o=O(a._el._model,a.model(),r),i._box.update(o,r,a.rotation()));return j(e,(function(e,t){var n=e._hidable,a=t._hidable;n&&a||a?t._visible=!1:n&&(e._visible=!1)}))}x.extend(C.prototype,{center:function(){var e=this._rect;return{x:e.x+e.w/2,y:e.y+e.h/2}},update:function(e,t,n){this._rotation=n,this._rect={x:t.x+e.x,y:t.y+e.y,w:t.w,h:t.h}},contains:function(e){var t=this,n=1,a=t._rect;return e=D(e,t.center(),-t._rotation),!(e.x<a.x-n||e.y<a.y-n||e.x>a.x+a.w+2*n||e.y>a.y+a.h+2*n)},intersects:function(e){var t,n,a,i=this._points(),r=e._points(),o=[H(i[0],i[1]),H(i[0],i[3])];for(this._rotation!==e._rotation&&o.push(H(r[0],r[1]),H(r[0],r[3])),t=0;t<o.length;++t)if(n=T(i,o[t]),a=T(r,o[t]),n.max<a.min||a.max<n.min)return!1;return!0},_points:function(){var e=this,t=e._rect,n=e._rotation,a=e.center();return[D({x:t.x,y:t.y},a,n),D({x:t.x+t.w,y:t.y},a,n),D({x:t.x+t.w,y:t.y+t.h},a,n),D({x:t.x,y:t.y+t.h},a,n)]}});var A={prepare:function(e){var t,n,a,i,r,o=[];for(t=0,a=e.length;t<a;++t)for(n=0,i=e[t].length;n<i;++n)r=e[t][n],o.push(r),r.$layout={_box:new C,_hidable:!1,_visible:!0,_set:t,_idx:n};return o.sort((function(e,t){var n=e.$layout,a=t.$layout;return n._idx===a._idx?a._set-n._set:a._idx-n._idx})),this.update(o),o},update:function(e){var t,n,a,i,r,o=!1;for(t=0,n=e.length;t<n;++t)a=e[t],i=a.model(),r=a.$layout,r._hidable=i&&"auto"===i.display,r._visible=a.visible(),o|=r._hidable;o&&P(e)},lookup:function(e,t){var n,a;for(n=e.length-1;n>=0;--n)if(a=e[n].$layout,a&&a._visible&&a._box.contains(t))return e[n];return null},draw:function(e,t){var n,a,i,r,o,s;for(n=0,a=t.length;n<a;++n)i=t[n],r=i.$layout,r._visible&&(o=i.geometry(),s=O(i._el._view,i.model(),o),r._box.update(s,o,i.rotation()),i.draw(e,s))}},E=e.helpers,I=function(e){if(E.isNullOrUndef(e))return null;var t,n,a,i=e;if(E.isObject(e))if(E.isNullOrUndef(e.label))if(E.isNullOrUndef(e.r))for(i="",t=Object.keys(e),a=0,n=t.length;a<n;++a)i+=(0!==a?", ":"")+t[a]+": "+e[t[a]];else i=e.r;else i=e.label;return""+i},B={align:"center",anchor:"center",backgroundColor:null,borderColor:null,borderRadius:0,borderWidth:0,clamp:!1,clip:!1,color:void 0,display:!0,font:{family:void 0,lineHeight:1.2,size:void 0,style:void 0,weight:null},formatter:I,labels:void 0,listeners:{},offset:4,opacity:1,padding:{top:4,right:4,bottom:4,left:4},rotation:0,textAlign:"start",textStrokeColor:void 0,textStrokeWidth:0,textShadowBlur:0,textShadowColor:void 0},W=e.helpers,F="$datalabels",N="$default";function z(e,t){var n,a,i=e.datalabels,r={},o=[];return!1===i?null:(!0===i&&(i={}),t=W.merge({},[t,i]),n=t.labels||{},a=Object.keys(n),delete t.labels,a.length?a.forEach((function(e){n[e]&&o.push(W.merge({},[t,n[e],{_key:e}]))})):o.push(t),r=o.reduce((function(e,t){return W.each(t.listeners||{},(function(n,a){e[a]=e[a]||{},e[a][t._key||N]=n})),delete t.listeners,e}),{}),{labels:o,listeners:r})}function R(e,t,n){if(t){var a,i=n.$context,r=n.$groups;t[r._set]&&(a=t[r._set][r._key],a&&!0===W.callback(a,[i])&&(e[F]._dirty=!0,n.update(i)))}}function $(e,t,n,a){var i,r;(n||a)&&(n?a?n!==a&&(r=i=!0):r=!0:i=!0,r&&R(e,t.leave,n),i&&R(e,t.enter,a))}function V(e,t){var n,a,i=e[F],r=i._listeners;if(r.enter||r.leave){if("mousemove"===t.type)a=A.lookup(i._labels,t);else if("mouseout"!==t.type)return;n=i._hovered,i._hovered=a,$(e,r,n,a)}}function J(e,t){var n=e[F],a=n._listeners.click,i=a&&A.lookup(n._labels,t);i&&R(e,a,i)}function U(t){if(!t.animating){for(var n=e.animationService.animations,a=0,i=n.length;a<i;++a)if(n[a].chart===t)return;t.render({duration:1,lazy:!0})}}e.defaults.global.plugins.datalabels=B;var G={id:"datalabels",beforeInit:function(e){e[F]={_actives:[]}},beforeUpdate:function(e){var t=e[F];t._listened=!1,t._listeners={},t._datasets=[],t._labels=[]},afterDatasetUpdate:function(e,t,n){var a,i,r,o,s,l,d,u,c=t.index,h=e[F],f=h._datasets[c]=[],m=e.isDatasetVisible(c),p=e.data.datasets[c],_=z(p,n),g=t.meta.data||[],y=e.ctx;for(y.save(),a=0,r=g.length;a<r;++a)if(d=g[a],d[F]=[],m&&d&&!d.hidden&&!d._model.skip)for(i=0,o=_.labels.length;i<o;++i)s=_.labels[i],l=s._key,u=new w(s,y,d,a),u.$groups={_set:c,_key:l||N},u.$context={active:!1,chart:e,dataIndex:a,dataset:p,datasetIndex:c},u.update(u.$context),d[F].push(u),f.push(u);y.restore(),W.merge(h._listeners,_.listeners,{merger:function(e,n,a){n[e]=n[e]||{},n[e][t.index]=a[e],h._listened=!0}})},afterUpdate:function(e,t){e[F]._labels=A.prepare(e[F]._datasets,t)},afterDatasetsDraw:function(e){A.draw(e,e[F]._labels)},beforeEvent:function(e,t){if(e[F]._listened)switch(t.type){case"mousemove":case"mouseout":V(e,t);break;case"click":J(e,t);break;default:}},afterEvent:function(e){var t,n,i,r,o,s,l,d=e[F],u=d._actives,c=d._actives=e.lastActive||[],h=a.arrayDiff(u,c);for(t=0,n=h.length;t<n;++t)if(o=h[t],o[1])for(l=o[0][F]||[],i=0,r=l.length;i<r;++i)s=l[i],s.$context.active=1===o[1],s.update(s.$context);(d._dirty||h.length)&&(A.update(d._labels),U(e)),delete d._dirty}};return e.plugins.register(G),G}))},a9e3:function(e,t,n){"use strict";var a=n("83ab"),i=n("da84"),r=n("94ca"),o=n("6eeb"),s=n("5135"),l=n("c6b6"),d=n("7156"),u=n("c04e"),c=n("d039"),h=n("7c73"),f=n("241c").f,m=n("06cf").f,p=n("9bf2").f,_=n("58a8").trim,g="Number",y=i[g],v=y.prototype,b=l(h(v))==g,M=function(e){var t,n,a,i,r,o,s,l,d=u(e,!1);if("string"==typeof d&&d.length>2)if(d=_(d),t=d.charCodeAt(0),43===t||45===t){if(n=d.charCodeAt(2),88===n||120===n)return NaN}else if(48===t){switch(d.charCodeAt(1)){case 66:case 98:a=2,i=49;break;case 79:case 111:a=8,i=55;break;default:return+d}for(r=d.slice(2),o=r.length,s=0;s<o;s++)if(l=r.charCodeAt(s),l<48||l>i)return NaN;return parseInt(r,a)}return+d};if(r(g,!y(" 0o1")||!y("0b1")||y("+0x1"))){for(var L,k=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof k&&(b?c((function(){v.valueOf.call(n)})):l(n)!=g)?d(new y(M(t)),n,k):M(t)},w=a?f(y):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),x=0;w.length>x;x++)s(y,L=w[x])&&!s(k,L)&&p(k,L,m(y,L));k.prototype=v,v.constructor=k,o(i,g,k)}},aa88:function(e,t,n){"use strict";var a=n("1f84"),i=n.n(a);i.a},ab13:function(e,t,n){var a=n("b622"),i=a("match");e.exports=function(e){var t=/./;try{"/./"[e](t)}catch(n){try{return t[i]=!1,"/./"[e](t)}catch(a){}}return!1}},ab61:function(e,t,n){},ac1f:function(e,t,n){"use strict";var a=n("23e7"),i=n("9263");a({target:"RegExp",proto:!0,forced:/./.exec!==i},{exec:i})},ad6d:function(e,t,n){"use strict";var a=n("825a");e.exports=function(){var e=a(this),t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e.unicode&&(t+="u"),e.sticky&&(t+="y"),t}},ada2:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t){var n=e.split("_");return t%10===1&&t%100!==11?n[0]:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?n[1]:n[2]}function n(e,n,a){var i={ss:n?"секунда_секунди_секунд":"секунду_секунди_секунд",mm:n?"хвилина_хвилини_хвилин":"хвилину_хвилини_хвилин",hh:n?"година_години_годин":"годину_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===a?n?"хвилина":"хвилину":"h"===a?n?"година":"годину":e+" "+t(i[a],+e)}function a(e,t){var n={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")};if(!0===e)return n["nominative"].slice(1,7).concat(n["nominative"].slice(0,1));if(!e)return n["nominative"];var a=/(\[[ВвУу]\]) ?dddd/.test(t)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(t)?"genitive":"nominative";return n[a][e.day()]}function i(e){return function(){return e+"о"+(11===this.hours()?"б":"")+"] LT"}}var r=e.defineLocale("uk",{months:{format:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_"),standalone:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_")},monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:a,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., HH:mm",LLLL:"dddd, D MMMM YYYY р., HH:mm"},calendar:{sameDay:i("[Сьогодні "),nextDay:i("[Завтра "),lastDay:i("[Вчора "),nextWeek:i("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return i("[Минулої] dddd [").call(this);case 1:case 2:case 4:return i("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",ss:n,m:n,mm:n,h:"годину",hh:n,d:"день",dd:n,M:"місяць",MM:n,y:"рік",yy:n},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(e){return/^(дня|вечора)$/.test(e)},meridiem:function(e,t,n){return e<4?"ночі":e<12?"ранку":e<17?"дня":"вечора"},dayOfMonthOrdinalParse:/\d{1,2}-(й|го)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":case"w":case"W":return e+"-й";case"D":return e+"-го";default:return e}},week:{dow:1,doy:7}});return r}))},ae93:function(e,t,n){"use strict";var a,i,r,o=n("e163"),s=n("9112"),l=n("5135"),d=n("b622"),u=n("c430"),c=d("iterator"),h=!1,f=function(){return this};[].keys&&(r=[].keys(),"next"in r?(i=o(o(r)),i!==Object.prototype&&(a=i)):h=!0),void 0==a&&(a={}),u||l(a,c)||s(a,c,f),e.exports={IteratorPrototype:a,BUGGY_SAFARI_ITERATORS:h}},ae98:function(e,t,n){"use strict";var a=n("21b8"),i=n.n(a);i.a},afaf:function(e,t,n){},b041:function(e,t,n){"use strict";var a=n("f5df"),i=n("b622"),r=i("toStringTag"),o={};o[r]="z",e.exports="[object z]"!==String(o)?function(){return"[object "+a(this)+"]"}:o.toString},b0c0:function(e,t,n){var a=n("83ab"),i=n("9bf2").f,r=Function.prototype,o=r.toString,s=/^\s*function ([^ (]*)/,l="name";a&&!(l in r)&&i(r,l,{configurable:!0,get:function(){try{return o.call(this).match(s)[1]}catch(e){return""}}})},b29d:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("lo",{months:"ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),monthsShort:"ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),weekdays:"ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),weekdaysShort:"ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),weekdaysMin:"ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"ວັນdddd D MMMM YYYY HH:mm"},meridiemParse:/ຕອນເຊົ້າ|ຕອນແລງ/,isPM:function(e){return"ຕອນແລງ"===e},meridiem:function(e,t,n){return e<12?"ຕອນເຊົ້າ":"ຕອນແລງ"},calendar:{sameDay:"[ມື້ນີ້ເວລາ] LT",nextDay:"[ມື້ອື່ນເວລາ] LT",nextWeek:"[ວັນ]dddd[ໜ້າເວລາ] LT",lastDay:"[ມື້ວານນີ້ເວລາ] LT",lastWeek:"[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT",sameElse:"L"},relativeTime:{future:"ອີກ %s",past:"%sຜ່ານມາ",s:"ບໍ່ເທົ່າໃດວິນາທີ",ss:"%d ວິນາທີ",m:"1 ນາທີ",mm:"%d ນາທີ",h:"1 ຊົ່ວໂມງ",hh:"%d ຊົ່ວໂມງ",d:"1 ມື້",dd:"%d ມື້",M:"1 ເດືອນ",MM:"%d ເດືອນ",y:"1 ປີ",yy:"%d ປີ"},dayOfMonthOrdinalParse:/(ທີ່)\d{1,2}/,ordinal:function(e){return"ທີ່"+e}});return t}))},b301:function(e,t,n){"use strict";var a=n("d039");e.exports=function(e,t){var n=[][e];return!n||!a((function(){n.call(null,t||function(){throw 1},1)}))}},b31c:function(e,t,n){},b39a:function(e,t,n){var a=n("d066");e.exports=a("navigator","userAgent")||""},b3eb:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n,a){var i={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return t?i[n][0]:i[n][1]}var n=e.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",ss:"%d Sekunden",m:t,mm:"%d Minuten",h:t,hh:"%d Stunden",d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return n}))},b469:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n,a){var i={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return t?i[n][0]:i[n][1]}var n=e.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",ss:"%d Sekunden",m:t,mm:"%d Minuten",h:t,hh:"%d Stunden",d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return n}))},b4f5:function(e,t,n){"use strict";var a=n("e88b"),i=n.n(a);i.a},b53d:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",ss:"%d imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}});return t}))},b540:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(e,t){return 12===e&&(e=0),"enjing"===t?e:"siyang"===t?e>=11?e:e+12:"sonten"===t||"ndalu"===t?e+12:void 0},meridiem:function(e,t,n){return e<11?"enjing":e<15?"siyang":e<19?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",ss:"%d detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,doy:7}});return t}))},b575:function(e,t,n){var a,i,r,o,s,l,d,u,c=n("da84"),h=n("06cf").f,f=n("c6b6"),m=n("2cf4").set,p=n("b39a"),_=c.MutationObserver||c.WebKitMutationObserver,g=c.process,y=c.Promise,v="process"==f(g),b=h(c,"queueMicrotask"),M=b&&b.value;M||(a=function(){var e,t;v&&(e=g.domain)&&e.exit();while(i){t=i.fn,i=i.next;try{t()}catch(n){throw i?o():r=void 0,n}}r=void 0,e&&e.enter()},v?o=function(){g.nextTick(a)}:_&&!/(iphone|ipod|ipad).*applewebkit/i.test(p)?(s=!0,l=document.createTextNode(""),new _(a).observe(l,{characterData:!0}),o=function(){l.data=s=!s}):y&&y.resolve?(d=y.resolve(void 0),u=d.then,o=function(){u.call(d,a)}):o=function(){m.call(c,a)}),e.exports=M||function(e){var t={fn:e,next:void 0};r&&(r.next=t),i||(i=t,o()),r=t}},b61b:function(e,t,n){"use strict";n.r(t),n.d(t,"mdbTooltip",(function(){return d}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("span",[n("transition",{on:{"after-leave":e.doDestroy}},[n("span",{ref:"popper",class:{show:!e.disabled&&e.showPopper}},[e.$slots.tip?n("div",{ref:"tooltip",staticClass:"tooltip",style:"max-width: "+e.maxWidth+"px"},[e._t("tip")],2):e._e(),e._t("default")],2)]),e._t("reference")],2)},i=[],r=(n("c975"),n("a9e3"),n("cca6"),n("f0bd")),o=function(e,t,n){e&&t&&n&&(document.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n))},s=function(e,t,n){e&&t&&(document.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n))},l={props:{trigger:{type:String,default:"hover",validator:function(e){return["click","hover"].indexOf(e)>-1}},delayOnMouseOut:{type:Number,default:10},disabled:{type:Boolean,default:!1},content:String,enterActiveClass:String,leaveActiveClass:String,boundariesSelector:String,reference:{},forceShow:{type:Boolean,default:!1},appendToBody:{type:Boolean,default:!1},visibleArrow:{type:Boolean,default:!0},transition:{type:String,default:""},options:{type:Object,default:function(){return{}}},maxWidth:{type:Number,default:276}},data:function(){return{referenceElm:null,popperJS:null,showPopper:!1,currentPlacement:"",popperOptions:{placement:"bottom",gpuAcceleration:!1}}},watch:{showPopper:function(e){e?(this.$emit("show"),this.updatePopper()):this.$emit("hide")},forceShow:{handler:function(e){this[e?"doShow":"doClose"]()},immediate:!0}},created:function(){this.appendedArrow=!1,this.appendedToBody=!1,this.popperOptions=Object.assign(this.popperOptions,this.options)},mounted:function(){switch(this.referenceElm=this.reference||this.$slots.reference[0].elm,this.tooltip=this.$refs.tooltip||this.$slots.default[0].elm,this.trigger){case"click":o(this.referenceElm,"click",this.doToggle),o(document,"click",this.handleDocumentClick);break;case"hover":o(this.referenceElm,"mouseover",this.onMouseOver),o(this.tooltip,"mouseover",this.onMouseOver),o(this.referenceElm,"mouseout",this.onMouseOut),o(this.tooltip,"mouseout",this.onMouseOut);break}},methods:{doToggle:function(){this.forceShow||(this.showPopper=!this.showPopper)},doShow:function(){this.showPopper=!0},doClose:function(){this.showPopper=!1},doDestroy:function(){this.showPopper||(this.popperJS&&(this.popperJS.destroy(),this.popperJS=null),this.appendedToBody&&(this.appendedToBody=!1,document.body.removeChild(this.tooltip.parentElement)))},createPopper:function(){var e=this;this.$nextTick((function(){if(e.visibleArrow&&e.appendArrow(e.tooltip),e.appendToBody&&!e.appendedToBody&&(e.appendedToBody=!0,document.body.appendChild(e.tooltip.parentElement)),e.popperJS&&e.popperJS.destroy&&e.popperJS.destroy(),e.boundariesSelector){var t=document.querySelector(e.boundariesSelector);t&&(e.popperOptions.modifiers=Object.assign({},e.popperOptions.modifiers),e.popperOptions.modifiers.preventOverflow=Object.assign({},e.popperOptions.modifiers.preventOverflow),e.popperOptions.modifiers.preventOverflow.boundariesElement=t)}e.popperOptions.onCreate=function(){e.$emit("created",e),e.$nextTick(e.updatePopper)},e.popperJS=new r["a"](e.referenceElm,e.tooltip,e.popperOptions)}))},destroyPopper:function(){s(this.referenceElm,"click",this.doToggle),s(this.referenceElm,"mouseup",this.doClose),s(this.referenceElm,"mousedown",this.doShow),s(this.referenceElm,"focus",this.doShow),s(this.referenceElm,"blur",this.doClose),s(this.referenceElm,"mouseout",this.onMouseOut),s(this.referenceElm,"mouseover",this.onMouseOver),s(document,"click",this.handleDocumentClick),this.showPopper=!1,this.doDestroy()},appendArrow:function(e){if(!this.appendedArrow){this.appendedArrow=!0;var t=document.createElement("div");t.setAttribute("x-arrow",""),t.className="tooltip_arrow",e.appendChild(t)}},updatePopper:function(){this.popperJS?this.popperJS.scheduleUpdate():this.createPopper()},onMouseOver:function(){this.showPopper=!0,clearTimeout(this._timer)},onMouseOut:function(){var e=this;this._timer=setTimeout((function(){e.showPopper=!1}),this.delayOnMouseOut)},handleDocumentClick:function(e){this.$el&&this.referenceElm&&!this.$el.contains(e.target)&&!this.referenceElm.contains(e.target)&&this.tooltip&&!this.tooltip.contains(e.target)&&(this.$emit("documentClick"),this.forceShow||(this.showPopper=!1))}},destroyed:function(){this.destroyPopper()}},d={mixins:[l]},u=d,c=u,h=(n("9b84"),n("2877")),f=Object(h["a"])(c,a,i,!1,null,"c6df5654",null);t["default"]=f.exports},b622:function(e,t,n){var a=n("da84"),i=n("5692"),r=n("90e3"),o=n("4930"),s=a.Symbol,l=i("wks");e.exports=function(e){return l[e]||(l[e]=o&&s[e]||(o?s:r)("Symbol."+e))}},b64b:function(e,t,n){var a=n("23e7"),i=n("7b0b"),r=n("df75"),o=n("d039"),s=o((function(){r(1)}));a({target:"Object",stat:!0,forced:s},{keys:function(e){return r(i(e))}})},b669:function(e,t,n){},b727:function(e,t,n){var a=n("f8c2"),i=n("44ad"),r=n("7b0b"),o=n("50c4"),s=n("65f0"),l=[].push,d=function(e){var t=1==e,n=2==e,d=3==e,u=4==e,c=6==e,h=5==e||c;return function(f,m,p,_){for(var g,y,v=r(f),b=i(v),M=a(m,p,3),L=o(b.length),k=0,w=_||s,x=t?w(f,L):n?w(f,0):void 0;L>k;k++)if((h||k in b)&&(g=b[k],y=M(g,k,v),e))if(t)x[k]=y;else if(y)switch(e){case 3:return!0;case 5:return g;case 6:return k;case 2:l.call(x,g)}else if(u)return!1;return c?-1:d||u?u:x}};e.exports={forEach:d(0),map:d(1),filter:d(2),some:d(3),every:d(4),find:d(5),findIndex:d(6)}},b84c:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s sidan",s:"nokre sekund",ss:"%d sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return t}))},b97c:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={ss:"sekundes_sekundēm_sekunde_sekundes".split("_"),m:"minūtes_minūtēm_minūte_minūtes".split("_"),mm:"minūtes_minūtēm_minūte_minūtes".split("_"),h:"stundas_stundām_stunda_stundas".split("_"),hh:"stundas_stundām_stunda_stundas".split("_"),d:"dienas_dienām_diena_dienas".split("_"),dd:"dienas_dienām_diena_dienas".split("_"),M:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),MM:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")};function n(e,t,n){return n?t%10===1&&t%100!==11?e[2]:e[3]:t%10===1&&t%100!==11?e[0]:e[1]}function a(e,a,i){return e+" "+n(t[i],e,a)}function i(e,a,i){return n(t[i],e,a)}function r(e,t){return t?"dažas sekundes":"dažām sekundēm"}var o=e.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, HH:mm",LLLL:"YYYY. [gada] D. MMMM, dddd, HH:mm"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pēc %s",past:"pirms %s",s:r,ss:a,m:i,mm:a,h:i,hh:a,d:i,dd:a,M:i,MM:a,y:i,yy:a},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return o}))},b9d7:function(e,t,n){},bb71:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n,a){var i={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return t?i[n][0]:i[n][1]}var n=e.defineLocale("de-ch",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",ss:"%d Sekunden",m:t,mm:"%d Minuten",h:t,hh:"%d Stunden",d:t,dd:t,M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return n}))},bf18:function(e,t,n){},c032:function(e,t,n){t.f=n("b622")},c04e:function(e,t,n){var a=n("861d");e.exports=function(e,t){if(!a(e))return e;var n,i;if(t&&"function"==typeof(n=e.toString)&&!a(i=n.call(e)))return i;if("function"==typeof(n=e.valueOf)&&!a(i=n.call(e)))return i;if(!t&&"function"==typeof(n=e.toString)&&!a(i=n.call(e)))return i;throw TypeError("Can't convert object to primitive value")}},c101:function(e,t,n){"use strict";n("99af"),n("4160"),n("ac1f"),n("1276"),n("159b");t["a"]={props:{m:String,p:String,noMdbClass:Boolean},computed:{mdbClass:function(){if(!this.noMdbClass){var e=[],t=[];return this.m&&this.m.split(" ").length>1&&this.m.split(" ").forEach((function(t){e.push("m".concat(t.split("")[0],"-").concat(t.split("")[1]))})),this.p&&this.p.split(" ").length>1&&this.p.split(" ").forEach((function(e){t.push("p".concat(e.split("")[0],"-").concat(e.split("")[1]))})),[!!this.m&&(this.m.split(" ").length>1?e:this.m.split("").length>1?"m".concat(this.m.split("")[0],"-").concat(this.m.split("")[1]):"m-".concat(this.m)),!!this.p&&(this.p.split(" ").length>1?t:this.p.split("").length>1?"p".concat(this.p.split("")[0],"-").concat(this.p.split("")[1]):"p-".concat(this.p))]}}}}},c109:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",ss:"%d ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}});return t}))},c1df:function(e,t,n){(function(e){(function(t,n){e.exports=n()})(0,(function(){"use strict";var t,a;function i(){return t.apply(null,arguments)}function r(e){t=e}function o(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function s(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function l(e){if(Object.getOwnPropertyNames)return 0===Object.getOwnPropertyNames(e).length;var t;for(t in e)if(e.hasOwnProperty(t))return!1;return!0}function d(e){return void 0===e}function u(e){return"number"===typeof e||"[object Number]"===Object.prototype.toString.call(e)}function c(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function h(e,t){var n,a=[];for(n=0;n<e.length;++n)a.push(t(e[n],n));return a}function f(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function m(e,t){for(var n in t)f(t,n)&&(e[n]=t[n]);return f(t,"toString")&&(e.toString=t.toString),f(t,"valueOf")&&(e.valueOf=t.valueOf),e}function p(e,t,n,a){return Gn(e,t,n,a,!0).utc()}function _(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null,rfc2822:!1,weekdayMismatch:!1}}function g(e){return null==e._pf&&(e._pf=_()),e._pf}function y(e){if(null==e._isValid){var t=g(e),n=a.call(t.parsedDateParts,(function(e){return null!=e})),i=!isNaN(e._d.getTime())&&t.overflow<0&&!t.empty&&!t.invalidMonth&&!t.invalidWeekday&&!t.weekdayMismatch&&!t.nullInput&&!t.invalidFormat&&!t.userInvalidated&&(!t.meridiem||t.meridiem&&n);if(e._strict&&(i=i&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return i;e._isValid=i}return e._isValid}function v(e){var t=p(NaN);return null!=e?m(g(t),e):g(t).userInvalidated=!0,t}a=Array.prototype.some?Array.prototype.some:function(e){for(var t=Object(this),n=t.length>>>0,a=0;a<n;a++)if(a in t&&e.call(this,t[a],a,t))return!0;return!1};var b=i.momentProperties=[];function M(e,t){var n,a,i;if(d(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),d(t._i)||(e._i=t._i),d(t._f)||(e._f=t._f),d(t._l)||(e._l=t._l),d(t._strict)||(e._strict=t._strict),d(t._tzm)||(e._tzm=t._tzm),d(t._isUTC)||(e._isUTC=t._isUTC),d(t._offset)||(e._offset=t._offset),d(t._pf)||(e._pf=g(t)),d(t._locale)||(e._locale=t._locale),b.length>0)for(n=0;n<b.length;n++)a=b[n],i=t[a],d(i)||(e[a]=i);return e}var L=!1;function k(e){M(this,e),this._d=new Date(null!=e._d?e._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),!1===L&&(L=!0,i.updateOffset(this),L=!1)}function w(e){return e instanceof k||null!=e&&null!=e._isAMomentObject}function x(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function Y(e){var t=+e,n=0;return 0!==t&&isFinite(t)&&(n=x(t)),n}function S(e,t,n){var a,i=Math.min(e.length,t.length),r=Math.abs(e.length-t.length),o=0;for(a=0;a<i;a++)(n&&e[a]!==t[a]||!n&&Y(e[a])!==Y(t[a]))&&o++;return o+r}function D(e){!1===i.suppressDeprecationWarnings&&"undefined"!==typeof console&&console.warn&&console.warn("Deprecation warning: "+e)}function T(e,t){var n=!0;return m((function(){if(null!=i.deprecationHandler&&i.deprecationHandler(null,e),n){for(var a,r=[],o=0;o<arguments.length;o++){if(a="","object"===typeof arguments[o]){for(var s in a+="\n["+o+"] ",arguments[0])a+=s+": "+arguments[0][s]+", ";a=a.slice(0,-2)}else a=arguments[o];r.push(a)}D(e+"\nArguments: "+Array.prototype.slice.call(r).join("")+"\n"+(new Error).stack),n=!1}return t.apply(this,arguments)}),t)}var H,C={};function O(e,t){null!=i.deprecationHandler&&i.deprecationHandler(e,t),C[e]||(D(t),C[e]=!0)}function j(e){return e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function P(e){var t,n;for(n in e)t=e[n],j(t)?this[n]=t:this["_"+n]=t;this._config=e,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)}function A(e,t){var n,a=m({},e);for(n in t)f(t,n)&&(s(e[n])&&s(t[n])?(a[n]={},m(a[n],e[n]),m(a[n],t[n])):null!=t[n]?a[n]=t[n]:delete a[n]);for(n in e)f(e,n)&&!f(t,n)&&s(e[n])&&(a[n]=m({},a[n]));return a}function E(e){null!=e&&this.set(e)}i.suppressDeprecationWarnings=!1,i.deprecationHandler=null,H=Object.keys?Object.keys:function(e){var t,n=[];for(t in e)f(e,t)&&n.push(t);return n};var I={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"};function B(e,t,n){var a=this._calendar[e]||this._calendar["sameElse"];return j(a)?a.call(t,n):a}var W={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"};function F(e){var t=this._longDateFormat[e],n=this._longDateFormat[e.toUpperCase()];return t||!n?t:(this._longDateFormat[e]=n.replace(/MMMM|MM|DD|dddd/g,(function(e){return e.slice(1)})),this._longDateFormat[e])}var N="Invalid date";function z(){return this._invalidDate}var R="%d",$=/\d{1,2}/;function V(e){return this._ordinal.replace("%d",e)}var J={future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function U(e,t,n,a){var i=this._relativeTime[n];return j(i)?i(e,t,n,a):i.replace(/%d/i,e)}function G(e,t){var n=this._relativeTime[e>0?"future":"past"];return j(n)?n(t):n.replace(/%s/i,t)}var q={};function X(e,t){var n=e.toLowerCase();q[n]=q[n+"s"]=q[t]=e}function K(e){return"string"===typeof e?q[e]||q[e.toLowerCase()]:void 0}function Z(e){var t,n,a={};for(n in e)f(e,n)&&(t=K(n),t&&(a[t]=e[n]));return a}var Q={};function ee(e,t){Q[e]=t}function te(e){var t=[];for(var n in e)t.push({unit:n,priority:Q[n]});return t.sort((function(e,t){return e.priority-t.priority})),t}function ne(e,t,n){var a=""+Math.abs(e),i=t-a.length,r=e>=0;return(r?n?"+":"":"-")+Math.pow(10,Math.max(0,i)).toString().substr(1)+a}var ae=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,ie=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,re={},oe={};function se(e,t,n,a){var i=a;"string"===typeof a&&(i=function(){return this[a]()}),e&&(oe[e]=i),t&&(oe[t[0]]=function(){return ne(i.apply(this,arguments),t[1],t[2])}),n&&(oe[n]=function(){return this.localeData().ordinal(i.apply(this,arguments),e)})}function le(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function de(e){var t,n,a=e.match(ae);for(t=0,n=a.length;t<n;t++)oe[a[t]]?a[t]=oe[a[t]]:a[t]=le(a[t]);return function(t){var i,r="";for(i=0;i<n;i++)r+=j(a[i])?a[i].call(t,e):a[i];return r}}function ue(e,t){return e.isValid()?(t=ce(t,e.localeData()),re[t]=re[t]||de(t),re[t](e)):e.localeData().invalidDate()}function ce(e,t){var n=5;function a(e){return t.longDateFormat(e)||e}ie.lastIndex=0;while(n>=0&&ie.test(e))e=e.replace(ie,a),ie.lastIndex=0,n-=1;return e}var he=/\d/,fe=/\d\d/,me=/\d{3}/,pe=/\d{4}/,_e=/[+-]?\d{6}/,ge=/\d\d?/,ye=/\d\d\d\d?/,ve=/\d\d\d\d\d\d?/,be=/\d{1,3}/,Me=/\d{1,4}/,Le=/[+-]?\d{1,6}/,ke=/\d+/,we=/[+-]?\d+/,xe=/Z|[+-]\d\d:?\d\d/gi,Ye=/Z|[+-]\d\d(?::?\d\d)?/gi,Se=/[+-]?\d+(\.\d{1,3})?/,De=/[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,Te={};function He(e,t,n){Te[e]=j(t)?t:function(e,a){return e&&n?n:t}}function Ce(e,t){return f(Te,e)?Te[e](t._strict,t._locale):new RegExp(Oe(e))}function Oe(e){return je(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,(function(e,t,n,a,i){return t||n||a||i})))}function je(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var Pe={};function Ae(e,t){var n,a=t;for("string"===typeof e&&(e=[e]),u(t)&&(a=function(e,n){n[t]=Y(e)}),n=0;n<e.length;n++)Pe[e[n]]=a}function Ee(e,t){Ae(e,(function(e,n,a,i){a._w=a._w||{},t(e,a._w,a,i)}))}function Ie(e,t,n){null!=t&&f(Pe,e)&&Pe[e](t,n._a,n,e)}var Be=0,We=1,Fe=2,Ne=3,ze=4,Re=5,$e=6,Ve=7,Je=8;function Ue(e){return Ge(e)?366:365}function Ge(e){return e%4===0&&e%100!==0||e%400===0}se("Y",0,0,(function(){var e=this.year();return e<=9999?""+e:"+"+e})),se(0,["YY",2],0,(function(){return this.year()%100})),se(0,["YYYY",4],0,"year"),se(0,["YYYYY",5],0,"year"),se(0,["YYYYYY",6,!0],0,"year"),X("year","y"),ee("year",1),He("Y",we),He("YY",ge,fe),He("YYYY",Me,pe),He("YYYYY",Le,_e),He("YYYYYY",Le,_e),Ae(["YYYYY","YYYYYY"],Be),Ae("YYYY",(function(e,t){t[Be]=2===e.length?i.parseTwoDigitYear(e):Y(e)})),Ae("YY",(function(e,t){t[Be]=i.parseTwoDigitYear(e)})),Ae("Y",(function(e,t){t[Be]=parseInt(e,10)})),i.parseTwoDigitYear=function(e){return Y(e)+(Y(e)>68?1900:2e3)};var qe,Xe=Ze("FullYear",!0);function Ke(){return Ge(this.year())}function Ze(e,t){return function(n){return null!=n?(et(this,e,n),i.updateOffset(this,t),this):Qe(this,e)}}function Qe(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function et(e,t,n){e.isValid()&&!isNaN(n)&&("FullYear"===t&&Ge(e.year())&&1===e.month()&&29===e.date()?e._d["set"+(e._isUTC?"UTC":"")+t](n,e.month(),it(n,e.month())):e._d["set"+(e._isUTC?"UTC":"")+t](n))}function tt(e){return e=K(e),j(this[e])?this[e]():this}function nt(e,t){if("object"===typeof e){e=Z(e);for(var n=te(e),a=0;a<n.length;a++)this[n[a].unit](e[n[a].unit])}else if(e=K(e),j(this[e]))return this[e](t);return this}function at(e,t){return(e%t+t)%t}function it(e,t){if(isNaN(e)||isNaN(t))return NaN;var n=at(t,12);return e+=(t-n)/12,1===n?Ge(e)?29:28:31-n%7%2}qe=Array.prototype.indexOf?Array.prototype.indexOf:function(e){var t;for(t=0;t<this.length;++t)if(this[t]===e)return t;return-1},se("M",["MM",2],"Mo",(function(){return this.month()+1})),se("MMM",0,0,(function(e){return this.localeData().monthsShort(this,e)})),se("MMMM",0,0,(function(e){return this.localeData().months(this,e)})),X("month","M"),ee("month",8),He("M",ge),He("MM",ge,fe),He("MMM",(function(e,t){return t.monthsShortRegex(e)})),He("MMMM",(function(e,t){return t.monthsRegex(e)})),Ae(["M","MM"],(function(e,t){t[We]=Y(e)-1})),Ae(["MMM","MMMM"],(function(e,t,n,a){var i=n._locale.monthsParse(e,a,n._strict);null!=i?t[We]=i:g(n).invalidMonth=e}));var rt=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,ot="January_February_March_April_May_June_July_August_September_October_November_December".split("_");function st(e,t){return e?o(this._months)?this._months[e.month()]:this._months[(this._months.isFormat||rt).test(t)?"format":"standalone"][e.month()]:o(this._months)?this._months:this._months["standalone"]}var lt="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");function dt(e,t){return e?o(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[rt.test(t)?"format":"standalone"][e.month()]:o(this._monthsShort)?this._monthsShort:this._monthsShort["standalone"]}function ut(e,t,n){var a,i,r,o=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],a=0;a<12;++a)r=p([2e3,a]),this._shortMonthsParse[a]=this.monthsShort(r,"").toLocaleLowerCase(),this._longMonthsParse[a]=this.months(r,"").toLocaleLowerCase();return n?"MMM"===t?(i=qe.call(this._shortMonthsParse,o),-1!==i?i:null):(i=qe.call(this._longMonthsParse,o),-1!==i?i:null):"MMM"===t?(i=qe.call(this._shortMonthsParse,o),-1!==i?i:(i=qe.call(this._longMonthsParse,o),-1!==i?i:null)):(i=qe.call(this._longMonthsParse,o),-1!==i?i:(i=qe.call(this._shortMonthsParse,o),-1!==i?i:null))}function ct(e,t,n){var a,i,r;if(this._monthsParseExact)return ut.call(this,e,t,n);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),a=0;a<12;a++){if(i=p([2e3,a]),n&&!this._longMonthsParse[a]&&(this._longMonthsParse[a]=new RegExp("^"+this.months(i,"").replace(".","")+"$","i"),this._shortMonthsParse[a]=new RegExp("^"+this.monthsShort(i,"").replace(".","")+"$","i")),n||this._monthsParse[a]||(r="^"+this.months(i,"")+"|^"+this.monthsShort(i,""),this._monthsParse[a]=new RegExp(r.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[a].test(e))return a;if(n&&"MMM"===t&&this._shortMonthsParse[a].test(e))return a;if(!n&&this._monthsParse[a].test(e))return a}}function ht(e,t){var n;if(!e.isValid())return e;if("string"===typeof t)if(/^\d+$/.test(t))t=Y(t);else if(t=e.localeData().monthsParse(t),!u(t))return e;return n=Math.min(e.date(),it(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n),e}function ft(e){return null!=e?(ht(this,e),i.updateOffset(this,!0),this):Qe(this,"Month")}function mt(){return it(this.year(),this.month())}var pt=De;function _t(e){return this._monthsParseExact?(f(this,"_monthsRegex")||vt.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(f(this,"_monthsShortRegex")||(this._monthsShortRegex=pt),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)}var gt=De;function yt(e){return this._monthsParseExact?(f(this,"_monthsRegex")||vt.call(this),e?this._monthsStrictRegex:this._monthsRegex):(f(this,"_monthsRegex")||(this._monthsRegex=gt),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)}function vt(){function e(e,t){return t.length-e.length}var t,n,a=[],i=[],r=[];for(t=0;t<12;t++)n=p([2e3,t]),a.push(this.monthsShort(n,"")),i.push(this.months(n,"")),r.push(this.months(n,"")),r.push(this.monthsShort(n,""));for(a.sort(e),i.sort(e),r.sort(e),t=0;t<12;t++)a[t]=je(a[t]),i[t]=je(i[t]);for(t=0;t<24;t++)r[t]=je(r[t]);this._monthsRegex=new RegExp("^("+r.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+i.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+a.join("|")+")","i")}function bt(e,t,n,a,i,r,o){var s;return e<100&&e>=0?(s=new Date(e+400,t,n,a,i,r,o),isFinite(s.getFullYear())&&s.setFullYear(e)):s=new Date(e,t,n,a,i,r,o),s}function Mt(e){var t;if(e<100&&e>=0){var n=Array.prototype.slice.call(arguments);n[0]=e+400,t=new Date(Date.UTC.apply(null,n)),isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e)}else t=new Date(Date.UTC.apply(null,arguments));return t}function Lt(e,t,n){var a=7+t-n,i=(7+Mt(e,0,a).getUTCDay()-t)%7;return-i+a-1}function kt(e,t,n,a,i){var r,o,s=(7+n-a)%7,l=Lt(e,a,i),d=1+7*(t-1)+s+l;return d<=0?(r=e-1,o=Ue(r)+d):d>Ue(e)?(r=e+1,o=d-Ue(e)):(r=e,o=d),{year:r,dayOfYear:o}}function wt(e,t,n){var a,i,r=Lt(e.year(),t,n),o=Math.floor((e.dayOfYear()-r-1)/7)+1;return o<1?(i=e.year()-1,a=o+xt(i,t,n)):o>xt(e.year(),t,n)?(a=o-xt(e.year(),t,n),i=e.year()+1):(i=e.year(),a=o),{week:a,year:i}}function xt(e,t,n){var a=Lt(e,t,n),i=Lt(e+1,t,n);return(Ue(e)-a+i)/7}function Yt(e){return wt(e,this._week.dow,this._week.doy).week}se("w",["ww",2],"wo","week"),se("W",["WW",2],"Wo","isoWeek"),X("week","w"),X("isoWeek","W"),ee("week",5),ee("isoWeek",5),He("w",ge),He("ww",ge,fe),He("W",ge),He("WW",ge,fe),Ee(["w","ww","W","WW"],(function(e,t,n,a){t[a.substr(0,1)]=Y(e)}));var St={dow:0,doy:6};function Dt(){return this._week.dow}function Tt(){return this._week.doy}function Ht(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")}function Ct(e){var t=wt(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")}function Ot(e,t){return"string"!==typeof e?e:isNaN(e)?(e=t.weekdaysParse(e),"number"===typeof e?e:null):parseInt(e,10)}function jt(e,t){return"string"===typeof e?t.weekdaysParse(e)%7||7:isNaN(e)?null:e}function Pt(e,t){return e.slice(t,7).concat(e.slice(0,t))}se("d",0,"do","day"),se("dd",0,0,(function(e){return this.localeData().weekdaysMin(this,e)})),se("ddd",0,0,(function(e){return this.localeData().weekdaysShort(this,e)})),se("dddd",0,0,(function(e){return this.localeData().weekdays(this,e)})),se("e",0,0,"weekday"),se("E",0,0,"isoWeekday"),X("day","d"),X("weekday","e"),X("isoWeekday","E"),ee("day",11),ee("weekday",11),ee("isoWeekday",11),He("d",ge),He("e",ge),He("E",ge),He("dd",(function(e,t){return t.weekdaysMinRegex(e)})),He("ddd",(function(e,t){return t.weekdaysShortRegex(e)})),He("dddd",(function(e,t){return t.weekdaysRegex(e)})),Ee(["dd","ddd","dddd"],(function(e,t,n,a){var i=n._locale.weekdaysParse(e,a,n._strict);null!=i?t.d=i:g(n).invalidWeekday=e})),Ee(["d","e","E"],(function(e,t,n,a){t[a]=Y(e)}));var At="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_");function Et(e,t){var n=o(this._weekdays)?this._weekdays:this._weekdays[e&&!0!==e&&this._weekdays.isFormat.test(t)?"format":"standalone"];return!0===e?Pt(n,this._week.dow):e?n[e.day()]:n}var It="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");function Bt(e){return!0===e?Pt(this._weekdaysShort,this._week.dow):e?this._weekdaysShort[e.day()]:this._weekdaysShort}var Wt="Su_Mo_Tu_We_Th_Fr_Sa".split("_");function Ft(e){return!0===e?Pt(this._weekdaysMin,this._week.dow):e?this._weekdaysMin[e.day()]:this._weekdaysMin}function Nt(e,t,n){var a,i,r,o=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],a=0;a<7;++a)r=p([2e3,1]).day(a),this._minWeekdaysParse[a]=this.weekdaysMin(r,"").toLocaleLowerCase(),this._shortWeekdaysParse[a]=this.weekdaysShort(r,"").toLocaleLowerCase(),this._weekdaysParse[a]=this.weekdays(r,"").toLocaleLowerCase();return n?"dddd"===t?(i=qe.call(this._weekdaysParse,o),-1!==i?i:null):"ddd"===t?(i=qe.call(this._shortWeekdaysParse,o),-1!==i?i:null):(i=qe.call(this._minWeekdaysParse,o),-1!==i?i:null):"dddd"===t?(i=qe.call(this._weekdaysParse,o),-1!==i?i:(i=qe.call(this._shortWeekdaysParse,o),-1!==i?i:(i=qe.call(this._minWeekdaysParse,o),-1!==i?i:null))):"ddd"===t?(i=qe.call(this._shortWeekdaysParse,o),-1!==i?i:(i=qe.call(this._weekdaysParse,o),-1!==i?i:(i=qe.call(this._minWeekdaysParse,o),-1!==i?i:null))):(i=qe.call(this._minWeekdaysParse,o),-1!==i?i:(i=qe.call(this._weekdaysParse,o),-1!==i?i:(i=qe.call(this._shortWeekdaysParse,o),-1!==i?i:null)))}function zt(e,t,n){var a,i,r;if(this._weekdaysParseExact)return Nt.call(this,e,t,n);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),a=0;a<7;a++){if(i=p([2e3,1]).day(a),n&&!this._fullWeekdaysParse[a]&&(this._fullWeekdaysParse[a]=new RegExp("^"+this.weekdays(i,"").replace(".","\\.?")+"$","i"),this._shortWeekdaysParse[a]=new RegExp("^"+this.weekdaysShort(i,"").replace(".","\\.?")+"$","i"),this._minWeekdaysParse[a]=new RegExp("^"+this.weekdaysMin(i,"").replace(".","\\.?")+"$","i")),this._weekdaysParse[a]||(r="^"+this.weekdays(i,"")+"|^"+this.weekdaysShort(i,"")+"|^"+this.weekdaysMin(i,""),this._weekdaysParse[a]=new RegExp(r.replace(".",""),"i")),n&&"dddd"===t&&this._fullWeekdaysParse[a].test(e))return a;if(n&&"ddd"===t&&this._shortWeekdaysParse[a].test(e))return a;if(n&&"dd"===t&&this._minWeekdaysParse[a].test(e))return a;if(!n&&this._weekdaysParse[a].test(e))return a}}function Rt(e){if(!this.isValid())return null!=e?this:NaN;var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=Ot(e,this.localeData()),this.add(e-t,"d")):t}function $t(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")}function Vt(e){if(!this.isValid())return null!=e?this:NaN;if(null!=e){var t=jt(e,this.localeData());return this.day(this.day()%7?t:t-7)}return this.day()||7}var Jt=De;function Ut(e){return this._weekdaysParseExact?(f(this,"_weekdaysRegex")||Zt.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(f(this,"_weekdaysRegex")||(this._weekdaysRegex=Jt),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)}var Gt=De;function qt(e){return this._weekdaysParseExact?(f(this,"_weekdaysRegex")||Zt.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(f(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=Gt),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)}var Xt=De;function Kt(e){return this._weekdaysParseExact?(f(this,"_weekdaysRegex")||Zt.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(f(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=Xt),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)}function Zt(){function e(e,t){return t.length-e.length}var t,n,a,i,r,o=[],s=[],l=[],d=[];for(t=0;t<7;t++)n=p([2e3,1]).day(t),a=this.weekdaysMin(n,""),i=this.weekdaysShort(n,""),r=this.weekdays(n,""),o.push(a),s.push(i),l.push(r),d.push(a),d.push(i),d.push(r);for(o.sort(e),s.sort(e),l.sort(e),d.sort(e),t=0;t<7;t++)s[t]=je(s[t]),l[t]=je(l[t]),d[t]=je(d[t]);this._weekdaysRegex=new RegExp("^("+d.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+l.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+s.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+o.join("|")+")","i")}function Qt(){return this.hours()%12||12}function en(){return this.hours()||24}function tn(e,t){se(e,0,0,(function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)}))}function nn(e,t){return t._meridiemParse}function an(e){return"p"===(e+"").toLowerCase().charAt(0)}se("H",["HH",2],0,"hour"),se("h",["hh",2],0,Qt),se("k",["kk",2],0,en),se("hmm",0,0,(function(){return""+Qt.apply(this)+ne(this.minutes(),2)})),se("hmmss",0,0,(function(){return""+Qt.apply(this)+ne(this.minutes(),2)+ne(this.seconds(),2)})),se("Hmm",0,0,(function(){return""+this.hours()+ne(this.minutes(),2)})),se("Hmmss",0,0,(function(){return""+this.hours()+ne(this.minutes(),2)+ne(this.seconds(),2)})),tn("a",!0),tn("A",!1),X("hour","h"),ee("hour",13),He("a",nn),He("A",nn),He("H",ge),He("h",ge),He("k",ge),He("HH",ge,fe),He("hh",ge,fe),He("kk",ge,fe),He("hmm",ye),He("hmmss",ve),He("Hmm",ye),He("Hmmss",ve),Ae(["H","HH"],Ne),Ae(["k","kk"],(function(e,t,n){var a=Y(e);t[Ne]=24===a?0:a})),Ae(["a","A"],(function(e,t,n){n._isPm=n._locale.isPM(e),n._meridiem=e})),Ae(["h","hh"],(function(e,t,n){t[Ne]=Y(e),g(n).bigHour=!0})),Ae("hmm",(function(e,t,n){var a=e.length-2;t[Ne]=Y(e.substr(0,a)),t[ze]=Y(e.substr(a)),g(n).bigHour=!0})),Ae("hmmss",(function(e,t,n){var a=e.length-4,i=e.length-2;t[Ne]=Y(e.substr(0,a)),t[ze]=Y(e.substr(a,2)),t[Re]=Y(e.substr(i)),g(n).bigHour=!0})),Ae("Hmm",(function(e,t,n){var a=e.length-2;t[Ne]=Y(e.substr(0,a)),t[ze]=Y(e.substr(a))})),Ae("Hmmss",(function(e,t,n){var a=e.length-4,i=e.length-2;t[Ne]=Y(e.substr(0,a)),t[ze]=Y(e.substr(a,2)),t[Re]=Y(e.substr(i))}));var rn=/[ap]\.?m?\.?/i;function on(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"}var sn,ln=Ze("Hours",!0),dn={calendar:I,longDateFormat:W,invalidDate:N,ordinal:R,dayOfMonthOrdinalParse:$,relativeTime:J,months:ot,monthsShort:lt,week:St,weekdays:At,weekdaysMin:Wt,weekdaysShort:It,meridiemParse:rn},un={},cn={};function hn(e){return e?e.toLowerCase().replace("_","-"):e}function fn(e){var t,n,a,i,r=0;while(r<e.length){i=hn(e[r]).split("-"),t=i.length,n=hn(e[r+1]),n=n?n.split("-"):null;while(t>0){if(a=mn(i.slice(0,t).join("-")),a)return a;if(n&&n.length>=t&&S(i,n,!0)>=t-1)break;t--}r++}return sn}function mn(t){var a=null;if(!un[t]&&"undefined"!==typeof e&&e&&e.exports)try{a=sn._abbr;n("4678")("./"+t),pn(a)}catch(i){}return un[t]}function pn(e,t){var n;return e&&(n=d(t)?yn(e):_n(e,t),n?sn=n:"undefined"!==typeof console&&console.warn&&console.warn("Locale "+e+" not found. Did you forget to load it?")),sn._abbr}function _n(e,t){if(null!==t){var n,a=dn;if(t.abbr=e,null!=un[e])O("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),a=un[e]._config;else if(null!=t.parentLocale)if(null!=un[t.parentLocale])a=un[t.parentLocale]._config;else{if(n=mn(t.parentLocale),null==n)return cn[t.parentLocale]||(cn[t.parentLocale]=[]),cn[t.parentLocale].push({name:e,config:t}),null;a=n._config}return un[e]=new E(A(a,t)),cn[e]&&cn[e].forEach((function(e){_n(e.name,e.config)})),pn(e),un[e]}return delete un[e],null}function gn(e,t){if(null!=t){var n,a,i=dn;a=mn(e),null!=a&&(i=a._config),t=A(i,t),n=new E(t),n.parentLocale=un[e],un[e]=n,pn(e)}else null!=un[e]&&(null!=un[e].parentLocale?un[e]=un[e].parentLocale:null!=un[e]&&delete un[e]);return un[e]}function yn(e){var t;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return sn;if(!o(e)){if(t=mn(e),t)return t;e=[e]}return fn(e)}function vn(){return H(un)}function bn(e){var t,n=e._a;return n&&-2===g(e).overflow&&(t=n[We]<0||n[We]>11?We:n[Fe]<1||n[Fe]>it(n[Be],n[We])?Fe:n[Ne]<0||n[Ne]>24||24===n[Ne]&&(0!==n[ze]||0!==n[Re]||0!==n[$e])?Ne:n[ze]<0||n[ze]>59?ze:n[Re]<0||n[Re]>59?Re:n[$e]<0||n[$e]>999?$e:-1,g(e)._overflowDayOfYear&&(t<Be||t>Fe)&&(t=Fe),g(e)._overflowWeeks&&-1===t&&(t=Ve),g(e)._overflowWeekday&&-1===t&&(t=Je),g(e).overflow=t),e}function Mn(e,t,n){return null!=e?e:null!=t?t:n}function Ln(e){var t=new Date(i.now());return e._useUTC?[t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()]:[t.getFullYear(),t.getMonth(),t.getDate()]}function kn(e){var t,n,a,i,r,o=[];if(!e._d){for(a=Ln(e),e._w&&null==e._a[Fe]&&null==e._a[We]&&wn(e),null!=e._dayOfYear&&(r=Mn(e._a[Be],a[Be]),(e._dayOfYear>Ue(r)||0===e._dayOfYear)&&(g(e)._overflowDayOfYear=!0),n=Mt(r,0,e._dayOfYear),e._a[We]=n.getUTCMonth(),e._a[Fe]=n.getUTCDate()),t=0;t<3&&null==e._a[t];++t)e._a[t]=o[t]=a[t];for(;t<7;t++)e._a[t]=o[t]=null==e._a[t]?2===t?1:0:e._a[t];24===e._a[Ne]&&0===e._a[ze]&&0===e._a[Re]&&0===e._a[$e]&&(e._nextDay=!0,e._a[Ne]=0),e._d=(e._useUTC?Mt:bt).apply(null,o),i=e._useUTC?e._d.getUTCDay():e._d.getDay(),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[Ne]=24),e._w&&"undefined"!==typeof e._w.d&&e._w.d!==i&&(g(e).weekdayMismatch=!0)}}function wn(e){var t,n,a,i,r,o,s,l;if(t=e._w,null!=t.GG||null!=t.W||null!=t.E)r=1,o=4,n=Mn(t.GG,e._a[Be],wt(qn(),1,4).year),a=Mn(t.W,1),i=Mn(t.E,1),(i<1||i>7)&&(l=!0);else{r=e._locale._week.dow,o=e._locale._week.doy;var d=wt(qn(),r,o);n=Mn(t.gg,e._a[Be],d.year),a=Mn(t.w,d.week),null!=t.d?(i=t.d,(i<0||i>6)&&(l=!0)):null!=t.e?(i=t.e+r,(t.e<0||t.e>6)&&(l=!0)):i=r}a<1||a>xt(n,r,o)?g(e)._overflowWeeks=!0:null!=l?g(e)._overflowWeekday=!0:(s=kt(n,a,i,r,o),e._a[Be]=s.year,e._dayOfYear=s.dayOfYear)}var xn=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Yn=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Sn=/Z|[+-]\d\d(?::?\d\d)?/,Dn=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],Tn=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],Hn=/^\/?Date\((\-?\d+)/i;function Cn(e){var t,n,a,i,r,o,s=e._i,l=xn.exec(s)||Yn.exec(s);if(l){for(g(e).iso=!0,t=0,n=Dn.length;t<n;t++)if(Dn[t][1].exec(l[1])){i=Dn[t][0],a=!1!==Dn[t][2];break}if(null==i)return void(e._isValid=!1);if(l[3]){for(t=0,n=Tn.length;t<n;t++)if(Tn[t][1].exec(l[3])){r=(l[2]||" ")+Tn[t][0];break}if(null==r)return void(e._isValid=!1)}if(!a&&null!=r)return void(e._isValid=!1);if(l[4]){if(!Sn.exec(l[4]))return void(e._isValid=!1);o="Z"}e._f=i+(r||"")+(o||""),Nn(e)}else e._isValid=!1}var On=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;function jn(e,t,n,a,i,r){var o=[Pn(e),lt.indexOf(t),parseInt(n,10),parseInt(a,10),parseInt(i,10)];return r&&o.push(parseInt(r,10)),o}function Pn(e){var t=parseInt(e,10);return t<=49?2e3+t:t<=999?1900+t:t}function An(e){return e.replace(/\([^)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function En(e,t,n){if(e){var a=It.indexOf(e),i=new Date(t[0],t[1],t[2]).getDay();if(a!==i)return g(n).weekdayMismatch=!0,n._isValid=!1,!1}return!0}var In={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function Bn(e,t,n){if(e)return In[e];if(t)return 0;var a=parseInt(n,10),i=a%100,r=(a-i)/100;return 60*r+i}function Wn(e){var t=On.exec(An(e._i));if(t){var n=jn(t[4],t[3],t[2],t[5],t[6],t[7]);if(!En(t[1],n,e))return;e._a=n,e._tzm=Bn(t[8],t[9],t[10]),e._d=Mt.apply(null,e._a),e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),g(e).rfc2822=!0}else e._isValid=!1}function Fn(e){var t=Hn.exec(e._i);null===t?(Cn(e),!1===e._isValid&&(delete e._isValid,Wn(e),!1===e._isValid&&(delete e._isValid,i.createFromInputFallback(e)))):e._d=new Date(+t[1])}function Nn(e){if(e._f!==i.ISO_8601)if(e._f!==i.RFC_2822){e._a=[],g(e).empty=!0;var t,n,a,r,o,s=""+e._i,l=s.length,d=0;for(a=ce(e._f,e._locale).match(ae)||[],t=0;t<a.length;t++)r=a[t],n=(s.match(Ce(r,e))||[])[0],n&&(o=s.substr(0,s.indexOf(n)),o.length>0&&g(e).unusedInput.push(o),s=s.slice(s.indexOf(n)+n.length),d+=n.length),oe[r]?(n?g(e).empty=!1:g(e).unusedTokens.push(r),Ie(r,n,e)):e._strict&&!n&&g(e).unusedTokens.push(r);g(e).charsLeftOver=l-d,s.length>0&&g(e).unusedInput.push(s),e._a[Ne]<=12&&!0===g(e).bigHour&&e._a[Ne]>0&&(g(e).bigHour=void 0),g(e).parsedDateParts=e._a.slice(0),g(e).meridiem=e._meridiem,e._a[Ne]=zn(e._locale,e._a[Ne],e._meridiem),kn(e),bn(e)}else Wn(e);else Cn(e)}function zn(e,t,n){var a;return null==n?t:null!=e.meridiemHour?e.meridiemHour(t,n):null!=e.isPM?(a=e.isPM(n),a&&t<12&&(t+=12),a||12!==t||(t=0),t):t}function Rn(e){var t,n,a,i,r;if(0===e._f.length)return g(e).invalidFormat=!0,void(e._d=new Date(NaN));for(i=0;i<e._f.length;i++)r=0,t=M({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[i],Nn(t),y(t)&&(r+=g(t).charsLeftOver,r+=10*g(t).unusedTokens.length,g(t).score=r,(null==a||r<a)&&(a=r,n=t));m(e,n||t)}function $n(e){if(!e._d){var t=Z(e._i);e._a=h([t.year,t.month,t.day||t.date,t.hour,t.minute,t.second,t.millisecond],(function(e){return e&&parseInt(e,10)})),kn(e)}}function Vn(e){var t=new k(bn(Jn(e)));return t._nextDay&&(t.add(1,"d"),t._nextDay=void 0),t}function Jn(e){var t=e._i,n=e._f;return e._locale=e._locale||yn(e._l),null===t||void 0===n&&""===t?v({nullInput:!0}):("string"===typeof t&&(e._i=t=e._locale.preparse(t)),w(t)?new k(bn(t)):(c(t)?e._d=t:o(n)?Rn(e):n?Nn(e):Un(e),y(e)||(e._d=null),e))}function Un(e){var t=e._i;d(t)?e._d=new Date(i.now()):c(t)?e._d=new Date(t.valueOf()):"string"===typeof t?Fn(e):o(t)?(e._a=h(t.slice(0),(function(e){return parseInt(e,10)})),kn(e)):s(t)?$n(e):u(t)?e._d=new Date(t):i.createFromInputFallback(e)}function Gn(e,t,n,a,i){var r={};return!0!==n&&!1!==n||(a=n,n=void 0),(s(e)&&l(e)||o(e)&&0===e.length)&&(e=void 0),r._isAMomentObject=!0,r._useUTC=r._isUTC=i,r._l=n,r._i=e,r._f=t,r._strict=a,Vn(r)}function qn(e,t,n,a){return Gn(e,t,n,a,!1)}i.createFromInputFallback=T("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",(function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))})),i.ISO_8601=function(){},i.RFC_2822=function(){};var Xn=T("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",(function(){var e=qn.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:v()})),Kn=T("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",(function(){var e=qn.apply(null,arguments);return this.isValid()&&e.isValid()?e>this?this:e:v()}));function Zn(e,t){var n,a;if(1===t.length&&o(t[0])&&(t=t[0]),!t.length)return qn();for(n=t[0],a=1;a<t.length;++a)t[a].isValid()&&!t[a][e](n)||(n=t[a]);return n}function Qn(){var e=[].slice.call(arguments,0);return Zn("isBefore",e)}function ea(){var e=[].slice.call(arguments,0);return Zn("isAfter",e)}var ta=function(){return Date.now?Date.now():+new Date},na=["year","quarter","month","week","day","hour","minute","second","millisecond"];function aa(e){for(var t in e)if(-1===qe.call(na,t)||null!=e[t]&&isNaN(e[t]))return!1;for(var n=!1,a=0;a<na.length;++a)if(e[na[a]]){if(n)return!1;parseFloat(e[na[a]])!==Y(e[na[a]])&&(n=!0)}return!0}function ia(){return this._isValid}function ra(){return Sa(NaN)}function oa(e){var t=Z(e),n=t.year||0,a=t.quarter||0,i=t.month||0,r=t.week||t.isoWeek||0,o=t.day||0,s=t.hour||0,l=t.minute||0,d=t.second||0,u=t.millisecond||0;this._isValid=aa(t),this._milliseconds=+u+1e3*d+6e4*l+1e3*s*60*60,this._days=+o+7*r,this._months=+i+3*a+12*n,this._data={},this._locale=yn(),this._bubble()}function sa(e){return e instanceof oa}function la(e){return e<0?-1*Math.round(-1*e):Math.round(e)}function da(e,t){se(e,0,0,(function(){var e=this.utcOffset(),n="+";return e<0&&(e=-e,n="-"),n+ne(~~(e/60),2)+t+ne(~~e%60,2)}))}da("Z",":"),da("ZZ",""),He("Z",Ye),He("ZZ",Ye),Ae(["Z","ZZ"],(function(e,t,n){n._useUTC=!0,n._tzm=ca(Ye,e)}));var ua=/([\+\-]|\d\d)/gi;function ca(e,t){var n=(t||"").match(e);if(null===n)return null;var a=n[n.length-1]||[],i=(a+"").match(ua)||["-",0,0],r=60*i[1]+Y(i[2]);return 0===r?0:"+"===i[0]?r:-r}function ha(e,t){var n,a;return t._isUTC?(n=t.clone(),a=(w(e)||c(e)?e.valueOf():qn(e).valueOf())-n.valueOf(),n._d.setTime(n._d.valueOf()+a),i.updateOffset(n,!1),n):qn(e).local()}function fa(e){return 15*-Math.round(e._d.getTimezoneOffset()/15)}function ma(e,t,n){var a,r=this._offset||0;if(!this.isValid())return null!=e?this:NaN;if(null!=e){if("string"===typeof e){if(e=ca(Ye,e),null===e)return this}else Math.abs(e)<16&&!n&&(e*=60);return!this._isUTC&&t&&(a=fa(this)),this._offset=e,this._isUTC=!0,null!=a&&this.add(a,"m"),r!==e&&(!t||this._changeInProgress?Oa(this,Sa(e-r,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,i.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?r:fa(this)}function pa(e,t){return null!=e?("string"!==typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()}function _a(e){return this.utcOffset(0,e)}function ga(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(fa(this),"m")),this}function ya(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"===typeof this._i){var e=ca(xe,this._i);null!=e?this.utcOffset(e):this.utcOffset(0,!0)}return this}function va(e){return!!this.isValid()&&(e=e?qn(e).utcOffset():0,(this.utcOffset()-e)%60===0)}function ba(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Ma(){if(!d(this._isDSTShifted))return this._isDSTShifted;var e={};if(M(e,this),e=Jn(e),e._a){var t=e._isUTC?p(e._a):qn(e._a);this._isDSTShifted=this.isValid()&&S(e._a,t.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function La(){return!!this.isValid()&&!this._isUTC}function ka(){return!!this.isValid()&&this._isUTC}function wa(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}i.updateOffset=function(){};var xa=/^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,Ya=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;function Sa(e,t){var n,a,i,r=e,o=null;return sa(e)?r={ms:e._milliseconds,d:e._days,M:e._months}:u(e)?(r={},t?r[t]=e:r.milliseconds=e):(o=xa.exec(e))?(n="-"===o[1]?-1:1,r={y:0,d:Y(o[Fe])*n,h:Y(o[Ne])*n,m:Y(o[ze])*n,s:Y(o[Re])*n,ms:Y(la(1e3*o[$e]))*n}):(o=Ya.exec(e))?(n="-"===o[1]?-1:1,r={y:Da(o[2],n),M:Da(o[3],n),w:Da(o[4],n),d:Da(o[5],n),h:Da(o[6],n),m:Da(o[7],n),s:Da(o[8],n)}):null==r?r={}:"object"===typeof r&&("from"in r||"to"in r)&&(i=Ha(qn(r.from),qn(r.to)),r={},r.ms=i.milliseconds,r.M=i.months),a=new oa(r),sa(e)&&f(e,"_locale")&&(a._locale=e._locale),a}function Da(e,t){var n=e&&parseFloat(e.replace(",","."));return(isNaN(n)?0:n)*t}function Ta(e,t){var n={};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=+t-+e.clone().add(n.months,"M"),n}function Ha(e,t){var n;return e.isValid()&&t.isValid()?(t=ha(t,e),e.isBefore(t)?n=Ta(e,t):(n=Ta(t,e),n.milliseconds=-n.milliseconds,n.months=-n.months),n):{milliseconds:0,months:0}}function Ca(e,t){return function(n,a){var i,r;return null===a||isNaN(+a)||(O(t,"moment()."+t+"(period, number) is deprecated. Please use moment()."+t+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),r=n,n=a,a=r),n="string"===typeof n?+n:n,i=Sa(n,a),Oa(this,i,e),this}}function Oa(e,t,n,a){var r=t._milliseconds,o=la(t._days),s=la(t._months);e.isValid()&&(a=null==a||a,s&&ht(e,Qe(e,"Month")+s*n),o&&et(e,"Date",Qe(e,"Date")+o*n),r&&e._d.setTime(e._d.valueOf()+r*n),a&&i.updateOffset(e,o||s))}Sa.fn=oa.prototype,Sa.invalid=ra;var ja=Ca(1,"add"),Pa=Ca(-1,"subtract");function Aa(e,t){var n=e.diff(t,"days",!0);return n<-6?"sameElse":n<-1?"lastWeek":n<0?"lastDay":n<1?"sameDay":n<2?"nextDay":n<7?"nextWeek":"sameElse"}function Ea(e,t){var n=e||qn(),a=ha(n,this).startOf("day"),r=i.calendarFormat(this,a)||"sameElse",o=t&&(j(t[r])?t[r].call(this,n):t[r]);return this.format(o||this.localeData().calendar(r,this,qn(n)))}function Ia(){return new k(this)}function Ba(e,t){var n=w(e)?e:qn(e);return!(!this.isValid()||!n.isValid())&&(t=K(t)||"millisecond","millisecond"===t?this.valueOf()>n.valueOf():n.valueOf()<this.clone().startOf(t).valueOf())}function Wa(e,t){var n=w(e)?e:qn(e);return!(!this.isValid()||!n.isValid())&&(t=K(t)||"millisecond","millisecond"===t?this.valueOf()<n.valueOf():this.clone().endOf(t).valueOf()<n.valueOf())}function Fa(e,t,n,a){var i=w(e)?e:qn(e),r=w(t)?t:qn(t);return!!(this.isValid()&&i.isValid()&&r.isValid())&&(a=a||"()",("("===a[0]?this.isAfter(i,n):!this.isBefore(i,n))&&(")"===a[1]?this.isBefore(r,n):!this.isAfter(r,n)))}function Na(e,t){var n,a=w(e)?e:qn(e);return!(!this.isValid()||!a.isValid())&&(t=K(t)||"millisecond","millisecond"===t?this.valueOf()===a.valueOf():(n=a.valueOf(),this.clone().startOf(t).valueOf()<=n&&n<=this.clone().endOf(t).valueOf()))}function za(e,t){return this.isSame(e,t)||this.isAfter(e,t)}function Ra(e,t){return this.isSame(e,t)||this.isBefore(e,t)}function $a(e,t,n){var a,i,r;if(!this.isValid())return NaN;if(a=ha(e,this),!a.isValid())return NaN;switch(i=6e4*(a.utcOffset()-this.utcOffset()),t=K(t),t){case"year":r=Va(this,a)/12;break;case"month":r=Va(this,a);break;case"quarter":r=Va(this,a)/3;break;case"second":r=(this-a)/1e3;break;case"minute":r=(this-a)/6e4;break;case"hour":r=(this-a)/36e5;break;case"day":r=(this-a-i)/864e5;break;case"week":r=(this-a-i)/6048e5;break;default:r=this-a}return n?r:x(r)}function Va(e,t){var n,a,i=12*(t.year()-e.year())+(t.month()-e.month()),r=e.clone().add(i,"months");return t-r<0?(n=e.clone().add(i-1,"months"),a=(t-r)/(r-n)):(n=e.clone().add(i+1,"months"),a=(t-r)/(n-r)),-(i+a)||0}function Ja(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function Ua(e){if(!this.isValid())return null;var t=!0!==e,n=t?this.clone().utc():this;return n.year()<0||n.year()>9999?ue(n,t?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):j(Date.prototype.toISOString)?t?this.toDate().toISOString():new Date(this.valueOf()+60*this.utcOffset()*1e3).toISOString().replace("Z",ue(n,"Z")):ue(n,t?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")}function Ga(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e="moment",t="";this.isLocal()||(e=0===this.utcOffset()?"moment.utc":"moment.parseZone",t="Z");var n="["+e+'("]',a=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",i="-MM-DD[T]HH:mm:ss.SSS",r=t+'[")]';return this.format(n+a+i+r)}function qa(e){e||(e=this.isUtc()?i.defaultFormatUtc:i.defaultFormat);var t=ue(this,e);return this.localeData().postformat(t)}function Xa(e,t){return this.isValid()&&(w(e)&&e.isValid()||qn(e).isValid())?Sa({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()}function Ka(e){return this.from(qn(),e)}function Za(e,t){return this.isValid()&&(w(e)&&e.isValid()||qn(e).isValid())?Sa({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()}function Qa(e){return this.to(qn(),e)}function ei(e){var t;return void 0===e?this._locale._abbr:(t=yn(e),null!=t&&(this._locale=t),this)}i.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",i.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var ti=T("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",(function(e){return void 0===e?this.localeData():this.locale(e)}));function ni(){return this._locale}var ai=1e3,ii=60*ai,ri=60*ii,oi=3506328*ri;function si(e,t){return(e%t+t)%t}function li(e,t,n){return e<100&&e>=0?new Date(e+400,t,n)-oi:new Date(e,t,n).valueOf()}function di(e,t,n){return e<100&&e>=0?Date.UTC(e+400,t,n)-oi:Date.UTC(e,t,n)}function ui(e){var t;if(e=K(e),void 0===e||"millisecond"===e||!this.isValid())return this;var n=this._isUTC?di:li;switch(e){case"year":t=n(this.year(),0,1);break;case"quarter":t=n(this.year(),this.month()-this.month()%3,1);break;case"month":t=n(this.year(),this.month(),1);break;case"week":t=n(this.year(),this.month(),this.date()-this.weekday());break;case"isoWeek":t=n(this.year(),this.month(),this.date()-(this.isoWeekday()-1));break;case"day":case"date":t=n(this.year(),this.month(),this.date());break;case"hour":t=this._d.valueOf(),t-=si(t+(this._isUTC?0:this.utcOffset()*ii),ri);break;case"minute":t=this._d.valueOf(),t-=si(t,ii);break;case"second":t=this._d.valueOf(),t-=si(t,ai);break}return this._d.setTime(t),i.updateOffset(this,!0),this}function ci(e){var t;if(e=K(e),void 0===e||"millisecond"===e||!this.isValid())return this;var n=this._isUTC?di:li;switch(e){case"year":t=n(this.year()+1,0,1)-1;break;case"quarter":t=n(this.year(),this.month()-this.month()%3+3,1)-1;break;case"month":t=n(this.year(),this.month()+1,1)-1;break;case"week":t=n(this.year(),this.month(),this.date()-this.weekday()+7)-1;break;case"isoWeek":t=n(this.year(),this.month(),this.date()-(this.isoWeekday()-1)+7)-1;break;case"day":case"date":t=n(this.year(),this.month(),this.date()+1)-1;break;case"hour":t=this._d.valueOf(),t+=ri-si(t+(this._isUTC?0:this.utcOffset()*ii),ri)-1;break;case"minute":t=this._d.valueOf(),t+=ii-si(t,ii)-1;break;case"second":t=this._d.valueOf(),t+=ai-si(t,ai)-1;break}return this._d.setTime(t),i.updateOffset(this,!0),this}function hi(){return this._d.valueOf()-6e4*(this._offset||0)}function fi(){return Math.floor(this.valueOf()/1e3)}function mi(){return new Date(this.valueOf())}function pi(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]}function _i(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}}function gi(){return this.isValid()?this.toISOString():null}function yi(){return y(this)}function vi(){return m({},g(this))}function bi(){return g(this).overflow}function Mi(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function Li(e,t){se(0,[e,e.length],0,t)}function ki(e){return Si.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function wi(e){return Si.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)}function xi(){return xt(this.year(),1,4)}function Yi(){var e=this.localeData()._week;return xt(this.year(),e.dow,e.doy)}function Si(e,t,n,a,i){var r;return null==e?wt(this,a,i).year:(r=xt(e,a,i),t>r&&(t=r),Di.call(this,e,t,n,a,i))}function Di(e,t,n,a,i){var r=kt(e,t,n,a,i),o=Mt(r.year,0,r.dayOfYear);return this.year(o.getUTCFullYear()),this.month(o.getUTCMonth()),this.date(o.getUTCDate()),this}function Ti(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)}se(0,["gg",2],0,(function(){return this.weekYear()%100})),se(0,["GG",2],0,(function(){return this.isoWeekYear()%100})),Li("gggg","weekYear"),Li("ggggg","weekYear"),Li("GGGG","isoWeekYear"),Li("GGGGG","isoWeekYear"),X("weekYear","gg"),X("isoWeekYear","GG"),ee("weekYear",1),ee("isoWeekYear",1),He("G",we),He("g",we),He("GG",ge,fe),He("gg",ge,fe),He("GGGG",Me,pe),He("gggg",Me,pe),He("GGGGG",Le,_e),He("ggggg",Le,_e),Ee(["gggg","ggggg","GGGG","GGGGG"],(function(e,t,n,a){t[a.substr(0,2)]=Y(e)})),Ee(["gg","GG"],(function(e,t,n,a){t[a]=i.parseTwoDigitYear(e)})),se("Q",0,"Qo","quarter"),X("quarter","Q"),ee("quarter",7),He("Q",he),Ae("Q",(function(e,t){t[We]=3*(Y(e)-1)})),se("D",["DD",2],"Do","date"),X("date","D"),ee("date",9),He("D",ge),He("DD",ge,fe),He("Do",(function(e,t){return e?t._dayOfMonthOrdinalParse||t._ordinalParse:t._dayOfMonthOrdinalParseLenient})),Ae(["D","DD"],Fe),Ae("Do",(function(e,t){t[Fe]=Y(e.match(ge)[0])}));var Hi=Ze("Date",!0);function Ci(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")}se("DDD",["DDDD",3],"DDDo","dayOfYear"),X("dayOfYear","DDD"),ee("dayOfYear",4),He("DDD",be),He("DDDD",me),Ae(["DDD","DDDD"],(function(e,t,n){n._dayOfYear=Y(e)})),se("m",["mm",2],0,"minute"),X("minute","m"),ee("minute",14),He("m",ge),He("mm",ge,fe),Ae(["m","mm"],ze);var Oi=Ze("Minutes",!1);se("s",["ss",2],0,"second"),X("second","s"),ee("second",15),He("s",ge),He("ss",ge,fe),Ae(["s","ss"],Re);var ji,Pi=Ze("Seconds",!1);for(se("S",0,0,(function(){return~~(this.millisecond()/100)})),se(0,["SS",2],0,(function(){return~~(this.millisecond()/10)})),se(0,["SSS",3],0,"millisecond"),se(0,["SSSS",4],0,(function(){return 10*this.millisecond()})),se(0,["SSSSS",5],0,(function(){return 100*this.millisecond()})),se(0,["SSSSSS",6],0,(function(){return 1e3*this.millisecond()})),se(0,["SSSSSSS",7],0,(function(){return 1e4*this.millisecond()})),se(0,["SSSSSSSS",8],0,(function(){return 1e5*this.millisecond()})),se(0,["SSSSSSSSS",9],0,(function(){return 1e6*this.millisecond()})),X("millisecond","ms"),ee("millisecond",16),He("S",be,he),He("SS",be,fe),He("SSS",be,me),ji="SSSS";ji.length<=9;ji+="S")He(ji,ke);function Ai(e,t){t[$e]=Y(1e3*("0."+e))}for(ji="S";ji.length<=9;ji+="S")Ae(ji,Ai);var Ei=Ze("Milliseconds",!1);function Ii(){return this._isUTC?"UTC":""}function Bi(){return this._isUTC?"Coordinated Universal Time":""}se("z",0,0,"zoneAbbr"),se("zz",0,0,"zoneName");var Wi=k.prototype;function Fi(e){return qn(1e3*e)}function Ni(){return qn.apply(null,arguments).parseZone()}function zi(e){return e}Wi.add=ja,Wi.calendar=Ea,Wi.clone=Ia,Wi.diff=$a,Wi.endOf=ci,Wi.format=qa,Wi.from=Xa,Wi.fromNow=Ka,Wi.to=Za,Wi.toNow=Qa,Wi.get=tt,Wi.invalidAt=bi,Wi.isAfter=Ba,Wi.isBefore=Wa,Wi.isBetween=Fa,Wi.isSame=Na,Wi.isSameOrAfter=za,Wi.isSameOrBefore=Ra,Wi.isValid=yi,Wi.lang=ti,Wi.locale=ei,Wi.localeData=ni,Wi.max=Kn,Wi.min=Xn,Wi.parsingFlags=vi,Wi.set=nt,Wi.startOf=ui,Wi.subtract=Pa,Wi.toArray=pi,Wi.toObject=_i,Wi.toDate=mi,Wi.toISOString=Ua,Wi.inspect=Ga,Wi.toJSON=gi,Wi.toString=Ja,Wi.unix=fi,Wi.valueOf=hi,Wi.creationData=Mi,Wi.year=Xe,Wi.isLeapYear=Ke,Wi.weekYear=ki,Wi.isoWeekYear=wi,Wi.quarter=Wi.quarters=Ti,Wi.month=ft,Wi.daysInMonth=mt,Wi.week=Wi.weeks=Ht,Wi.isoWeek=Wi.isoWeeks=Ct,Wi.weeksInYear=Yi,Wi.isoWeeksInYear=xi,Wi.date=Hi,Wi.day=Wi.days=Rt,Wi.weekday=$t,Wi.isoWeekday=Vt,Wi.dayOfYear=Ci,Wi.hour=Wi.hours=ln,Wi.minute=Wi.minutes=Oi,Wi.second=Wi.seconds=Pi,Wi.millisecond=Wi.milliseconds=Ei,Wi.utcOffset=ma,Wi.utc=_a,Wi.local=ga,Wi.parseZone=ya,Wi.hasAlignedHourOffset=va,Wi.isDST=ba,Wi.isLocal=La,Wi.isUtcOffset=ka,Wi.isUtc=wa,Wi.isUTC=wa,Wi.zoneAbbr=Ii,Wi.zoneName=Bi,Wi.dates=T("dates accessor is deprecated. Use date instead.",Hi),Wi.months=T("months accessor is deprecated. Use month instead",ft),Wi.years=T("years accessor is deprecated. Use year instead",Xe),Wi.zone=T("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",pa),Wi.isDSTShifted=T("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",Ma);var Ri=E.prototype;function $i(e,t,n,a){var i=yn(),r=p().set(a,t);return i[n](r,e)}function Vi(e,t,n){if(u(e)&&(t=e,e=void 0),e=e||"",null!=t)return $i(e,t,n,"month");var a,i=[];for(a=0;a<12;a++)i[a]=$i(e,a,n,"month");return i}function Ji(e,t,n,a){"boolean"===typeof e?(u(t)&&(n=t,t=void 0),t=t||""):(t=e,n=t,e=!1,u(t)&&(n=t,t=void 0),t=t||"");var i,r=yn(),o=e?r._week.dow:0;if(null!=n)return $i(t,(n+o)%7,a,"day");var s=[];for(i=0;i<7;i++)s[i]=$i(t,(i+o)%7,a,"day");return s}function Ui(e,t){return Vi(e,t,"months")}function Gi(e,t){return Vi(e,t,"monthsShort")}function qi(e,t,n){return Ji(e,t,n,"weekdays")}function Xi(e,t,n){return Ji(e,t,n,"weekdaysShort")}function Ki(e,t,n){return Ji(e,t,n,"weekdaysMin")}Ri.calendar=B,Ri.longDateFormat=F,Ri.invalidDate=z,Ri.ordinal=V,Ri.preparse=zi,Ri.postformat=zi,Ri.relativeTime=U,Ri.pastFuture=G,Ri.set=P,Ri.months=st,Ri.monthsShort=dt,Ri.monthsParse=ct,Ri.monthsRegex=yt,Ri.monthsShortRegex=_t,Ri.week=Yt,Ri.firstDayOfYear=Tt,Ri.firstDayOfWeek=Dt,Ri.weekdays=Et,Ri.weekdaysMin=Ft,Ri.weekdaysShort=Bt,Ri.weekdaysParse=zt,Ri.weekdaysRegex=Ut,Ri.weekdaysShortRegex=qt,Ri.weekdaysMinRegex=Kt,Ri.isPM=an,Ri.meridiem=on,pn("en",{dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10,n=1===Y(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n}}),i.lang=T("moment.lang is deprecated. Use moment.locale instead.",pn),i.langData=T("moment.langData is deprecated. Use moment.localeData instead.",yn);var Zi=Math.abs;function Qi(){var e=this._data;return this._milliseconds=Zi(this._milliseconds),this._days=Zi(this._days),this._months=Zi(this._months),e.milliseconds=Zi(e.milliseconds),e.seconds=Zi(e.seconds),e.minutes=Zi(e.minutes),e.hours=Zi(e.hours),e.months=Zi(e.months),e.years=Zi(e.years),this}function er(e,t,n,a){var i=Sa(t,n);return e._milliseconds+=a*i._milliseconds,e._days+=a*i._days,e._months+=a*i._months,e._bubble()}function tr(e,t){return er(this,e,t,1)}function nr(e,t){return er(this,e,t,-1)}function ar(e){return e<0?Math.floor(e):Math.ceil(e)}function ir(){var e,t,n,a,i,r=this._milliseconds,o=this._days,s=this._months,l=this._data;return r>=0&&o>=0&&s>=0||r<=0&&o<=0&&s<=0||(r+=864e5*ar(or(s)+o),o=0,s=0),l.milliseconds=r%1e3,e=x(r/1e3),l.seconds=e%60,t=x(e/60),l.minutes=t%60,n=x(t/60),l.hours=n%24,o+=x(n/24),i=x(rr(o)),s+=i,o-=ar(or(i)),a=x(s/12),s%=12,l.days=o,l.months=s,l.years=a,this}function rr(e){return 4800*e/146097}function or(e){return 146097*e/4800}function sr(e){if(!this.isValid())return NaN;var t,n,a=this._milliseconds;if(e=K(e),"month"===e||"quarter"===e||"year"===e)switch(t=this._days+a/864e5,n=this._months+rr(t),e){case"month":return n;case"quarter":return n/3;case"year":return n/12}else switch(t=this._days+Math.round(or(this._months)),e){case"week":return t/7+a/6048e5;case"day":return t+a/864e5;case"hour":return 24*t+a/36e5;case"minute":return 1440*t+a/6e4;case"second":return 86400*t+a/1e3;case"millisecond":return Math.floor(864e5*t)+a;default:throw new Error("Unknown unit "+e)}}function lr(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*Y(this._months/12):NaN}function dr(e){return function(){return this.as(e)}}var ur=dr("ms"),cr=dr("s"),hr=dr("m"),fr=dr("h"),mr=dr("d"),pr=dr("w"),_r=dr("M"),gr=dr("Q"),yr=dr("y");function vr(){return Sa(this)}function br(e){return e=K(e),this.isValid()?this[e+"s"]():NaN}function Mr(e){return function(){return this.isValid()?this._data[e]:NaN}}var Lr=Mr("milliseconds"),kr=Mr("seconds"),wr=Mr("minutes"),xr=Mr("hours"),Yr=Mr("days"),Sr=Mr("months"),Dr=Mr("years");function Tr(){return x(this.days()/7)}var Hr=Math.round,Cr={ss:44,s:45,m:45,h:22,d:26,M:11};function Or(e,t,n,a,i){return i.relativeTime(t||1,!!n,e,a)}function jr(e,t,n){var a=Sa(e).abs(),i=Hr(a.as("s")),r=Hr(a.as("m")),o=Hr(a.as("h")),s=Hr(a.as("d")),l=Hr(a.as("M")),d=Hr(a.as("y")),u=i<=Cr.ss&&["s",i]||i<Cr.s&&["ss",i]||r<=1&&["m"]||r<Cr.m&&["mm",r]||o<=1&&["h"]||o<Cr.h&&["hh",o]||s<=1&&["d"]||s<Cr.d&&["dd",s]||l<=1&&["M"]||l<Cr.M&&["MM",l]||d<=1&&["y"]||["yy",d];return u[2]=t,u[3]=+e>0,u[4]=n,Or.apply(null,u)}function Pr(e){return void 0===e?Hr:"function"===typeof e&&(Hr=e,!0)}function Ar(e,t){return void 0!==Cr[e]&&(void 0===t?Cr[e]:(Cr[e]=t,"s"===e&&(Cr.ss=t-1),!0))}function Er(e){if(!this.isValid())return this.localeData().invalidDate();var t=this.localeData(),n=jr(this,!e,t);return e&&(n=t.pastFuture(+this,n)),t.postformat(n)}var Ir=Math.abs;function Br(e){return(e>0)-(e<0)||+e}function Wr(){if(!this.isValid())return this.localeData().invalidDate();var e,t,n,a=Ir(this._milliseconds)/1e3,i=Ir(this._days),r=Ir(this._months);e=x(a/60),t=x(e/60),a%=60,e%=60,n=x(r/12),r%=12;var o=n,s=r,l=i,d=t,u=e,c=a?a.toFixed(3).replace(/\.?0+$/,""):"",h=this.asSeconds();if(!h)return"P0D";var f=h<0?"-":"",m=Br(this._months)!==Br(h)?"-":"",p=Br(this._days)!==Br(h)?"-":"",_=Br(this._milliseconds)!==Br(h)?"-":"";return f+"P"+(o?m+o+"Y":"")+(s?m+s+"M":"")+(l?p+l+"D":"")+(d||u||c?"T":"")+(d?_+d+"H":"")+(u?_+u+"M":"")+(c?_+c+"S":"")}var Fr=oa.prototype;return Fr.isValid=ia,Fr.abs=Qi,Fr.add=tr,Fr.subtract=nr,Fr.as=sr,Fr.asMilliseconds=ur,Fr.asSeconds=cr,Fr.asMinutes=hr,Fr.asHours=fr,Fr.asDays=mr,Fr.asWeeks=pr,Fr.asMonths=_r,Fr.asQuarters=gr,Fr.asYears=yr,Fr.valueOf=lr,Fr._bubble=ir,Fr.clone=vr,Fr.get=br,Fr.milliseconds=Lr,Fr.seconds=kr,Fr.minutes=wr,Fr.hours=xr,Fr.days=Yr,Fr.weeks=Tr,Fr.months=Sr,Fr.years=Dr,Fr.humanize=Er,Fr.toISOString=Wr,Fr.toString=Wr,Fr.toJSON=Wr,Fr.locale=ei,Fr.localeData=ni,Fr.toIsoString=T("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Wr),Fr.lang=ti,se("X",0,0,"unix"),se("x",0,0,"valueOf"),He("x",we),He("X",Se),Ae("X",(function(e,t,n){n._d=new Date(1e3*parseFloat(e,10))})),Ae("x",(function(e,t,n){n._d=new Date(Y(e))})),i.version="2.24.0",r(qn),i.fn=Wi,i.min=Qn,i.max=ea,i.now=ta,i.utc=p,i.unix=Fi,i.months=Ui,i.isDate=c,i.locale=pn,i.invalid=v,i.duration=Sa,i.isMoment=w,i.weekdays=qi,i.parseZone=Ni,i.localeData=yn,i.isDuration=sa,i.monthsShort=Gi,i.weekdaysMin=Ki,i.defineLocale=_n,i.updateLocale=gn,i.locales=vn,i.weekdaysShort=Xi,i.normalizeUnits=K,i.relativeTimeRounding=Pr,i.relativeTimeThreshold=Ar,i.calendarFormat=Aa,i.prototype=Wi,i.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"GGGG-[W]WW",MONTH:"YYYY-MM"},i}))}).call(this,n("62e4")(e))},c430:function(e,t){e.exports=!1},c4fe:function(e,t,n){"use strict";var a=n("5d26"),i=n.n(a);i.a},c6b6:function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},c6cd:function(e,t,n){var a=n("da84"),i=n("ce4e"),r="__core-js_shared__",o=a[r]||i(r,{});e.exports=o},c700:function(e,t,n){},c740:function(e,t,n){"use strict";var a=n("23e7"),i=n("b727").findIndex,r=n("44d2"),o="findIndex",s=!0;o in[]&&Array(1)[o]((function(){s=!1})),a({target:"Array",proto:!0,forced:s},{findIndex:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}}),r(o)},c7aa:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY HH:mm",LLLL:"dddd, D [ב]MMMM YYYY HH:mm",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",ss:"%d שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(e){return 2===e?"שעתיים":e+" שעות"},d:"יום",dd:function(e){return 2===e?"יומיים":e+" ימים"},M:"חודש",MM:function(e){return 2===e?"חודשיים":e+" חודשים"},y:"שנה",yy:function(e){return 2===e?"שנתיים":e%10===0&&10!==e?e+" שנה":e+" שנים"}},meridiemParse:/אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,isPM:function(e){return/^(אחה"צ|אחרי הצהריים|בערב)$/.test(e)},meridiem:function(e,t,n){return e<5?"לפנות בוקר":e<10?"בבוקר":e<12?n?'לפנה"צ':"לפני הצהריים":e<18?n?'אחה"צ':"אחרי הצהריים":"בערב"}});return t}))},c7cd:function(e,t,n){"use strict";var a=n("23e7"),i=n("857a"),r=n("eae9");a({target:"String",proto:!0,forced:r("fixed")},{fixed:function(){return i(this,"tt","","")}})},c8b9:function(e,t,n){"use strict";n.d(t,"b",(function(){return o}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},i=[],r=n("c101"),o={props:{tag:{type:String,default:"div"},start:{type:Boolean,default:!1},end:{type:Boolean,default:!1},center:{type:Boolean,default:!1},between:{type:Boolean,default:!1},around:{type:Boolean,default:!1}},computed:{className:function(){return["row",this.start&&"justify-content-start",this.end&&"justify-content-end",this.center&&"justify-content-center",this.between&&"justify-content-between",this.around&&"justify-content-around",this.mdbClass]}},mixins:[r["a"]]},s=o,l=s,d=n("2877"),u=Object(d["a"])(l,a,i,!1,null,"320224c2",null);t["a"]=u.exports},c8ba:function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(a){"object"===typeof window&&(n=window)}e.exports=n},c8f3:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),weekdaysParseExact:!0,meridiemParse:/PD|MD/,isPM:function(e){return"M"===e.charAt(0)},meridiem:function(e,t,n){return e<12?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",ss:"%d sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return t}))},c96a:function(e,t,n){"use strict";var a=n("23e7"),i=n("857a"),r=n("eae9");a({target:"String",proto:!0,forced:r("small")},{small:function(){return i(this,"small","","")}})},c975:function(e,t,n){"use strict";var a=n("23e7"),i=n("4d64").indexOf,r=n("b301"),o=[].indexOf,s=!!o&&1/[1].indexOf(1,-0)<0,l=r("indexOf");a({target:"Array",proto:!0,forced:s||l},{indexOf:function(e){return s?o.apply(this,arguments)||0:i(this,e,arguments.length>1?arguments[1]:void 0)}})},ca58:function(e,t,n){},ca84:function(e,t,n){var a=n("5135"),i=n("fc6a"),r=n("4d64").indexOf,o=n("d012");e.exports=function(e,t){var n,s=i(e),l=0,d=[];for(n in s)!a(o,n)&&a(s,n)&&d.push(n);while(t.length>l)a(s,n=t[l++])&&(~r(d,n)||d.push(n));return d}},caad:function(e,t,n){"use strict";var a=n("23e7"),i=n("4d64").includes,r=n("44d2");a({target:"Array",proto:!0},{includes:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}}),r("includes")},cb29:function(e,t,n){var a=n("23e7"),i=n("81d5"),r=n("44d2");a({target:"Array",proto:!0},{fill:i}),r("fill")},cc12:function(e,t,n){var a=n("da84"),i=n("861d"),r=a.document,o=i(r)&&i(r.createElement);e.exports=function(e){return o?r.createElement(e):{}}},cc71:function(e,t,n){"use strict";var a=n("23e7"),i=n("857a"),r=n("eae9");a({target:"String",proto:!0,forced:r("bold")},{bold:function(){return i(this,"b","","")}})},cca6:function(e,t,n){var a=n("23e7"),i=n("60da");a({target:"Object",stat:!0,forced:Object.assign!==i},{assign:i})},ccbd:function(e,t,n){"use strict";var a=n("de93"),i=n.n(a);i.a},ccef:function(e,t,n){"use strict";var a=n("ea9f"),i=n.n(a);i.a},cdab:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("en-SG",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n},week:{dow:1,doy:4}});return t}))},cdf9:function(e,t,n){var a=n("825a"),i=n("861d"),r=n("f069");e.exports=function(e,t){if(a(e),i(t)&&t.constructor===e)return t;var n=r.f(e),o=n.resolve;return o(t),n.promise}},ce4e:function(e,t,n){var a=n("da84"),i=n("9112");e.exports=function(e,t){try{i(a,e,t)}catch(n){a[e]=t}return t}},cf1e:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={words:{ss:["sekunda","sekunde","sekundi"],m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(e,t){return 1===e?t[0]:e>=2&&e<=4?t[1]:t[2]},translate:function(e,n,a){var i=t.words[a];return 1===a.length?n?i[0]:i[1]:e+" "+t.correctGrammaticalCase(e,i)}},n=e.defineLocale("sr",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sre._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var e=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",ss:t.translate,m:t.translate,mm:t.translate,h:t.translate,hh:t.translate,d:"dan",dd:t.translate,M:"mesec",MM:t.translate,y:"godinu",yy:t.translate},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});return n}))},cf51:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("tzl",{months:"Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split("_"),monthsShort:"Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),weekdays:"Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),weekdaysShort:"Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),weekdaysMin:"Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"D. MMMM [dallas] YYYY",LLL:"D. MMMM [dallas] YYYY HH.mm",LLLL:"dddd, [li] D. MMMM [dallas] YYYY HH.mm"},meridiemParse:/d\'o|d\'a/i,isPM:function(e){return"d'o"===e.toLowerCase()},meridiem:function(e,t,n){return e>11?n?"d'o":"D'O":n?"d'a":"D'A"},calendar:{sameDay:"[oxhi à] LT",nextDay:"[demà à] LT",nextWeek:"dddd [à] LT",lastDay:"[ieiri à] LT",lastWeek:"[sür el] dddd [lasteu à] LT",sameElse:"L"},relativeTime:{future:"osprei %s",past:"ja%s",s:n,ss:n,m:n,mm:n,h:n,hh:n,d:n,dd:n,M:n,MM:n,y:n,yy:n},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});function n(e,t,n,a){var i={s:["viensas secunds","'iensas secunds"],ss:[e+" secunds",e+" secunds"],m:["'n míut","'iens míut"],mm:[e+" míuts",e+" míuts"],h:["'n þora","'iensa þora"],hh:[e+" þoras",e+" þoras"],d:["'n ziua","'iensa ziua"],dd:[e+" ziuas",e+" ziuas"],M:["'n mes","'iens mes"],MM:[e+" mesen",e+" mesen"],y:["'n ar","'iens ar"],yy:[e+" ars",e+" ars"]};return a||t?i[n][0]:i[n][1]}return t}))},cf69:function(e,t,n){"use strict";var a=n("afaf"),i=n.n(a);i.a},cf75:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut".split("_");function n(e){var t=e;return t=-1!==e.indexOf("jaj")?t.slice(0,-3)+"leS":-1!==e.indexOf("jar")?t.slice(0,-3)+"waQ":-1!==e.indexOf("DIS")?t.slice(0,-3)+"nem":t+" pIq",t}function a(e){var t=e;return t=-1!==e.indexOf("jaj")?t.slice(0,-3)+"Hu’":-1!==e.indexOf("jar")?t.slice(0,-3)+"wen":-1!==e.indexOf("DIS")?t.slice(0,-3)+"ben":t+" ret",t}function i(e,t,n,a){var i=r(e);switch(n){case"ss":return i+" lup";case"mm":return i+" tup";case"hh":return i+" rep";case"dd":return i+" jaj";case"MM":return i+" jar";case"yy":return i+" DIS"}}function r(e){var n=Math.floor(e%1e3/100),a=Math.floor(e%100/10),i=e%10,r="";return n>0&&(r+=t[n]+"vatlh"),a>0&&(r+=(""!==r?" ":"")+t[a]+"maH"),i>0&&(r+=(""!==r?" ":"")+t[i]),""===r?"pagh":r}var o=e.defineLocale("tlh",{months:"tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’".split("_"),monthsShort:"jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’".split("_"),monthsParseExact:!0,weekdays:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysShort:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysMin:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[DaHjaj] LT",nextDay:"[wa’leS] LT",nextWeek:"LLL",lastDay:"[wa’Hu’] LT",lastWeek:"LLL",sameElse:"L"},relativeTime:{future:n,past:a,s:"puS lup",ss:i,m:"wa’ tup",mm:i,h:"wa’ rep",hh:i,d:"wa’ jaj",dd:i,M:"wa’ jar",MM:i,y:"wa’ DIS",yy:i},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return o}))},cfd1:function(e,t,n){},d012:function(e,t){e.exports={}},d039:function(e,t){e.exports=function(e){try{return!!e()}catch(t){return!0}}},d066:function(e,t,n){var a=n("428f"),i=n("da84"),r=function(e){return"function"==typeof e?e:void 0};e.exports=function(e,t){return arguments.length<2?r(a[e])||r(i[e]):a[e]&&a[e][t]||i[e]&&i[e][t]}},d1e7:function(e,t,n){"use strict";var a={}.propertyIsEnumerable,i=Object.getOwnPropertyDescriptor,r=i&&!a.call({1:2},1);t.f=r?function(e){var t=i(this,e);return!!t&&t.enumerable}:a},d26a:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"},n={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"},a=e.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",ss:"%d སྐར་ཆ།",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(e){return e.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,meridiemHour:function(e,t){return 12===e&&(e=0),"མཚན་མོ"===t&&e>=4||"ཉིན་གུང"===t&&e<5||"དགོང་དག"===t?e+12:e},meridiem:function(e,t,n){return e<4?"མཚན་མོ":e<10?"ཞོགས་ཀས":e<17?"ཉིན་གུང":e<20?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}});return a}))},d28b:function(e,t,n){var a=n("746f");a("iterator")},d2bb:function(e,t,n){var a=n("825a"),i=n("3bbe");e.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,n={};try{e=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set,e.call(n,[]),t=n instanceof Array}catch(r){}return function(n,r){return a(n),i(r),t?e.call(n,r):n.__proto__=r,n}}():void 0)},d2d4:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("pt-br",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Do_2ª_3ª_4ª_5ª_6ª_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY [às] HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"poucos segundos",ss:"%d segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº"});return t}))},d3b7:function(e,t,n){var a=n("6eeb"),i=n("b041"),r=Object.prototype;i!==r.toString&&a(r,"toString",i,{unsafe:!0})},d44e:function(e,t,n){var a=n("9bf2").f,i=n("5135"),r=n("b622"),o=r("toStringTag");e.exports=function(e,t,n){e&&!i(e=n?e:e.prototype,o)&&a(e,o,{configurable:!0,value:t})}},d58f:function(e,t,n){var a=n("1c0b"),i=n("7b0b"),r=n("44ad"),o=n("50c4"),s=function(e){return function(t,n,s,l){a(n);var d=i(t),u=r(d),c=o(d.length),h=e?c-1:0,f=e?-1:1;if(s<2)while(1){if(h in u){l=u[h],h+=f;break}if(h+=f,e?h<0:c<=h)throw TypeError("Reduce of empty array with no initial value")}for(;e?h>=0:c>h;h+=f)h in u&&(l=n(l,u[h],h,d));return l}};e.exports={left:s(!1),right:s(!0)}},d6b6:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("hy-am",{months:{format:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_"),standalone:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_")},monthsShort:"հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_"),weekdays:"կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_"),weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., HH:mm",LLLL:"dddd, D MMMM YYYY թ., HH:mm"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",ss:"%d վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(e){return/^(ցերեկվա|երեկոյան)$/.test(e)},meridiem:function(e){return e<4?"գիշերվա":e<12?"առավոտվա":e<17?"ցերեկվա":"երեկոյան"},dayOfMonthOrdinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(e,t){switch(t){case"DDD":case"w":case"W":case"DDDo":return 1===e?e+"-ին":e+"-րդ";default:return e}},week:{dow:1,doy:7}});return t}))},d716:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ca",{months:{standalone:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),format:"de gener_de febrer_de març_d'abril_de maig_de juny_de juliol_d'agost_de setembre_d'octubre_de novembre_de desembre".split("_"),isFormat:/D[oD]?(\s)+MMMM/},monthsShort:"gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.".split("_"),monthsParseExact:!0,weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"dg_dl_dt_dc_dj_dv_ds".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [de] YYYY",ll:"D MMM YYYY",LLL:"D MMMM [de] YYYY [a les] H:mm",lll:"D MMM YYYY, H:mm",LLLL:"dddd D MMMM [de] YYYY [a les] H:mm",llll:"ddd D MMM YYYY, H:mm"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"d'aquí %s",past:"fa %s",s:"uns segons",ss:"%d segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},dayOfMonthOrdinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(e,t){var n=1===e?"r":2===e?"n":3===e?"r":4===e?"t":"è";return"w"!==t&&"W"!==t||(n="a"),e+n},week:{dow:1,doy:4}});return t}))},d784:function(e,t,n){"use strict";var a=n("9112"),i=n("6eeb"),r=n("d039"),o=n("b622"),s=n("9263"),l=o("species"),d=!r((function(){var e=/./;return e.exec=function(){var e=[];return e.groups={a:"7"},e},"7"!=="".replace(e,"$<a>")})),u=!r((function(){var e=/(?:)/,t=e.exec;e.exec=function(){return t.apply(this,arguments)};var n="ab".split(e);return 2!==n.length||"a"!==n[0]||"b"!==n[1]}));e.exports=function(e,t,n,c){var h=o(e),f=!r((function(){var t={};return t[h]=function(){return 7},7!=""[e](t)})),m=f&&!r((function(){var t=!1,n=/a/;return n.exec=function(){return t=!0,null},"split"===e&&(n.constructor={},n.constructor[l]=function(){return n}),n[h](""),!t}));if(!f||!m||"replace"===e&&!d||"split"===e&&!u){var p=/./[h],_=n(h,""[e],(function(e,t,n,a,i){return t.exec===s?f&&!i?{done:!0,value:p.call(t,n,a)}:{done:!0,value:e.call(n,t,a)}:{done:!1}})),g=_[0],y=_[1];i(String.prototype,e,g),i(RegExp.prototype,h,2==t?function(e,t){return y.call(e,this,t)}:function(e){return y.call(e,this)}),c&&a(RegExp.prototype[h],"sham",!0)}}},d81d:function(e,t,n){"use strict";var a=n("23e7"),i=n("b727").map,r=n("1dde");a({target:"Array",proto:!0,forced:!r("map")},{map:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},d85e:function(e,t,n){!function(t,a){e.exports=a(n("0ee8"))}("undefined"!=typeof self&&self,(function(e){return function(e){function t(a){if(n[a])return n[a].exports;var i=n[a]={i:a,l:!1,exports:{}};return e[a].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:a})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t,n){"use strict";var a=n(4),i=n.n(a);t.a={name:"VueNumeric",props:{currency:{type:String,default:"",required:!1},max:{type:Number,default:Number.MAX_SAFE_INTEGER||9007199254740991,required:!1},min:{type:Number,default:Number.MIN_SAFE_INTEGER||-9007199254740991,required:!1},minus:{type:Boolean,default:!1,required:!1},placeholder:{type:String,default:"",required:!1},emptyValue:{type:[Number,String],default:"",required:!1},precision:{type:Number,default:0,required:!1},separator:{type:String,default:",",required:!1},thousandSeparator:{default:void 0,required:!1,type:String},decimalSeparator:{default:void 0,required:!1,type:String},outputType:{required:!1,type:String,default:"Number"},value:{type:[Number,String],default:0,required:!0},readOnly:{type:Boolean,default:!1,required:!1},readOnlyClass:{type:String,default:"",required:!1},currencySymbolPosition:{type:String,default:"prefix",required:!1}},data:function(){return{amount:""}},computed:{amountNumber:function(){return this.unformat(this.amount)},valueNumber:function(){return this.unformat(this.value)},decimalSeparatorSymbol:function(){return void 0!==this.decimalSeparator?this.decimalSeparator:","===this.separator?".":","},thousandSeparatorSymbol:function(){return void 0!==this.thousandSeparator?this.thousandSeparator:"."===this.separator?".":"space"===this.separator?" ":","},symbolPosition:function(){return this.currency?"suffix"===this.currencySymbolPosition?"%v %s":"%s %v":"%v"}},watch:{valueNumber:function(e){this.$refs.numeric!==document.activeElement&&(this.amount=this.format(e))},readOnly:function(e,t){var n=this;!1===t&&!0===e&&this.$nextTick((function(){n.$refs.readOnly.className=n.readOnlyClass}))},separator:function(){this.process(this.valueNumber),this.amount=this.format(this.valueNumber)},currency:function(){this.process(this.valueNumber),this.amount=this.format(this.valueNumber)},precision:function(){this.process(this.valueNumber),this.amount=this.format(this.valueNumber)}},mounted:function(){var e=this;this.placeholder||(this.process(this.valueNumber),this.amount=this.format(this.valueNumber),setTimeout((function(){e.process(e.valueNumber),e.amount=e.format(e.valueNumber)}),500)),this.readOnly&&(this.$refs.readOnly.className=this.readOnlyClass)},methods:{onBlurHandler:function(e){this.$emit("blur",e),this.amount=this.format(this.valueNumber)},onFocusHandler:function(e){this.$emit("focus",e),0===this.valueNumber?this.amount=null:this.amount=i.a.formatMoney(this.valueNumber,{symbol:"",format:"%v",thousand:"",decimal:this.decimalSeparatorSymbol,precision:Number(this.precision)})},onInputHandler:function(){this.process(this.amountNumber)},process:function(e){e>=this.max&&this.update(this.max),e<=this.min&&this.update(this.min),e>this.min&&e<this.max&&this.update(e),!this.minus&&e<0&&(this.min>=0?this.update(this.min):this.update(0))},update:function(e){var t=i.a.toFixed(e,this.precision),n="string"===this.outputType.toLowerCase()?t:Number(t);this.$emit("input",n)},format:function(e){return i.a.formatMoney(e,{symbol:this.currency,format:this.symbolPosition,precision:Number(this.precision),decimal:this.decimalSeparatorSymbol,thousand:this.thousandSeparatorSymbol})},unformat:function(e){var t="string"==typeof e&&""===e?this.emptyValue:e;return i.a.unformat(t,this.decimalSeparatorSymbol)}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),i={install:function(e){e.component(a.a.name,a.a)}};a.a.install=i.install,t.default=a.a},function(e,t,n){"use strict";var a=n(0),i=n(5),r=n(3),o=r(a.a,i.a,!1,null,null,null);t.a=o.exports},function(e,t){e.exports=function(e,t,n,a,i,r){var o,s=e=e||{},l=typeof e.default;"object"!==l&&"function"!==l||(o=e,s=e.default);var d,u="function"==typeof s?s.options:s;if(t&&(u.render=t.render,u.staticRenderFns=t.staticRenderFns,u._compiled=!0),n&&(u.functional=!0),i&&(u._scopeId=i),r?(d=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),a&&a.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},u._ssrRegister=d):a&&(d=a),d){var c=u.functional,h=c?u.render:u.beforeCreate;c?(u._injectStyles=d,u.render=function(e,t){return d.call(t),h(e,t)}):u.beforeCreate=h?[].concat(h,d):[d]}return{esModule:o,exports:s,options:u}}},function(t,n){t.exports=e},function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.readOnly?n("span",{ref:"readOnly"},[e._v(e._s(e.amount))]):n("input",{directives:[{name:"model",rawName:"v-model",value:e.amount,expression:"amount"}],ref:"numeric",attrs:{placeholder:e.placeholder,type:"tel"},domProps:{value:e.amount},on:{blur:e.onBlurHandler,input:[function(t){t.target.composing||(e.amount=t.target.value)},e.onInputHandler],focus:e.onFocusHandler}})},i=[],r={render:a,staticRenderFns:i};t.a=r}])}))},d8e1:function(e,t,n){},d957:function(e,t,n){"use strict";var a=n("1c7a"),i=n.n(a);i.a},d9f8:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"di_lu_ma_me_je_ve_sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd’hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",ss:"%d secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},dayOfMonthOrdinalParse:/\d{1,2}(er|e)/,ordinal:function(e,t){switch(t){default:case"M":case"Q":case"D":case"DDD":case"d":return e+(1===e?"er":"e");case"w":case"W":return e+(1===e?"re":"e")}}});return t}))},da84:function(e,t,n){(function(t){var n=function(e){return e&&e.Math==Math&&e};e.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof t&&t)||Function("return this")()}).call(this,n("c8ba"))},db02:function(e,t,n){"use strict";var a=n("b669"),i=n.n(a);i.a},db29:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),n="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),a=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],i=/^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,r=e.defineLocale("nl-be",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(e,a){return e?/-MMM-/.test(a)?n[e.month()]:t[e.month()]:t},monthsRegex:i,monthsShortRegex:i,monthsStrictRegex:/^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:a,longMonthsParse:a,shortMonthsParse:a,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"zo_ma_di_wo_do_vr_za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",ss:"%d seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}});return r}))},dbb4:function(e,t,n){var a=n("23e7"),i=n("83ab"),r=n("56ef"),o=n("fc6a"),s=n("06cf"),l=n("8418");a({target:"Object",stat:!0,sham:!i},{getOwnPropertyDescriptors:function(e){var t,n,a=o(e),i=s.f,d=r(a),u={},c=0;while(d.length>c)n=i(a,t=d[c++]),void 0!==n&&l(u,t,n);return u}})},dc4d:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},n={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},a=e.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm बजे",LLLL:"dddd, D MMMM YYYY, A h:mm बजे"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",ss:"%d सेकंड",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(e,t){return 12===e&&(e=0),"रात"===t?e<4?e:e+12:"सुबह"===t?e:"दोपहर"===t?e>=10?e:e+12:"शाम"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"रात":e<10?"सुबह":e<17?"दोपहर":e<20?"शाम":"रात"},week:{dow:0,doy:6}});return a}))},ddb0:function(e,t,n){var a=n("da84"),i=n("fdbc"),r=n("e260"),o=n("9112"),s=n("b622"),l=s("iterator"),d=s("toStringTag"),u=r.values;for(var c in i){var h=a[c],f=h&&h.prototype;if(f){if(f[l]!==u)try{o(f,l,u)}catch(p){f[l]=u}if(f[d]||o(f,d,c),i[c])for(var m in r)if(f[m]!==r[m])try{o(f,m,r[m])}catch(p){f[m]=r[m]}}}},de93:function(e,t,n){},dedf:function(e,t,n){"use strict";n.r(t),n.d(t,"mdbDatatable",(function(){return x}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"mdb-datatable",style:e.wrapperStyle},[n("mdb-tbl",e._b({key:e.componentKey,staticClass:"scrollbar-grey thin",class:{"mdb-scroll-y":e.scrollY},style:"max-height: "+(e.scrollY?e.maxHeight?e.maxHeight:"280px":null)+";",attrs:{datatable:""}},"mdb-tbl",e.tableProps,!1),[n("mdb-tbl-head",{staticClass:"table-header",attrs:{color:e.headerColor,textWhite:e.headerWhite}},[n("tr",[e.multiselectable?n("th",{staticClass:"text-center",staticStyle:{"padding-bottom":"0.4rem"},style:[e.fixedHeader&&{position:"sticky",top:0,boxShadow:"0 1px #dee2e6"},e.fixedHeader&&e.headerBg&&{background:e.headerBg}]},[n("div",{staticClass:"custom-control custom-checkbox mdb-select-all"},[n("input",{staticClass:"custom-control-input",attrs:{type:"checkbox",id:"mdb-datatable-select-all-"+e.randomKey,tabindex:"0"},domProps:{checked:"all"===e.selected},on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.toggleSelectAll(t)},click:e.toggleSelectAll}}),n("label",{staticClass:"custom-control-label",attrs:{for:"mdb-datatable-select-all-"+e.randomKey}})])]):e._e(),e.selectable?n("th",{style:[e.fixedHeader&&{position:"sticky",top:0,boxShadow:"0 1px #dee2e6"},e.fixedHeader&&e.headerBg&&{background:e.headerBg}]}):e._e(),e._l(e.columns,(function(t,a){return["mdbID"!==t.field?n("th",{key:t.field,class:t.sort&&e.sorting?"sorting":"",style:[e.sorting&&t.sort&&{cursor:"pointer"},e.fixedHeader&&{position:"sticky",top:0,boxShadow:"0 1px #dee2e6"},e.fixedHeader&&e.headerBg&&{background:e.headerBg},e.fixedCols&&e.fixedCols>=a&&{position:"sticky",left:e.fixedColsPosition[a-1]-3+"px",zIndex:1},e.fixedCols&&e.fixedCols>=a&&{background:e.fixedColsBg}],on:{click:function(n){t.sort&&e.sorting&&e.sort(t.field,t.sort)},mouseleave:function(t){e.lastFieldSorted=null}}},[e.sorting&&t.sort&&e.recentSort&&e.recentSort.field===t.field&&"asc"===e.recentSort.sort?n("i",{staticClass:"mdb-datatable-header-icon fas fa-arrow-up"}):e._e(),e.sorting&&t.sort&&e.recentSort&&e.recentSort.field===t.field&&"desc"===e.recentSort.sort?n("i",{staticClass:"mdb-datatable-header-icon fas fa-arrow-down"}):e._e(),e.sorting&&!e.recentSort||e.sorting&&e.recentSort&&e.recentSort.field!==t.field&&e.lastFieldSorted!==t.field?n("i",{staticClass:"mdb-datatable-header-hover-icon fas fa-arrow-up"}):e._e(),e._v(" "+e._s(t.label)+" ")]):e._e()]}))],2)]),n("mdb-tbl-body",[e._l(e.pages[e.activePage],(function(t,a){return n("tr",{key:a,class:((e.selectable||e.multiselectable)&&"selectable-row")+" "+((e.selectable||e.multiselectable)&&(e.rowsDisplay.indexOf(t)===e.selected||"all"===e.selected||Array.isArray(e.selected)&&e.selected.includes(e.rowsDisplay.indexOf(t)))?e.selectColor:""),style:(e.selectable||e.multiselectable)&&e.rowsDisplay.indexOf(t)===e.hovered&&{backgroundColor:e.hoverColor},on:{mouseenter:function(n){e.hovered=e.rowsDisplay.indexOf(t)},mouseleave:function(t){e.hovered=-1},click:function(n){return e.selectRow(t)}}},[e.selectable||e.multiselectable?n("td",{staticClass:"text-center",staticStyle:{"padding-top":"1rem","padding-bottom":"0"}},[n("div",{staticClass:"custom-control custom-checkbox"},[n("input",{staticClass:"custom-control-input",attrs:{type:"checkbox",id:"mdb-datatable-checkbox-"+e.randomKey+"-"+a,tabindex:"0"},domProps:{checked:!!(e.rowsDisplay.indexOf(t)===e.selected||"all"===e.selected||Array.isArray(e.selected)&&e.selected.includes(e.rowsDisplay.indexOf(t)))},on:{keydown:function(n){return!n.type.indexOf("key")&&e._k(n.keyCode,"enter",13,n.key,"Enter")?null:e.selectRow(t)},click:function(n){return e.selectRow(t)}}}),n("label",{staticClass:"custom-control-label",attrs:{for:"mdb-datatable-checkbox-"+e.randomKey+"-"+a}})])]):e._e(),e._l(t,(function(t,i){return[0!==i?[n("td",{key:i,class:e.fixedCols&&e.fixedCols>=i&&"fixed-td",style:[e.fixedCols&&e.fixedCols>=i&&{position:"sticky",left:e.fixedColsPosition[i-1]-3+"px"},e.fixedCols&&e.fixedCols>=i&&{background:e.fixedColsBg},e.columns[i].width&&{width:e.columns[i].width+"px",maxWidth:e.columns[i].width+"px"}],attrs:{contenteditable:e.editable},domProps:{innerHTML:e._s(t)},on:{blur:function(t){return e.handleContentChange(t,a,i)}}})]:e._e()]}))],2)})),e.pages.length?e._e():n("tr",[n("td",{attrs:{colspan:e.columns.length}},[e._v(e._s(e.noFoundMessage))])])],2),e.footer?n("mdb-tbl-head",{staticClass:"table-footer",attrs:{tag:"tfoot"}},[n("tr",{domProps:{innerHTML:e._s(e.footer)}})]):e._e()],1),n("div",{staticClass:"mdb-datatable-footer"},[n("div",{staticClass:"d-flex"},[e.pagination?n("datatable-select",{staticClass:"d-inline-block",attrs:{title:e.entriesTitle,options:e.options},on:{getValue:e.updateEntries}}):e._e(),n("div",{staticClass:"dataTables_info pt-2 mx-sm-4 d-inline-block",attrs:{role:"status","aria-live":"polite"}},[e._v(" "+e._s(e.activePage>0?e.activePage*e.entries:e.activePage+1)+"-"+e._s(e.pages.length-1>e.activePage?e.pages[e.activePage].length*(e.activePage+1):e.filteredRows.length)+" "+e._s(e.showingText)+" "+e._s(e.filteredRows.length)+" ")]),e.pagination?n("div",{staticClass:"dataTables_paginate d-inline-block"},[n("mdb-pagination",{attrs:{id:"pagination",color:e.paginationColor}},[e.pages.length>e.display&&e.fullPagination?n("mdb-page-item",{attrs:{disabled:0===e.activePage},nativeOn:{click:function(t){return e.changePage(0)}}},[e.arrows?n("mdb-icon",{attrs:{icon:"angle-double-left"}}):n("p",{staticClass:"pagination"},[e._v(e._s(e.start))])],1):e._e(),n("mdb-page-item",{attrs:{disabled:0===e.activePage},nativeOn:{click:function(t){return e.changePage(e.activePage-1)}}},[e.arrows?n("mdb-icon",{attrs:{icon:"chevron-left"}}):n("p",{staticClass:"pagination"},[e._v(e._s(e.previous))])],1),n("mdb-page-item",{attrs:{disabled:e.activePage===e.pages.length-1},nativeOn:{click:function(t){return e.changePage(e.activePage+1)}}},[e.arrows?n("mdb-icon",{attrs:{icon:"chevron-right"}}):n("p",{staticClass:"pagination"},[e._v(e._s(e.next))])],1),e.pages.length>e.display&&e.fullPagination?n("mdb-page-item",{attrs:{disabled:e.activePage===e.pages.length-1},nativeOn:{click:function(t){return e.changePage(e.pages.length-1)}}},[e.arrows?n("mdb-icon",{attrs:{icon:"angle-double-right"}}):n("p",{staticClass:"pagination"},[e._v(e._s(e.end))])],1):e._e()],1)],1):e._e()],1)])],1)},i=[],r=(n("4de4"),n("b64b"),n("d3b7"),n("ac1f"),n("25f0"),n("466d"),n("5319"),n("841c"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"dataTables_length bs-select pb-2"},[n("label",[e._v(" "+e._s(e.title)+": ")]),n("select",{staticClass:"custom-select custom-select-sm form-control form-control-sm",on:{change:e.emitValue}},e._l(e.entries,(function(t){return n("option",{key:t,domProps:{selected:10===t}},[e._v(e._s(t))])})),0)])}),o=[],s=(n("d81d"),{name:"DatatableSelect",props:{options:{type:Array},title:{type:String,default:"Rows per page"}},data:function(){return{entries:this.options.map((function(e){return e.value}))}},methods:{emitValue:function(e){this.$emit("getValue",e.target.value)}}}),l=s,d=l,u=(n("5ef3"),n("2877")),c=Object(u["a"])(d,r,o,!1,null,"6c7cac7e",null),h=c.exports,f=n("060a");n("99af"),n("c740"),n("4160"),n("caad"),n("c975"),n("e260"),n("fb6a"),n("a434"),n("a9e3"),n("e6cf"),n("2532"),n("c7cd"),n("159b"),n("ddb0"),n("a4d3"),n("e01a"),n("d28b"),n("3ca3");function m(e){return m="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},m(e)}var p=n("c8b9"),_=n("9a03"),g=n("4b5c"),y=n("3a3c"),v=n("2a95"),b=n("6583"),M=n("e601"),L=n("2b57"),k=n("2c40"),w={components:{mdbTbl:y["a"],mdbTblHead:v["a"],mdbTblBody:b["a"],mdbPagination:M["a"],mdbPageItem:L["a"],mdbInput:k["default"],mdbIcon:f["a"],mdbRow:p["a"],mdbCol:_["a"],mdbBtn:g["a"]},props:{value:{type:[Object,String],default:function(){return{columns:[],rows:[]}}},autoWidth:{type:Boolean,default:!1},bordered:{type:Boolean,default:!1},borderless:{type:Boolean,default:!1},dark:{type:Boolean,default:!1},fixed:{type:Boolean,default:!1},fixedHeader:{type:Boolean,default:!1},fixedCols:{type:[Boolean,Number],default:!1},fixedColsPosition:{type:Array,default:function(){return[0,120]}},fixedColsBg:{type:String,default:"white"},headerColor:{type:String},headerWhite:{type:Boolean,default:!1},headerBg:{type:String,default:"white"},hover:{type:Boolean,default:!1},maxWidth:{type:String},maxHeight:{type:String},order:{type:Array},pagination:{type:Boolean,default:!0},responsive:{type:Boolean,default:!0},responsiveSm:{type:Boolean,default:!1},responsiveMd:{type:Boolean,default:!1},responsiveLg:{type:Boolean,default:!1},responsiveXl:{type:Boolean,default:!1},scrollY:{type:Boolean,defautl:!1},searching:{type:[String,Object],default:""},sorting:{type:Boolean,default:!0},striped:{type:Boolean,default:!1},start:{type:String,default:"Start"},end:{type:String,default:"End"},next:{type:String,default:"Next"},previous:{type:String,default:"Previous"},arrows:{type:Boolean,default:!0},display:{type:Number,default:5},defaultRow:{type:String,default:"-"},defaultCol:{type:String,default:"undefined"},footer:{type:[Boolean,String],default:!1},reactive:{type:Boolean,default:!1},refresh:{type:Boolean,default:!1},time:{type:Number,default:5e3},searchPlaceholder:{type:String},entriesTitle:{type:String},noFoundMessage:{type:String,default:"No matching records found"},showingText:{type:String,default:"of"},selectable:{type:Boolean,default:!1},multiselectable:{type:Boolean,default:!1},btnColor:{type:String,default:"primary"},selectColor:{type:String,default:"grey lighten-4"},hoverColor:{type:String,default:"#fafafa"},paginationColor:{type:String,default:"blue"},fullPagination:{type:Boolean,default:!1},editable:{type:Boolean,default:!1}},data:function(){return{updatedKey:null,reactiveFlag:!1,recentSort:null,interval:null,selected:-1,hovered:-1,rows:this.value.rows||[],columns:this.value.columns||[],entries:10,pages:[],activePage:0,search:"object"===m(this.searching)?this.escapeRegExp(this.searching.value):this.escapeRegExp(this.searching),searchField:"all",sortIndex:0,lastFieldSorted:null,tableProps:{autoWidth:this.autoWidth,bordered:this.bordered,borderless:this.borderless,dark:this.dark,fixed:this.fixed,hover:this.hover,responsive:this.responsive,responsiveSm:this.responsiveSm,responsiveMd:this.responsiveMd,responsiveLg:this.responsiveLg,responsiveXl:this.responsiveXl,striped:this.striped,dtScrollY:this.scrollY,maxHeight:this.maxHeight},wrapperStyle:{maxWidth:this.maxWidth?this.maxWidth:"100%",margin:"0 auto"}}},computed:{rowsDisplay:function(){return this.formatRows()},visiblePages:function(){var e=this.activePage-Math.floor(this.display/2)>0?this.activePage-Math.floor(this.display/2):0,t=e+this.display<this.pages.length?e+this.display:this.pages.length;return t-e<this.display&&t-this.display>=0&&(e=t-this.display),this.pages.slice(e,t)},componentKey:function(){return this.updatedKey}},methods:{changePage:function(e){this.activePage=e},sort:function(e,t){var n=this,a="";Array.isArray(this.selected)?(a=[],this.selected.forEach((function(e){a.push(n.rows[e])}))):a="all"===this.selected?"all":this.rows[this.selected],e&&(this.recentSort&&this.recentSort.field===e?this.sortIndex++:(this.sortIndex=0,t="asc"),2===this.sortIndex&&(this.lastFieldSorted=e,e="mdbID",t="asc"),this.recentSort={field:e,sort:t},this.sorting&&("asc"===t?this.rows.sort((function(t,n){return t[e]>n[e]?1:-1})):this.rows.sort((function(t,n){return t[e]>n[e]?-1:1})),this.columns[this.columns.findIndex((function(t){return t.field===e}))].sort="asc"===t?"desc":"desc"===t?"asc":null)),Array.isArray(a)?(this.selected=[],a.forEach((function(e){n.selected.push(n.rows.indexOf(e))}))):"all"===this.selected?this.selected="all":this.selected=this.rows.indexOf(a)},escapeRegExp:function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")},updateEntries:function(e){this.entries=e},fetchData:function(){var e=this;fetch(this.value).then((function(e){return e.json()})).then((function(t){e.columns=t.columns,e.rows=t.rows,e.$emit("fields",e.columns)})).then((function(){e.recentSort&&e.sort(e.recentSort.field,e.recentSort.sort)})).catch((function(e){return console.log(e)}))},updateData:function(){this.fetchData(),this.reactiveFlag=!0,this.updatedKey=Math.floor(1e8*Math.random())},selectRow:function(e){var t=this;if(this.multiselectable){var n=this.rowsDisplay.indexOf(e);"all"===this.selected?(this.selected=[],this.value.rows.forEach((function(e,n){t.selected.push(n)}))):Array.isArray(this.selected)||(this.selected=[]),this.selected.includes(n)?this.selected.splice(this.selected.indexOf(n),1):this.selected.push(n);var a=[];this.selected.forEach((function(e){a.push(t.value.rows[e])})),this.$emit("selected",a)}else{var i=this.rowsDisplay.indexOf(e);this.selected===i&&(i=-1),this.selected=i,this.$emit("selected",this.value.rows[i])}},toggleSelectAll:function(){"all"===this.selected?(this.$emit("selected",[]),this.selected=-1):(this.$emit("selected",this.value.rows),this.selected="all")},formatRows:function(){var e=this;this.setDefaultColumns();var t=[];return this.rows.map((function(n){var a=[];e.columns.forEach((function(t){var i=n[t.field]||e.defaultRow;i=t.format?t.format(i):i,a.push(i)})),t.push(a)})),t},setDefaultColumns:function(){var e=this;this.columns.forEach((function(t,n){t||(e.columns[n+1]={label:e.defaultCol,field:e.defaultCol.concat(n),sort:"asc"})})),this.searching.field&&this.columns.forEach((function(t,n){e.searching.field===t.field&&(e.searchField=n)}))}},beforeMount:function(){var e=this;if("mdbID"!==this.columns[0].field){var t=0;this.columns.unshift({label:"mdbID",field:"mdbID",sort:"asc"}),this.rows.forEach((function(n,a){t++,e.rows[a].mdbID=t}))}},mounted:function(){"string"===typeof this.value&&this.fetchData(),this.reactive&&(this.interval=setInterval(this.updateData,this.time));var e=Math.ceil(this.filteredRows.length/this.entries);if(this.pages=[],this.pagination)for(var t=1;t<=e;t++){var n=t*this.entries;this.pages.push(this.filteredRows.slice(n-this.entries,n))}else this.pages.push(this.filteredRows);this.activePage=0,this.order&&this.sort(this.columns[this.order[0]].field,this.order[1]),this.$emit("pages",this.pages),this.$emit("fields",this.columns)},beforeDestroy:function(){this.reactive&&window.clearInterval(this.interval)},watch:{data:function(e){this.columns=e.columns},searching:function(e){"object"===m(e)?this.search=this.escapeRegExp(e.value):this.search=this.escapeRegExp(e),this.activePage=0},entries:function(){var e=Math.ceil(this.filteredRows.length/this.entries);this.pages=[];for(var t=1;t<=e;t++){var n=t*this.entries;this.pages.push(this.filteredRows.slice(n-this.entries,n))}this.activePage=this.activePage<this.pages.length?this.activePage:this.pages.length-1,this.$emit("pages",this.pages)},filteredRows:function(){var e=this.activePage,t=Math.ceil(this.filteredRows.length/this.entries);if(this.pages=[],this.pagination)for(var n=1;n<=t;n++){var a=n*this.entries;this.pages.push(this.filteredRows.slice(a-this.entries,a))}else this.pages.push(this.filteredRows);!1===this.reactiveFlag&&(this.activePage=0),this.activePage=e,this.$emit("pages",this.pages)}}},x={name:"Datatable2Pro",props:{filter:{type:String,default:""}},data:function(){return{options:[{value:10,text:10,selected:!0},{value:25,text:25},{value:50,text:50},{value:100,text:100}],select:"",randomKey:Math.round(1e4*Math.random())}},components:{DatatableSelect:h,mdbIcon:f["a"]},computed:{filteredRows:function(){var e=this,t=this.rowsDisplay;return this.filter&&(t=this.selectedRows),"all"===this.searchField?t.filter((function(t){return t.filter((function(t){return t.toString().toLowerCase().match(e.search.toLowerCase())})).length>0})):t.filter((function(t){return t[e.searchField].toString().toLowerCase().match(e.search.toLowerCase())}))},selectedRows:function(){var e=this;return this.rowsDisplay.filter((function(t){return t.filter((function(t){return e.select?t.toString().toLowerCase()===e.select.toLowerCase():t})).length>0}))}},filters:{toCapitalize:function(e){return e.replace(/^\w/,(function(e){return e.toUpperCase()}))}},methods:{updateSelect:function(e){this.select=e},handleContentChange:function(e,t,n){this.rows[t][Object.keys(this.rows[t])[n-1]]=e.target.innerText,this.$emit("update",this.value)}},mixins:[w]},Y=x,S=Y,D=(n("3187"),n("0cd3"),Object(u["a"])(S,a,i,!1,null,"41e9962a",null));t["default"]=D.exports},df75:function(e,t,n){var a=n("ca84"),i=n("7839");e.exports=Object.keys||function(e){return a(e,i)}},df76:function(e,t,n){},e01a:function(e,t,n){"use strict";var a=n("23e7"),i=n("83ab"),r=n("da84"),o=n("5135"),s=n("861d"),l=n("9bf2").f,d=n("e893"),u=r.Symbol;if(i&&"function"==typeof u&&(!("description"in u.prototype)||void 0!==u().description)){var c={},h=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:String(arguments[0]),t=this instanceof h?new u(e):void 0===e?u():u(e);return""===e&&(c[t]=!0),t};d(h,u);var f=h.prototype=u.prototype;f.constructor=h;var m=f.toString,p="Symbol(test)"==String(u("test")),_=/^Symbol\((.*)\)[^)]+$/;l(f,"description",{configurable:!0,get:function(){var e=s(this)?this.valueOf():this,t=m.call(e);if(o(c,e))return"";var n=p?t.slice(7,-1):t.replace(_,"$1");return""===n?void 0:n}}),a({global:!0,forced:!0},{Symbol:h})}},e0c5:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"૧",2:"૨",3:"૩",4:"૪",5:"૫",6:"૬",7:"૭",8:"૮",9:"૯",0:"૦"},n={"૧":"1","૨":"2","૩":"3","૪":"4","૫":"5","૬":"6","૭":"7","૮":"8","૯":"9","૦":"0"},a=e.defineLocale("gu",{months:"જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર".split("_"),monthsShort:"જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.".split("_"),monthsParseExact:!0,weekdays:"રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર".split("_"),weekdaysShort:"રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ".split("_"),weekdaysMin:"ર_સો_મં_બુ_ગુ_શુ_શ".split("_"),longDateFormat:{LT:"A h:mm વાગ્યે",LTS:"A h:mm:ss વાગ્યે",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm વાગ્યે",LLLL:"dddd, D MMMM YYYY, A h:mm વાગ્યે"},calendar:{sameDay:"[આજ] LT",nextDay:"[કાલે] LT",nextWeek:"dddd, LT",lastDay:"[ગઇકાલે] LT",lastWeek:"[પાછલા] dddd, LT",sameElse:"L"},relativeTime:{future:"%s મા",past:"%s પેહલા",s:"અમુક પળો",ss:"%d સેકંડ",m:"એક મિનિટ",mm:"%d મિનિટ",h:"એક કલાક",hh:"%d કલાક",d:"એક દિવસ",dd:"%d દિવસ",M:"એક મહિનો",MM:"%d મહિનો",y:"એક વર્ષ",yy:"%d વર્ષ"},preparse:function(e){return e.replace(/[૧૨૩૪૫૬૭૮૯૦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/રાત|બપોર|સવાર|સાંજ/,meridiemHour:function(e,t){return 12===e&&(e=0),"રાત"===t?e<4?e:e+12:"સવાર"===t?e:"બપોર"===t?e>=10?e:e+12:"સાંજ"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"રાત":e<10?"સવાર":e<17?"બપોર":e<20?"સાંજ":"રાત"},week:{dow:0,doy:6}});return a}))},e163:function(e,t,n){var a=n("5135"),i=n("7b0b"),r=n("f772"),o=n("e177"),s=r("IE_PROTO"),l=Object.prototype;e.exports=o?Object.getPrototypeOf:function(e){return e=i(e),a(e,s)?e[s]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?l:null}},e177:function(e,t,n){var a=n("d039");e.exports=!a((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype}))},e1d3:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("en-ie",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},dayOfMonthOrdinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n},week:{dow:1,doy:4}});return t}))},e260:function(e,t,n){"use strict";var a=n("fc6a"),i=n("44d2"),r=n("3f8c"),o=n("69f3"),s=n("7dd0"),l="Array Iterator",d=o.set,u=o.getterFor(l);e.exports=s(Array,"Array",(function(e,t){d(this,{type:l,target:a(e),index:0,kind:t})}),(function(){var e=u(this),t=e.target,n=e.kind,a=e.index++;return!t||a>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==n?{value:a,done:!1}:"values"==n?{value:t[a],done:!1}:{value:[a,t[a]],done:!1}}),"values"),r.Arguments=r.Array,i("keys"),i("values"),i("entries")},e2cc:function(e,t,n){var a=n("6eeb");e.exports=function(e,t,n){for(var i in t)a(e,i,t[i],n);return e}},e439:function(e,t,n){var a=n("23e7"),i=n("d039"),r=n("fc6a"),o=n("06cf").f,s=n("83ab"),l=i((function(){o(1)})),d=!s||l;a({target:"Object",stat:!0,forced:d,sham:!s},{getOwnPropertyDescriptor:function(e,t){return o(r(e),t)}})},e601:function(e,t,n){"use strict";n.d(t,"b",(function(){return r}));var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},i=[],r={props:{tag:{type:String,default:"ul"},circle:{type:Boolean,default:!1},lg:{type:Boolean,default:!1},sm:{type:Boolean,default:!1},color:{type:String,default:"blue"}},computed:{className:function(){return["pagination",!!this.sm&&"pagination-sm",!!this.lg&&"pagination-lg",!!this.circle&&"pagination-circle",!!this.color&&"pg-"+this.color]}}},o=r,s=o,l=n("2877"),d=Object(l["a"])(s,a,i,!1,null,"21e99006",null);t["a"]=d.exports},e667:function(e,t){e.exports=function(e){try{return{error:!1,value:e()}}catch(t){return{error:!0,value:t}}}},e6cf:function(e,t,n){"use strict";var a,i,r,o,s=n("23e7"),l=n("c430"),d=n("da84"),u=n("428f"),c=n("fea9"),h=n("6eeb"),f=n("e2cc"),m=n("d44e"),p=n("2626"),_=n("861d"),g=n("1c0b"),y=n("19aa"),v=n("c6b6"),b=n("2266"),M=n("1c7e"),L=n("4840"),k=n("2cf4").set,w=n("b575"),x=n("cdf9"),Y=n("44de"),S=n("f069"),D=n("e667"),T=n("b39a"),H=n("69f3"),C=n("94ca"),O=n("b622"),j=O("species"),P="Promise",A=H.get,E=H.set,I=H.getterFor(P),B=c,W=d.TypeError,F=d.document,N=d.process,z=d.fetch,R=N&&N.versions,$=R&&R.v8||"",V=S.f,J=V,U="process"==v(N),G=!!(F&&F.createEvent&&d.dispatchEvent),q="unhandledrejection",X="rejectionhandled",K=0,Z=1,Q=2,ee=1,te=2,ne=C(P,(function(){var e=B.resolve(1),t=function(){},n=(e.constructor={})[j]=function(e){e(t,t)};return!((U||"function"==typeof PromiseRejectionEvent)&&(!l||e["finally"])&&e.then(t)instanceof n&&0!==$.indexOf("6.6")&&-1===T.indexOf("Chrome/66"))})),ae=ne||!M((function(e){B.all(e)["catch"]((function(){}))})),ie=function(e){var t;return!(!_(e)||"function"!=typeof(t=e.then))&&t},re=function(e,t,n){if(!t.notified){t.notified=!0;var a=t.reactions;w((function(){var i=t.value,r=t.state==Z,o=0;while(a.length>o){var s,l,d,u=a[o++],c=r?u.ok:u.fail,h=u.resolve,f=u.reject,m=u.domain;try{c?(r||(t.rejection===te&&de(e,t),t.rejection=ee),!0===c?s=i:(m&&m.enter(),s=c(i),m&&(m.exit(),d=!0)),s===u.promise?f(W("Promise-chain cycle")):(l=ie(s))?l.call(s,h,f):h(s)):f(i)}catch(p){m&&!d&&m.exit(),f(p)}}t.reactions=[],t.notified=!1,n&&!t.rejection&&se(e,t)}))}},oe=function(e,t,n){var a,i;G?(a=F.createEvent("Event"),a.promise=t,a.reason=n,a.initEvent(e,!1,!0),d.dispatchEvent(a)):a={promise:t,reason:n},(i=d["on"+e])?i(a):e===q&&Y("Unhandled promise rejection",n)},se=function(e,t){k.call(d,(function(){var n,a=t.value,i=le(t);if(i&&(n=D((function(){U?N.emit("unhandledRejection",a,e):oe(q,e,a)})),t.rejection=U||le(t)?te:ee,n.error))throw n.value}))},le=function(e){return e.rejection!==ee&&!e.parent},de=function(e,t){k.call(d,(function(){U?N.emit("rejectionHandled",e):oe(X,e,t.value)}))},ue=function(e,t,n,a){return function(i){e(t,n,i,a)}},ce=function(e,t,n,a){t.done||(t.done=!0,a&&(t=a),t.value=n,t.state=Q,re(e,t,!0))},he=function(e,t,n,a){if(!t.done){t.done=!0,a&&(t=a);try{if(e===n)throw W("Promise can't be resolved itself");var i=ie(n);i?w((function(){var a={done:!1};try{i.call(n,ue(he,e,a,t),ue(ce,e,a,t))}catch(r){ce(e,a,r,t)}})):(t.value=n,t.state=Z,re(e,t,!1))}catch(r){ce(e,{done:!1},r,t)}}};ne&&(B=function(e){y(this,B,P),g(e),a.call(this);var t=A(this);try{e(ue(he,this,t),ue(ce,this,t))}catch(n){ce(this,t,n)}},a=function(e){E(this,{type:P,done:!1,notified:!1,parent:!1,reactions:[],rejection:!1,state:K,value:void 0})},a.prototype=f(B.prototype,{then:function(e,t){var n=I(this),a=V(L(this,B));return a.ok="function"!=typeof e||e,a.fail="function"==typeof t&&t,a.domain=U?N.domain:void 0,n.parent=!0,n.reactions.push(a),n.state!=K&&re(this,n,!1),a.promise},catch:function(e){return this.then(void 0,e)}}),i=function(){var e=new a,t=A(e);this.promise=e,this.resolve=ue(he,e,t),this.reject=ue(ce,e,t)},S.f=V=function(e){return e===B||e===r?new i(e):J(e)},l||"function"!=typeof c||(o=c.prototype.then,h(c.prototype,"then",(function(e,t){var n=this;return new B((function(e,t){o.call(n,e,t)})).then(e,t)}),{unsafe:!0}),"function"==typeof z&&s({global:!0,enumerable:!0,forced:!0},{fetch:function(e){return x(B,z.apply(d,arguments))}}))),s({global:!0,wrap:!0,forced:ne},{Promise:B}),m(B,P,!1,!0),p(P),r=u[P],s({target:P,stat:!0,forced:ne},{reject:function(e){var t=V(this);return t.reject.call(void 0,e),t.promise}}),s({target:P,stat:!0,forced:l||ne},{resolve:function(e){return x(l&&this===r?B:this,e)}}),s({target:P,stat:!0,forced:ae},{all:function(e){var t=this,n=V(t),a=n.resolve,i=n.reject,r=D((function(){var n=g(t.resolve),r=[],o=0,s=1;b(e,(function(e){var l=o++,d=!1;r.push(void 0),s++,n.call(t,e).then((function(e){d||(d=!0,r[l]=e,--s||a(r))}),i)})),--s||a(r)}));return r.error&&i(r.value),n.promise},race:function(e){var t=this,n=V(t),a=n.reject,i=D((function(){var i=g(t.resolve);b(e,(function(e){i.call(t,e).then(n.resolve,a)}))}));return i.error&&a(i.value),n.promise}})},e81d:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"១",2:"២",3:"៣",4:"៤",5:"៥",6:"៦",7:"៧",8:"៨",9:"៩",0:"០"},n={"១":"1","២":"2","៣":"3","៤":"4","៥":"5","៦":"6","៧":"7","៨":"8","៩":"9","០":"0"},a=e.defineLocale("km",{months:"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អា_ច_អ_ព_ព្រ_សុ_ស".split("_"),weekdaysMin:"អា_ច_អ_ព_ព្រ_សុ_ស".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/ព្រឹក|ល្ងាច/,isPM:function(e){return"ល្ងាច"===e},meridiem:function(e,t,n){return e<12?"ព្រឹក":"ល្ងាច"},calendar:{sameDay:"[ថ្ងៃនេះ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",ss:"%d វិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},dayOfMonthOrdinalParse:/ទី\d{1,2}/,ordinal:"ទី%d",preparse:function(e){return e.replace(/[១២៣៤៥៦៧៨៩០]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},week:{dow:1,doy:4}});return a}))},e88b:function(e,t,n){},e893:function(e,t,n){var a=n("5135"),i=n("56ef"),r=n("06cf"),o=n("9bf2");e.exports=function(e,t){for(var n=i(t),s=o.f,l=r.f,d=0;d<n.length;d++){var u=n[d];a(e,u)||s(e,u,l(t,u))}}},e8b5:function(e,t,n){var a=n("c6b6");e.exports=Array.isArray||function(e){return"Array"==a(e)}},e943:function(e,t,n){"use strict";var a=n("ca58"),i=n.n(a);i.a},e95a:function(e,t,n){var a=n("b622"),i=n("3f8c"),r=a("iterator"),o=Array.prototype;e.exports=function(e){return void 0!==e&&(i.Array===e||o[r]===e)}},ea9f:function(e,t,n){},eac0:function(e,t,n){"use strict";var a=n("5ea8"),i=n.n(a);i.a},ead7:function(e,t,n){"use strict";var a=n("b31c"),i=n.n(a);i.a},eae9:function(e,t,n){var a=n("d039");e.exports=function(e){return a((function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3}))}},ebe4:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("ms",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"tengahari"===t?e>=11?e:e+12:"petang"===t||"malam"===t?e+12:void 0},meridiem:function(e,t,n){return e<11?"pagi":e<15?"tengahari":e<19?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",ss:"%d saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}});return t}))},ec18:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";function t(e,t,n,a){var i={s:["mõne sekundi","mõni sekund","paar sekundit"],ss:[e+"sekundi",e+"sekundit"],m:["ühe minuti","üks minut"],mm:[e+" minuti",e+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[e+" tunni",e+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[e+" kuu",e+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[e+" aasta",e+" aastat"]};return t?i[n][2]?i[n][2]:i[n][1]:a?i[n][0]:i[n][1]}var n=e.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:t,ss:t,m:t,mm:t,h:t,hh:t,d:t,dd:"%d päeva",M:t,MM:t,y:t,yy:t},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return n}))},eda5:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("si",{months:"ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),monthsShort:"ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),weekdays:"ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),weekdaysShort:"ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),weekdaysMin:"ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, a h:mm",LLLL:"YYYY MMMM D [වැනි] dddd, a h:mm:ss"},calendar:{sameDay:"[අද] LT[ට]",nextDay:"[හෙට] LT[ට]",nextWeek:"dddd LT[ට]",lastDay:"[ඊයේ] LT[ට]",lastWeek:"[පසුගිය] dddd LT[ට]",sameElse:"L"},relativeTime:{future:"%sකින්",past:"%sකට පෙර",s:"තත්පර කිහිපය",ss:"තත්පර %d",m:"මිනිත්තුව",mm:"මිනිත්තු %d",h:"පැය",hh:"පැය %d",d:"දිනය",dd:"දින %d",M:"මාසය",MM:"මාස %d",y:"වසර",yy:"වසර %d"},dayOfMonthOrdinalParse:/\d{1,2} වැනි/,ordinal:function(e){return e+" වැනි"},meridiemParse:/පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,isPM:function(e){return"ප.ව."===e||"පස් වරු"===e},meridiem:function(e,t,n){return e>11?n?"ප.ව.":"පස් වරු":n?"පෙ.ව.":"පෙර වරු"}});return t}))},ee13:function(e,t,n){"use strict";var a=n("5bea"),i=n.n(a);i.a},ee91:function(e,t,n){"use strict";var a=n("5f59"),i=n.n(a);i.a},f069:function(e,t,n){"use strict";var a=n("1c0b"),i=function(e){var t,n;this.promise=new e((function(e,a){if(void 0!==t||void 0!==n)throw TypeError("Bad Promise constructor");t=e,n=a})),this.resolve=a(t),this.reject=a(n)};e.exports.f=function(e){return new i(e)}},f0bd:function(e,t,n){"use strict";(function(e){
/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.0
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var n="undefined"!==typeof window&&"undefined"!==typeof document&&"undefined"!==typeof navigator,a=function(){for(var e=["Edge","Trident","Firefox"],t=0;t<e.length;t+=1)if(n&&navigator.userAgent.indexOf(e[t])>=0)return 1;return 0}();function i(e){var t=!1;return function(){t||(t=!0,window.Promise.resolve().then((function(){t=!1,e()})))}}function r(e){var t=!1;return function(){t||(t=!0,setTimeout((function(){t=!1,e()}),a))}}var o=n&&window.Promise,s=o?i:r;function l(e){var t={};return e&&"[object Function]"===t.toString.call(e)}function d(e,t){if(1!==e.nodeType)return[];var n=e.ownerDocument.defaultView,a=n.getComputedStyle(e,null);return t?a[t]:a}function u(e){return"HTML"===e.nodeName?e:e.parentNode||e.host}function c(e){if(!e)return document.body;switch(e.nodeName){case"HTML":case"BODY":return e.ownerDocument.body;case"#document":return e.body}var t=d(e),n=t.overflow,a=t.overflowX,i=t.overflowY;return/(auto|scroll|overlay)/.test(n+i+a)?e:c(u(e))}function h(e){return e&&e.referenceNode?e.referenceNode:e}var f=n&&!(!window.MSInputMethodContext||!document.documentMode),m=n&&/MSIE 10/.test(navigator.userAgent);function p(e){return 11===e?f:10===e?m:f||m}function _(e){if(!e)return document.documentElement;var t=p(10)?document.body:null,n=e.offsetParent||null;while(n===t&&e.nextElementSibling)n=(e=e.nextElementSibling).offsetParent;var a=n&&n.nodeName;return a&&"BODY"!==a&&"HTML"!==a?-1!==["TH","TD","TABLE"].indexOf(n.nodeName)&&"static"===d(n,"position")?_(n):n:e?e.ownerDocument.documentElement:document.documentElement}function g(e){var t=e.nodeName;return"BODY"!==t&&("HTML"===t||_(e.firstElementChild)===e)}function y(e){return null!==e.parentNode?y(e.parentNode):e}function v(e,t){if(!e||!e.nodeType||!t||!t.nodeType)return document.documentElement;var n=e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING,a=n?e:t,i=n?t:e,r=document.createRange();r.setStart(a,0),r.setEnd(i,0);var o=r.commonAncestorContainer;if(e!==o&&t!==o||a.contains(i))return g(o)?o:_(o);var s=y(e);return s.host?v(s.host,t):v(e,y(t).host)}function b(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top",n="top"===t?"scrollTop":"scrollLeft",a=e.nodeName;if("BODY"===a||"HTML"===a){var i=e.ownerDocument.documentElement,r=e.ownerDocument.scrollingElement||i;return r[n]}return e[n]}function M(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=b(t,"top"),i=b(t,"left"),r=n?-1:1;return e.top+=a*r,e.bottom+=a*r,e.left+=i*r,e.right+=i*r,e}function L(e,t){var n="x"===t?"Left":"Top",a="Left"===n?"Right":"Bottom";return parseFloat(e["border"+n+"Width"],10)+parseFloat(e["border"+a+"Width"],10)}function k(e,t,n,a){return Math.max(t["offset"+e],t["scroll"+e],n["client"+e],n["offset"+e],n["scroll"+e],p(10)?parseInt(n["offset"+e])+parseInt(a["margin"+("Height"===e?"Top":"Left")])+parseInt(a["margin"+("Height"===e?"Bottom":"Right")]):0)}function w(e){var t=e.body,n=e.documentElement,a=p(10)&&getComputedStyle(n);return{height:k("Height",t,n,a),width:k("Width",t,n,a)}}var x=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},Y=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),S=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e},D=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e};function T(e){return D({},e,{right:e.left+e.width,bottom:e.top+e.height})}function H(e){var t={};try{if(p(10)){t=e.getBoundingClientRect();var n=b(e,"top"),a=b(e,"left");t.top+=n,t.left+=a,t.bottom+=n,t.right+=a}else t=e.getBoundingClientRect()}catch(h){}var i={left:t.left,top:t.top,width:t.right-t.left,height:t.bottom-t.top},r="HTML"===e.nodeName?w(e.ownerDocument):{},o=r.width||e.clientWidth||i.width,s=r.height||e.clientHeight||i.height,l=e.offsetWidth-o,u=e.offsetHeight-s;if(l||u){var c=d(e);l-=L(c,"x"),u-=L(c,"y"),i.width-=l,i.height-=u}return T(i)}function C(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=p(10),i="HTML"===t.nodeName,r=H(e),o=H(t),s=c(e),l=d(t),u=parseFloat(l.borderTopWidth,10),h=parseFloat(l.borderLeftWidth,10);n&&i&&(o.top=Math.max(o.top,0),o.left=Math.max(o.left,0));var f=T({top:r.top-o.top-u,left:r.left-o.left-h,width:r.width,height:r.height});if(f.marginTop=0,f.marginLeft=0,!a&&i){var m=parseFloat(l.marginTop,10),_=parseFloat(l.marginLeft,10);f.top-=u-m,f.bottom-=u-m,f.left-=h-_,f.right-=h-_,f.marginTop=m,f.marginLeft=_}return(a&&!n?t.contains(s):t===s&&"BODY"!==s.nodeName)&&(f=M(f,t)),f}function O(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=e.ownerDocument.documentElement,a=C(e,n),i=Math.max(n.clientWidth,window.innerWidth||0),r=Math.max(n.clientHeight,window.innerHeight||0),o=t?0:b(n),s=t?0:b(n,"left"),l={top:o-a.top+a.marginTop,left:s-a.left+a.marginLeft,width:i,height:r};return T(l)}function j(e){var t=e.nodeName;if("BODY"===t||"HTML"===t)return!1;if("fixed"===d(e,"position"))return!0;var n=u(e);return!!n&&j(n)}function P(e){if(!e||!e.parentElement||p())return document.documentElement;var t=e.parentElement;while(t&&"none"===d(t,"transform"))t=t.parentElement;return t||document.documentElement}function A(e,t,n,a){var i=arguments.length>4&&void 0!==arguments[4]&&arguments[4],r={top:0,left:0},o=i?P(e):v(e,h(t));if("viewport"===a)r=O(o,i);else{var s=void 0;"scrollParent"===a?(s=c(u(t)),"BODY"===s.nodeName&&(s=e.ownerDocument.documentElement)):s="window"===a?e.ownerDocument.documentElement:a;var l=C(s,o,i);if("HTML"!==s.nodeName||j(o))r=l;else{var d=w(e.ownerDocument),f=d.height,m=d.width;r.top+=l.top-l.marginTop,r.bottom=f+l.top,r.left+=l.left-l.marginLeft,r.right=m+l.left}}n=n||0;var p="number"===typeof n;return r.left+=p?n:n.left||0,r.top+=p?n:n.top||0,r.right-=p?n:n.right||0,r.bottom-=p?n:n.bottom||0,r}function E(e){var t=e.width,n=e.height;return t*n}function I(e,t,n,a,i){var r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;if(-1===e.indexOf("auto"))return e;var o=A(n,a,r,i),s={top:{width:o.width,height:t.top-o.top},right:{width:o.right-t.right,height:o.height},bottom:{width:o.width,height:o.bottom-t.bottom},left:{width:t.left-o.left,height:o.height}},l=Object.keys(s).map((function(e){return D({key:e},s[e],{area:E(s[e])})})).sort((function(e,t){return t.area-e.area})),d=l.filter((function(e){var t=e.width,a=e.height;return t>=n.clientWidth&&a>=n.clientHeight})),u=d.length>0?d[0].key:l[0].key,c=e.split("-")[1];return u+(c?"-"+c:"")}function B(e,t,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,i=a?P(t):v(t,h(n));return C(n,i,a)}function W(e){var t=e.ownerDocument.defaultView,n=t.getComputedStyle(e),a=parseFloat(n.marginTop||0)+parseFloat(n.marginBottom||0),i=parseFloat(n.marginLeft||0)+parseFloat(n.marginRight||0),r={width:e.offsetWidth+i,height:e.offsetHeight+a};return r}function F(e){var t={left:"right",right:"left",bottom:"top",top:"bottom"};return e.replace(/left|right|bottom|top/g,(function(e){return t[e]}))}function N(e,t,n){n=n.split("-")[0];var a=W(e),i={width:a.width,height:a.height},r=-1!==["right","left"].indexOf(n),o=r?"top":"left",s=r?"left":"top",l=r?"height":"width",d=r?"width":"height";return i[o]=t[o]+t[l]/2-a[l]/2,i[s]=n===s?t[s]-a[d]:t[F(s)],i}function z(e,t){return Array.prototype.find?e.find(t):e.filter(t)[0]}function R(e,t,n){if(Array.prototype.findIndex)return e.findIndex((function(e){return e[t]===n}));var a=z(e,(function(e){return e[t]===n}));return e.indexOf(a)}function $(e,t,n){var a=void 0===n?e:e.slice(0,R(e,"name",n));return a.forEach((function(e){e["function"]&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var n=e["function"]||e.fn;e.enabled&&l(n)&&(t.offsets.popper=T(t.offsets.popper),t.offsets.reference=T(t.offsets.reference),t=n(t,e))})),t}function V(){if(!this.state.isDestroyed){var e={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};e.offsets.reference=B(this.state,this.popper,this.reference,this.options.positionFixed),e.placement=I(this.options.placement,e.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),e.originalPlacement=e.placement,e.positionFixed=this.options.positionFixed,e.offsets.popper=N(this.popper,e.offsets.reference,e.placement),e.offsets.popper.position=this.options.positionFixed?"fixed":"absolute",e=$(this.modifiers,e),this.state.isCreated?this.options.onUpdate(e):(this.state.isCreated=!0,this.options.onCreate(e))}}function J(e,t){return e.some((function(e){var n=e.name,a=e.enabled;return a&&n===t}))}function U(e){for(var t=[!1,"ms","Webkit","Moz","O"],n=e.charAt(0).toUpperCase()+e.slice(1),a=0;a<t.length;a++){var i=t[a],r=i?""+i+n:e;if("undefined"!==typeof document.body.style[r])return r}return null}function G(){return this.state.isDestroyed=!0,J(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.position="",this.popper.style.top="",this.popper.style.left="",this.popper.style.right="",this.popper.style.bottom="",this.popper.style.willChange="",this.popper.style[U("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function q(e){var t=e.ownerDocument;return t?t.defaultView:window}function X(e,t,n,a){var i="BODY"===e.nodeName,r=i?e.ownerDocument.defaultView:e;r.addEventListener(t,n,{passive:!0}),i||X(c(r.parentNode),t,n,a),a.push(r)}function K(e,t,n,a){n.updateBound=a,q(e).addEventListener("resize",n.updateBound,{passive:!0});var i=c(e);return X(i,"scroll",n.updateBound,n.scrollParents),n.scrollElement=i,n.eventsEnabled=!0,n}function Z(){this.state.eventsEnabled||(this.state=K(this.reference,this.options,this.state,this.scheduleUpdate))}function Q(e,t){return q(e).removeEventListener("resize",t.updateBound),t.scrollParents.forEach((function(e){e.removeEventListener("scroll",t.updateBound)})),t.updateBound=null,t.scrollParents=[],t.scrollElement=null,t.eventsEnabled=!1,t}function ee(){this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=Q(this.reference,this.state))}function te(e){return""!==e&&!isNaN(parseFloat(e))&&isFinite(e)}function ne(e,t){Object.keys(t).forEach((function(n){var a="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&te(t[n])&&(a="px"),e.style[n]=t[n]+a}))}function ae(e,t){Object.keys(t).forEach((function(n){var a=t[n];!1!==a?e.setAttribute(n,t[n]):e.removeAttribute(n)}))}function ie(e){return ne(e.instance.popper,e.styles),ae(e.instance.popper,e.attributes),e.arrowElement&&Object.keys(e.arrowStyles).length&&ne(e.arrowElement,e.arrowStyles),e}function re(e,t,n,a,i){var r=B(i,t,e,n.positionFixed),o=I(n.placement,r,t,e,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return t.setAttribute("x-placement",o),ne(t,{position:n.positionFixed?"fixed":"absolute"}),n}function oe(e,t){var n=e.offsets,a=n.popper,i=n.reference,r=Math.round,o=Math.floor,s=function(e){return e},l=r(i.width),d=r(a.width),u=-1!==["left","right"].indexOf(e.placement),c=-1!==e.placement.indexOf("-"),h=l%2===d%2,f=l%2===1&&d%2===1,m=t?u||c||h?r:o:s,p=t?r:s;return{left:m(f&&!c&&t?a.left-1:a.left),top:p(a.top),bottom:p(a.bottom),right:m(a.right)}}var se=n&&/Firefox/i.test(navigator.userAgent);function le(e,t){var n=t.x,a=t.y,i=e.offsets.popper,r=z(e.instance.modifiers,(function(e){return"applyStyle"===e.name})).gpuAcceleration;void 0!==r&&console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");var o=void 0!==r?r:t.gpuAcceleration,s=_(e.instance.popper),l=H(s),d={position:i.position},u=oe(e,window.devicePixelRatio<2||!se),c="bottom"===n?"top":"bottom",h="right"===a?"left":"right",f=U("transform"),m=void 0,p=void 0;if(p="bottom"===c?"HTML"===s.nodeName?-s.clientHeight+u.bottom:-l.height+u.bottom:u.top,m="right"===h?"HTML"===s.nodeName?-s.clientWidth+u.right:-l.width+u.right:u.left,o&&f)d[f]="translate3d("+m+"px, "+p+"px, 0)",d[c]=0,d[h]=0,d.willChange="transform";else{var g="bottom"===c?-1:1,y="right"===h?-1:1;d[c]=p*g,d[h]=m*y,d.willChange=c+", "+h}var v={"x-placement":e.placement};return e.attributes=D({},v,e.attributes),e.styles=D({},d,e.styles),e.arrowStyles=D({},e.offsets.arrow,e.arrowStyles),e}function de(e,t,n){var a=z(e,(function(e){var n=e.name;return n===t})),i=!!a&&e.some((function(e){return e.name===n&&e.enabled&&e.order<a.order}));if(!i){var r="`"+t+"`",o="`"+n+"`";console.warn(o+" modifier is required by "+r+" modifier in order to work, be sure to include it before "+r+"!")}return i}function ue(e,t){var n;if(!de(e.instance.modifiers,"arrow","keepTogether"))return e;var a=t.element;if("string"===typeof a){if(a=e.instance.popper.querySelector(a),!a)return e}else if(!e.instance.popper.contains(a))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),e;var i=e.placement.split("-")[0],r=e.offsets,o=r.popper,s=r.reference,l=-1!==["left","right"].indexOf(i),u=l?"height":"width",c=l?"Top":"Left",h=c.toLowerCase(),f=l?"left":"top",m=l?"bottom":"right",p=W(a)[u];s[m]-p<o[h]&&(e.offsets.popper[h]-=o[h]-(s[m]-p)),s[h]+p>o[m]&&(e.offsets.popper[h]+=s[h]+p-o[m]),e.offsets.popper=T(e.offsets.popper);var _=s[h]+s[u]/2-p/2,g=d(e.instance.popper),y=parseFloat(g["margin"+c],10),v=parseFloat(g["border"+c+"Width"],10),b=_-e.offsets.popper[h]-y-v;return b=Math.max(Math.min(o[u]-p,b),0),e.arrowElement=a,e.offsets.arrow=(n={},S(n,h,Math.round(b)),S(n,f,""),n),e}function ce(e){return"end"===e?"start":"start"===e?"end":e}var he=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],fe=he.slice(3);function me(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=fe.indexOf(e),a=fe.slice(n+1).concat(fe.slice(0,n));return t?a.reverse():a}var pe={FLIP:"flip",CLOCKWISE:"clockwise",COUNTERCLOCKWISE:"counterclockwise"};function _e(e,t){if(J(e.instance.modifiers,"inner"))return e;if(e.flipped&&e.placement===e.originalPlacement)return e;var n=A(e.instance.popper,e.instance.reference,t.padding,t.boundariesElement,e.positionFixed),a=e.placement.split("-")[0],i=F(a),r=e.placement.split("-")[1]||"",o=[];switch(t.behavior){case pe.FLIP:o=[a,i];break;case pe.CLOCKWISE:o=me(a);break;case pe.COUNTERCLOCKWISE:o=me(a,!0);break;default:o=t.behavior}return o.forEach((function(s,l){if(a!==s||o.length===l+1)return e;a=e.placement.split("-")[0],i=F(a);var d=e.offsets.popper,u=e.offsets.reference,c=Math.floor,h="left"===a&&c(d.right)>c(u.left)||"right"===a&&c(d.left)<c(u.right)||"top"===a&&c(d.bottom)>c(u.top)||"bottom"===a&&c(d.top)<c(u.bottom),f=c(d.left)<c(n.left),m=c(d.right)>c(n.right),p=c(d.top)<c(n.top),_=c(d.bottom)>c(n.bottom),g="left"===a&&f||"right"===a&&m||"top"===a&&p||"bottom"===a&&_,y=-1!==["top","bottom"].indexOf(a),v=!!t.flipVariations&&(y&&"start"===r&&f||y&&"end"===r&&m||!y&&"start"===r&&p||!y&&"end"===r&&_),b=!!t.flipVariationsByContent&&(y&&"start"===r&&m||y&&"end"===r&&f||!y&&"start"===r&&_||!y&&"end"===r&&p),M=v||b;(h||g||M)&&(e.flipped=!0,(h||g)&&(a=o[l+1]),M&&(r=ce(r)),e.placement=a+(r?"-"+r:""),e.offsets.popper=D({},e.offsets.popper,N(e.instance.popper,e.offsets.reference,e.placement)),e=$(e.instance.modifiers,e,"flip"))})),e}function ge(e){var t=e.offsets,n=t.popper,a=t.reference,i=e.placement.split("-")[0],r=Math.floor,o=-1!==["top","bottom"].indexOf(i),s=o?"right":"bottom",l=o?"left":"top",d=o?"width":"height";return n[s]<r(a[l])&&(e.offsets.popper[l]=r(a[l])-n[d]),n[l]>r(a[s])&&(e.offsets.popper[l]=r(a[s])),e}function ye(e,t,n,a){var i=e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+i[1],o=i[2];if(!r)return e;if(0===o.indexOf("%")){var s=void 0;switch(o){case"%p":s=n;break;case"%":case"%r":default:s=a}var l=T(s);return l[t]/100*r}if("vh"===o||"vw"===o){var d=void 0;return d="vh"===o?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0),d/100*r}return r}function ve(e,t,n,a){var i=[0,0],r=-1!==["right","left"].indexOf(a),o=e.split(/(\+|\-)/).map((function(e){return e.trim()})),s=o.indexOf(z(o,(function(e){return-1!==e.search(/,|\s/)})));o[s]&&-1===o[s].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");var l=/\s*,\s*|\s+/,d=-1!==s?[o.slice(0,s).concat([o[s].split(l)[0]]),[o[s].split(l)[1]].concat(o.slice(s+1))]:[o];return d=d.map((function(e,a){var i=(1===a?!r:r)?"height":"width",o=!1;return e.reduce((function(e,t){return""===e[e.length-1]&&-1!==["+","-"].indexOf(t)?(e[e.length-1]=t,o=!0,e):o?(e[e.length-1]+=t,o=!1,e):e.concat(t)}),[]).map((function(e){return ye(e,i,t,n)}))})),d.forEach((function(e,t){e.forEach((function(n,a){te(n)&&(i[t]+=n*("-"===e[a-1]?-1:1))}))})),i}function be(e,t){var n=t.offset,a=e.placement,i=e.offsets,r=i.popper,o=i.reference,s=a.split("-")[0],l=void 0;return l=te(+n)?[+n,0]:ve(n,r,o,s),"left"===s?(r.top+=l[0],r.left-=l[1]):"right"===s?(r.top+=l[0],r.left+=l[1]):"top"===s?(r.left+=l[0],r.top-=l[1]):"bottom"===s&&(r.left+=l[0],r.top+=l[1]),e.popper=r,e}function Me(e,t){var n=t.boundariesElement||_(e.instance.popper);e.instance.reference===n&&(n=_(n));var a=U("transform"),i=e.instance.popper.style,r=i.top,o=i.left,s=i[a];i.top="",i.left="",i[a]="";var l=A(e.instance.popper,e.instance.reference,t.padding,n,e.positionFixed);i.top=r,i.left=o,i[a]=s,t.boundaries=l;var d=t.priority,u=e.offsets.popper,c={primary:function(e){var n=u[e];return u[e]<l[e]&&!t.escapeWithReference&&(n=Math.max(u[e],l[e])),S({},e,n)},secondary:function(e){var n="right"===e?"left":"top",a=u[n];return u[e]>l[e]&&!t.escapeWithReference&&(a=Math.min(u[n],l[e]-("right"===e?u.width:u.height))),S({},n,a)}};return d.forEach((function(e){var t=-1!==["left","top"].indexOf(e)?"primary":"secondary";u=D({},u,c[t](e))})),e.offsets.popper=u,e}function Le(e){var t=e.placement,n=t.split("-")[0],a=t.split("-")[1];if(a){var i=e.offsets,r=i.reference,o=i.popper,s=-1!==["bottom","top"].indexOf(n),l=s?"left":"top",d=s?"width":"height",u={start:S({},l,r[l]),end:S({},l,r[l]+r[d]-o[d])};e.offsets.popper=D({},o,u[a])}return e}function ke(e){if(!de(e.instance.modifiers,"hide","preventOverflow"))return e;var t=e.offsets.reference,n=z(e.instance.modifiers,(function(e){return"preventOverflow"===e.name})).boundaries;if(t.bottom<n.top||t.left>n.right||t.top>n.bottom||t.right<n.left){if(!0===e.hide)return e;e.hide=!0,e.attributes["x-out-of-boundaries"]=""}else{if(!1===e.hide)return e;e.hide=!1,e.attributes["x-out-of-boundaries"]=!1}return e}function we(e){var t=e.placement,n=t.split("-")[0],a=e.offsets,i=a.popper,r=a.reference,o=-1!==["left","right"].indexOf(n),s=-1===["top","left"].indexOf(n);return i[o?"left":"top"]=r[n]-(s?i[o?"width":"height"]:0),e.placement=F(t),e.offsets.popper=T(i),e}var xe={shift:{order:100,enabled:!0,fn:Le},offset:{order:200,enabled:!0,fn:be,offset:0},preventOverflow:{order:300,enabled:!0,fn:Me,priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:ge},arrow:{order:500,enabled:!0,fn:ue,element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:_e,behavior:"flip",padding:5,boundariesElement:"viewport",flipVariations:!1,flipVariationsByContent:!1},inner:{order:700,enabled:!1,fn:we},hide:{order:800,enabled:!0,fn:ke},computeStyle:{order:850,enabled:!0,fn:le,gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:ie,onLoad:re,gpuAcceleration:void 0}},Ye={placement:"bottom",positionFixed:!1,eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:xe},Se=function(){function e(t,n){var a=this,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};x(this,e),this.scheduleUpdate=function(){return requestAnimationFrame(a.update)},this.update=s(this.update.bind(this)),this.options=D({},e.Defaults,i),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=t&&t.jquery?t[0]:t,this.popper=n&&n.jquery?n[0]:n,this.options.modifiers={},Object.keys(D({},e.Defaults.modifiers,i.modifiers)).forEach((function(t){a.options.modifiers[t]=D({},e.Defaults.modifiers[t]||{},i.modifiers?i.modifiers[t]:{})})),this.modifiers=Object.keys(this.options.modifiers).map((function(e){return D({name:e},a.options.modifiers[e])})).sort((function(e,t){return e.order-t.order})),this.modifiers.forEach((function(e){e.enabled&&l(e.onLoad)&&e.onLoad(a.reference,a.popper,a.options,e,a.state)})),this.update();var r=this.options.eventsEnabled;r&&this.enableEventListeners(),this.state.eventsEnabled=r}return Y(e,[{key:"update",value:function(){return V.call(this)}},{key:"destroy",value:function(){return G.call(this)}},{key:"enableEventListeners",value:function(){return Z.call(this)}},{key:"disableEventListeners",value:function(){return ee.call(this)}}]),e}();Se.Utils=("undefined"!==typeof window?window:e).PopperUtils,Se.placements=he,Se.Defaults=Ye,t["a"]=Se}).call(this,n("c8ba"))},f260:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("pt",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Do_2ª_3ª_4ª_5ª_6ª_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",ss:"%d segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},dayOfMonthOrdinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});return t}))},f3ff:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t={1:"੧",2:"੨",3:"੩",4:"੪",5:"੫",6:"੬",7:"੭",8:"੮",9:"੯",0:"੦"},n={"੧":"1","੨":"2","੩":"3","੪":"4","੫":"5","੬":"6","੭":"7","੮":"8","੯":"9","੦":"0"},a=e.defineLocale("pa-in",{months:"ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),monthsShort:"ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),weekdays:"ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ".split("_"),weekdaysShort:"ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),weekdaysMin:"ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),longDateFormat:{LT:"A h:mm ਵਜੇ",LTS:"A h:mm:ss ਵਜੇ",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm ਵਜੇ",LLLL:"dddd, D MMMM YYYY, A h:mm ਵਜੇ"},calendar:{sameDay:"[ਅਜ] LT",nextDay:"[ਕਲ] LT",nextWeek:"[ਅਗਲਾ] dddd, LT",lastDay:"[ਕਲ] LT",lastWeek:"[ਪਿਛਲੇ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ਵਿੱਚ",past:"%s ਪਿਛਲੇ",s:"ਕੁਝ ਸਕਿੰਟ",ss:"%d ਸਕਿੰਟ",m:"ਇਕ ਮਿੰਟ",mm:"%d ਮਿੰਟ",h:"ਇੱਕ ਘੰਟਾ",hh:"%d ਘੰਟੇ",d:"ਇੱਕ ਦਿਨ",dd:"%d ਦਿਨ",M:"ਇੱਕ ਮਹੀਨਾ",MM:"%d ਮਹੀਨੇ",y:"ਇੱਕ ਸਾਲ",yy:"%d ਸਾਲ"},preparse:function(e){return e.replace(/[੧੨੩੪੫੬੭੮੯੦]/g,(function(e){return n[e]}))},postformat:function(e){return e.replace(/\d/g,(function(e){return t[e]}))},meridiemParse:/ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,meridiemHour:function(e,t){return 12===e&&(e=0),"ਰਾਤ"===t?e<4?e:e+12:"ਸਵੇਰ"===t?e:"ਦੁਪਹਿਰ"===t?e>=10?e:e+12:"ਸ਼ਾਮ"===t?e+12:void 0},meridiem:function(e,t,n){return e<4?"ਰਾਤ":e<10?"ਸਵੇਰ":e<17?"ਦੁਪਹਿਰ":e<20?"ਸ਼ਾਮ":"ਰਾਤ"},week:{dow:0,doy:6}});return a}))},f5df:function(e,t,n){var a=n("c6b6"),i=n("b622"),r=i("toStringTag"),o="Arguments"==a(function(){return arguments}()),s=function(e,t){try{return e[t]}catch(n){}};e.exports=function(e){var t,n,i;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=s(t=Object(e),r))?n:o?a(t):"Object"==(i=a(t))&&"function"==typeof t.callee?"Arguments":i}},f6b4:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=["Am Faoilleach","An Gearran","Am Màrt","An Giblean","An Cèitean","An t-Ògmhios","An t-Iuchar","An Lùnastal","An t-Sultain","An Dàmhair","An t-Samhain","An Dùbhlachd"],n=["Faoi","Gear","Màrt","Gibl","Cèit","Ògmh","Iuch","Lùn","Sult","Dàmh","Samh","Dùbh"],a=["Didòmhnaich","Diluain","Dimàirt","Diciadain","Diardaoin","Dihaoine","Disathairne"],i=["Did","Dil","Dim","Dic","Dia","Dih","Dis"],r=["Dò","Lu","Mà","Ci","Ar","Ha","Sa"],o=e.defineLocale("gd",{months:t,monthsShort:n,monthsParseExact:!0,weekdays:a,weekdaysShort:i,weekdaysMin:r,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[An-diugh aig] LT",nextDay:"[A-màireach aig] LT",nextWeek:"dddd [aig] LT",lastDay:"[An-dè aig] LT",lastWeek:"dddd [seo chaidh] [aig] LT",sameElse:"L"},relativeTime:{future:"ann an %s",past:"bho chionn %s",s:"beagan diogan",ss:"%d diogan",m:"mionaid",mm:"%d mionaidean",h:"uair",hh:"%d uairean",d:"latha",dd:"%d latha",M:"mìos",MM:"%d mìosan",y:"bliadhna",yy:"%d bliadhna"},dayOfMonthOrdinalParse:/\d{1,2}(d|na|mh)/,ordinal:function(e){var t=1===e?"d":e%10===2?"na":"mh";return e+t},week:{dow:1,doy:4}});return o}))},f6b9:function(e,t,n){},f772:function(e,t,n){var a=n("5692"),i=n("90e3"),r=a("keys");e.exports=function(e){return r[e]||(r[e]=i(e))}},f8c2:function(e,t,n){var a=n("1c0b");e.exports=function(e,t,n){if(a(e),void 0===t)return e;switch(n){case 0:return function(){return e.call(t)};case 1:return function(n){return e.call(t,n)};case 2:return function(n,a){return e.call(t,n,a)};case 3:return function(n,a,i){return e.call(t,n,a,i)}}return function(){return e.apply(t,arguments)}}},f928:function(e,t,n){"use strict";var a=n("b9d7"),i=n.n(a);i.a},facd:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),n="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),a=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],i=/^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,r=e.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(e,a){return e?/-MMM-/.test(a)?n[e.month()]:t[e.month()]:t},monthsRegex:i,monthsShortRegex:i,monthsStrictRegex:/^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:a,longMonthsParse:a,shortMonthsParse:a,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"zo_ma_di_wo_do_vr_za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",ss:"%d seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}});return r}))},fae3:function(e,t,n){"use strict";if(n.r(t),n.d(t,"mdbAccordion",(function(){return ce})),n.d(t,"mdbAccordionPane",(function(){return se})),n.d(t,"mdbAlert",(function(){return ge})),n.d(t,"mdbBadge",(function(){return ke})),n.d(t,"mdbBreadcrumb",(function(){return Te})),n.d(t,"mdbBreadcrumbItem",(function(){return Ae})),n.d(t,"mdbBtn",(function(){return G["b"]})),n.d(t,"mdbBtnGroup",(function(){return Ne})),n.d(t,"mdbBtnToolbar",(function(){return Ue})),n.d(t,"mdbCard",(function(){return f})),n.d(t,"mdbCardAvatar",(function(){return Qe})),n.d(t,"mdbCardBody",(function(){return D})),n.d(t,"mdbCardFooter",(function(){return rt})),n.d(t,"mdbCardGroup",(function(){return ct})),n.d(t,"mdbCardHeader",(function(){return M})),n.d(t,"mdbCardImage",(function(){return gt})),n.d(t,"mdbCardText",(function(){return Tt})),n.d(t,"mdbCardTitle",(function(){return At})),n.d(t,"mdbCardUp",(function(){return kt})),n.d(t,"mdbCarousel",(function(){return ls})),n.d(t,"mdbBarChart",(function(){return Qt})),n.d(t,"mdbDoughnutChart",(function(){return en})),n.d(t,"mdbLineChart",(function(){return tn})),n.d(t,"mdbPieChart",(function(){return nn})),n.d(t,"mdbPolarChart",(function(){return an})),n.d(t,"mdbRadarChart",(function(){return rn})),n.d(t,"mdbBubbleChart",(function(){return on})),n.d(t,"mdbScatterChart",(function(){return sn})),n.d(t,"mdbHorizontalBarChart",(function(){return ln})),n.d(t,"mdbCol",(function(){return pn["b"]})),n.d(t,"mdbCollapse",(function(){return cn})),n.d(t,"mdbContainer",(function(){return yn})),n.d(t,"mdbDatatable",(function(){return ds})),n.d(t,"mdbDatatable2",(function(){return us})),n.d(t,"mdbDropdown",(function(){return cs})),n.d(t,"mdbDropdownItem",(function(){return ne})),n.d(t,"mdbDropdownMenu",(function(){return I})),n.d(t,"mdbDropdownToggle",(function(){return q})),n.d(t,"mdbEdgeHeader",(function(){return wn})),n.d(t,"mdbIcon",(function(){return j["b"]})),n.d(t,"mdbInput",(function(){return hs})),n.d(t,"mdbFooter",(function(){return Hn})),n.d(t,"mdbFormInline",(function(){return En})),n.d(t,"mdbGoogleMap",(function(){return zn})),n.d(t,"mdbJumbotron",(function(){return Gn})),n.d(t,"mdbListGroup",(function(){return ea})),n.d(t,"mdbListGroupItem",(function(){return oa})),n.d(t,"mdbMask",(function(){return ua["b"]})),n.d(t,"mdbMedia",(function(){return fa})),n.d(t,"mdbMediaBody",(function(){return va})),n.d(t,"mdbMediaImage",(function(){return xa})),n.d(t,"mdbModal",(function(){return Ca})),n.d(t,"mdbModalHeader",(function(){return qa})),n.d(t,"mdbModalTitle",(function(){return ti})),n.d(t,"mdbModalBody",(function(){return Ia})),n.d(t,"mdbModalFooter",(function(){return Ra})),n.d(t,"mdbNumericInput",(function(){return Vi})),n.d(t,"mdbNavbar",(function(){return fi})),n.d(t,"mdbNavbarBrand",(function(){return vi})),n.d(t,"mdbNavbarNav",(function(){return Ii})),n.d(t,"mdbNavbarToggler",(function(){return xi})),n.d(t,"mdbNavItem",(function(){return Ci})),n.d(t,"mdbPageItem",(function(){return qi["b"]})),n.d(t,"mdbPageNav",(function(){return Zi})),n.d(t,"mdbPagination",(function(){return nr["b"]})),n.d(t,"mdbPopover",(function(){return lr})),n.d(t,"mdbProgress",(function(){return mr})),n.d(t,"mdbRow",(function(){return yr["b"]})),n.d(t,"mdbStepper",(function(){return ms})),n.d(t,"mdbTabs",(function(){return Sr})),n.d(t,"mdbTab",(function(){return jr})),n.d(t,"mdbTabContent",(function(){return Wr})),n.d(t,"mdbTabItem",(function(){return Vr})),n.d(t,"mdbTabPane",(function(){return Kr})),n.d(t,"mdbTbl",(function(){return to["b"]})),n.d(t,"mdbTblBody",(function(){return no["b"]})),n.d(t,"mdbTblHead",(function(){return ao["b"]})),n.d(t,"mdbTextarea",(function(){return si})),n.d(t,"mdbTooltip",(function(){return fs})),n.d(t,"mdbView",(function(){return io["b"]})),n.d(t,"mdbScrollbar",(function(){return lo})),n.d(t,"mdbStretchedLink",(function(){return po})),n.d(t,"mdbToastNotification",(function(){return Mo})),n.d(t,"mdbMasonry",(function(){return So})),n.d(t,"mdbMasonryItem",(function(){return jo})),n.d(t,"mdbTreeview",(function(){return Wo})),n.d(t,"mdbTreeviewItem",(function(){return Vo})),n.d(t,"mdbRating",(function(){return Zo})),n.d(t,"animateOnScroll",(function(){return ns})),n.d(t,"mdbAnimateOnScroll",(function(){return ns})),n.d(t,"mdbClassMixin",(function(){return h["a"]})),n.d(t,"mdbIconMixin",(function(){return is})),n.d(t,"mdbWaves",(function(){return ss})),n.d(t,"waves",(function(){return U["a"]})),n.d(t,"ScrollSpy",(function(){return as})),n.d(t,"mdbScrollSpy",(function(){return as})),"undefined"!==typeof window){var a=window.document.currentScript,i=n("8875");a=i(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:i});var r=a&&a.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);r&&(n.p=r[1])}var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.outerAccodionClasses,attrs:{role:"tablist"}},[e._t("default"),e._l(e.panes,(function(t,a){return n("mdb-accordion-pane",{key:a,attrs:{title:t.title,content:t.content,isOpen:e.openPaneNum==a,type:e.style,color:e.shades,order:a,icon:t.icon,options:t.options,hamburger:e.hamburger},on:{"pane-clicked":function(t){return e.handlePaneOpened(a)}}})}))],2)},s=[],l=(n("a9e3"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("card",{class:e.cardClass},[n("card-header",{class:e.headerClass,attrs:{role:"tab"},nativeOn:{click:function(t){return e.toggleVisible(t)}}},[e._t("title"),"default"===e.type?n("h5",{class:e.headingClass},[n("button",{staticClass:"btn btn-link",attrs:{type:"button","data-toggle":"collapse","data-expanded":e.isOpen},domProps:{innerHTML:e._s(e.title)}},[e._v(" "+e._s(e.title)+" ")])]):"icon"===e.type?n("a",{class:{collapsed:!e.isOpen},attrs:{"data-toggle":"collapse","aria-expanded":e.isOpen}},[n("h3",{class:e.headingClass},[e._v(" "+e._s(e.title)+" "),e.hamburger?n("div",{ref:"animatedIcon",staticClass:"animated-icon1 float-right mt-1"},[n("span"),n("span"),n("span")]):n("fa",{staticClass:"rotate-icon",attrs:{icon:"angle-down",size:"2x"}})],1)]):"color"===e.type||"photoBg"===e.type?n("a",{class:{collapsed:!e.isOpen},attrs:{"data-toggle":"collapse","aria-expanded":e.isOpen}},[n("fa",{directives:[{name:"show",rawName:"v-show",value:"photoBg"===e.type,expression:"type==='photoBg'"}],staticClass:"p-3 mr-4 float-left black-text",attrs:{icon:e.icon,size:"2x"}}),n("h4",{class:e.headingClass,domProps:{innerHTML:e._s(e.title)}},[e._v(" "+e._s(e.title)+" ")])],1):n("a",{staticClass:"fix",class:{collapsed:!e.isOpen},attrs:{"data-toggle":"collapse","aria-expanded":e.isOpen}},[n("h5",{class:e.headingClass},[n("span",{domProps:{innerHTML:e._s(e.title)}},[e._v(e._s(e.title))]),"picture"!==e.type?n("fa",{staticClass:"rotate-icon",attrs:{icon:"angle-down"}}):e._e()],1)])],2),n("transition",{on:{"before-enter":e.beforeEnter,enter:e.enter,"before-leave":e.beforeLeave,leave:e.leave}},[e.isOpen?n("card-body",{ref:"body",staticClass:"collapse-item",class:e.bodyClass},[e.content?n("p",{class:e.paragraphClass,domProps:{innerHTML:e._s(e.content)}},[e._v(" "+e._s(e.content)+" ")]):e._e(),e._t("default")],2):e._e()],1)],1)}),d=[],u=(n("99af"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),c=[],h=n("c101"),f={props:{tag:{type:String,default:"div"},cascade:{type:Boolean,default:!1},wide:{type:Boolean,default:!1},narrow:{type:Boolean,default:!1},reverse:{type:Boolean,default:!1},dark:{type:Boolean,default:!1},testimonial:{type:Boolean,default:!1},personal:{type:Boolean,default:!1},news:{type:Boolean,default:!1},ecommerce:{type:Boolean,default:!1},collection:{type:Boolean,default:!1},pricing:{type:Boolean,default:!1},color:{type:String},textColor:{type:String},border:{type:String}},computed:{className:function(){return["card",this.cascade?"card-cascade":"",this.wide?"card-cascade wider":"",this.narrow?"card-cascade narrower":"",this.reverse?"card-cascade wider reverse":"",this.dark?"card-dark":"",this.testimonial?"testimonial-card":"",this.personal?"card-personal":"",this.news?"news-card":"",this.ecommerce&&"card-ecommerce",this.collection&&"collection-card",this.pricing&&"pricing-card",this.color&&!this.textColor?this.color+" white-text":!!this.textColor&&this.color+" "+this.textColor+"-text",this.border&&"border-"+this.border,this.mdbClass]}},mixins:[h["a"]]},m=f,p=m,_=n("2877"),g=Object(_["a"])(p,u,c,!1,null,"ec246eba",null),y=g.exports,v=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},b=[],M={props:{tag:{type:String,default:"div"},color:{type:String},textColor:{type:String},border:{type:String},transparent:{type:Boolean,default:!1}},computed:{className:function(){return["card-header",this.color&&!this.textColor?this.color+" white-text":!!this.textColor&&this.color+" "+this.textColor+"-text",this.border&&"border-"+this.border,this.transparent&&"transparent"]}}},L=M,k=L,w=Object(_["a"])(k,v,b,!1,null,"6d5255d9",null),x=w.exports,Y=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},S=[],D={props:{tag:{type:String,default:"div"},color:{type:String},cascade:{type:Boolean}},computed:{className:function(){return["card-body",this.color?this.color+"-color":"",this.cascade&&"card-body-cascade"]}}},T=D,H=T,C=Object(_["a"])(H,Y,S,!1,null,"58bdbe1a",null),O=C.exports,j=n("060a"),P=n("05bd"),A=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,attrs:{"data-toggle":"dropdown-menu"}},[e._t("default")],2)},E=[],I={props:{tag:{type:String,default:"div"},dropup:{type:Boolean,default:!1},right:{type:Boolean,default:!1},dropright:{type:Boolean,default:!1},dropleft:{type:Boolean,default:!1},color:{type:String}},computed:{className:function(){return["dropdown-menu","show",this.color?"dropdown-"+this.color:""]}}},B=I,W=B,F=(n("d957"),Object(_["a"])(W,A,E,!1,null,null,null)),N=F.exports,z=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:[e.className,{"ripple-parent":e.waves}],attrs:{"aria-haspopup":"true","aria-expanded":"false"},on:{click:function(t){return t.preventDefault(),e.wave(t)}}},[e.srOnly?n("span",{staticClass:"sr-only"},[e._v("Toggle Dropdown")]):e._e(),e.icon&&!e.iconRight?n("mdb-icon",{class:e.iconClasses,attrs:{icon:e.icon,far:e.far||e.regular,fal:e.fal||e.light,fab:e.fab||e.brands,color:e.iconColor}}):e._e(),e._t("default"),e.icon&&e.iconRight?n("mdb-icon",{class:e.iconClasses,attrs:{icon:e.icon,far:e.far||e.regular,fal:e.fal||e.light,fab:e.fab||e.brands,color:e.iconColor}}):e._e()],2)},R=[];n("0481"),n("4069"),n("a4d3"),n("4de4"),n("4160"),n("e439"),n("dbb4"),n("b64b"),n("159b");function $(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function V(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function J(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?V(Object(n),!0).forEach((function(t){$(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):V(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var U=n("9327"),G=n("4b5c"),q={components:{mdbBtn:G["a"],mdbIcon:j["a"]},props:J({navLink:{type:Boolean,default:!1},srOnly:{type:Boolean,default:!1}},G["a"].props,{color:{type:String}}),computed:{className:function(){return[this.navLink?"nav-link":"btn",this.rounded&&"btn-rounded",this.floating&&"btn-floating",this.flat?"btn-flat":this.transparent?"":"btn-"+this.color,this.gradient&&this.gradient+"-gradient",this.action&&"btn-action",this.save&&"btn-save",this.waves&&"ripple-parent",this.text&&"".concat(this.text,"-text"),this.outline?"btn-outline-"+this.outline:this.transparent?"":"btn-"+this.color,this.size?"btn-"+this.size:"",this.block?"btn-block":"",this.active?"active":"",this.disabled?"disabled":"",this.group&&"m-0 px-3 py-2",this.group&&this.outline&&"z-depth-0","dropdown-toggle"]},iconClasses:function(){return["px-1",this.iconClass]}},mixins:[U["a"]]},X=q,K=X,Z=(n("88c8"),Object(_["a"])(K,z,R,!1,null,"5cc25de7",null)),Q=Z.exports,ee=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.to?"router-link":e.tag,{tag:"component",class:e.className,attrs:{tabindex:0,to:e.to,exact:e.exact,href:!e.to&&e.href,target:e.tab},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:(t.stopPropagation(),e.handleKeypress(t))},click:function(t){return e.$emit("click",t)}}},[e._t("default"),e.submenuIcon?n("mdb-icon",{staticClass:"pl-2",attrs:{icon:e.submenuIcon}}):e._e()],2)},te=[],ne={components:{mdbIcon:j["a"]},props:{tag:{type:String,default:"a"},to:[String,Object],href:{type:String},disabled:{type:Boolean,default:!1},active:{type:Boolean,default:!1},exact:{type:Boolean,default:!1},newTab:{type:Boolean,default:!1},submenu:{type:Boolean,default:!1},submenuIcon:String},computed:{className:function(){return["dropdown-item",this.disabled?"disabled":"",this.active?"active":"",this.submenu&&"dropdown-submenu"]},tab:function(){return!!this.newTab&&"_blank"}},methods:{handleKeypress:function(e){e.target.click()}}},ae=ne,ie=ae,re=(n("c4fe"),Object(_["a"])(ie,ee,te,!1,null,"4b393a3e",null)),oe=re.exports,se={props:{type:{type:String,default:"default"},isOpen:{type:Boolean},title:{type:String},content:{type:String},order:{type:Number},color:{type:String,default:""},icon:{type:String},hamburger:{type:Boolean}},components:{Card:y,CardHeader:x,CardBody:O,Fa:j["a"],Dropdown:P["default"],DropdownMenu:N,DropdownToggle:Q,DropdownItem:oe},data:function(){return{}},mounted:function(){this.isOpen&&(this.$refs.body.$el.style.height=this.$refs.body.$el.scrollHeight+"px")},methods:{toggleVisible:function(){this.$emit("pane-clicked",this)},beforeEnter:function(e){e.style.height="0"},enter:function(e){e.style.height=e.scrollHeight+"px"},beforeLeave:function(e){e.style.height=e.scrollHeight+"px"},leave:function(e){e.style.height="0"}},computed:{cardClass:function(){return["default"===this.type&&"z-depth-0 bordered","color"===this.type&&"border-0","photoBg"===this.type&&"mb-4"]},headerClass:function(){return["gradient"===this.type&&"rgba-stylish-strong z-depth-1 mb-1","picture"===this.type&&"blue lighten-3 z-depth-1","color"===this.type&&"z-depth-1 ".concat(this.color," lighten-").concat(4-this.order),"photoBg"===this.type&&"p-0"]},headingClass:function(){return["mb-0","gradient"===this.type&&"white-text text-uppercase font-thin","picture"===this.type&&"text-uppercase py-1 font-weight-bold white-text","icon"===this.type&&"mt-3 red-text","color"===this.type&&"black-text text-center font-weight-bold text-uppercase","photoBg"===this.type&&"text-uppercase white-text py-3 mt-1","table"===this.type&&"mt-1"]},bodyClass:function(){return["color"===this.type&&"rgba-".concat(this.color,"-strong white-text"),"gradient"===this.type&&"mb-1 rgba-grey-light white-text","photoBg"===this.type&&"rgba-black-light white-text z-depth-1"]},paragraphClass:function(){return["default"==this.type?"p-3":"p-4"]}}},le=se,de=le,ue=(n("59e7"),Object(_["a"])(de,l,d,!1,null,"7d7038a4",null)),ce=(ue.exports,{props:{tag:{type:String,default:"div"},default:{type:Boolean,defaul:!0},open:{type:Number,default:null},panes:{type:[Object,Array]},material:{type:Boolean,default:!1},gradient:{type:Boolean,default:!1},picture:{type:Boolean,default:!1},icon:{type:Boolean,default:!1},shades:{type:String,default:null},photoBg:{type:Boolean,default:!1},table:{type:Boolean,default:!1},hamburger:{type:Boolean}},data:function(){return{openPaneNum:null}},components:{mdbAccordionPane:se},mounted:function(){null!==this.open&&(this.openPaneNum=this.open)},methods:{handlePaneOpened:function(e){if(this.openPaneNum==e)return this.openPaneNum=null;this.openPaneNum=e}},computed:{outerAccodionClasses:function(){return["accordion",this.material&&"md-accordion",this.gradient&&"md-accordion accordion-2",this.picture&&"md-accordion accordion-1",this.icon&&"md-accordion accordion-3 z-depth-1-half",this.shades&&"md-accordion accordion-4",this.photoBg&&"md-accordion accordion-5",this.table&&"md-accordion accordion-blocks"]},style:function(){var e;return this.material&&(e="material"),this.gradient&&(e="gradient"),this.picture&&(e="picture"),this.icon&&(e="icon"),this.shades&&(e="color"),this.photoBg&&(e="photoBg"),this.photoBg&&(e="photoBg"),this.table&&(e="table"),e}}}),he=ce,fe=he,me=Object(_["a"])(fe,o,s,!1,null,"3762c46a",null),pe=(me.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{"enter-active-class":e.enterAnimationClasses,"leave-active-class":e.leaveAnimationClasses},on:{"before-enter":e.beforeEnterHook,enter:e.enterHook,"after-enter":e.afterEnterHook,"enter-cancelled":e.enterCancelledHook,"before-leave":e.beforeLeaveHook,leave:e.leaveHook,"after-leave":e.afterLeaveHook,"leave-cancelled":e.leaveCancelledHook}},[n("div",{class:e.alertClasses,attrs:{role:"alert"}},[e._t("default"),e.dismiss?n("button",{class:e.closeIconClass,attrs:{type:"button","data-dismiss":"alert","aria-label":"Close"},on:{click:e.closeAlert}},[n("span",{attrs:{"aria-hidden":"true"}},[e._v("×")])]):e._e()],2)])}),_e=[],ge={name:"Alert",props:{tag:{type:String,default:"div"},isOpen:{type:Boolean,default:!0},color:{type:String},dismiss:{type:Boolean},closeClass:{type:[String,Array,Object]},leaveAnimation:{type:String},enterAnimation:{type:String}},data:function(){return{}},methods:{closeAlert:function(){this.$emit("closeAlert",this)},beforeEnterHook:function(){this.$emit("beforeEnter",this)},enterHook:function(){this.$emit("enter",this)},afterEnterHook:function(){this.$emit("afterEnter",this)},enterCancelledHook:function(){this.$emit("enterCancelled",this)},beforeLeaveHook:function(){this.$emit("beforeLeave",this)},leaveHook:function(){this.$emit("leave",this)},afterLeaveHook:function(){this.$parent.$emit("afterLeave",this)},leaveCancelledHook:function(){this.$emit("leaveCancelled",this)}},computed:{alertClasses:function(){return["alert",this.color&&"alert-".concat(this.color)]},closeIconClass:function(){return["close",this.closeClass]},enterAnimationClasses:function(){return"animated ".concat(this.enterAnimation)},leaveAnimationClasses:function(){return"animated ".concat(this.leaveAnimation)}}},ye=ge,ve=ye,be=Object(_["a"])(ve,pe,_e,!1,null,null,null),Me=(be.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Le=[],ke=(n("caad"),{props:{tag:{type:String,default:"span"},color:{type:String,default:"default"},pill:{type:Boolean,default:!1}},computed:{className:function(){var e=["danger","warning","success","info","default","primary","secondary","elegant","stylish","unique","special"];return["badge",e.includes(this.color)?"".concat(this.color,"-color"):this.color,!!this.pill&&"badge-pill",this.mdbClass]}},mixins:[h["a"]]}),we=ke,xe=we,Ye=Object(_["a"])(xe,Me,Le,!1,null,"4039e640",null),Se=(Ye.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),De=[],Te={props:{tag:{type:String,default:"ol"},color:{type:String}},computed:{className:function(){return["breadcrumb",this.color&&"".concat(this.color,"-color")]}}},He=Te,Ce=He,Oe=(n("018f"),Object(_["a"])(Ce,Se,De,!1,null,null,null)),je=(Oe.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Pe=[],Ae={props:{tag:{type:String,default:"li"},active:{type:Boolean,default:!1}},computed:{className:function(){return["breadcrumb-item",this.active?"active":""]}}},Ee=Ae,Ie=Ee,Be=Object(_["a"])(Ie,je,Pe,!1,null,"4dd4ef6a",null),We=(Be.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,attrs:{role:"group"}},[e._t("default")],2)}),Fe=[],Ne={props:{tag:{type:String,default:"div"},vertical:{type:Boolean,default:!1},size:{type:String}},computed:{className:function(){return[this.vertical?"btn-group-vertical":"btn-group",this.size&&"btn-group-"+this.size]}}},ze=Ne,Re=ze,$e=Object(_["a"])(Re,We,Fe,!1,null,"f1f9bac4",null),Ve=($e.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,attrs:{role:"toolbar"}},[e._t("default")],2)}),Je=[],Ue={props:{tag:{type:String,default:"div"}},computed:{className:function(){return["btn-toolbar"]}}},Ge=Ue,qe=Ge,Xe=Object(_["a"])(qe,Ve,Je,!1,null,"00422082",null),Ke=(Xe.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Ze=[],Qe={props:{tag:{type:String,default:"div"},color:{type:String}},computed:{className:function(){return["avatar",this.color?this.color:""]}}},et=Qe,tt=et,nt=Object(_["a"])(tt,Ke,Ze,!1,null,"3223c09a",null),at=(nt.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),it=[],rt={props:{tag:{type:String,default:"div"},color:{type:String},textColor:{type:String},border:{type:String},transparent:{type:Boolean,default:!1}},computed:{className:function(){return["card-footer",this.color&&!this.textColor?this.color+" white-text":!!this.textColor&&this.color+" "+this.textColor+"-text",this.border&&"border-"+this.border,this.transparent&&"transparent"]}}},ot=rt,st=ot,lt=Object(_["a"])(st,at,it,!1,null,"74b3576a",null),dt=(lt.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),ut=[],ct={props:{tag:{type:String,default:"div"},deck:{type:Boolean,default:!1},column:{type:Boolean,defaul:!1}},computed:{className:function(){return[this.deck?"card-deck":this.column?"card-columns":"card-group"]}}},ht=ct,ft=ht,mt=Object(_["a"])(ft,dt,ut,!1,null,"66e3dabe",null),pt=(mt.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:{"ripple-parent":e.waves},on:{click:e.wave}},[n("img",{class:e.className,attrs:{src:e.src,alt:e.alt}})])}),_t=[],gt={props:{src:{type:String,required:!0},alt:{type:String},waves:{type:Boolean,default:!1},top:{type:Boolean}},computed:{className:function(){return["img-fluid",this.top&&"card-img-top"]}},mixins:[U["a"]]},yt=gt,vt=yt,bt=(n("e943"),Object(_["a"])(vt,pt,_t,!1,null,"6aeb6c78",null)),Mt=(bt.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Lt=[],kt={props:{tag:{type:String,default:"div"},color:{type:String},gradient:{type:String}},computed:{className:function(){return["card-up",this.color?this.color+"-color":"",this.gradient?this.gradient+"-gradient":""]}}},wt=kt,xt=wt,Yt=Object(_["a"])(xt,Mt,Lt,!1,null,"7c1db9cf",null),St=(Yt.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Dt=[],Tt={props:{tag:{type:String,default:"p"}},computed:{className:function(){return["card-text"]}}},Ht=Tt,Ct=Ht,Ot=Object(_["a"])(Ct,St,Dt,!1,null,"4e623858",null),jt=(Ot.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Pt=[],At={props:{tag:{type:String,default:"h4"}},computed:{className:function(){return["card-title"]}}},Et=At,It=Et,Bt=Object(_["a"])(It,jt,Pt,!1,null,"6dbf9a14",null);Bt.exports;var Wt=n("30ef"),Ft=n.n(Wt);function Nt(e,t){return{render:function(e){return e("div",{style:this.styles,class:this.cssClasses},[e("canvas",{attrs:{id:this.chartId,width:this.width,height:this.height},ref:"canvas"})])},props:{chartId:{default:e,type:String},width:{default:400,type:Number},height:{default:400,type:Number},cssClasses:{type:String,default:""},styles:{type:Object},plugins:{type:Array,default:function(){return[]}}},data:function(){return{_chart:null,_plugins:this.plugins}},methods:{addPlugin:function(e){this.$data._plugins.push(e)},generateLegend:function(){if(this.$data._chart)return this.$data._chart.generateLegend()},renderChart:function(e,n){this.$data._chart&&this.$data._chart.destroy(),this.$data._chart=new Ft.a(this.$refs.canvas.getContext("2d"),{type:t,data:e,options:n,plugins:this.$data._plugins})}},beforeDestroy:function(){this.$data._chart&&this.$data._chart.destroy()}}}var zt=Nt("bar-chart","bar"),Rt=Nt("horizontalbar-chart","horizontalBar"),$t=Nt("doughnut-chart","doughnut"),Vt=Nt("line-chart","line"),Jt=Nt("pie-chart","pie"),Ut=Nt("polar-chart","polarArea"),Gt=Nt("radar-chart","radar"),qt=Nt("bubble-chart","bubble"),Xt=Nt("scatter-chart","scatter"),Kt=n("a9be"),Zt=n.n(Kt);Ft.a.plugins.unregister(Zt.a);var Qt={extends:zt,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}};Ft.a.plugins.unregister(Zt.a);var en={extends:$t,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}};Ft.a.plugins.unregister(Zt.a);var tn={extends:Vt,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}};Ft.a.plugins.unregister(Zt.a);var nn={extends:Jt,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}};Ft.a.plugins.unregister(Zt.a);var an={extends:Ut,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}};Ft.a.plugins.unregister(Zt.a);var rn={extends:Gt,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}};Ft.a.plugins.unregister(Zt.a);var on={extends:qt,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}};Ft.a.plugins.unregister(Zt.a);var sn={extends:Xt,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}};Ft.a.plugins.unregister(Zt.a);var ln={extends:Rt,props:{data:Object,options:Object,datalabels:{type:Boolean,default:!1}},mounted:function(){this.datalabels&&this.addPlugin(J({},Zt.a)),this.data&&this.options&&this.renderChart(this.data,this.options)},watch:{data:function(e){this.renderChart(e,this.options)},options:function(e){this.renderChart(this.data,e)}}},dn=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._l(e.togglers,(function(t,a){return n(e.toggleTag[a],{key:a,tag:"component",class:e.btnClass,on:{click:function(t){t.preventDefault(),e.collapse=!e.collapse}}},[e._v(e._s(e.toggleText[a]))])})),n("transition",{on:{"before-enter":e.beforeEnter,enter:e.enter,"before-leave":e.beforeLeave,leave:e.leave}},[e.collapse?n("div",{ref:"collapseContent",staticClass:"collapse show collapse-item"},[e._t("default")],2):e._e()])],2)},un=[],cn={props:{toggleTag:{type:[String,Array],default:function(){return["button"]}},toggleClass:{type:[String,Array],default:function(){return["btn btn-primary"]}},togglers:{type:Number,default:1},toggleText:{type:[String,Array],default:function(){return["Toggle"]}}},data:function(){return{collapse:!0,height:0}},mounted:function(){this.height=this.$refs.collapseContent.clientHeight,this.collapse=!1},methods:{beforeEnter:function(e){e.style.height="0"},enter:function(e){e.style.height=e.scrollHeight+"px"},beforeLeave:function(e){e.style.height=e.scrollHeight+"px"},leave:function(e){e.style.height="0"}},computed:{btnClass:function(){return[this.toggleClass]}}},hn=cn,fn=hn,mn=(n("512e"),Object(_["a"])(fn,dn,un,!1,null,"1588c4ba",null)),pn=(mn.exports,n("9a03")),_n=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},gn=[],yn={props:{tag:{type:String,default:"div"},fluid:{type:Boolean,default:!1},freeBird:{type:Boolean,default:!1}},computed:{className:function(){return[this.fluid?"container-fluid":"container",this.freeBird?"free-bird":"",this.mdbClass]}},mixins:[h["a"]]},vn=yn,bn=vn,Mn=Object(_["a"])(bn,_n,gn,!1,null,"35ea163e",null),Ln=(Mn.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),kn=[],wn={props:{tag:{type:String,default:"div"},color:{type:String}},computed:{className:function(){return["edge-header",this.color?this.color:""]}}},xn=wn,Yn=xn,Sn=Object(_["a"])(Yn,Ln,kn,!1,null,"2bafe7a8",null),Dn=(Sn.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Tn=[],Hn={props:{tag:{type:String,default:"footer"},color:{type:String},marginTop:{type:Boolean,default:!0}},computed:{className:function(){return["page-footer",this.marginTop&&"mt-4",this.color?this.color:""]}}},Cn=Hn,On=Cn,jn=Object(_["a"])(On,Dn,Tn,!1,null,"4e56bdc0",null),Pn=(jn.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),An=[],En={props:{tag:{type:String,default:"form"},classes:{type:String}},computed:{className:function(){return["form-inline",this.classes]}}},In=En,Bn=In,Wn=Object(_["a"])(Bn,Pn,An,!1,null,"ad4a49de",null),Fn=(Wn.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"google-map",class:e.wrapperClass,style:e.wrapperStyle,attrs:{id:e.mapName}})}),Nn=[],zn=(n("d81d"),n("b0c0"),{name:"google-map",props:{name:{type:String,default:"default"},markerCoordinates:{type:Array},zoom:{type:Number,default:14},center:{type:Array},modal:{type:Boolean},styles:{type:Array},type:{type:String,default:"roadmap"},wrapperStyle:{type:[Array,String,Object]},wrapperClass:{type:[Array,String,Object]},manualInit:{type:Boolean}},data:function(){return{mapName:this.name+"-map",map:null,bounds:null,markers:[]}},mounted:function(){this.manualInit||this.initMap()},methods:{retrigger:function(){google.maps.event.trigger(this.map,"resize")},initMap:function(){var e=this;this.bounds=new google.maps.LatLngBounds;var t={latitude:40.725118,longitude:-73.997699};this.center?t=this.center[0]:this.markerCoordinates&&(t=this.markerCoordinates[0]);var n=document.getElementById(this.mapName),a={center:new google.maps.LatLng(t.latitude,t.longitude),zoom:this.zoom?this.zoom:15,styles:this.styles,mapTypeId:this.type};this.map=new google.maps.Map(n,a),this.markerCoordinates&&this.markerCoordinates.forEach((function(t){var n=new google.maps.LatLng(t.latitude,t.longitude),a=new google.maps.Marker({position:n,map:e.map,title:t.title});e.markers.push(a),e.zoom||e.map.fitBounds(e.bounds.extend(n))}))}},watch:{modal:function(){this.retrigger()}}}),Rn=zn,$n=Rn,Vn=(n("f928"),Object(_["a"])($n,Fn,Nn,!1,null,"64730d88",null)),Jn=(Vn.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Un=[],Gn={props:{tag:{type:String,default:"div"},fluid:{type:Boolean,default:!1}},computed:{className:function(){return["jumbotron",this.fluid?"jumbotron-fluid":""]}}},qn=Gn,Xn=qn,Kn=Object(_["a"])(Xn,Jn,Un,!1,null,"385959fe",null),Zn=(Kn.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Qn=[],ea={props:{tag:{type:String,default:"ul"},horizontal:{type:Boolean,default:!1},sm:{type:Boolean,default:!1},lg:{type:Boolean,default:!1},md:{type:Boolean,default:!1},xl:{type:Boolean,default:!1},flush:{type:Boolean,default:!1}},computed:{className:function(){return["list-group",this.horizontal?this.sm?"list-group-horizontal-sm":this.md?"list-group-horizontal-md":this.lg?"list-group-horizontal-lg":this.xl?"list-group-horizontal-xl":"list-group-horizontal":"",this.flush&&"list-group-flush"]}}},ta=ea,na=ta,aa=Object(_["a"])(na,Zn,Qn,!1,null,"f4bee86e",null),ia=(aa.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e.icon?n("mdb-icon",{class:e.iconClass,attrs:{icon:e.icon,far:e.far,regular:e.regular,fad:e.fad,duotone:e.duotone,fal:e.fal,light:e.light,fab:e.fab,brands:e.brands}}):e._e(),e.icon&&!e.social?n("div",{staticClass:"md-v-line"}):e._e(),e._t("default")],2)}),ra=[],oa=(n("c975"),{components:{mdbIcon:j["a"],mdbBtn:G["a"]},props:{tag:{type:String,default:"li"},action:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},active:{type:Boolean,default:!1},justifyContentBetween:{type:Boolean,default:!0},alignItemsCenter:{type:Boolean,default:!0},social:{type:Boolean,default:!1},circle:{type:Boolean,default:!1},iconColor:{type:String,default:"default-color"},color:String,icon:String,far:Boolean,regular:Boolean,light:Boolean,fal:Boolean,fad:Boolean,duotone:Boolean,fab:Boolean,brands:Boolean},computed:{iconClass:function(){return[this.social?"fa-2x list-item-btn mr-4 white-text":"pr-4",this.circle&&"rounded-circle",this.social&&this.iconColor]},className:function(){var e=["danger","warning","success","info","default","primary","secondary","dark","light"];return["list-group-item","d-flex",-1===e.indexOf(this.color)?this.color:"list-group-item-".concat(this.color),this.justifyContentBetween?this.icon?"justify-content-start":"justify-content-between":"",this.alignItemsCenter?"align-items-center":"",this.action?"list-group-item-action":"",this.disabled?"disabled":"",this.active?"active":""]}}}),sa=oa,la=sa,da=(n("a0bb"),Object(_["a"])(la,ia,ra,!1,null,"2fdeea68",null)),ua=(da.exports,n("1968")),ca=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)},ha=[],fa={props:{tag:{type:String,default:"div"}},computed:{className:function(){return["media"]}}},ma=fa,pa=ma,_a=Object(_["a"])(pa,ca,ha,!1,null,"10b10efe",null),ga=(_a.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),ya=[],va={props:{tag:{type:String,default:"div"}},computed:{className:function(){return["media-body"]}}},ba=va,Ma=ba,La=Object(_["a"])(Ma,ga,ya,!1,null,"1887c942",null),ka=(La.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,style:e.style,attrs:{href:e.href}},[n("img",{staticClass:"media-image",class:this.circle?"rounded-circle":"",attrs:{src:e.src,alt:e.alt}})])}),wa=[],xa={props:{tag:{type:String,default:"a"},src:{type:String,required:!0},alt:{type:String},align:{type:String,default:"top"},side:{type:String,default:"left"},href:{type:String,default:"#"},circle:{type:Boolean,default:!1},width:Number},computed:{className:function(){return["d-flex","right"===this.side?"ml-3":"mr-3","center"===this.align?"align-self-center":"bottom"===this.align?"align-self-end":"align-self-start"]},style:function(){return this.width?"width: ".concat(this.width,"px"):""}}},Ya=xa,Sa=Ya,Da=(n("cf69"),Object(_["a"])(Sa,ka,wa,!1,null,"1aa0778f",null)),Ta=(Da.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"fade"},on:{enter:e.enter,"after-enter":e.afterEnter,"before-leave":e.beforeLeave,"after-leave":e.afterLeave}},[e.show?n(e.tag,{tag:"component",class:e.wrapperClass,on:{click:function(t){return t.target!==t.currentTarget?null:e.away(t)}}},[n("div",{class:e.dialogClass,attrs:{role:"document"}},[n("div",{class:e.contentClass,style:e.computedContentStyle},[e._t("default")],2)])]):e._e()],1)}),Ha=[],Ca={props:{tag:{type:String,default:"div"},size:{type:String},side:{type:Boolean,default:!1},position:{type:String},fullHeight:{type:Boolean,default:!1},frame:{type:Boolean,default:!1},removeBackdrop:{type:Boolean,default:!1},centered:{type:Boolean,default:!1},cascade:{type:Boolean,default:!1},danger:{type:Boolean,default:!1},info:{type:Boolean,default:!1},success:{type:Boolean,default:!1},warning:{type:Boolean,default:!1},tabs:{type:Boolean,default:!1},avatar:{type:Boolean,default:!1},elegant:{type:Boolean,default:!1},dark:{type:Boolean,default:!1},bgSrc:{type:String,default:""},direction:{type:String,default:"top"},show:{type:Boolean,default:!0},scrollable:{type:Boolean,default:!1}},beforeMount:function(){"right"===this.direction?this.dialogTransform="translate(25%,0)":"bottom"===this.direction?this.dialogTransform="translate(0,25%)":"left"===this.direction&&(this.dialogTransform="translate(-25%,0)")},data:function(){return{dialogTransform:"translate(0,-25%)"}},methods:{away:function(){this.removeBackdrop||this.$emit("close",this)},enter:function(e){e.style.opacity=0,e.childNodes[0].style.transform=this.dialogTransform,this.$emit("show",this)},afterEnter:function(e){var t=this;e.style.opacity=1,e.childNodes[0].style.transform="translate(0,0)",setTimeout((function(){t.$emit("shown",t)}),400)},beforeLeave:function(e){this.$parent.$emit("hide",this),e.style.opacity=0,e.childNodes[0].style.transform=this.dialogTransform},afterLeave:function(){this.$parent.$emit("hidden",this)}},computed:{wrapperClass:function(){return["modal",this.removeBackdrop&&"modal-without-backdrop"]},dialogClass:function(){return["modal-dialog",this.size&&"modal-"+this.size,this.side&&"modal-side",this.fullHeight&&"modal-full-height",this.frame&&"modal-frame",this.position?"modal-"+this.position:"",this.centered&&"modal-dialog-centered",(this.cascade||this.tabs)&&"cascading-modal",this.danger&&"modal-notify modal-danger",this.info&&"modal-notify modal-info",this.success&&"modal-notify modal-success",this.warning&&"modal-notify modal-warning",this.avatar&&"modal-avatar cascading-modal",this.dark&&"form-dark",this.scrollable&&"modal-dialog-scrollable"]},contentClass:function(){return["modal-content",this.tabs&&"modal-c-tabs",this.elegant&&"form-elegant",this.dark&&"card card-image"]},computedContentStyle:function(){return!!this.bgSrc&&{"background-image":'url("'.concat(this.bgSrc,'")')}}}},Oa=Ca,ja=Oa,Pa=(n("64fb"),Object(_["a"])(ja,Ta,Ha,!1,null,"bfb6b926",null)),Aa=(Pa.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Ea=[],Ia={props:{tag:{type:String,default:"div"}},computed:{className:function(){return["modal-body"]}}},Ba=Ia,Wa=Ba,Fa=(n("8f40"),Object(_["a"])(Wa,Aa,Ea,!1,null,"c35b1502",null)),Na=(Fa.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),za=[],Ra={props:{tag:{type:String,default:"div"},start:{type:Boolean,default:!1},end:{type:Boolean,default:!1},center:{type:Boolean,default:!1},between:{type:Boolean,default:!1},around:{type:Boolean,default:!1}},computed:{className:function(){return["modal-footer",this.start&&"justify-content-start",this.end&&"justify-content-end",this.center&&"justify-content-center",this.between&&"justify-content-between",this.around&&"justify-content-around"]}}},$a=Ra,Va=$a,Ja=(n("db02"),Object(_["a"])(Va,Na,za,!1,null,"66808654",null)),Ua=(Ja.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default"),e.close?n("a",{staticClass:"close",attrs:{flat:""},on:{click:function(t){return t.preventDefault(),e.away(t)}}},[e._v("×")]):e._e()],2)}),Ga=[],qa={props:{tag:{type:String,default:"div"},close:{type:Boolean,default:!0},color:{type:String},textColor:{type:String},start:{type:Boolean,default:!1},end:{type:Boolean,default:!1},center:{type:Boolean,default:!1},between:{type:Boolean,default:!1},around:{type:Boolean,default:!1}},data:function(){return{isStyled:!1}},mounted:function(){(this.$parent._props.success||this.$parent._props.info||this.$parent._props.warning||this.$parent._props.danger)&&(this.isStyled=!0)},computed:{className:function(){return["modal-header",this.start&&"justify-content-start",this.end&&"justify-content-end",this.center&&"justify-content-center",this.between&&"justify-content-between",this.around&&"justify-content-around",this.color&&!this.textColor||this.isStyled?this.color+" white-text":!!this.textColor&&this.color+" "+this.textColor+"-text"]}},methods:{away:function(){this.$parent.$emit("close")}}},Xa=qa,Ka=Xa,Za=(n("4aed"),Object(_["a"])(Ka,Ua,Ga,!1,null,"135c83c0",null)),Qa=(Za.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),ei=[],ti=(n("cc71"),{props:{tag:{type:String,default:"h5"},bold:{type:Boolean,default:!1}},computed:{className:function(){return["modal-title",this.bold&&"font-weight-bold"]}}}),ni=ti,ai=ni,ii=Object(_["a"])(ai,Qa,ei,!1,null,null,null),ri=(ii.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:e.wrapperClasses},[e.icon?n("i",{class:e.iconClasses}):e._e(),e.$slots.prepend?n("div",{staticClass:"input-group-prepend"},[e._t("prepend")],2):e._e(),n(e.tag,{ref:"input",tag:"textarea",class:e.textareaClass,attrs:{type:e.type,placeholder:e.placeholder,disabled:e.disabled,rows:e.rows,"aria-label":e.label},on:{focus:e.focus,blur:e.blur,input:e.onInput,change:e.onChange},model:{value:e.innerValue,callback:function(t){e.innerValue=t},expression:"innerValue"}}),e.label?n("label",{ref:"label",class:e.labelClass,attrs:{for:e.id},on:{click:e.focus}},[e._v(e._s(e.label))]):e._e(),e._t("default"),e.$slots.append?n("div",{staticClass:"input-group-append"},[e._t("append")],2):e._e()],2)}),oi=[],si={props:{tag:{type:String,default:"textarea"},label:{type:String},icon:{type:String},type:{type:String},placeholder:{type:String},disabled:{type:Boolean,default:!1},rows:{type:[Number,String],default:1},value:{type:String,default:""},iconClass:{type:String},far:{type:Boolean,default:!1},regular:{type:Boolean,default:!1},fal:{type:Boolean,default:!1},light:{type:Boolean,default:!1},fab:{type:Boolean,default:!1},outline:{type:Boolean,default:!1},brands:{type:Boolean,default:!1},basic:{type:Boolean,default:!1},id:{type:String},wrapperClass:{type:[String,Array]}},data:function(){return{isTouched:!1,innerValue:this.value}},computed:{textareaClass:function(){return["form-control",!this.basic&&"md-textarea"]},wrapperClasses:function(){return[this.basic?"form-group":"md-form",this.outline&&"md-outline",this.doesItGetTheGroupClass&&"input-group",this.size&&this.doesItGetTheGroupClass?"input-group-".concat(this.size):!(!this.size||this.doesItGetTheGroupClass)&&"form-".concat(this.size),this.wrapperClass]},iconClasses:function(){return[this.far||this.regular?"far":this.fal||this.light?"fal":this.fab||this.brands?"fab":"fas","prefix fa-"+this.icon,this.isTouched&&"active",this.iconClass]},labelClass:function(){return[(this.isTouched||this.placeholder||""!==this.innerValue)&&"active",this.disabled&&"disabled"]},doesItGetTheGroupClass:function(){return this.$slots.prepend||this.$slots.append||this.basic}},mounted:function(){this.$emit("input",this.innerValue)},methods:{focus:function(e){this.$emit("focus",e),this.label&&!this.disabled&&(this.isTouched=!0,this.$refs.input.focus())},blur:function(e){this.$emit("blur",e),this.isTouched=!1,this.$refs.input.blur()},onChange:function(e){this.$emit("change",e.target.value),this.innerValue=e.target.value},onInput:function(e){this.$emit("input",e.target.value),this.innerValue=e.target.value}},watch:{value:function(e){this.$refs.input.value=e,this.innerValue=e,this.$emit("change",this.innerValue)}}},li=si,di=li,ui=Object(_["a"])(di,ri,oi,!1,null,"860a0a36",null),ci=(ui.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.navClass,on:{click:e.close}},[e.container?n("div",{staticClass:"container"},[e.toggler?n("button",{class:e.navTogglerClass,attrs:{type:"button","data-toggle":"collapse","data-target":e.target,"aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation"},on:{click:function(t){return t.stopPropagation(),e.onClick(t)}}},[e.animation?n("div",{ref:"animatedIcon",class:"animated-icon"+e.animation},[n("span"),n("span"),n("span"),"2"===e.animation?n("span"):e._e()]):n("span",{class:e.navTogglerIcon},[e.hamburger?n("mdb-icon",{class:e.togglerIconClass,attrs:{icon:e.togglerIcon,size:e.togglerSize,far:e.far,fal:e.fal,fab:e.fab,fad:e.fad}}):e._e()],1)]):e._e(),e._t("default")],2):e._e(),e.toggler&&!e.container?n("button",{class:e.navTogglerClass,attrs:{type:"button","data-toggle":"collapse","data-target":e.target,"aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation"},on:{click:function(t){return t.stopPropagation(),e.onClick(t)}}},[e.animation?n("div",{ref:"animatedIcon",class:"animated-icon"+e.animation},[n("span"),n("span"),n("span"),"2"===e.animation?n("span"):e._e()]):n("span",{class:e.navTogglerIcon},[e.hamburger?n("mdb-icon",{class:e.togglerIconClass,attrs:{icon:e.togglerIcon,size:e.togglerSize,far:e.far,fal:e.fal,fab:e.fab,fad:e.fad}}):e._e()],1)]):e._e(),e.container?e._e():e._t("default")],2)}),hi=[],fi={components:{mdbIcon:j["a"]},props:{tag:{type:String,default:"nav"},animation:{type:[Number,String],default:null},color:{type:String},dark:{type:Boolean,default:!1},light:{type:Boolean,default:!1},double:{type:Boolean,default:!1},expand:{type:String,default:"large"},hamburger:{type:Boolean},navIconClass:{type:String},position:{type:String},target:{type:String,default:"navbarSupportedContent"},togglerClass:{type:String},transparent:{type:Boolean},scrolling:{type:Boolean,default:!1},scrollingOffset:{type:Number,default:100},center:{type:Boolean,default:!1},toggler:{type:Boolean,default:!0},togglerIcon:{type:String,default:"bars"},togglerSize:{type:String,default:"1x"},far:{type:Boolean,default:!1},fal:{type:Boolean,default:!1},fab:{type:Boolean,default:!1},fad:{type:Boolean,default:!1},togglerIconClass:String,container:{type:Boolean,default:!1}},data:function(){return{scrolled:!1,toggleClicked:!0}},computed:{navClass:function(){var e=["primary","secondary","danger","warning","success","info","default","elegant","stylish","unique","special"];return["navbar",this.dark&&"navbar-dark",this.light&&"navbar-light",this.color&&!this.transparent&&-1!==e.indexOf(this.color)?this.color+"-color":"",this.color&&!this.transparent&&-1===e.indexOf(this.color)?this.color:"","small"===this.expand||"sm"===this.expand?"navbar-expand-sm":"medium"===this.expand||"md"===this.expand?"navbar-expand-md":"large"===this.expand||"lg"===this.expand?"navbar-expand-lg":"navbar-expand-xl","top"===this.position?"fixed-top":"bottom"===this.position?"fixed-bottom":"",this.scrolling&&"scrolling-navbar",this.double&&"double-nav",this.center&&"justify-content-center"]},navTogglerIcon:function(){return[this.hamburger?"":"navbar-toggler-icon",this.navIconClass]},navTogglerClass:function(){return["navbar-toggler",this.togglerClass]}},methods:{toggle:function(){var e=this;this.toggleClicked?(this.collapse.classList.toggle("show-navbar"),this.collapse.classList.remove("hide-navbar"),this.collapse.classList.toggle("collapse"),this.collapse.style.overflow="hidden",this.collapseOverflow=setTimeout((function(){e.collapse.style.overflow="initial"}),300),this.animation&&this.$refs.animatedIcon.classList.add("open"),this.toggleClicked=!1):(this.collapse.classList.add("hide-navbar"),this.collapse.classList.toggle("show-navbar"),this.collapse.style.overflow="hidden",this.collapseOverflow=setTimeout((function(){e.collapse.classList.toggle("collapse"),e.collapse.style.overflow="initial"}),300),this.animation&&this.$refs.animatedIcon.classList.remove("open"),this.toggleClicked=!0)},close:function(e){var t=this;window.innerWidth>990||!this.toggler||e.target.classList.contains("dropdown-toggle")||"INPUT"!==e.target.tagName&&(this.collapse.classList.add("hide-navbar"),this.collapse.classList.remove("show-navbar"),this.collapse.style.overflow="hidden",this.collapseOverflow=setTimeout((function(){t.collapse.classList.add("collapse"),t.collapse.style.overflow="initial"}),300),this.animation&&this.$refs.animatedIcon.classList.remove("open"),this.toggleClicked=!0)},handleScroll:function(){this.scrolling&&(window.scrollY>this.scrollingOffset&&!1===this.scrolled?(this.$el.style.paddingTop="5px",this.$el.style.paddingBottom="5px",this.transparent&&this.$el.classList.add("".concat(this.color,"-color")),this.$el.classList.add("top-nav-collapse"),this.scrolled=!0):window.scrollY<this.scrollingOffset&&!0===this.scrolled&&(this.$el.style.paddingTop="12px",this.$el.style.paddingBottom="12px",this.transparent&&this.$el.classList.remove("".concat(this.color,"-color")),this.$el.classList.remove("top-nav-collapse"),this.scrolled=!1))},onClick:function(e){(e.target.classList.contains("navbar-toggler")||e.target.parentNode.classList.contains("navbar-toggler"))&&this.toggle()},searchForCollapseContent:function(e){"undefined"!==typeof e.attributes&&"undefined"!==typeof e.attributes.id&&e.id===this.target&&(this.collapse=e,this.collapse.classList.add("collapse"))}},mounted:function(){var e=this;window.addEventListener("scroll",this.handleScroll),this.$slots.default.forEach((function(t){t.elm.id===e.target?(e.collapse=t.elm,e.collapse.classList.add("collapse")):(e.children=t.elm.childNodes,e.children.forEach((function(t){e.searchForCollapseContent(t),t.childNodes.forEach((function(t){e.searchForCollapseContent(t),t.childNodes.forEach((function(t){e.searchForCollapseContent(t)}))}))})))}))},beforeDestroy:function(){document.removeEventListener("click",this.onClick),window.removeEventListener("scroll",this.handleScroll)}},mi=fi,pi=mi,_i=(n("eac0"),Object(_["a"])(pi,ci,hi,!1,null,"2b9910e1",null)),gi=(_i.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:e.wrapperClass,on:{click:e.wave}},[e.to?n("router-link",e._b({staticClass:"navbar-brand",attrs:{to:e.to}},"router-link",e.$attrs,!1),[e._t("default")],2):n(e.tag,e._b({tag:"component",staticClass:"navbar-brand",on:{click:e.wave}},"component",e.$attrs,!1),[e._t("default")],2)],1)}),yi=[],vi={props:{tag:{type:String,default:"div"},to:[String,Object],waves:{type:Boolean,default:!1}},computed:{wrapperClass:function(){return this.waves&&"ripple-parent"}},mixins:[U["a"]]},bi=vi,Mi=bi,Li=Object(_["a"])(Mi,gi,yi,!1,null,"39e892d4",null),ki=(Li.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,attrs:{id:e.id}},[e._t("default")],2)}),wi=[],xi={props:{tag:{type:String,default:"nav"},id:{type:String,default:"navbarSupportedContent"}},computed:{className:function(){return["navbar-collapse"]}}},Yi=xi,Si=Yi,Di=(n("16f9"),Object(_["a"])(Si,ki,wi,!1,null,"b87b353c",null)),Ti=(Di.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{ref:"navItem",tag:"component",class:e.className,on:{click:function(t){return e.handleClick(t)}}},[e.to?n("router-link",{class:e.anchorClassName,attrs:{tag:"a",exact:e.exact,"active-class":"active","exact-active-class":"active",to:e.to,target:e.tab}},[e.icon?n("mdb-icon",{attrs:{far:e.far,fab:e.fab,fad:e.fad,fal:e.fal,icon:e.icon}}):e._e(),e.icon?n("span",{staticClass:"clearfix d-none d-sm-inline-block"},[e._t("default")],2):e._t("default")],2):n("a",{class:e.anchorClassName,attrs:{href:e.href,target:e.tab}},[e.icon?n("mdb-icon",{attrs:{far:e.far,fab:e.fab,fad:e.fad,fal:e.fal,icon:e.icon}}):e._e(),e.icon?n("span",{staticClass:"clearfix d-none d-sm-inline-block"},[e._t("default")],2):e._t("default")],2)],1)}),Hi=[],Ci=(n("2532"),{components:{mdbIcon:j["a"]},props:{tag:{type:String,default:"li"},active:{type:Boolean,default:!1},disabled:{type:Boolean},exact:{type:Boolean,default:!1},href:{type:String},newTab:{type:Boolean,default:!1},to:[String,Object],waves:{type:Boolean,default:!0},anchorClass:{type:String},icon:{type:String},far:{type:Boolean,default:!1},fab:{type:Boolean,default:!1},fad:{type:Boolean,default:!1},fal:{type:Boolean,default:!1}},data:function(){return{isNavFixed:!1}},computed:{className:function(){return["nav-item",this.waves&&"ripple-parent"]},anchorClassName:function(){return[{"nav-link":!0,"navbar-link":!0,disabled:this.disabled,active:this.active},this.anchorClass]},tab:function(){return!!this.newTab&&"_blank"}},methods:{handleClick:function(e){this.$emit("click",e),this.wave(e)}},mounted:function(){var e=this.$refs.navItem;while(e.parentNode){if(e.className.includes("fixed")){this.isNavFixed=!0;break}e=e.parentNode}},mixins:[U["a"]]}),Oi=Ci,ji=Oi,Pi=Object(_["a"])(ji,Ti,Hi,!1,null,"5bd92072",null),Ai=(Pi.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Ei=[],Ii={props:{tag:{type:String,default:"ul"},nav:{type:Boolean,default:!1},right:{type:Boolean,default:!1},center:{type:Boolean,default:!1},vertical:{type:Boolean,default:!1},justifyAround:{type:Boolean,default:!1}},computed:{className:function(){return[this.nav?"nav":"navbar-nav",this.right?"ml-auto":this.center?"justify-content-center w-100":this.vertical?"flex-column":this.justifyAround?"justify-content-around w-100":"mr-auto"]}}},Bi=Ii,Wi=Bi,Fi=Object(_["a"])(Wi,Ai,Ei,!1,null,"1c8503c4",null),Ni=(Fi.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:e.wrapper},[n("vue-numeric",{class:e.className,attrs:{"empty-value":e.emptyValue,min:e.min,max:e.max,minus:e.minus,precision:e.precision,placeholder:e.placeholder,type:"number"},model:{value:e.number,callback:function(t){e.number=t},expression:"number"}})],1)}),zi=[],Ri=n("d85e"),$i=n.n(Ri),Vi={props:{emptyValue:{type:Number,default:0},min:{type:Number},max:{type:Number},precision:{type:Number},placeholder:{type:String},separator:{type:String,default:","},minus:{type:Boolean,default:!1},basic:{type:Boolean,default:!1}},components:{VueNumeric:$i.a},computed:{className:function(){return["form-control"]},wrapper:function(){return[!this.basic&&"md-form"]}},data:function(){return{number:""}},watch:{number:function(){this.$emit("input",this.number)}}},Ji=Vi,Ui=Ji,Gi=Object(_["a"])(Ui,Ni,zi,!1,null,"00fd7a7b",null),qi=(Gi.exports,n("2b57")),Xi=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,on:{click:e.wave}},[e.prev?n("a",{staticClass:"page-link",attrs:{href:"#","aria-label":"Previous"}},[n("span",{attrs:{"aria-hidden":"true"}},[e._v("«")]),n("span",{staticClass:"sr-only"},[e._v("Previous")])]):e._e(),e.next?n("a",{staticClass:"page-link",attrs:{href:"#","aria-label":"Next"}},[n("span",{attrs:{"aria-hidden":"true"}},[e._v("»")]),n("span",{staticClass:"sr-only"},[e._v("Next")])]):e._e()])},Ki=[],Zi={props:{tag:{type:String,default:"li"},active:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},href:{type:String},waves:{type:Boolean,default:!0},prev:{type:Boolean,default:!1},next:{type:Boolean,default:!1}},computed:{className:function(){return["page-item",!!this.active&&"active",!!this.disabled&&"disabled",!!this.waves&&"ripple-parent"]}},mixins:[U["a"]]},Qi=Zi,er=Qi,tr=Object(_["a"])(er,Xi,Ki,!1,null,"240ac06f",null),nr=(tr.exports,n("e601")),ar=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("span",[n("transition",{on:{"after-leave":e.doDestroy}},[n("span",{ref:"popper",class:{show:!e.disabled&&e.showPopper}},[e.$slots.header||e.$slots.body?n("div",{ref:"popover",staticClass:"popover",style:"max-width: "+e.maxWidth+"px;"},[e.$slots.header?n("div",{staticClass:"popover-header"},[e._t("header")],2):e._e(),e.$slots.body?n("div",{staticClass:"popover-body"},[e._t("body")],2):e._e()]):e._e(),e._t("default")],2)]),e._t("reference")],2)},ir=[],rr=(n("cca6"),n("f0bd")),or=function(e,t,n){e&&t&&n&&(document.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n))},sr=function(e,t,n){e&&t&&(document.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n))},lr={props:{trigger:{type:String,default:"click",validator:function(e){return["click","hover"].indexOf(e)>-1}},delayOnMouseOut:{type:Number,default:10},disabled:{type:Boolean,default:!1},enterActiveClass:String,leaveActiveClass:String,boundariesSelector:String,reference:{},forceShow:{type:Boolean,default:!1},close:Boolean,appendToBody:{type:Boolean,default:!1},visibleArrow:{type:Boolean,default:!0},transition:{type:String,default:""},options:{type:Object,default:function(){return{}}},maxWidth:{type:Number,default:276}},data:function(){return{referenceElm:null,popperJS:null,showPopper:!1,currentPlacement:"",popperOptions:{placement:"bottom",gpuAcceleration:!1}}},computed:{popoverStyle:function(){return"max-width: ".concat(this.maxWidth," px!important")}},watch:{showPopper:function(e){e?(this.$emit("show"),this.updatePopper()):this.$emit("hide")},close:function(e){e&&this.doClose()},forceShow:{handler:function(e){this[e?"doShow":"doClose"]()},immediate:!0}},created:function(){this.appendedArrow=!1,this.appendedToBody=!1,this.popperOptions=Object.assign(this.popperOptions,this.options)},mounted:function(){switch(this.referenceElm=this.reference||this.$slots.reference[0].elm,this.popover=this.$refs.popover||this.$slots.default[0].elm,this.trigger){case"click":or(this.referenceElm,"click",this.doToggle),or(document,"click",this.handleDocumentClick);break;case"hover":or(this.referenceElm,"mouseover",this.onMouseOver),or(this.popover,"mouseover",this.onMouseOver),or(this.referenceElm,"mouseout",this.onMouseOut),or(this.popover,"mouseout",this.onMouseOut);break}},methods:{doToggle:function(){this.forceShow||(this.showPopper=!this.showPopper)},doShow:function(){this.showPopper=!0},doClose:function(){this.showPopper=!1},doDestroy:function(){this.showPopper||(this.popperJS&&(this.popperJS.destroy(),this.popperJS=null),this.appendedToBody&&(this.appendedToBody=!1,document.body.removeChild(this.popover.parentElement)))},createPopper:function(){var e=this;this.$nextTick((function(){if(e.visibleArrow&&e.appendArrow(e.popover),e.appendToBody&&!e.appendedToBody&&(e.appendedToBody=!0,document.body.appendChild(e.popover.parentElement)),e.popperJS&&e.popperJS.destroy&&e.popperJS.destroy(),e.boundariesSelector){var t=document.querySelector(e.boundariesSelector);t&&(e.popperOptions.modifiers=Object.assign({},e.popperOptions.modifiers),e.popperOptions.modifiers.preventOverflow=Object.assign({},e.popperOptions.modifiers.preventOverflow),e.popperOptions.modifiers.preventOverflow.boundariesElement=t)}e.popperOptions.onCreate=function(){e.$emit("created",e),e.$nextTick(e.updatePopper)},e.popperJS=new rr["a"](e.referenceElm,e.popover,e.popperOptions)}))},destroyPopper:function(){sr(this.referenceElm,"click",this.doToggle),sr(this.referenceElm,"mouseup",this.doClose),sr(this.referenceElm,"mousedown",this.doShow),sr(this.referenceElm,"focus",this.doShow),sr(this.referenceElm,"blur",this.doClose),sr(this.referenceElm,"mouseout",this.onMouseOut),sr(this.referenceElm,"mouseover",this.onMouseOver),sr(document,"click",this.handleDocumentClick),this.showPopper=!1,this.doDestroy()},appendArrow:function(e){if(!this.appendedArrow){this.appendedArrow=!0;var t=document.createElement("div");t.setAttribute("x-arrow",""),t.className="popover_arrow",e.appendChild(t)}},updatePopper:function(){this.popperJS?this.popperJS.scheduleUpdate():this.createPopper()},onMouseOver:function(){this.showPopper=!0,clearTimeout(this._timer)},onMouseOut:function(){var e=this;this._timer=setTimeout((function(){e.showPopper=!1}),this.delayOnMouseOut)},handleDocumentClick:function(e){this.$el&&this.referenceElm&&!this.$el.contains(e.target)&&!this.referenceElm.contains(e.target)&&this.popover&&!this.popover.contains(e.target)&&(this.$emit("documentClick"),this.forceShow||(this.showPopper=!1))}},destroyed:function(){this.destroyPopper()}},dr=lr,ur=dr,cr=(n("3300"),Object(_["a"])(ur,ar,ir,!1,null,null,null)),hr=(cr.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,style:e.style},[n(e.barTag,{tag:"component",class:e.barClassName,style:[{width:(e.value-e.min)/(e.max-e.min)*100+"%"}],attrs:{role:"progressbar","aria-valuenow":e.value,"aria-valuemin":e.min,"aria-valuemax":e.max}},[e._t("default")],2)],1)}),fr=[],mr={props:{tag:{type:String,default:"div"},barTag:{type:String,default:"div"},height:{type:Number},bgColor:{type:String},value:{type:Number,default:0},striped:{type:Boolean,default:!1},color:{type:String},animated:{type:Boolean,default:!1},indeterminate:{type:Boolean,default:!1},min:{type:Number,default:0},max:{type:Number,default:100}},computed:{className:function(){return["progress md-progress",this.bgColor&&this.bgColor]},barClassName:function(){return[this.indeterminate?"indeterminate":"progress-bar",this.striped?"progress-bar-striped":"",this.color?["bg-"+this.color,this.color]:"",this.animated?"progress-bar-animated":""]},style:function(){return{height:this.height+"px"}}}},pr=mr,_r=pr,gr=(n("aa88"),Object(_["a"])(_r,hr,fr,!1,null,"565d3256",null)),yr=(gr.exports,n("c8b9")),vr=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n(e.tag,{tag:"component",class:e.className,style:"z-index:"+e.zIndex},e._l(e.filteredLinks,(function(t,a){return n("li",{key:a,staticClass:"nav-item"},[t.dropdown?n("mdb-dropdown",{style:e.justify&&{display:"block"}},[n("mdb-dropdown-toggle",{class:t.class,attrs:{slot:"toggle",tag:"a",color:e.pills?"":e.color,navLink:""},slot:"toggle"},[e._v(e._s(t.text))]),n("mdb-dropdown-menu",{attrs:{color:e.color}},e._l(t.dropdownItems,(function(t,a){return n("div",{key:a},[t.divider?n("div",{staticClass:"dropdown-divider"}):n("mdb-dropdown-item",{attrs:{href:t.href,target:t.target}},[e._v(e._s(t.text))])],1)})),0)],1):n("a",{class:["nav-link ripple-parent",a===e.activeTab&&"active",!0===t.disabled&&"disabled"],attrs:{href:"#",role:"tab"},on:{click:[function(t){return t.preventDefault(),e.changeTab(a)},e.wave]}},[t.icon?n("mdb-icon",{class:[t.bigIcon?"pb-2":"pr-1",t.iconClass],attrs:{icon:t.icon,fab:t.fab,far:t.far,fal:t.fal,fad:t.fad,fas:!t.fab&&!t.far&&!t.fal&&!t.fad,size:t.bigIcon&&"2x"}}):e._e(),t.bigIcon?n("br"):e._e(),e._v(" "+e._s(t.text)+" ")],1)],1)})),0),e.content||e.hasSlots?n("div",{class:e.contentClass,style:{"z-index":e.zIndex-1,height:e.height,transition:"height "+e.transitionDuration+"s "+e.transitionStyle}},[n("transition-group",{on:{enter:e.enter,leave:e.leave}},e._l(e.filteredLinks,(function(t){return n("div",{directives:[{name:"show",rawName:"v-show",value:t.index===e.activeTab,expression:"link.index === activeTab"}],key:t.index,staticClass:"tab-pane animated fadeIn",style:{position:(t.index===e.activeTab?"relative":"absolute")+";",top:0,left:0,"z-index":t.index===e.activeTab?"1":"-1",transitionDuration:e.transitionDuration,transitionStyle:e.transitionStyle}},[e.content?n("p",{staticClass:"p-0 m-0",domProps:{innerHTML:e._s(e.content[t.index])}}):e._t(t.slot||t.text)],2)})),0)],1):e._e()],1)},br=[];n("cb29"),n("4fad");function Mr(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function Lr(e){if(Array.isArray(e))return Mr(e)}n("e01a"),n("d28b"),n("a630"),n("e260"),n("d3b7"),n("3ca3"),n("ddb0");function kr(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}n("fb6a"),n("25f0");function wr(e,t){if(e){if("string"===typeof e)return Mr(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Mr(e,t):void 0}}function xr(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function Yr(e){return Lr(e)||kr(e)||wr(e)||xr()}var Sr={components:{mdbDropdown:P["mdbDropdown"],mdbDropdownToggle:q,mdbDropdownMenu:I,mdbDropdownItem:ne,mdbIcon:j["b"]},props:{tag:{type:String,default:"ul"},links:{type:[String,Array],default:function(){return[]}},active:{type:Number,default:0},content:{type:[String,Array]},color:{type:String},pills:{type:Boolean},tabs:{type:Boolean},vertical:{type:Boolean},justify:{type:Boolean},header:{type:Boolean},navClass:{type:String},card:{type:Boolean},zIndex:{type:Number,default:1},border:{type:Boolean},default:{type:Boolean},fill:{type:Boolean},transitionDuration:{type:Number,default:.4},transitionStyle:{type:String,default:"ease-out"},minHeight:{type:Number,default:0},gradient:{type:String},rounded:{type:Boolean},outline:{type:String}},data:function(){return{activeTab:-1,tabLinks:[],height:"100px"}},computed:{filteredLinks:function(){return"string"===typeof this.links?this.tabLinks.push({text:this.links}):this.tabLinks=Yr(this.links),this.tabLinks.map((function(e,t){return e.index=t,e}))},hasSlots:function(){return 0!==Object.entries(this.$slots).length&&this.$slots.constructor===Object},className:function(){return["nav",this.default&&"nav-tabs",this.tabs&&"nav-tabs md-tabs",this.justify&&"nav-justified",this.pills&&"nav-pills md-pills",this.fill&&"nav-fill",this.vertical&&"flex-column",this.pills&&this.color?"pills-"+this.color:!this.pills&&this.color?"tabs-"+this.color:null,this.pills&&this.gradient?"pills-"+this.gradient+"-gradient":null,this.rounded&&"pills-rounded",this.outline&&"pills-outline-"+this.outline,this.header&&"nav-pills card-header-pills",this.navClass]},contentClass:function(){return["tab-content",this.card&&"card",this.vertical&&"vertical",this.border&&"border-right border-bottom border-left rounded-bottom"]}},methods:{changeTab:function(e){this.activeTab=e,this.$emit("activeTab",this.activeTab)},enter:function(e,t){var n=this;setTimeout((function(){n.height=e.scrollHeight+"px"})),t()},leave:function(e,t){t()}},mounted:function(){this.activeTab=this.active},watch:{active:function(e){this.activeTab=e}},mixins:[U["a"]]},Dr=Sr,Tr=Dr,Hr=(n("03be"),Object(_["a"])(Tr,vr,br,!1,null,"0b9a1d72",null)),Cr=(Hr.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[e._t("default")],2)}),Or=[],jr={props:{tag:{type:String,default:"ul"},color:{type:String},pills:{type:Boolean},tabs:{type:Boolean},vertical:{type:Boolean},justify:{type:Boolean},classes:{type:String},header:{type:Boolean},default:{type:Boolean}},computed:{className:function(){return["nav",this.default&&"nav-tabs",this.tabs&&"nav-tabs md-tabs",this.justify&&"nav-justified",this.pills&&"md-pills",this.vertical?"flex-column":"",this.pills&&this.color?"pills-"+this.color:!(this.pills||!this.color)&&"tabs-"+this.color,!!this.classes&&this.classes,this.header&&"nav-pills card-header-pills"]}}},Pr=jr,Ar=Pr,Er=Object(_["a"])(Ar,Cr,Or,!1,null,"352776ca",null),Ir=(Er.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[n("transition",{on:{"before-enter":e.beforeEnter,enter:e.enter,"before-leave":e.beforeLeave,leave:e.leave}},[n("keep-alive",[e._t("default")],2)],1)],1)}),Br=[],Wr={props:{tag:{type:String,default:"div"},vertical:{type:Boolean,default:!1}},methods:{beforeEnter:function(e){e.style.height="0",e.style.opacity="0"},enter:function(e){e.style.height=e.scrollHeight+"px",e.style.opacity="1"},beforeLeave:function(e){e.style.height=e.scrollHeight+"px",e.style.opacity="1"},leave:function(e){e.style.height="0",e.style.opacity="0"}},computed:{className:function(){return["tab-content",this.vertical&&"vertical"]}}},Fr=Wr,Nr=Fr,zr=(n("66ff"),Object(_["a"])(Nr,Ir,Br,!1,null,"31a7c8ec",null)),Rr=(zr.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[n("a",{class:e.anchorClass,attrs:{href:e.href,role:"tab"}},[e.icon?n("i",{class:e.iconClass}):e._e(),e._t("default")],2)])}),$r=[],Vr={mixnins:[j["a"]],props:{tag:{type:String,default:"li"},active:{type:Boolean,default:!1},icon:{type:String},iconClass:{type:String},disabled:{type:Boolean},href:{type:String,default:"#"}},computed:{className:function(){return["nav-item"]},anchorClass:function(){return["nav-link",this.disabled&&"disabled",this.active&&"active"]}}},Jr=Vr,Ur=Jr,Gr=Object(_["a"])(Ur,Rr,$r,!1,null,"e495d1f4",null),qr=(Gr.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className,attrs:{role:"tabpanel"}},[n("p",[e._t("default")],2)])}),Xr=[],Kr={props:{tag:{type:String,default:"div"},classes:{type:String}},computed:{className:function(){return["tab-pane active collapse-item",this.classes]}}},Zr=Kr,Qr=Zr,eo=(n("ee13"),Object(_["a"])(Qr,qr,Xr,!1,null,"d99adc4a",null)),to=(eo.exports,n("3a3c")),no=n("6583"),ao=n("2a95"),io=n("291c"),ro=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("perfect-scrollbar",{class:e.className,style:e.scrollStyles,attrs:{options:e.settings}},[e._t("default")],2)},oo=[],so=n("a4a1"),lo=(n("f6b9"),{components:{PerfectScrollbar:so["PerfectScrollbar"]},props:{wheelSpeed:{type:Number,default:1},wheelPropagation:{type:Boolean,default:!1},swipeEasing:{type:Boolean,default:!0},minScrollbarLength:{type:Number,default:null},maxScrollbarLength:{type:Number,default:null},scrollingThreshold:{type:Number,default:1e3},useBothWheelAxes:{type:Boolean,default:!1},suppressScrollX:{type:Boolean,default:!1},suppressScrollY:{type:Boolean,default:!1},scrollXMarginOffset:{type:Number,default:0},scrollYMarginOffset:{type:Number,default:0},scrollClass:{type:String},scrollStyle:{type:String},width:{type:String,default:"100%"},height:{type:String,default:"100%"}},data:function(){return{name:"Scrollbar",yRail:null,settings:{wheelSpeed:this.wheelSpeed,wheelPropagation:this.wheelPropagation,swipeEasing:this.swipeEasing,minScrollbarLength:this.minScrollbarLength,maxScrollbarLength:this.maxScrollbarLength,scrollingThreshold:this.scrollingThreshold,useBothWheelAxes:this.useBothWheelAxes,suppressScrollX:this.suppressScrollX,suppressScrollY:this.suppressScrollY,scrollXMarginOffset:this.scrollXMarginOffset,scrollYMarginOffset:this.scrollYMarginOffset}}},computed:{className:function(){return[this.scrollClass]},scrollStyles:function(){return this.scrollStyle}},mounted:function(){this.setStyle("width",this.width),this.setStyle("height",this.height)},methods:{setStyle:function(e,t){this.$el.style[e]=t}}}),uo=lo,co=uo,ho=Object(_["a"])(co,ro,oo,!1,null,null,null),fo=(ho.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,e._b({tag:"component",staticClass:"stretched-link"},"component",e.$attrs,!1),[e._t("default")],2)}),mo=[],po={props:{tag:{type:String,default:"a"}}},_o=po,go=_o,yo=Object(_["a"])(go,fo,mo,!1,null,"4b689fba",null),vo=(yo.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{"enter-active-class":"animated fadeIn","leave-active-class":"animated "}},[e.showing?n("div",{staticClass:"toast",attrs:{role:"alert","aria-live":"assertive","aria-atomic":"true"}},[n("div",{staticClass:"toast-header"},[n("mdb-icon",{staticClass:"mr-2",attrs:{icon:e.icon,color:e.iconColor,size:e.iconSize}}),n("strong",{staticClass:"mr-auto"},[e._v(e._s(e.title))]),e.time?n("small",{staticClass:"text-muted"},[e._v(e._s(e.calculatedTime))]):e._e(),n("button",{staticClass:"ml-2 mb-1 close",attrs:{type:"button","data-dismiss":"toast","aria-label":"Close"},on:{click:e.closeToast}},[n("mdb-icon",{attrs:{size:"xs",icon:"times"}})],1)],1),n("div",{staticClass:"toast-body"},[e._v(" "+e._s(e.message)+" ")])]):e._e()])}),bo=[],Mo={name:"Notification",components:{mdbBtn:G["a"],mdbIcon:j["a"]},props:{time:{type:Boolean,default:!0},show:{type:Boolean,default:!1},message:{type:String,default:""},title:{type:String,default:""},icon:{type:String,default:"square"},iconSize:{type:String,default:"lg"},iconColor:{type:String,default:"primary"},received:Date},data:function(){return{currentTime:"",startTime:"",showNotification:this.show,interval:null}},computed:{showing:{get:function(){return this.showNotification},set:function(e){this.showNotification=e}},calculatedTime:function(){var e=(this.currentTime-this.startTime)/1e3;return this.formatTime(e)}},methods:{updateTime:function(){this.currentTime=(new Date).getTime()},formatTime:function(e){var t,n,a;switch(!0){case e<60:return"now";case e<3600:return t=Math.floor(e/60),"".concat(t," min ago");case e>=3600&&e<86400:return n=Math.floor(e/3600),"".concat(n," h ago");case e>=86400:return a=Math.floor(e/86400),"".concat(a," d ago")}},closeToast:function(){this.showing=!1}},mounted:function(){var e=this.received||new Date;this.startTime=e.getTime(),this.currentTime=(new Date).getTime(),this.interval=window.setInterval(this.updateTime,6e4)},beforeDestroy:function(){window.clearInterval(this.interval)}},Lo=Mo,ko=Lo,wo=(n("b4f5"),Object(_["a"])(ko,vo,bo,!1,null,"4e564f56",null)),xo=(wo.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{ref:"masonry",tag:"component",class:e.masonryClass,style:e.masonryStyle},[e._t("default")],2)}),Yo=[],So=(n("13d5"),{props:{tag:{type:String,default:"div"},horizontal:{type:Boolean,default:!1},responsive:{type:Boolean,default:!1},flexbox:{type:Boolean,default:!1},maxHeight:{type:[String,Number],default:"auto"},numCols:{type:Number}},data:function(){return{height:null}},computed:{masonryClass:function(){return[this.horizontal||this.flexbox?this.flexbox?"masonry-with-flex":"masonry-horizontal":"masonry-with-columns"]},masonryStyle:function(){return{maxHeight:this.height?isNaN(this.height)?this.height:"".concat(this.height,"px"):null}}},methods:{checkScreenSize:function(){if(window.innerWidth<600)this.height=null;else if(window.innerWidth<1200){var e=this.$slots.default.filter((function(e){return e.tag})).map((function(e){return e.elm.clientWidth})),t=Math.floor(e.length/2),n=e.slice(0,t).reduce((function(e,t){return e+t})),a=e.slice(t).reduce((function(e,t){return e+t}));this.height=n>a?n:a}else this.height=this.maxHeight}},mounted:function(){var e=this;if(this.responsive?(setTimeout(this.checkScreenSize,200),window.addEventListener("resize",this.checkScreenSize)):this.height=this.maxHeight,!this.horizontal&&!this.flexbox){var t=Array(this.numCols).fill(0),n=this.$refs.masonry;Array.from(n.children).forEach((function(n,a){var i=a%e.numCols;n.style.order=i,t[i]+=parseFloat(n.clientHeight)})),n.style.height=Math.max.apply(Math,Yr(t))+"px"}},beforeDestroy:function(){this.responsive&&window.removeEventListener("resize",this.checkScreenSize)}}),Do=So,To=Do,Ho=(n("ccbd"),Object(_["a"])(To,xo,Yo,!1,null,"5f39a78a",null)),Co=(Ho.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{appear:"",name:"slide"}},[n(e.tag,{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],tag:"component",style:e.style},[e.src?n("img",{staticClass:"masonry-image",attrs:{src:e.src}}):e._t("default")],2)],1)}),Oo=[],jo=(n("c96a"),{props:{tag:{type:String,default:"div"},order:{type:[String,Number],default:0},itemStyle:{type:Object},src:String},data:function(){return{small:!1,medium:!1,show:!0}},computed:{style:function(){var e=this.small?J({},this.itemStyle,{width:"100%"}):this.medium?J({},this.itemStyle,{width:"50%"}):this.itemStyle;return J({order:this.order},e)},isResponsive:function(){return this.$parent.responsive}},methods:{checkScreenSize:function(){window.innerWidth<600?(this.small=!0,this.medium=!1):window.innerWidth<1200?(this.medium=!0,this.small=!1):(this.small=!1,this.medium=!1)}},mounted:function(){this.isResponsive&&(this.checkScreenSize(),window.addEventListener("resize",this.checkScreenSize))},beforeDestroy:function(){this.isResponsive&&window.removeEventListener("resize",this.checkScreenSize)},watch:{small:function(e,t){var n=this;e!==t&&(this.show=!1,setTimeout((function(){n.show=!0}),300))},medium:function(e,t){var n=this;e!==t&&(this.show=!1,setTimeout((function(){n.show=!0}),300))}}}),Po=jo,Ao=Po,Eo=(n("7829"),Object(_["a"])(Ao,Co,Oo,!1,null,"4407658c",null)),Io=(Eo.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",staticClass:"border",class:e.className},[e.header?n("h6",{staticClass:"pt-3 pl-3"},[e._v(e._s(e.header))]):e._e(),n("hr"),n("ul",{class:e.listClass},[e._t("default")],2)])}),Bo=[],Wo={props:{tag:{type:String,default:"div"},header:String,animated:{type:Boolean,default:!1},colorful:{type:Boolean,default:!1}},computed:{className:function(){return[this.animated&&"treeview-animated",this.colorful&&"treeview-colorful"]},listClass:function(){return["list-unstyled",this.animated?"treeview-animated-list mb-3 pl-3 pb-2":"",this.colorful?"treeview-colorful-list":"mb-1 pl-3 pb-2 "]}}},Fo=Wo,No=Fo,zo=Object(_["a"])(No,Io,Bo,!1,null,"793a54f2",null),Ro=(zo.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",class:e.className},[n("div",{staticClass:"p-1",class:e.headerClass,staticStyle:{position:"relative"},on:{click:function(t){e.opened=!e.opened}}},[e.nested?n("a",{staticClass:"p-0 m-0 z-depth-0 stretched-link",on:{click:function(t){e.show=!e.show}}},[n("mdb-icon",{staticClass:"ic-w mx-1",class:e.nestedIconClasses,attrs:{icon:e.arrow}})],1):e._e(),n("mdb-icon",{staticClass:"pl-1 ic-w mr-1",class:e.iconClass,attrs:{fab:e.fab,far:e.far,fad:e.fad,fal:e.fal,icon:e.icon}}),n("span",[e._v(e._s(e.title))])],1),(e.animated||e.colorful)&&e.nested?n("transition",{attrs:{name:"slide"}},[e.show?n("ul",{staticClass:"nested list-unstyled pl-4"},[e._t("default")],2):e._e()]):e.show&&e.nested?n("ul",{staticClass:"nested list-unstyled pl-5"},[e._t("default")],2):e._e()],1)}),$o=[],Vo={components:{mdbIcon:j["b"],mdbBtn:G["b"]},props:{tag:{type:String,default:"li"},icon:{type:String,default:"folder-open"},title:{type:String},nested:{type:Boolean,default:!1},far:{type:Boolean,default:!1},fab:{type:Boolean,default:!1},fal:{type:Boolean,default:!1},fad:{type:Boolean,default:!1},animated:{type:Boolean,default:!1}},data:function(){return{show:!1,opened:!1}},computed:{className:function(){return[this.animated&&"treeview-animated-items ",this.nestedItems&&this.colorful&&"treeview-colorful-items"]},animatedParent:function(){return this.$parent.animated},colorful:function(){return this.$parent.colorful},nestedItems:function(){return this.$parent.nested},nestedIcon:function(){return this.colorful?"plus-circle":"angle-right"},nestedActiveIcon:function(){return this.colorful?"minus-circle":"angle-down"},arrow:function(){return this.show?this.nestedActiveIcon:this.nestedIcon},headerClass:function(){return[this.colorful?this.nested?"treeview-colorful-items-header":"treeview-colorful-element":"",this.opened&&"opened",this.show&&"open",this.animatedParent&&!this.nested&&"treeview-animated-element",this.animated&&this.show&&"opened"]},nestedIconClasses:function(){return[this.show&&this.animated&&"white-text"]},iconClass:function(){return[this.animated&&this.show&&"white-text",this.colorful&&this.show&&"amber-text"]}}},Jo=Vo,Uo=Jo,Go=(n("6236"),Object(_["a"])(Uo,Ro,$o,!1,null,"41ed7b59",null)),qo=(Go.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n(e.tag,{tag:"component",on:{mouseleave:e.clearRating}},e._l(e.ratings,(function(t,a){return n("mdb-popover",{key:a,attrs:{trigger:"click",options:{placement:"top"},disabled:!e.feedback||e.disabled,close:e.closePopover}},[n("span",{attrs:{slot:"header"},slot:"header"},[e._v(e._s(t.feedback))]),n("span",{attrs:{slot:"body"},slot:"body"},[n("mdb-textarea",{attrs:{rows:1},model:{value:e.feedbackMessage,callback:function(t){e.feedbackMessage=t},expression:"feedbackMessage"}}),n("mdb-btn",{attrs:{size:"sm",color:"primary"},on:{click:e.submitFeedback}},[e._v("Submit!")]),n("mdb-btn",{attrs:{size:"sm",flat:""},on:{click:e.forceClosePopover}},[e._v("Close")])],1),n("mdb-tooltip",{attrs:{slot:"reference",trigger:"hover",options:{placement:"top"},disabled:e.disabled},slot:"reference"},[n("span",{attrs:{slot:"tip"},slot:"tip"},[e._v(e._s(t.feedback))]),n("mdb-icon",{ref:a,refInFor:!0,staticClass:"p-1 rating-icon",class:a<=e.active||a<=e.rateValue?e.ratings[e.active].iconActiveClass:e.iconClass,attrs:{slot:"reference",icon:a<=e.active||a<=e.rateValue?e.ratings[e.active].icon:e.icon,fal:a<=e.active||a<=e.rateValue?e.ratings[e.active].fal:e.fal,far:a<=e.active||a<=e.rateValue?e.ratings[e.active].far:e.far,fab:a<=e.active||a<=e.rateValue?e.ratings[e.active].fab:e.fab,fad:a<=e.active||a<=e.rateValue?e.ratings[e.active].fad:e.fad},nativeOn:{mouseover:function(t){return e.updateRating(a)},click:function(t){return e.rate(a)}},slot:"reference"})],1)],1)})),1)}),Xo=[],Ko=n("b61b"),Zo={components:{mdbIcon:j["b"],mdbTooltip:Ko["mdbTooltip"],mdbPopover:lr,mdbTextarea:si,mdbBtn:G["b"]},props:{tag:{type:String,default:"div"},feedback:{type:Boolean,default:!1},icon:{type:String,default:"star"},iconClass:{type:String,default:"grey-text"},iconActiveClass:{type:String,default:"yellow-text"},value:Number,far:Boolean,fab:Boolean,fal:Boolean,fad:Boolean,activeFar:Boolean,activeFab:Boolean,activeFal:Boolean,activeFad:Boolean,disabled:{type:Boolean,default:!1},options:{type:Array,default:function(){return[{feedback:"Very bad"},{feedback:"Poor"},{feedback:"OK"},{feedback:"Good"},{feedback:"Excellent"}]}}},data:function(){return{ratings:[],active:-1,rateValue:-1,showModal:!1,closePopover:null,feedbackMessage:""}},methods:{updateRating:function(e){this.disabled||(this.active=e)},clearRating:function(){this.disabled||(this.active=this.rateValue>-1?this.rateValue:-1)},rate:function(e){this.disabled||(this.$emit("input",e+1),this.rateValue=e)},forceClosePopover:function(){var e=this;this.closePopover=!0,setTimeout((function(){e.closePopover=!1}))},submitFeedback:function(){""!==this.feedbackMessage&&(this.$emit("submit",this.feedbackMessage),this.forceClosePopover()),this.feedbackMessage=""}},mounted:function(){var e=this;this.ratings=this.options.map((function(t){var n=t.icon||e.icon,a=t.iconActiveClass||e.iconActiveClass,i=t.far||e.activeFar,r=t.fab||e.activeFab,o=t.fal||e.activeFal,s=t.fad||e.activeFad,l=t.feedback||"";return{icon:n,iconActiveClass:a,far:i,fab:r,fal:o,fad:s,feedback:l}})),this.value&&(this.rateValue=this.value-1,this.active=this.value-1)},watch:{value:function(e){this.rateValue=e-1,this.active=e-1}}},Qo=Zo,es=Qo,ts=(n("7c80"),Object(_["a"])(es,qo,Xo,!1,null,"7f1eb1b4",null)),ns=(ts.exports,n("7db0"),n("ac1f"),n("1276"),{inserted:function(e,t){var n=!1;e.animate=function(){window.scrollY>0&&!n&&(n=!0,e.setAttribute("style","visibility: hidden"));var a=function(e){var t=e.getBoundingClientRect(),n=window.pageXOffset||document.documentElement.scrollLeft,a=window.pageYOffset||document.documentElement.scrollTop;return{top:t.top+a,left:t.left+n}},i=t.value.position||0,r=t.value.delay||0,o=t.value.animation||t.value;return a(e).top-window.scrollY+e.clientHeight+window.innerHeight*i/100<window.innerHeight&&setTimeout((function(){var t=e.getAttribute("class");t.split(" ").find((function(e){return e===o}))||(t="".concat(t," animated ").concat(o),e.setAttribute("style","visibility: visible"),e.setAttribute("class",t))}),r),a(e).top-window.scrollY<window.innerHeight},window.addEventListener("scroll",e.animate)},unbind:function(e){window.removeEventListener("scroll",e.animate)}}),as={inserted:function(e,t,n){e.scrollSpy={spy:null,findHrefs:null,setActive:null,clickHandler:null,links:[],container:window,scrollPosition:null,visible:.5,async:!1},t.value&&(e.scrollSpy.container=document.getElementById(t.value.container)||window,e.scrollSpy.visible=t.value.visible||.5,e.scrollSpy.async=t.value.async||!1),e.scrollSpy.scrollPosition=e.scrollSpy.container===window?e.scrollSpy.container.scrollY:e.scrollSpy.container.scrollTop,e.scrollSpy.findHrefs=function(t){t.attributes&&t.attributes.href?e.scrollSpy.links.push(t):t.childNodes&&t.childNodes.forEach((function(t){return e.scrollSpy.findHrefs(t)}))},e.scrollSpy.setActive=function(a){t.value&&t.value.callback?n.context[t.value.callback](a):e.scrollSpy.links.forEach((function(e,t){a===t?e.classList.add("active"):e.classList.remove("active")}))},e.scrollSpy.spy=function(){if(!e.disableScroll){var t=e.scrollSpy.container,n=t===window?t.scrollY:t.scrollTop,a=n-e.scrollSpy.scrollPosition>0?1:-1;e.scrollSpy.scrollPosition=n,e.scrollSpy.links.forEach((function(n){var a=document.querySelector(n.hash);if(a){var i,r=a.getBoundingClientRect();if(t===window)i=window.innerHeight>r.top+r.height*e.scrollSpy.visible&&r.top+r.height*(1-e.scrollSpy.visible)>=0;else{var o=t.getBoundingClientRect();i=r.top+r.height*e.scrollSpy.visible<=o.top+o.height&&r.top+r.height*(1-e.scrollSpy.visible)>=o.top}n.isLinkActive=i}}));var i=e.scrollSpy.links.filter((function(e){return e.isLinkActive}));if(i.length>0){var r=1===a?i[i.length-1]:i[0],o=r.scrollspyIndex;e.scrollSpy.setActive(o)}else e.scrollSpy.setActive(-1)}},e.scrollSpy.clickHandler=function(t,n){var a=e.scrollSpy.container;window.clearTimeout(e.disableScrollTimeout),e.disableScroll=!0,t.preventDefault();var i=document.querySelector(n.hash),r=i.getBoundingClientRect();if(a===window)window.scrollTo({top:window.scrollY+r.y-r.height*e.scrollSpy.visible,behavior:"smooth"});else{var o=a.getBoundingClientRect();a.style.scrollBehavior="smooth",a.scrollTop=a.scrollTop+r.y-o.y+r.height-o.height}e.scrollSpy.setActive(n.scrollspyIndex),e.disableScrollTimeout=setTimeout((function(){e.disableScroll=!1}),800)},e.scrollSpy.findHrefs(e),e.scrollSpy.links.forEach((function(t,n){t.scrollspyIndex=n,t.addEventListener("click",(function(n){return e.scrollSpy.clickHandler(n,t)}))})),e.scrollSpy.spy(),e.scrollSpy.container.addEventListener("scroll",e.scrollSpy.spy)},update:function(e,t){t.modifiers.async&&!t.value.loading&&t.oldValue.loading&&setTimeout((function(){e.scrollSpy.links=[],e.scrollSpy.findHrefs(e),e.scrollSpy.links.forEach((function(t,n){t.scrollspyIndex=n,t.addEventListener("click",(function(n){return e.scrollSpy.clickHandler(n,t)}))})),e.scrollSpy.spy()}),0)},unbind:function(e){window.removeEventListener("scroll",e.scrollSpy.spy)}},is=(n("c7cd"),{props:{icon:{type:String},size:{type:[Boolean,String],default:!1},fixed:{type:Boolean,default:!1},pull:{type:[Boolean,String],default:!1},border:{type:Boolean,default:!1},spin:{type:Boolean,default:!1},pulse:{type:Boolean,default:!1},rotate:{type:[Boolean,String],default:!1},flip:{type:[Boolean,String],default:!1},inverse:{type:[Boolean,String],default:!1},stack:{type:[Boolean,String],default:!1},color:{type:String,default:""},far:{type:Boolean,default:!1},regular:{type:Boolean,default:!1},fal:{type:Boolean,default:!1},light:{type:Boolean,default:!1},fab:{type:Boolean,default:!1},fad:{type:Boolean,default:!1},duotone:{type:Boolean,default:!1},brands:{type:Boolean,default:!1},openIcon:{type:String},slimIcon:{type:String},customIconClass:{type:[String,Array]}},computed:{iconClass:function(){return[this.far||this.regular?"far":this.fal||this.light?"fal":this.fab||this.brands?"fab":this.fad||this.duotone?"fad":"fas",this.slimIcon?"fa-"+this.slimIcon:this.openIcon&&this.isCollapsed?"fa-"+this.openIcon:this.submenuIcon?"fa-"+this.submenuIcon:this.togglerIcon?"fa-"+this.togglerIcon:this.icon&&"fa-"+this.icon,this.size&&"fa-"+this.size,this.fixed&&"fa-fw",this.pull&&"fa-pull-"+this.pull,this.border&&"fa-border",this.spin&&"fa-spin",this.pulse&&"fa-pulse",this.rotate&&"fa-rotate-"+this.rotate,this.flip&&"fa-flip-"+this.flip,this.inverse&&"fa-inverse",this.stack&&"fa-"+this.stack,""!==this.iconColor&&this.iconColor?"text-"+this.iconColor:null,this.color&&!this.iconColor?"text-"+this.color:null,this.togglerSize&&"fa-"+this.togglerSize,this.customIconClass]}}}),rs=(n("d8e1"),function(e){var t=e.offsetLeft,n=e.offsetTop,a=e.offsetParent;while(a)t+=a.offsetLeft,n+=a.offsetTop,a=a.offsetParent;return[t,n]}),os=function(e,t,n){var a=document.createElement("div");a.classList.add("ripple"),n.center?(a.style.top=-t.height/2+"px",a.style.left=0):(a.style.top=t.top-t.width/2+"px",a.style.left=t.left-t.width/2+"px"),a.style.height=t.width+"px",a.style.width=t.width+"px",a.style.background=n.background,n.dark&&(a.style.background="rgba(0, 0, 0, 0.2)"),e.appendChild(a),"short"===n.duration?a.classList.add("is-reppling-short-duration"):"long"===n.duration?a.classList.add("is-reppling-long-duration"):a.classList.add("is-reppling"),setTimeout((function(){e.removeChild(a)}),1e3)},ss={inserted:function(e,t){var n={dark:!1,background:"rgba(255, 255, 255, 0.3)",duration:"basic",center:!1,fixed:!1};t.value&&(n.dark=t.value.dark||n.dark,n.background=t.value.background||n.background,n.duration=t.value.duration||n.duration,n.center=t.value.center||n.center,n.fixed=t.value.fixed||n.fixed);var a=rs(e);e.classList.add("ripple-parent"),e.waves=function(t){var i={top:t.pageY-a[1],left:t.pageX-a[0],height:e.offsetHeight,width:e.offsetWidth};n.fixed&&(i.top=t.clientY-a[1]),os(e,i,n)},e.addEventListener("click",e.waves)},unbind:function(e){e.removeEventListener("click",e.waves)}},ls=n("a433").default,ds=n("6ba7").default,us=n("dedf").default,cs=n("05bd").default,hs=n("2c40").default,fs=n("b61b").default,ms=n("2840").default},fb6a:function(e,t,n){"use strict";var a=n("23e7"),i=n("861d"),r=n("e8b5"),o=n("23cb"),s=n("50c4"),l=n("fc6a"),d=n("8418"),u=n("1dde"),c=n("b622"),h=c("species"),f=[].slice,m=Math.max;a({target:"Array",proto:!0,forced:!u("slice")},{slice:function(e,t){var n,a,u,c=l(this),p=s(c.length),_=o(e,p),g=o(void 0===t?p:t,p);if(r(c)&&(n=c.constructor,"function"!=typeof n||n!==Array&&!r(n.prototype)?i(n)&&(n=n[h],null===n&&(n=void 0)):n=void 0,n===Array||void 0===n))return f.call(c,_,g);for(a=new(void 0===n?Array:n)(m(g-_,0)),u=0;_<g;_++,u++)_ in c&&d(a,u,c[_]);return a.length=u,a}})},fc6a:function(e,t,n){var a=n("44ad"),i=n("1d80");e.exports=function(e){return a(i(e))}},fd7e:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("x-pseudo",{months:"J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér".split("_"),monthsShort:"J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc".split("_"),monthsParseExact:!0,weekdays:"S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý".split("_"),weekdaysShort:"S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát".split("_"),weekdaysMin:"S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[T~ódá~ý át] LT",nextDay:"[T~ómó~rró~w át] LT",nextWeek:"dddd [át] LT",lastDay:"[Ý~ést~érdá~ý át] LT",lastWeek:"[L~ást] dddd [át] LT",sameElse:"L"},relativeTime:{future:"í~ñ %s",past:"%s á~gó",s:"á ~féw ~sécó~ñds",ss:"%d s~écóñ~ds",m:"á ~míñ~úté",mm:"%d m~íñú~tés",h:"á~ñ hó~úr",hh:"%d h~óúrs",d:"á ~dáý",dd:"%d d~áýs",M:"á ~móñ~th",MM:"%d m~óñt~hs",y:"á ~ýéár",yy:"%d ý~éárs"},dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10,n=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n},week:{dow:1,doy:4}});return t}))},fdbc:function(e,t){e.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},fea9:function(e,t,n){var a=n("da84");e.exports=a.Promise},ffab:function(e,t,n){},ffff:function(e,t,n){(function(e,t){t(n("c1df"))})(0,(function(e){"use strict";var t=e.defineLocale("se",{months:"ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu".split("_"),monthsShort:"ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov".split("_"),weekdays:"sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat".split("_"),weekdaysShort:"sotn_vuos_maŋ_gask_duor_bear_láv".split("_"),weekdaysMin:"s_v_m_g_d_b_L".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"MMMM D. [b.] YYYY",LLL:"MMMM D. [b.] YYYY [ti.] HH:mm",LLLL:"dddd, MMMM D. [b.] YYYY [ti.] HH:mm"},calendar:{sameDay:"[otne ti] LT",nextDay:"[ihttin ti] LT",nextWeek:"dddd [ti] LT",lastDay:"[ikte ti] LT",lastWeek:"[ovddit] dddd [ti] LT",sameElse:"L"},relativeTime:{future:"%s geažes",past:"maŋit %s",s:"moadde sekunddat",ss:"%d sekunddat",m:"okta minuhta",mm:"%d minuhtat",h:"okta diimmu",hh:"%d diimmut",d:"okta beaivi",dd:"%d beaivvit",M:"okta mánnu",MM:"%d mánut",y:"okta jahki",yy:"%d jagit"},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return t}))}})}));
//# sourceMappingURL=mdbvue.umd.min.js.map

/***/ }),

/***/ 1286:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getFeaturedGames;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Services_request__ = __webpack_require__(645);


function getFeaturedGames() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_Services_request__["a" /* default */])({
    url: '/home/game-list',
    method: 'get',
    params: {}
  });
}

/***/ }),

/***/ 1287:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("mdb-carousel", {
    attrs: {
      items: 9,
      multi: "",
      indicators: "",
      controlls: "",
      slide: "",
      interval: 8000
    },
    scopedSlots: _vm._u(
      [
        _vm._l(_vm.basic, function(img, i) {
          return {
            key: i + 1,
            fn: function() {
              return [
                _c(
                  "mdb-card",
                  { key: i },
                  [
                    _c("mdb-card-image", {
                      attrs: { src: img.image, alt: "Card image cap" }
                    }),
                    _vm._v(" "),
                    _c(
                      "mdb-card-body",
                      [
                        _c("mdb-card-title", [_vm._v(_vm._s(i + 1))]),
                        _vm._v(" "),
                        _c("mdb-card-text", [
                          _vm._v(
                            "Some quick example text to build on the card title and\n          make up the bulk of the card's content."
                          )
                        ]),
                        _vm._v(" "),
                        _c(
                          "mdb-btn",
                          { attrs: { color: "primary", size: "md" } },
                          [_vm._v("Button")]
                        )
                      ],
                      1
                    )
                  ],
                  1
                )
              ]
            },
            proxy: true
          }
        })
      ],
      null,
      true
    )
  })
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-171715ee", module.exports)
  }
}

/***/ }),

/***/ 1288:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1289)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/CashArea.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6cc36516", Component.options)
  } else {
    hotAPI.reload("data-v-6cc36516", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1289:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "hero-area" }, [
      _c("div", { staticClass: "container" }, [
        _c("div", { staticClass: "row" }, [
          _c(
            "div",
            { staticClass: "col-lg-10 col-sm-10 d-flex align-self-center" },
            [
              _c("div", { staticClass: "left-content" }, [
                _c("div", { staticClass: "content" }, [
                  _c("h1", { staticClass: "title" }, [
                    _vm._v(
                      "\r\n                            Play for cash\r\n                        "
                    )
                  ]),
                  _vm._v(" "),
                  _c("h5", { staticClass: "subtitle" }, [
                    _vm._v(
                      "\r\n                            Your favourite games\r\n                        "
                    )
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "text" }, [
                    _vm._v(
                      "\r\n                            Play the games you love on your favorite platforms for Cash and Clout. Join daily free and\r\n                            pay-to-play games and tournaments for games like Apex Legends, Call of Duty, and Fortnite.\r\n                        "
                    )
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "links" })
                ])
              ])
            ]
          )
        ])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6cc36516", module.exports)
  }
}

/***/ }),

/***/ 1290:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1291)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/BombArea.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-99c9a438", Component.options)
  } else {
    hotAPI.reload("data-v-99c9a438", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1291:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("section", { staticClass: "Bomb-membership" }, [
      _c("div", { staticClass: "container" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-lg-6 col-sm-6" }, [
            _c("h4", { staticClass: "bomb-heading" }, [
              _vm._v(
                "\r\n                    Buy bombs & memberships\r\n                "
              )
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-lg-6 col-sm-6" }, [
            _c("h4", { staticClass: "bomb-sub-heading" }, [
              _vm._v(
                "\r\n                    In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the\r\n                    visual form of a document or a typeface without relying on meaningful content.\r\n                "
              )
            ])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "row buy-bomb-card" }, [
          _c("div", { staticClass: "col-lg-6 col-sm-6" }, [
            _c("div", { staticClass: "buy-cards" }, [
              _c("h4", { staticClass: "buy-card-text" }, [
                _vm._v("Bomb coins")
              ]),
              _vm._v(" "),
              _c("img", {
                staticClass: "bomb-img",
                attrs: {
                  src: "assets/images/Content-coder/Larg-Group-2000px.png",
                  alt: ""
                }
              })
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-lg-6 col-sm-6" }, [
            _c("div", { staticClass: "buy-cards" }, [
              _c("h4", { staticClass: "buy-card-text" }, [
                _vm._v("Membership")
              ]),
              _vm._v(" "),
              _c("img", {
                staticClass: "bomb-img",
                attrs: {
                  src: "assets/images/Content-coder/member-img.png",
                  alt: ""
                }
              })
            ])
          ])
        ])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-99c9a438", module.exports)
  }
}

/***/ }),

/***/ 1292:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1293)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/NewsArea.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bc2c85d6", Component.options)
  } else {
    hotAPI.reload("data-v-bc2c85d6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1293:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("section", { staticClass: "latest-news" }, [
      _c("div", { staticClass: "container" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-lg-8 col-sm-8" }, [
            _c("h4", { staticClass: "news-heading" }, [
              _vm._v("Our latest News")
            ])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-lg-6 col-sm-6" }, [
            _c("h4", { staticClass: "news-heading2" }, [
              _vm._v("Our latest new heading")
            ])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-lg-6  col-sm-6" }, [
            _c("p", { staticClass: "news-p" }, [
              _vm._v(
                "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to\n                    demonstrate the visual form of a document or a typeface without relying on meaningful content."
              )
            ])
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "row", staticStyle: { "padding-top": "35px" } },
          [
            _c("div", { staticClass: "col-lg-3 col-sm-3" }, [
              _c("a", { staticClass: "indexbtn2", attrs: { href: "" } }, [
                _vm._v("READ MORE")
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-lg-3 col-sm-3" }, [
              _c("a", { staticClass: "indexbtn3", attrs: { href: "" } }, [
                _vm._v("OTHER NEWS")
              ])
            ])
          ]
        )
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-bc2c85d6", module.exports)
  }
}

/***/ }),

/***/ 1294:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1295)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/TopPlayerArea.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-745980fe", Component.options)
  } else {
    hotAPI.reload("data-v-745980fe", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1295:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("section", { staticClass: "featured-game2" }, [
      _c("section", { staticClass: "activities" }, [
        _c("div", { staticClass: "funfact" }, [
          _c("div", { staticClass: "container" }, [
            _c("div", { staticClass: "row" }, [
              _c(
                "div",
                { staticClass: "col-lg-6 col-sm-6 head-top-player-area" },
                [
                  _c("h2", { staticClass: "top-title" }, [
                    _vm._v(
                      "\n                            Top of the month\n                        "
                    )
                  ])
                ]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-6 col-sm-6" }, [
                _c("p", { staticClass: "top-paragraf" }, [
                  _vm._v(
                    "In publishing and graphic design, Lorem ipsum is a placeholder text\n                            commonly used to demonstrate the visual form of a document or a typeface without relying on\n                            meaningful content."
                  )
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "row top-card-row" }, [
                _c("div", { staticClass: "single-fun col-lg-4 col-sm-4" }, [
                  _c("div", { staticClass: "top-player-card" }, [
                    _c("img", {
                      staticStyle: { width: "85%" },
                      attrs: {
                        src: "assets/images/Content-coder/characters/pony.gif",
                        alt: ""
                      }
                    }),
                    _vm._v(" "),
                    _c("div", { staticClass: "count-area" }, [
                      _c("div", { staticClass: "count" }, [_vm._v("2nd")])
                    ]),
                    _vm._v(" "),
                    _c("p")
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "single-fun col-lg-4 col-sm-4" }, [
                  _c("div", { staticClass: "top-player-card" }, [
                    _c("img", {
                      staticStyle: { width: "85%" },
                      attrs: {
                        src: "assets/images/Content-coder/characters/bow_1.gif",
                        alt: ""
                      }
                    }),
                    _vm._v(" "),
                    _c("div", { staticClass: "count-area" }, [
                      _c("div", { staticClass: "count" }, [_vm._v("1st")])
                    ]),
                    _vm._v(" "),
                    _c("p")
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "single-fun col-lg-4 col-sm-4" }, [
                  _c("div", { staticClass: "top-player-card" }, [
                    _c("img", {
                      staticStyle: { width: "85%" },
                      attrs: {
                        src:
                          "assets/images/Content-coder/characters/floss_1.gif",
                        alt: ""
                      }
                    }),
                    _vm._v(" "),
                    _c("div", { staticClass: "count-area" }, [
                      _c("div", { staticClass: "count" }, [_vm._v("3rd")])
                    ]),
                    _vm._v(" "),
                    _c("p")
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "container" }, [
        _c("div", { staticClass: "row" }, [
          _c("h4", { staticClass: "page-timer" }, [_vm._v("23:04:14")])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "row" }, [
          _c("h4", { staticClass: "timer-tag" }, [
            _c("span", { staticClass: "space1" }, [_vm._v("HRS")]),
            _c("span", { staticClass: "space1" }, [_vm._v("MIN")]),
            _c("span", { staticClass: "space1" }, [_vm._v("SEC")])
          ])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "container index-timer" }, [
        _c("ul", [
          _c("li", { staticClass: "timer-inner", staticStyle: {} }, [
            _c("span", { staticClass: "inner-span", attrs: { id: "days" } }, [
              _vm._v(":")
            ]),
            _vm._v("days")
          ]),
          _vm._v(" "),
          _c("li", { staticClass: "timer-inner", staticStyle: {} }, [
            _c("span", { staticClass: "inner-span", attrs: { id: "hours" } }, [
              _vm._v(":")
            ]),
            _vm._v("Hours")
          ]),
          _vm._v(" "),
          _c("li", { staticClass: "timer-inner", staticStyle: {} }, [
            _c(
              "span",
              { staticClass: "inner-span", attrs: { id: "minutes" } },
              [_vm._v(":")]
            ),
            _vm._v("Minutes")
          ])
        ])
      ]),
      _vm._v(" "),
      _c("section", { staticClass: "get-games" }, [
        _c("div", { staticClass: "container" }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-lg-4 col-sm-4" }, [
              _c("div", { staticClass: "circle-section text-center" }, [
                _c("img", {
                  attrs: { src: "assets/images/Content-coder/red.png", alt: "" }
                }),
                _vm._v(" "),
                _c("h4", { staticClass: "get-text" }, [_vm._v("FREE GAMES")])
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-lg-4 col-sm-4 text-center" }, [
              _c("div", { staticClass: "circle-section text-center" }, [
                _c("img", {
                  attrs: {
                    src: "assets/images/Content-coder/blue.png",
                    alt: ""
                  }
                }),
                _vm._v(" "),
                _c("h4", { staticClass: "get-text" }, [
                  _vm._v("GLOBAL LEADERBOARDS")
                ])
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-lg-4 col-sm-4" }, [
              _c("div", { staticClass: "circle-section text-center" }, [
                _c("img", {
                  attrs: {
                    src: "assets/images/Content-coder/green.png",
                    alt: ""
                  }
                }),
                _vm._v(" "),
                _c("h4", { staticClass: "get-text" }, [
                  _vm._v("EASY FAST CASH PAYOUTS")
                ])
              ])
            ])
          ])
        ])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-745980fe", module.exports)
  }
}

/***/ }),

/***/ 1296:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1297)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/partials/SignupPopup.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4b442cd5", Component.options)
  } else {
    hotAPI.reload("data-v-4b442cd5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1297:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass: "modal fade login-modal sign-in",
        attrs: {
          id: "signin",
          tabindex: "-1",
          role: "dialog",
          "aria-labelledby": "signin",
          "aria-hidden": "true"
        }
      },
      [
        _c(
          "div",
          {
            staticClass: "modal-dialog modal-dialog-centered ",
            attrs: { role: "document" }
          },
          [
            _c("div", { staticClass: "modal-content" }, [
              _c("div", { staticClass: "modal-body" }, [
                _c("div", { staticClass: "header-area" }, [
                  _c("h4", { staticClass: "title" }, [_vm._v("Welcome")])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-area" }, [
                  _c("form", { attrs: { action: "", method: "POST" } }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "input-name" } }, [
                        _vm._v("Username*")
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        staticClass: "input-field",
                        attrs: {
                          type: "text",
                          name: "name",
                          id: "input-name",
                          placeholder: "Enter your Username",
                          required: ""
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("hr"),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "input-email" } }, [
                        _vm._v("E-mail*")
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        staticClass: "input-field",
                        attrs: {
                          type: "email",
                          name: "email",
                          id: "input-email",
                          placeholder: "example@gmail.com",
                          required: ""
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("hr"),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "input-password" } }, [
                        _vm._v("Password*")
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        staticClass: "input-field",
                        attrs: {
                          type: "password",
                          name: "password",
                          id: "input-password",
                          placeholder: "&nbsp;Enter your password",
                          required: ""
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("hr"),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "input-con-password" } }, [
                        _vm._v("Confirm password**")
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        staticClass: "input-field",
                        attrs: {
                          type: "password",
                          name: "password_confirmation",
                          id: "input-con-password",
                          placeholder: "Re-Enter your Password",
                          required: ""
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("hr"),
                    _vm._v(" "),
                    _c("input", {
                      attrs: {
                        type: "hidden",
                        id: "role",
                        name: "role",
                        value: "user"
                      }
                    }),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group fbtn" }, [
                      _c(
                        "button",
                        { staticClass: "mybtn2", attrs: { type: "submit" } },
                        [_vm._v("Sign up")]
                      )
                    ])
                  ])
                ])
              ])
            ])
          ]
        )
      ]
    )
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4b442cd5", module.exports)
  }
}

/***/ }),

/***/ 1298:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1299)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/partials/BottomTopbutton.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f1056e86", Component.options)
  } else {
    hotAPI.reload("data-v-f1056e86", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1299:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "bottomtotop" }, [
      _c("i", { staticClass: "fas fa-chevron-right" })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-f1056e86", module.exports)
  }
}

/***/ }),

/***/ 1300:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(1301)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/Parallax.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5b59192c", Component.options)
  } else {
    hotAPI.reload("data-v-5b59192c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1301:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-parallax",
    { attrs: { src: "/img/parallax.jpg" } },
    [
      _c("h1", { staticClass: "text-xs-center" }, [_vm._v("Veutified")]),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          staticClass: "secondary white--text text-xs-center",
          staticStyle: { "margin-left": "auto", "margin-right": "auto" },
          attrs: {
            flat: "",
            href: "https://github.com/codeitlikemiley/vuetified"
          }
        },
        [_vm._v("Clone Repository Now!")]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5b59192c", module.exports)
  }
}

/***/ }),

/***/ 1302:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1303)
}
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1305)
/* template */
var __vue_template__ = __webpack_require__(1306)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/Showcase.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d2deff7c", Component.options)
  } else {
    hotAPI.reload("data-v-d2deff7c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1303:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1304);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1222)("21455ec0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d2deff7c\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Showcase.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d2deff7c\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Showcase.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1304:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 1305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      showcase: [{
        show: true,
        title: "Laravel Echo Notifications",
        src: "/svg/announcement-svgrepo-com.svg",
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4
      }, {
        show: true,
        title: "Laravel Passport Auth Scaffold",
        src: "/svg/fingerprint-scan-svgrepo-com.svg",
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4
      }, {
        show: true,
        title: "Vuetify Themes",
        src: "/svg/browsers-svgrepo-com.svg",
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4
      }]
    };
  }
});

/***/ }),

/***/ 1306:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    { staticClass: "secondary", attrs: { fluid: "" } },
    [
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        _vm._l(_vm.showcase, function(card) {
          var _obj
          return _c(
            "v-flex",
            _vm._b(
              { key: card.title, staticClass: "pa-2" },
              "v-flex",
              ((_obj = {}),
              (_obj["xs" + card.xs] = true),
              (_obj["sm" + card.sm] = true),
              (_obj["md" + card.md] = true),
              (_obj["lg" + card.lg] = true),
              (_obj["xl" + card.xl] = true),
              _obj),
              false
            ),
            [
              _c(
                "v-card",
                { attrs: { flat: "", color: "secondary" } },
                [
                  _c("v-img", {
                    attrs: { src: card.src, height: "150px", contain: "" }
                  }),
                  _vm._v(" "),
                  _c(
                    "v-card-actions",
                    [
                      _c("v-spacer"),
                      _vm._v(" "),
                      _c("p", {
                        staticClass: "headline white--text",
                        domProps: { textContent: _vm._s(card.title) }
                      }),
                      _vm._v(" "),
                      _c("v-spacer")
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        }),
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d2deff7c", module.exports)
  }
}

/***/ }),

/***/ 1307:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1308)
}
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1310)
/* template */
var __vue_template__ = __webpack_require__(1311)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1ccc24b5"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/Pioneer.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1ccc24b5", Component.options)
  } else {
    hotAPI.reload("data-v-1ccc24b5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1308:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1309);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1222)("01f256b1", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1ccc24b5\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Pioneer.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1ccc24b5\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Pioneer.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1309:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n.image[data-v-1ccc24b5] {\r\n  float: left;\r\n  background-size: cover;\r\n  background-repeat: no-repeat;\r\n  background-position: center center;\r\n  border: 1px solid #ebebeb;\r\n  margin: 5px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ 1310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      title: '<h1 class="accent--text">Scaffold Your Laravel and Vue Apps </br> <strong class="primary--text">Vuetified Your App</strong></h1>',
      subtitle: "Starting a New Project Is Hard, We Already Do The Heavy Lifting For You. Many Small Details Things You Will Love Such as Vue Linting and Autofix in VS Code Editor, Ready Built Auth Scaffold To Realtime BroadCasting and Modular State Management.",
      current_image: "/svg/spa-svgrepo-com.svg",
      photos: []
    };
  },
  computed: {
    imageHeight: function imageHeight() {
      var height = window.innerWidth * 0.07;
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return height + "px";
        case "sm":
          return height + "px";
        case "md":
          return height + "px";
        case "lg":
          return height + "px";
        case "xl":
          return height + "px";
      }
    },
    imageWidth: function imageWidth() {
      var width = window.innerWidth * 0.07;

      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return width + "px";
        case "sm":
          return width + "px";
        case "md":
          return width + "px";
        case "lg":
          return width + "px";
        case "xl":
          return width + "px";
      }
    }
  },
  methods: {
    setCurrentImage: function setCurrentImage(index) {
      this.current_image = this.photos[index];
    }
  }
});

/***/ }),

/***/ 1311:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    { attrs: { fluid: "", "grid-list-md": "" } },
    [
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "", sm12: "", md6: "", lg6: "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs12: "", "text-xs-center": "" } },
                    [
                      _c(
                        "v-card",
                        { attrs: { flat: "", light: "" } },
                        [
                          _c(
                            "v-card-title",
                            [
                              _c("v-card-text", {
                                domProps: { innerHTML: _vm._s(_vm.title) }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c("v-card-text", {
                            staticClass: "grey--text headline text-xs-left",
                            domProps: { textContent: _vm._s(_vm.subtitle) }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "", sm12: "", md6: "", lg6: "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs12: "", "text-xs-right": "" } },
                    [
                      _c(
                        "v-card",
                        { attrs: { flat: "", light: "" } },
                        [
                          _c(
                            "v-container",
                            [
                              !_vm.current_image
                                ? _c("div", {
                                    staticStyle: {
                                      "background-color": "#d3d3d3",
                                      height: "322px",
                                      width: "50%",
                                      margin: "auto"
                                    }
                                  })
                                : _c("v-img", {
                                    attrs: {
                                      src: _vm.current_image,
                                      height: "400px",
                                      contain: ""
                                    }
                                  })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _vm.photos !== null &&
                          _vm.photos !== undefined &&
                          _vm.photos.length > 0
                            ? _c(
                                "v-container",
                                { attrs: { "fill-height": "", fluid: "" } },
                                [
                                  _c(
                                    "v-layout",
                                    { attrs: { "fill-height": "" } },
                                    [
                                      _c(
                                        "v-flex",
                                        {
                                          attrs: {
                                            xs12: "",
                                            "align-end": "",
                                            flexbox: ""
                                          }
                                        },
                                        _vm._l(_vm.photos, function(
                                          image,
                                          key
                                        ) {
                                          return _c("div", {
                                            key: key,
                                            staticClass: "image",
                                            style: {
                                              backgroundImage:
                                                "url(" + image + ")",
                                              width: _vm.imageHeight,
                                              height: _vm.imageWidth
                                            },
                                            on: {
                                              click: function($event) {
                                                return _vm.setCurrentImage(key)
                                              }
                                            }
                                          })
                                        }),
                                        0
                                      )
                                    ],
                                    1
                                  )
                                ],
                                1
                              )
                            : _vm._e()
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1ccc24b5", module.exports)
  }
}

/***/ }),

/***/ 1312:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1313)
}
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1315)
/* template */
var __vue_template__ = __webpack_require__(1316)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4ed61541"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/FeatureCase.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4ed61541", Component.options)
  } else {
    hotAPI.reload("data-v-4ed61541", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1313:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1314);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1222)("5682b374", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4ed61541\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./FeatureCase.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4ed61541\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./FeatureCase.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1314:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n.image[data-v-4ed61541] {\r\n  float: left;\r\n  background-size: cover;\r\n  background-repeat: no-repeat;\r\n  background-position: center center;\r\n  border: 1px solid #ebebeb;\r\n  margin: 5px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ 1315:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      title: '<h1 class="accent--text">Everything You Need To Start </br><strong class="primary--text">In Building Single Page Apps</strong></h1>',
      current_image: "/svg/website-svgrepo-com.svg",
      features: [{
        show: true,
        title: "Easy Scaffolding",
        tagline: "Added New Artisan Commands To Help You Get Up and Running",
        src: "/svg/command-window-svgrepo-com.svg",
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12
      }, {
        show: true,
        title: "Easily Add Components",
        tagline: "Need More Components? Add Them As A New Service in Your Plugins.js",
        src: "/svg/usb-svgrepo-com.svg",
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12
      }, {
        show: true,
        title: "Deploy Easily On Cloud",
        tagline: "Deploy Your Containers with Dockers at Digital Ocean",
        src: "/svg/cloud-computing-svgrepo-com.svg",
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12
      }, {
        show: true,
        title: "Modular State Management",
        tagline: "Few Modules Are Built In For You To Handle State On Front End",
        src: "/svg/database-svgrepo-com.svg",
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12
      }],
      photos: []
    };
  },
  computed: {
    imageHeight: function imageHeight() {
      var height = window.innerWidth * 0.07;
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return height + "px";
        case "sm":
          return height + "px";
        case "md":
          return height + "px";
        case "lg":
          return height + "px";
        case "xl":
          return height + "px";
      }
    },
    imageWidth: function imageWidth() {
      var width = window.innerWidth * 0.07;

      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return width + "px";
        case "sm":
          return width + "px";
        case "md":
          return width + "px";
        case "lg":
          return width + "px";
        case "xl":
          return width + "px";
      }
    },
    taglineSize: function taglineSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return {};
        case "sm":
          return {};
        case "md":
          return { title: true };
        case "lg":
          return { title: true };
        case "xl":
          return { title: true };
      }
    }
  },
  methods: {
    setCurrentImage: function setCurrentImage(index) {
      this.current_image = this.photos[index];
    }
  }
});

/***/ }),

/***/ 1316:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    { attrs: { fluid: "", "grid-list-md": "" } },
    [
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "", sm12: "", md6: "", lg6: "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs12: "", "text-xs-center": "" } },
                    [
                      _c(
                        "v-card",
                        { attrs: { flat: "", light: "" } },
                        [
                          _c(
                            "v-card-title",
                            { staticClass: "title primary--text" },
                            [
                              _c("v-card-text", {
                                domProps: { innerHTML: _vm._s(_vm.title) }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          !_vm.current_image
                            ? _c("div", {
                                staticStyle: {
                                  "background-color": "#d3d3d3",
                                  height: "322px",
                                  width: "50%",
                                  margin: "auto"
                                }
                              })
                            : _c("v-img", {
                                attrs: {
                                  src: _vm.current_image,
                                  height: "700px",
                                  contain: ""
                                }
                              }),
                          _vm._v(" "),
                          _vm.photos !== null &&
                          _vm.photos !== undefined &&
                          _vm.photos.length > 0
                            ? _c(
                                "v-container",
                                { attrs: { "fill-height": "", fluid: "" } },
                                [
                                  _c(
                                    "v-layout",
                                    { attrs: { "fill-height": "" } },
                                    [
                                      _c(
                                        "v-flex",
                                        {
                                          attrs: {
                                            xs12: "",
                                            "align-end": "",
                                            flexbox: ""
                                          }
                                        },
                                        _vm._l(_vm.photos, function(
                                          image,
                                          key
                                        ) {
                                          return _c("div", {
                                            key: key,
                                            staticClass: "image",
                                            style: {
                                              backgroundImage:
                                                "url(" + image + ")",
                                              width: _vm.imageHeight,
                                              height: _vm.imageWidth
                                            },
                                            on: {
                                              click: function($event) {
                                                return _vm.setCurrentImage(key)
                                              }
                                            }
                                          })
                                        }),
                                        0
                                      )
                                    ],
                                    1
                                  )
                                ],
                                1
                              )
                            : _vm._e()
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "", sm12: "", md6: "", lg6: "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                _vm._l(_vm.features, function(card) {
                  var _obj
                  return _c(
                    "v-flex",
                    _vm._b(
                      {
                        key: card.title,
                        staticClass: "pa-2",
                        attrs: { "d-flex": "", xs12: "" }
                      },
                      "v-flex",
                      ((_obj = {}),
                      (_obj["xs" + card.xs] = true),
                      (_obj["sm" + card.sm] = true),
                      (_obj["md" + card.md] = true),
                      (_obj["lg" + card.lg] = true),
                      (_obj["xl" + card.xl] = true),
                      _obj),
                      false
                    ),
                    [
                      _c(
                        "v-card",
                        { attrs: { flat: "", light: "" } },
                        [
                          _c(
                            "v-container",
                            { attrs: { fluid: "" } },
                            [
                              _c(
                                "v-layout",
                                { attrs: { row: "", wrap: "" } },
                                [
                                  _c(
                                    "v-flex",
                                    { attrs: { "d-flex": "", xs4: "" } },
                                    [
                                      _c("v-img", {
                                        attrs: {
                                          src: card.src,
                                          height: "125px",
                                          contain: "",
                                          avatar: ""
                                        }
                                      })
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "v-flex",
                                    { attrs: { "d-flex": "", xs8: "" } },
                                    [
                                      _c(
                                        "v-container",
                                        [
                                          _c(
                                            "v-layout",
                                            { attrs: { row: "", wrap: "" } },
                                            [
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: {
                                                    "d-flex": "",
                                                    xs12: ""
                                                  }
                                                },
                                                [
                                                  _c(
                                                    "v-card-actions",
                                                    [
                                                      _c("v-spacer"),
                                                      _vm._v(" "),
                                                      _c("p", {
                                                        staticClass:
                                                          "headline primary--text",
                                                        domProps: {
                                                          textContent: _vm._s(
                                                            card.title
                                                          )
                                                        }
                                                      }),
                                                      _vm._v(" "),
                                                      _c("v-spacer"),
                                                      _vm._v(" "),
                                                      _c(
                                                        "v-btn",
                                                        {
                                                          staticClass:
                                                            "accent--text",
                                                          attrs: { icon: "" },
                                                          nativeOn: {
                                                            click: function(
                                                              $event
                                                            ) {
                                                              card.show = !card.show
                                                            }
                                                          }
                                                        },
                                                        [
                                                          _c("v-icon", [
                                                            _vm._v(
                                                              _vm._s(
                                                                card.show
                                                                  ? "keyboard_arrow_up"
                                                                  : "keyboard_arrow_down"
                                                              )
                                                            )
                                                          ])
                                                        ],
                                                        1
                                                      )
                                                    ],
                                                    1
                                                  )
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: {
                                                    "d-flex": "",
                                                    xs12: ""
                                                  }
                                                },
                                                [
                                                  _c(
                                                    "v-slide-y-transition",
                                                    [
                                                      _c("v-card-text", {
                                                        directives: [
                                                          {
                                                            name: "show",
                                                            rawName: "v-show",
                                                            value: card.show,
                                                            expression:
                                                              "card.show"
                                                          }
                                                        ],
                                                        staticClass:
                                                          "accent--text",
                                                        class: [
                                                          _vm.taglineSize
                                                        ],
                                                        domProps: {
                                                          textContent: _vm._s(
                                                            card.tagline
                                                          )
                                                        }
                                                      })
                                                    ],
                                                    1
                                                  )
                                                ],
                                                1
                                              )
                                            ],
                                            1
                                          )
                                        ],
                                        1
                                      )
                                    ],
                                    1
                                  )
                                ],
                                1
                              )
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                }),
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4ed61541", module.exports)
  }
}

/***/ }),

/***/ 1317:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1318)
}
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1320)
/* template */
var __vue_template__ = __webpack_require__(1321)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/VideoCase.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b5aed2f4", Component.options)
  } else {
    hotAPI.reload("data-v-b5aed2f4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1318:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1319);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1222)("4dbf028c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b5aed2f4\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./VideoCase.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b5aed2f4\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./VideoCase.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1319:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 1320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      videos: [{
        title: "One Piece 819",
        href: "https://www.youtube.com/watch?v=L0ZHk0JD5yE",
        type: "text/html",
        youtube: "L0ZHk0JD5yE",
        poster: "/svg/video-play-svgrepo-com.svg"
      }, {
        title: "One Piece Commercial",
        href: "https://www.youtube.com/watch?v=5TrI6b4gc9c",
        type: "text/html",
        youtube: "5TrI6b4gc9c",
        poster: "/svg/video-play-svgrepo-com.svg"
      }, {
        title: "One Piece Coca Cola Ads",
        href: "https://www.youtube.com/watch?v=SV1Z2kpzjQk",
        type: "text/html",
        youtube: "SV1Z2kpzjQk",
        poster: "/svg/video-play-svgrepo-com.svg"
      }],
      youtube_id: "l-nKCcfSMHc",
      loaded: false
    };
  },
  computed: {
    imageHeight: function imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "100px";
        case "sm":
          return "100px";
        case "md":
          return "150px";
        case "lg":
          return "250px";
        case "xl":
          return "250px";
      }
    },
    youtubeHeight: function youtubeHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "315px";
        case "sm":
          return "315px";
        case "md":
          return "450px";
        case "lg":
          return "750px";
        case "xl":
          return "864px";
      }
    },
    youtubeWidth: function youtubeWidth() {
      var width = window.innerWidth;

      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return width + "px";
        case "sm":
          return width + "px";
        case "md":
          return width + "px";
        case "lg":
          return width + "px";
        case "xl":
          return width + "px";
      }
    },
    showVideoTitle: function showVideoTitle() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return false;
        case "sm":
          return true;
        case "md":
          return true;
        case "lg":
          return true;
        case "xl":
          return true;
      }
    }
  },
  methods: {
    changeVideo: function changeVideo(video) {
      this.youtube_id = video.youtube;
      this.loaded = true;
    }
  }
});

/***/ }),

/***/ 1321:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    { staticClass: "pa-0 ma-0", attrs: { fluid: "" } },
    [
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c("v-flex", { attrs: { xs12: "", "text-xs-center": "" } }, [
            _c("h1", { staticClass: "primary--text" }, [
              _vm._v("Watch Videos")
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "headline accent--text" }, [
              _vm._v("Click The Image To Lazy Load The Video")
            ])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "", "justify-center": "" } },
        _vm._l(_vm.videos, function(video, key) {
          return _c(
            "v-flex",
            {
              key: key,
              attrs: {
                xs12: "",
                sm12: "",
                md4: "",
                lg4: "",
                xl4: "",
                "text-xs-center": "",
                "pa-2": ""
              }
            },
            [
              _c(
                "v-card",
                [
                  _c("div", {
                    staticStyle: { cursor: "pointer" },
                    style: {
                      backgroundImage: "url(" + video.poster + ")",
                      height: _vm.imageHeight,
                      "background-position": "center",
                      "background-repeat": "no-repeat"
                    },
                    on: {
                      click: function($event) {
                        return _vm.changeVideo(video)
                      }
                    }
                  }),
                  _vm._v(" "),
                  _vm.showVideoTitle
                    ? _c(
                        "v-card-title",
                        { staticStyle: { "background-color": "#607d8b" } },
                        [
                          _c("v-spacer"),
                          _vm._v(" "),
                          _c("span", { staticClass: "headline white--text" }, [
                            _vm._v(_vm._s(video.title))
                          ]),
                          _vm._v(" "),
                          _c("v-spacer")
                        ],
                        1
                      )
                    : _vm._e()
                ],
                1
              )
            ],
            1
          )
        }),
        1
      ),
      _vm._v(" "),
      _vm.loaded
        ? _c(
            "v-layout",
            { attrs: { row: "", wrap: "" } },
            [
              _c(
                "v-flex",
                { attrs: { xs12: "", "text-xs-center": "" } },
                [
                  _c("youtube", {
                    attrs: {
                      "video-id": _vm.youtube_id,
                      "player-width": _vm.youtubeWidth,
                      "player-height": _vm.youtubeHeight
                    }
                  })
                ],
                1
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-b5aed2f4", module.exports)
  }
}

/***/ }),

/***/ 1322:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1323)
/* template */
var __vue_template__ = __webpack_require__(1324)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/Testimonial.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0440e61a", Component.options)
  } else {
    hotAPI.reload("data-v-0440e61a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      avatar: "/svg/employee-svgrepo-com.svg",
      name: "-Happy User",
      testimonial: '<h1 class="primary--text">With Vuetified I can Easily Start My New Big Idea</h1><h1 class="accent--text"> <strong>Using Laravel and Vue To Build Single Page Apps</strong></h1>'
    };
  }
});

/***/ }),

/***/ 1324:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    { attrs: { fluid: "" } },
    [
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "" } },
            [
              _c(
                "v-card",
                { attrs: { flat: "", light: "" } },
                [
                  _c(
                    "v-container",
                    { attrs: { fluid: "" } },
                    [
                      _c(
                        "v-layout",
                        { attrs: { row: "", wrap: "" } },
                        [
                          _c(
                            "v-flex",
                            { attrs: { xs12: "", "text-xs-center": "" } },
                            [
                              _c("blockquote", {
                                domProps: { innerHTML: _vm._s(_vm.testimonial) }
                              })
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "v-flex",
                            { attrs: { xs12: "", "text-xs-right": "" } },
                            [
                              _c(
                                "v-chip",
                                { attrs: { color: "accent" } },
                                [
                                  _c("v-avatar", [
                                    _c("img", {
                                      attrs: { src: _vm.avatar, alt: _vm.name }
                                    })
                                  ]),
                                  _vm._v(" "),
                                  _c("span", {
                                    staticClass: "white--text title",
                                    domProps: { textContent: _vm._s(_vm.name) }
                                  })
                                ],
                                1
                              )
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0440e61a", module.exports)
  }
}

/***/ }),

/***/ 1325:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1326)
}
var normalizeComponent = __webpack_require__(640)
/* script */
var __vue_script__ = __webpack_require__(1328)
/* template */
var __vue_template__ = __webpack_require__(1329)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/home/CallToAction.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-29e80bb8", Component.options)
  } else {
    hotAPI.reload("data-v-29e80bb8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1326:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1327);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1222)("af613baa", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-29e80bb8\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CallToAction.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-29e80bb8\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CallToAction.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1327:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 1328:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_acl__ = __webpack_require__(1240);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  mixins: [__WEBPACK_IMPORTED_MODULE_0__mixins_acl__["a" /* default */]],
  data: function data() {
    return {
      link: "https://github.com/codeitlikemiley/vuetified"
    };
  },
  mounted: function mounted() {
    var self = this;
    if (self.isLoggedIn()) {
      self.link = "https://github.com/codeitlikemiley/vuetified";
    }
  }
});

/***/ }),

/***/ 1329:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    { staticClass: "accent", attrs: { fluid: "", "pa-0": "", "ma-0": "" } },
    [
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "", "pa-0": "", "ma-0": "" } },
        [
          _c(
            "v-flex",
            {
              attrs: { xs12: "", "text-xs-center": "", "pa-0": "", "ma-0": "" }
            },
            [
              _c("v-card-text", [
                _c("h2", { staticClass: "white--text" }, [
                  _c("em", [_vm._v("YES!")])
                ])
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-flex",
            {
              attrs: { xs12: "", "text-xs-center": "", "pa-0": "", "ma-0": "" }
            },
            [
              _c("v-card-text", { staticClass: "headline white--text" }, [
                _c("p", [
                  _c("em", [
                    _vm._v(
                      "I would like to save Hours Of Prototyping and Scaffolding My Next Big Idea"
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("p", [
                  _c("em", [
                    _vm._v(
                      "And Use Vuetified To Save Tons Of Hours Experimenting What Works and Not."
                    )
                  ])
                ])
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-flex",
            { attrs: { xs12: "", "text-xs-center": "", "pb-5": "" } },
            [
              _c(
                "v-btn",
                { attrs: { href: _vm.link, color: "primary" } },
                [
                  _c("span", { staticClass: "white--text" }, [
                    _vm._v("Clone The Repository")
                  ]),
                  _vm._v(" "),
                  _c("v-icon", { attrs: { right: "", dark: "" } }, [
                    _vm._v("fa-code-fork")
                  ])
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-29e80bb8", module.exports)
  }
}

/***/ }),

/***/ 1330:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "banger-layout",
    { class: [_vm.contentClass] },
    [
      _c("b-section", [_c("main-slider")], 1),
      _vm._v(" "),
      _c("b-section", [_c("featured-games")], 1),
      _vm._v(" "),
      _c("cash-area"),
      _vm._v(" "),
      _c("bomb-area"),
      _vm._v(" "),
      _c("news-area"),
      _vm._v(" "),
      _c("topPlayer"),
      _vm._v(" "),
      _c("bottom-top"),
      _vm._v(" "),
      _c("signup-popup")
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-097fa176", module.exports)
  }
}

/***/ })

});