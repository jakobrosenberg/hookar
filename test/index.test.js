import { createHook } from '..'

describe('empty collection', () => {
    /** @type {import('..').HooksCollection<number>} */
    const emptyCollection = createHook()

    test('returns ', () => {
        const res = emptyCollection.runInPipeline(123)
    })
})

describe('populated collection', () => {
    const hookCollection = createHook()
})

test('can create hooksCollection', () => {
    // expect(route.fragments.map(f => f.node.name)).toEqual(['', 'admin'])
})
