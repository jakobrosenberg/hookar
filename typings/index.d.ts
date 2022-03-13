export function createPipelineCollection<T>(type?: T): HooksCollection<T>;
export function createSequenceHooksCollection<T>(type?: T): CollectionSyncVoid<T> | CollectionAsyncVoid<T>;
export function createParallelHooksCollection<T>(type?: T): CollectionSyncVoid<T> | CollectionAsyncVoid<T>;
export function createGuardsCollection<T>(type?: T): CollectionSync<T> | CollectionAsync<T>;
export type AddHookToCollection<H> = (hook: H) => Function;
export type HooksCollection<H> = AddHookToCollection<H> & HooksCollectionProps<H>;
export type HooksCollectionProps<H> = {
    run: H;
    runOnce: H;
    hooks: H[];
};
export type Runner<V> = (value: HookCb<V>[], ...rest: any[]) => any;
export type HookCb<T> = (value: T, ...rest: any[]) => any;
export type CollectionSync<P> = AddHookToCollection<(pri: P, ...rest: any[]) => P> & HooksCollectionProps<(pri: P, ...rest: any[]) => P>;
export type CollectionAsync<P> = AddHookToCollection<(pri: P, ...rest: any[]) => P | Promise<P>> & HooksCollectionProps<(pri: P, ...rest: any[]) => P | Promise<P>>;
export type CollectionSyncVoid<P> = AddHookToCollection<(pri: P, ...rest: any[]) => void> & HooksCollectionProps<(pri: P, ...rest: any[]) => void>;
export type CollectionAsyncVoid<P> = AddHookToCollection<(pri: P, ...rest: any[]) => void | Promise<void>> & HooksCollectionProps<(pri: P, ...rest: any[]) => void | Promise<void>>;
