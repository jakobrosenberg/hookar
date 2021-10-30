

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
 * @prop {H[]} hooks
 */

/**
 * creates a hook collection
 * @template H
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
    const hooks = []

    /**
     *@type {HooksCollection<H>}
     */
    const hooksCollection = hook => {
        hooks.push(hook)
        return () => hooks.splice(hooks.indexOf(hook), 1)
    }

    hooksCollection.hooks = hooks
    hooksCollection.run = runner(hooks)

    return hooksCollection
}



/**
 * @template P
 * @typedef {HooksCollection<(pri: P, ...rest)=>P>} PipelineCollectionSync
 */
/**
 * @template P
 * @typedef {HooksCollection<(pri: P, ...rest)=>P|Promise<P>>} PipelineCollectionAsync
 */
/**
 * @template P
 * @typedef {HooksCollection<((pri: P, ...rest)=>void)>} HooksCollectionSync
 */
/**
 * @template P
 * @typedef {HooksCollection<(pri: P, ...rest)=>void|Promise<void>>} HooksCollectionAsync
 */


/**
 * @template T
 * @param {T} type
 * @returns {createPipelineCollection<T>|PipelineCollectionAsync<T>}
 */
export const createPipelineCollection = (type) =>
    // @ts-ignore
    createHooksCollection(
        hooks =>
            (value, ...rest) =>
                hooks.reduce(
                    (pipedValue, hook) =>
                        pipedValue.then
                            ? pipedValue.then(r => hook(r, ...rest))
                            : hook(pipedValue, ...rest),
                    value,
                ),
    )

/**
 * @template T
 * @param {T=} type
 * @returns {HooksCollectionSync<T>|HooksCollectionSync<T>}
 */
export const createSequenceHooksCollection = (type) =>
    createHooksCollection(
        hooks =>
            (value, ...rest) => hooks.reduce(
                (last, hook) =>
                    last.then ? last.then(_ => hook(value, ...rest)) : hook(value, ...rest),
                value,
            )
    )

/**
 * @template T
 * @param {T=} type
 * @returns {HooksCollectionSync<T>|HooksCollectionAsync<T>}
 */
export const createParallelHooksCollection = (type) =>
    createHooksCollection(
        hooks =>
            (value, ...rest) =>
                Promise.all(hooks.map(hook => hook(value, ...rest))).then(r => value),
    )

