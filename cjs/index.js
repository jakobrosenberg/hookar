"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSequenceHooksCollection = exports.createPipelineCollection = exports.createParallelHooksCollection = exports.createGuardsCollection = void 0;

var _util = require("./util.js");

/**
 * @template H
 * @callback AddHookToCollection
 * @param {H} hook
 * @returns {function} unhook
 **/

/**
 * @template H
 * @typedef {AddHookToCollection<H> & HooksCollectionProps<H>} HooksCollection
 */

/**
 * @template H hook
 * @typedef {Object} HooksCollectionProps
 * @prop {H} run
 * @prop {H} runOnce
 * @prop {HookCb<H>} next
 * @prop {H[]} hooks
 */

/**
 * @template  V
 * @callback Runner
 * @param {HookCb<V>[]} value
 * @param  {...any} rest
 */

/**
 * @template T
 * @callback HookCb
 * @param {T} value
 * @param {...any} rest
 */

/**
 * creates a hook collection
 * @template T
 * @param {Runner<T>} runner
 * @return {HooksCollection<HookCb<T>>}
 * @example
 * const hooksCollection = createHook()
 * const unhookFn = hooksCollection(x => console.log('hello', x))
 * const unhookFn2 = hooksCollection(x => console.log('goodbye', x))
 *
 * // call hooks
 * hooksCollection.hooks.forEach(hook => hook('Jake'))
 * // logs "hello Jake" and "goodbye Jake"
 *
 * // unregister
 * unhookFn()
 * unhookFn2()
 */
var createHooksCollection = function createHooksCollection(runner) {
  /** @type {HookCb<T>[]} */
  var hooks = [];
  /**
   *@type {HooksCollection<HookCb<T>>}
   */

  var hooksCollection = function hooksCollection(hook) {
    hooks.push(hook);
    return function () {
      return hooks.splice(hooks.indexOf(hook), 1);
    };
  };

  hooksCollection.hooks = hooks;
  hooksCollection.run = runner(hooks);
  hooksCollection.runOnce = (0, _util.runOnce)(runner(hooks));

  hooksCollection.next = function (hook) {
    var unhook = hooksCollection(function () {
      hook.apply(void 0, arguments);
      unhook();
    });
  };

  return hooksCollection;
};
/**
 * @template P
 * @typedef {HooksCollection<(pri: P, ...rest)=>P>} CollectionSync
 */

/**
 * @template P
 * @typedef {HooksCollection<(pri: P, ...rest)=>P|Promise<P>>} CollectionAsync
 */

/**
 * @template P
 * @typedef {HooksCollection<((pri: P, ...rest)=>void)>} CollectionSyncVoid
 */

/**
 * @template P
 * @typedef {HooksCollection<(pri: P, ...rest)=>void|Promise<void>>} CollectionAsyncVoid
 */

/**
 * @template T
 * @param {T=} type
 * @returns {HooksCollection<T>}
 */


var createPipelineCollection = function createPipelineCollection(type) {
  return (// @ts-ignore
    createHooksCollection(function (hooks) {
      return function (value) {
        for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }

        return hooks.reduce(function (pipedValue, hook) {
          return pipedValue !== null && pipedValue !== void 0 && pipedValue.then ? pipedValue.then(function (r) {
            return hook.apply(void 0, [r].concat(rest));
          }) : hook.apply(void 0, [pipedValue].concat(rest));
        }, value);
      };
    })
  );
};
/**
 * @template T
 * @param {T=} type
 * @returns {CollectionSyncVoid<T>|CollectionAsyncVoid<T>}
 */


exports.createPipelineCollection = createPipelineCollection;

var createSequenceHooksCollection = function createSequenceHooksCollection(type) {
  return createHooksCollection(function (hooks) {
    return function (value) {
      for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
      }

      return hooks.reduce(function (last, hook) {
        return last !== null && last !== void 0 && last.then ? last.then(function (_) {
          return hook.apply(void 0, [value].concat(rest));
        }) : hook.apply(void 0, [value].concat(rest));
      }, value);
    };
  });
};
/**
 * @template T
 * @param {T=} type
 * @returns {CollectionSyncVoid<T>|CollectionAsyncVoid<T>}
 */


exports.createSequenceHooksCollection = createSequenceHooksCollection;

var createParallelHooksCollection = function createParallelHooksCollection(type) {
  return createHooksCollection(function (hooks) {
    return function (value) {
      for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        rest[_key3 - 1] = arguments[_key3];
      }

      return Promise.all(hooks.map(function (hook) {
        return hook.apply(void 0, [value].concat(rest));
      })).then(function (r) {
        return value;
      });
    };
  });
};
/**
 * @template T
 * @param {T=} type
 * @returns {CollectionSync<T>|CollectionAsync<T>}
 */


exports.createParallelHooksCollection = createParallelHooksCollection;

var createGuardsCollection = function createGuardsCollection(type) {
  return (// @ts-ignore
    createHooksCollection(function (hooks) {
      return function (value) {
        for (var _len4 = arguments.length, rest = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          rest[_key4 - 1] = arguments[_key4];
        }

        return hooks.reduce(function (pipedValue, hook) {
          return pipedValue !== null && pipedValue !== void 0 && pipedValue.then ? pipedValue.then(function (r) {
            return r && hook.apply(void 0, [value].concat(rest));
          }) : pipedValue && hook.apply(void 0, [value].concat(rest));
        }, value || true);
      };
    })
  );
};

exports.createGuardsCollection = createGuardsCollection;
//# sourceMappingURL=index.js.map