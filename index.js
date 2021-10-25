/** 
 * @template P
 * @template R
 * @typedef {(pri: P, ...rest)=>R<P>} Hook
 */


/**
 * @template P
 * @template R
 * @callback AddHookToCollection
 * @param {Hook<P, R<P>} hook
 * @returns {function} unhook
 **/

/**
 * @template P
 * @template R
 * @typedef {AddHookToCollection<P, R> & HooksCollectionProps<P>} HooksCollection
 */

/**
 * @template P
 * @typedef {Object} HooksCollectionProps
 * @prop {Hook<P>} runHooks
 * @prop {(pri: P, ...rest)=>(P)} runInPipeline
 * @prop {Hook<P>} runInParallel
 * @prop {Hook<P>} runInSequence
 * @prop {Hook<P>[]} hooks
 */

/**
 * creates a hook collection
 * @template P
 * @template R
 * @return {HooksCollection<P, R>}
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
 export const createHooksCollection = ({ runner }) => {
    /** @type {Hook<P>[]} */
    const hooks = []

    /**
     *@type {HooksCollection<P, R>}
     */
    const hooksCollection = hook => {
        const _hooks = [hook]
        const indexes = _hooks.map(hook => {
            hooks.push(hook)
            return hooks.indexOf(hook)
        })
        const unhook = () => _hooks.splice(indexes[0], length)
        return unhook
    }

    hooksCollection.hooks = hooks

    hooksCollection.runHooks = runner(hooks)
    // hooksCollection.runHooks = (param, ...rest) =>
    //     hooksCollection.hooks.reduce(
    //         (_param, hook) =>
    //             _param.then ? _param.then(r => hook(r, ...rest)) : hook(_param, ...rest),
    //         param,
    //     )

    // hooksCollection.runHooks = (param, ...rest) =>
    //     hooksCollection.hooks.reduce(
    //         (_, hook) =>
    //             _.then ? _.then(r => hook(param, ...rest)) : hook(param, ...rest),
    //         param,
    //     )

    // hooksCollection.runHooks = (param, ...rest) =>
    //     Promise.all(hooksCollection.hooks.map(hook => hook(param, ...rest)))

    return hooksCollection
}

/**
 * @type {HooksCollection<string, Promise>}
 */
let testCollection

testCollection

export const createPipelineHooks = () =>
    createHook({
        runner:
            hooks =>
            (param, ...rest) =>
                hooks.reduce(
                    (_param, hook) =>
                        _param.then
                            ? _param.then(r => hook(r, ...rest))
                            : hook(_param, ...rest),
                    param,
                ),
    })

export const createPipelineHooksAsync    

/**
 * @template P payload
 * @type {HooksCollection<P, }
 */
export const createSequenceHooks = () =>
    createHook({
        runner:
            hooks =>
            (param, ...rest) =>
                hooks.reduce(
                    (_, hook) =>
                        _.then ? _.then(r => hook(param, ...rest)) : hook(param, ...rest),
                    param,
                ),
    })


export const createParallelHooks = () =>
    createHook({
        runner:
            hooks =>
            (param, ...rest) =>
                Promise.all(hooks.map(hook => hook(param, ...rest))),
    })

const asyncPipelineTest = pipeline()

asyncPipelineTest(x => (x.foo = 'foo') && x)
asyncPipelineTest(async x => (x.bar = 'bar') && x)
asyncPipelineTest(x => (x.baz = 'baz') && x)
asyncPipelineTest(x => (x.boo = 'boo') && x)

const initial = {}
const result = asyncPipelineTest.runHooks(initial)

console.log(result, { initial })
result.then(r => console.log(r) || console.log(initial))
