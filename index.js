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
 * @prop {H[]} hooks
 */

/**
 * @template  T
 * @callback Runner
 * @param {HookCb<T>[]} value
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
 * @template {HookCb<T>} H
 * @param {Runner<T>} runner
 * @return {HooksCollection<H>}
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
const createHooksCollection = (runner) => {
  /** @type {H[]} */
  const hooks = [];

  /**
   *@type {HooksCollection<H>}
   */
  const hooksCollection = (hook) => {
    hooks.push(hook);
    return () => hooks.splice(hooks.indexOf(hook), 1);
  };

  hooksCollection.hooks = hooks;
  hooksCollection.run = runner(hooks);
  hooksCollection.runOnce = runner(hooks);

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
export const createPipelineCollection = (type) =>
  // @ts-ignore
  createHooksCollection(
    (hooks) =>
      (value, ...rest) =>
        hooks.reduce(
          (pipedValue, hook) =>
            pipedValue?.then ? pipedValue.then((r) => hook(r, ...rest)) : hook(pipedValue, ...rest),
          value
        )
  );

/**
 * @template T
 * @param {T=} type
 * @returns {CollectionSyncVoid<T>|CollectionAsyncVoid<T>}
 */
export const createSequenceHooksCollection = (type) =>
  createHooksCollection(
    (hooks) =>
      (value, ...rest) =>
        hooks.reduce(
          (last, hook) => (last?.then ? last.then((_) => hook(value, ...rest)) : hook(value, ...rest)),
          value
        )
  );

/**
 * @template T
 * @param {T=} type
 * @returns {CollectionSyncVoid<T>|CollectionAsyncVoid<T>}
 */
export const createParallelHooksCollection = (type) =>
  createHooksCollection(
    (hooks) =>
      (value, ...rest) =>
        Promise.all(hooks.map((hook) => hook(value, ...rest))).then((r) => value)
  );

/**
 * @template T
 * @param {T=} type
 * @returns {CollectionSync<T>|CollectionAsync<T>}
 */
export const createGuardsCollection = (type) =>
  // @ts-ignore
  createHooksCollection(
    (hooks) =>
      (value, ...rest) =>
        hooks.reduce(
          (pipedValue, hook) =>
            pipedValue?.then ? pipedValue.then((r) => r && hook(value, ...rest)) : pipedValue && hook(value, ...rest),
          value || true
        )
  );